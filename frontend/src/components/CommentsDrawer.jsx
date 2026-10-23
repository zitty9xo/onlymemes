import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Trash2, User, Loader2, Sparkles } from 'lucide-react';
import { db, isFirebaseConfigured } from '../firebase/config';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';

export default function CommentsDrawer({
  isOpen,
  onClose,
  post,
  currentUser,
  onOpenAuth,
  onCommentAdded
}) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync comments for active post
  useEffect(() => {
    if (!isOpen || !post) {
      setComments([]);
      return;
    }

    setLoading(true);

    if (isFirebaseConfigured) {
      try {
        const commentsRef = collection(db, 'posts', post.id, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const liveComments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setComments(liveComments);
          setLoading(false);
        }, (err) => {
          console.warn('Comments listener notice:', err);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (e) {
        console.warn('Realtime comments fallback active');
        setLoading(false);
      }
    } else {
      // Local demo mode storage
      const storageKey = `onlymeme_comments_${post.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setComments(JSON.parse(saved));
        } catch (e) {
          setComments([]);
        }
      } else {
        setComments([]);
      }
      setLoading(false);
    }
  }, [isOpen, post?.id]);

  if (!isOpen || !post) return null;

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    const commentPayload = {
      authorId: currentUser.uid,
      authorName: currentUser.displayName || 'Anonymous Memer',
      authorPhoto: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=60',
      text: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured) {
      try {
        const commentsRef = collection(db, 'posts', post.id, 'comments');
        await addDoc(commentsRef, {
          ...commentPayload,
          createdAt: serverTimestamp()
        });

        // Increment commentCount on post
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, {
          commentCount: increment(1)
        });
      } catch (err) {
        console.error('Firestore comment error:', err);
      }
    } else {
      // Local demo storage
      const storageKey = `onlymeme_comments_${post.id}`;
      const updated = [
        { id: 'comm_' + Date.now(), ...commentPayload },
        ...comments
      ];
      setComments(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));

      // Notify parent to increment commentCount on post
      if (onCommentAdded) {
        onCommentAdded(post.id, updated.length);
      }
    }

    setNewCommentText('');
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'posts', post.id, 'comments', commentId));
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, {
          commentCount: increment(-1)
        });
      } catch (e) {
        console.warn('Delete comment error:', e);
      }
    } else {
      const storageKey = `onlymeme_comments_${post.id}`;
      const remaining = comments.filter(c => c.id !== commentId);
      setComments(remaining);
      localStorage.setItem(storageKey, JSON.stringify(remaining));

      if (onCommentAdded) {
        onCommentAdded(post.id, remaining.length);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-md bg-surface-container border-l border-outline-variant shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-secondary/20 border border-secondary flex items-center justify-center shadow-hard">
                <MessageSquare className="w-4 h-4 text-secondary" />
              </div>
              <h2 className="font-modern-20 text-2xl font-normal text-on-surface tracking-wide">
                Comments (<span className="text-primary font-bold">{comments.length}</span>)
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Post Snippet Preview */}
          <div className="p-3.5 bg-surface-container-lowest border-b border-outline-variant/60 flex items-center gap-3">
            <img
              src={post.mediaUrl}
              alt="Meme thumbnail"
              className="w-14 h-14 rounded-xl object-cover border border-outline-variant shadow-xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[10px] text-primary font-bold uppercase">
                {post.tag || '#meme'}
              </span>
              <p className="font-body text-xs font-semibold text-on-surface truncate">
                {post.caption || 'Untitled Meme'}
              </p>
              <span className="font-mono text-[10px] text-outline block">
                by {post.authorName || 'Creator'}
              </span>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-outline">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : comments.length === 0 ? (
              <div className="p-8 rounded-2xl bg-surface-container-low border border-dashed border-outline-variant text-center flex flex-col items-center gap-2.5 my-auto">
                <span className="material-symbols-outlined text-outline text-3xl">chat_bubble_outline</span>
                <p className="font-body text-xs text-on-surface-variant font-medium">
                  No comments yet on this meme.
                </p>
                <span className="font-mono text-[10px] text-primary">
                  Be the first to share your comedic reaction!
                </span>
              </div>
            ) : (
              comments.map((comment) => {
                const canDelete = currentUser && (
                  currentUser.uid === comment.authorId ||
                  currentUser.uid === post.authorId ||
                  currentUser.role === 'admin'
                );

                return (
                  <div
                    key={comment.id}
                    className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col gap-1.5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.authorPhoto}
                          alt={comment.authorName}
                          className="w-6 h-6 rounded-full border border-outline-variant object-cover"
                        />
                        <span className="font-body text-xs font-bold text-on-surface">
                          {comment.authorName}
                        </span>
                        <span className="font-mono text-[10px] text-outline">
                          {comment.createdAt ? new Date(comment.createdAt?.seconds ? comment.createdAt.seconds * 1000 : comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                        </span>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-outline hover:text-error transition-all"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="font-body text-xs text-on-surface-variant leading-relaxed pl-8">
                      {comment.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Comment Submission Bar */}
          <div className="p-3.5 bg-surface-container-low border-t border-outline-variant">
            {currentUser ? (
              <form onSubmit={handleSubmitComment} className="flex flex-col gap-2">
                <div className="relative flex items-center">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Drop a witty comment..."
                    maxLength={500}
                    rows={2}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl p-2.5 text-xs text-on-surface font-body focus:outline-none focus:border-secondary resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[10px] text-outline">
                    {newCommentText.length} / 500
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newCommentText.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary font-headline text-xs font-bold shadow-hard active:translate-y-0.5 transition-all disabled:opacity-50 btn-neo"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Reply</span>
                        <Send className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-2 flex flex-col gap-2 items-center">
                <p className="font-mono text-xs text-outline">
                  Want to join this conversation?
                </p>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-headline text-xs font-bold shadow-hard btn-neo"
                >
                  Sign In to Comment
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
