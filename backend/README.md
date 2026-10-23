# OnlyMeme Backend & Cloud Infrastructure

This directory houses the Firebase security rules and deployment configuration for OnlyMeme.

## Files
- `firestore.rules`: Real-time Cloud Firestore security policies.
  - Public read access for feeds and posts (guest browsing without login).
  - Authenticated-only post creation with verified Google emails.
  - Owner-only edits and comments deletion.
  - Atomic like count transactions via `posts/{id}/likes/{uid}`.
  - Admin-only moderation access to `reports/{id}` and **1-Click Quick-Delete ("Nuke")** authorization for any violating post.
- `storage.rules`: Cloud Storage policies enforcing a strict **10MB file size limit**, image/gif MIME type validation, and owner or admin delete privileges.
- `firebase.json`: Hosting configuration pointing to `../frontend/dist` with SPA client rewrites to `/index.html`.
- `.firebaserc`: Project alias configuration.

## Deployment Instructions

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login & Link Project
```bash
firebase login
firebase use --add
```

### 3. Deploy Rules & Hosting
```bash
# Deploy Firestore & Storage rules only
firebase deploy --only firestore:rules,storage:rules

# Deploy everything including frontend build
firebase deploy
```
