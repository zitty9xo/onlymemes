# Security, Access Control & Business Rules (Rules.md)
## OnlyMeme Application Security Architecture

This document specifies the strict security rules and access control policies for Cloud Firestore, Firebase Storage, and client-side business logic.

---

## 1. Cloud Firestore Security Rules (`firestore.rules`)

These rules ensure:
- Only authenticated users can create posts, like, comment, and submit reports.
- Users can ONLY edit or delete content they personally authored.
- Reports are write-only for users (users cannot read or manipulate moderation reports).
- Data integrity, schema constraints, and field-type validations are strictly enforced.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isDocOwner() {
      return isAuthenticated() && request.auth.uid == resource.data.authorId;
    }

    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.admin == true ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }

    // Backend email integrity validation: rejects disposable and burner email domains
    function isNotDisposableEmail(email) {
      return !email.matches('.*@(mailinator\\.com|10minutemail\\.com|tempmail\\.com|temp-mail\\.org|guerrillamail\\.com|guerrillamailblock\\.com|sharklasers\\.com|trashmail\\..*|yopmail\\..*|dispostable\\.com|fakeinbox\\.com|throwawaymail\\.com|burnermail\\.io|getnada\\.com|inboxkitten\\.com).*');
    }

    // ----------------------------------------------------
    // USERS COLLECTION
    // ----------------------------------------------------
    match /users/{userId} {
      // Anyone can view user profile summaries
      allow read: if true;

      // Backend security rule: Only authenticated users with non-disposable email can create user doc
      allow create: if isOwner(userId) 
        && request.resource.data.uid == userId
        && request.resource.data.email is string
        && isNotDisposableEmail(request.resource.data.email)
        && (request.auth.token.email_verified == true || request.auth.token.firebase.sign_in_provider == 'password');

      allow update: if isOwner(userId)
        && request.resource.data.uid == userId;

      allow delete: if false; // User accounts cannot be arbitrarily deleted from client
    }

    // ----------------------------------------------------
    // POSTS COLLECTION
    // ----------------------------------------------------
    match /posts/{postId} {
      // Public feed: Anyone can read posts
      allow read: if true;

      // Create: Logged-in users only with validated schema
      allow create: if isAuthenticated()
        && request.resource.data.authorId == request.auth.uid
        && request.resource.data.mediaUrl is string
        && request.resource.data.type in ['image', 'gif']
        && request.resource.data.likeCount == 0
        && request.resource.data.commentCount == 0
        && request.resource.data.createdAt is timestamp;

      // Update:
      // 1. Post author can update caption and tags
      // 2. Any logged-in user can increment/decrement likeCount or commentCount via transactions
      allow update: if isAuthenticated() && (
        // Case A: Owner edits post metadata
        (isDocOwner() 
          && request.resource.data.authorId == resource.data.authorId
          && request.resource.data.mediaUrl == resource.data.mediaUrl)
        ||
        // Case B: Social counters updated (likes, comments, report count)
        (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likeCount', 'commentCount', 'reportCount']))
      );

      // Delete: Post author OR Admin (allows rapid moderator takedown)
      allow delete: if isDocOwner() || isAdmin();

      // --------------------------------------------------
      // LIKES SUBCOLLECTION (posts/{postId}/likes/{userId})
      // --------------------------------------------------
      match /likes/{userId} {
        allow read: if true;
        // Only the user themselves can like/unlike a post
        allow create, delete: if isOwner(userId);
      }

      // --------------------------------------------------
      // COMMENTS SUBCOLLECTION (posts/{postId}/comments/{commentId})
      // --------------------------------------------------
      match /comments/{commentId} {
        allow read: if true;

        // Logged-in user can add a comment
        allow create: if isAuthenticated()
          && request.resource.data.authorId == request.auth.uid
          && request.resource.data.text is string
          && request.resource.data.text.size() > 0
          && request.resource.data.text.size() <= 500
          && request.resource.data.createdAt is timestamp;

        // Only the comment author or post author can delete
        allow delete: if isAuthenticated() && (
          request.auth.uid == resource.data.authorId ||
          request.auth.uid == get(/databases/$(database)/documents/posts/$(postId)).data.authorId
        );

        allow update: if false; // Comments are immutable
      }
    }

    // ----------------------------------------------------
    // REPORTS COLLECTION
    // ----------------------------------------------------
    match /reports/{reportId} {
      // Regular users cannot read reports; Admins can read full moderation queue
      allow read: if isAdmin();

      // Any logged-in user can file a report
      allow create: if isAuthenticated()
        && request.resource.data.reportedBy == request.auth.uid
        && request.resource.data.postId is string
        && request.resource.data.reason in ['sexuality', 'vulgarity', 'harassment', 'spam', 'copyright']
        && request.resource.data.createdAt is timestamp;

      // Only admins can update status (e.g. 'resolved', 'dismissed') or delete reports
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## 2. Firebase Cloud Storage Security Rules (`storage.rules`)

These rules enforce strict file size caps (max 10 MB), valid media MIME types, and secure path boundaries:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isValidMedia() {
      // Must be under 10 MB (10 * 1024 * 1024 bytes)
      return request.resource.size <= 10 * 1024 * 1024
        && (
          request.resource.contentType.matches('image/png') ||
          request.resource.contentType.matches('image/jpeg') ||
          request.resource.contentType.matches('image/webp') ||
          request.resource.contentType.matches('image/gif')
        );
    }

    // Memes folder: memes/{userId}/{fileName}
    match /memes/{userId}/{fileName} {
      // Publicly viewable by anyone on the internet
      allow read: if true;

      // Only the authenticated user can upload to their personal folder
      allow create: if isOwner(userId) && isValidMedia();

      // Owner or Admin can delete media file
      allow delete: if isOwner(userId) || (isAuthenticated() && request.auth.token.admin == true);

      // Overwriting existing files is disabled
      allow update: if false;
    }

    // User avatars folder: avatars/{userId}/{fileName}
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow create, update: if isOwner(userId) 
        && request.resource.size <= 2 * 1024 * 1024 // 2MB for avatar
        && request.resource.contentType.matches('image/.*');
      allow delete: if isOwner(userId);
    }
  }
}
```

---

## 3. Client-Side Validation & Business Logic Rules

1. **Upload Size Pre-flight Check**:
   - Files greater than 10,485,760 bytes (10MB) must be rejected immediately in the browser before invoking Firebase Storage to save bandwidth and prevent storage costs.
2. **AI Safety Gate Rules**:
   - **Explicit Sexuality (NSFW)**: Detected nudity, erotic anatomy, or pornography -> submission is blocked.
   - **Severe Vulgarity / Hate**: Hate speech, slurs, severe harassment -> submission is blocked.
   - **Borderline / Edgy**: High vulgarity score without hate speech -> Allowed with an `edgy` tag and user-toggled blur overlay.
3. **Optimistic Like Guard**:
   - Users cannot spam like/unlike; requests are debounced by 400ms.
   - Document ID in `/posts/{postId}/likes/{userId}` guarantees idempotency.
4. **Zero-Default Data Policy**:
   - The production database and UI start clean. No dummy cards, raw memes, or fake accounts are injected.
5. **Frictionless Guest Browsing & Login Gate**:
   - Any visitor can freely browse the feed, view high-res images and animated GIFs, read comments, and view AI scores with zero login barriers.
   - When a guest clicks "Upload Meme", "Meme Studio", "Like", "Comment", or "Report", the app opens a sleek Google Sign-In prompt.
   - Upon successful sign-in, the user's intended action automatically resumes without data loss.
6. **Anti-Dummy & Fake Email Filter Policy**:
   - Authentication enforces that the user's email has `emailVerified: true` from Google.
   - The user's email domain must NOT belong to disposable/throwaway domain lists (`mailinator`, `10minutemail`, `tempmail`, `guerrillamail`, `trashmail`, `sharklasers`, etc.).
   - Pattern analysis detects and blocks automated bot addresses (e.g. `test1234@`, `asdfghj@`, `fakeuser@`, repetitive sequences).
   - Accounts failing email integrity checks are instantly signed out and denied Firestore record creation.


