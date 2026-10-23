import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Sparkles, ShieldAlert, Trash2, CheckCircle2, Eye, EyeOff, Flame, Edit3, Check, X } from 'lucide-react';

export default function MemeCard({
  post,
  currentUser,
  onLike,
  onComment,
  onReport,
  onDelete,
  onEdit
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likeCount || 0);
  const [copied, setCopied] = useState(false);
  const [revealedEdgy, setRevealedEdgy] = useState(false);

  // Author inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption || '');
  const [editTag, setEditTag] = useState(post.tag || '#meme');

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      onLike(post.id);
      return;
    }

    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1));
    onLike(post.id, nextState);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + '#' + post.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(post.id, {
        caption: editCaption.trim(),
        tag: editTag
      });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditCaption(post.caption || '');
    setEditTag(post.tag || '#meme');
    setIsEditing(false);
  };

  // Only the creator who uploaded the meme is authorized to edit, delete, and view private AI evaluations
  const isAuthor = Boolean(
    currentUser && (
      (currentUser.uid && post.authorId && String(currentUser.uid) === String(post.authorId)) ||
      (currentUser.id && post.authorId && String(currentUser.id) === String(post.authorId)) ||
      (currentUser.email && post.authorEmail && currentUser.email.toLowerCase() === String(post.authorEmail).toLowerCase())
    )
  );
  const isEdgy = post.isEdgy || post.tag === '#edgy';
  const shouldBlur = isEdgy && !revealedEdgy;

  const channelTags = ['#dank', '#dev', '#gaming', '#crypto', '#wholesome', '#edgy'];

  return (
    <article className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant shadow-hard flex flex-col transition-all hover:border-outline hover:shadow-hard-lg animate-fadeIn">
      
      {/* Header: Author & Metadata */}
      <div className="p-3.5 flex items-center justify-between gap-3 border-b border-outline-variant/50">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={post.authorPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=60'}
            alt={post.authorName || 'Creator'}
            className="w-8 h-8 rounded-full border border-primary object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-body text-xs font-bold text-on-surface truncate">
                {post.authorName || 'Anonymous Creator'}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-primary/15 text-primary border border-primary/30 font-bold uppercase">
                {post.tag || '#meme'}
              </span>
              {isEdgy && (
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-tertiary/20 text-tertiary border border-tertiary/40 font-bold uppercase flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5" /> Edgy
                </span>
              )}
            </div>
            <span className="font-mono text-[10px] text-outline block">
              {post.createdAt ? new Date(post.createdAt?.seconds ? post.createdAt.seconds * 1000 : post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
            </span>
          </div>
        </div>

        {/* Creator Ownership Controls: Edit & Delete (Strictly for Author Only) */}
        {isAuthor && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-lg border transition-all ${
                isEditing
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'text-outline hover:text-primary hover:bg-primary/15 border-transparent hover:border-primary/30'
              }`}
              title="Edit your meme"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/15 border border-transparent hover:border-error/30 transition-colors"
              title="Delete your meme"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Media Image / GIF Container with Edgy Blur Shield */}
      <div className="relative bg-surface-container-lowest flex items-center justify-center max-h-[520px] overflow-hidden group">
        <img
          src={post.mediaUrl}
          alt={post.caption || 'OnlyMeme content'}
          className={`w-full h-auto max-h-[520px] object-contain transition-all duration-300 ${
            shouldBlur ? 'blur-2xl scale-105 select-none' : ''
          }`}
          loading="lazy"
        />

        {/* Edgy Shield Overlay */}
        {shouldBlur && (
          <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center gap-2.5 z-10 animate-fadeIn">
            <span className="p-2 rounded-xl bg-tertiary/20 text-tertiary border border-tertiary/40 shadow-hard">
              <EyeOff className="w-5 h-5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-headline text-xs font-bold text-on-surface uppercase tracking-wider">
                Sensitive / Spicy Content
              </span>
              <span className="font-mono text-[11px] text-outline">
                Flagged as edgy by OnlyMeme AI
              </span>
            </div>
            <button
              onClick={() => setRevealedEdgy(true)}
              className="mt-1 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-mono text-xs font-bold border border-outline-variant shadow-hard btn-neo transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span>Reveal Content</span>
            </button>
          </div>
        )}

        {/* Media Type Badge */}
        {post.type === 'gif' && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur font-mono text-[10px] text-tertiary font-bold uppercase border border-tertiary/40 z-20">
            GIF
          </span>
        )}
      </div>

      {/* Caption & Inline Editor Section */}
      {isEditing ? (
        <div className="p-3 bg-surface-container-low border-b border-outline-variant/60 flex flex-col gap-2.5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">
              Edit Your Meme
            </span>
            <span className="font-mono text-[9px] text-outline">
              Visible only to you
            </span>
          </div>

          <input
            type="text"
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            placeholder="Edit meme caption..."
            className="w-full bg-surface-container border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-on-surface font-body focus:outline-none focus:border-primary"
            autoFocus
          />

          {/* Tag Selector */}
          <div className="flex items-center gap-1 flex-wrap">
            {channelTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setEditTag(tag)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  editTag === tag
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container border border-outline-variant text-outline hover:text-on-surface'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Edit Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-outline hover:text-on-surface bg-surface-container border border-outline-variant text-[11px] font-mono font-bold"
            >
              <X className="w-3 h-3" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary text-on-primary text-[11px] font-mono font-bold shadow-sm"
            >
              <Check className="w-3 h-3" />
              <span>Save</span>
            </button>
          </div>
        </div>
      ) : (
        post.caption && (
          <div className="px-4 pt-3 pb-1.5">
            <p className="font-body text-sm text-on-surface leading-snug">
              {post.caption}
            </p>
          </div>
        )
      )}

      {/* Comedic AI Roast Callout — STRICTLY PRIVATE to the author who uploaded the meme */}
      {isAuthor && (post.aiRoast || post.aiRating) && (
        <div className="mx-3.5 mb-2.5 p-2.5 rounded-xl bg-surface-container-low border border-secondary/30 flex items-start gap-2 shadow-sm animate-fadeIn">
          <span className="p-1 rounded-md bg-secondary/15 text-secondary shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="font-mono text-[10px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                AI Evaluation <span className="text-[9px] text-outline font-normal">· Visible only to you (Uploader)</span>
              </span>
              {post.aiRating && (
                <span className="font-mono text-[9px] text-secondary font-bold">
                  Score: {post.aiRating}/100
                </span>
              )}
            </div>
            {post.aiRoast && (
              <p className="font-body text-xs text-on-surface-variant italic leading-snug">
                "{post.aiRoast}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* Social Action Controls Bar */}
      <div className="p-3 flex items-center justify-between gap-2 border-t border-outline-variant/40 mt-auto">
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Like Button */}
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all btn-neo ${
              isLiked
                ? 'bg-primary/20 text-primary border-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container-high border-outline-variant'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-primary text-primary' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => onComment(post)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold bg-surface-container-low text-on-surface-variant hover:text-secondary hover:bg-surface-container-high border border-outline-variant transition-all btn-neo"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.commentCount || 0}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareClick}
            className="p-1.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant transition-colors"
            title="Copy share link"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>

        </div>

        {/* AI Score Badge & Report Option */}
        <div className="flex items-center gap-2">
          {/* AI Rating — STRICTLY visible to the creator who uploaded the meme, NOT other users */}
          {isAuthor && post.aiRating && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/15 border border-secondary/30 text-secondary font-mono text-[10px] font-bold"
              title="Private AI score visible only to you as the creator"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI {post.aiRating}/100</span>
            </div>
          )}

          {/* Report Button (available for reporting any post) */}
          <button
            onClick={() => onReport(post)}
            className="text-outline hover:text-error p-1 rounded transition-colors"
            title="Report content"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </article>
  );
}
