import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, Flag } from 'lucide-react';

export default function ReportModal({
  isOpen,
  onClose,
  post,
  onSubmitReport,
  currentUser
}) {
  const [selectedReason, setSelectedReason] = useState('Sexuality / NSFW');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !post) return null;

  const reasons = [
    { id: 'Sexuality / NSFW', label: 'Sexuality / NSFW', desc: 'Nudity, sexually suggestive, or adult content' },
    { id: 'Vulgarity / Hate Speech', label: 'Vulgarity / Hate Speech', desc: 'Slurs, violent threats, or hate speech' },
    { id: 'Harassment', label: 'Harassment / Bullying', desc: 'Targeted attack against an individual' },
    { id: 'Spam', label: 'Spam / Commercial Bot', desc: 'Repetitive spam or promotional links' },
    { id: 'Copyright', label: 'Copyright / Stolen Media', desc: 'Intellectual property violation' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmitReport({
        postId: post.id,
        postCaption: post.caption,
        postMediaUrl: post.mediaUrl,
        postAuthorId: post.authorId,
        reportedBy: currentUser?.uid || 'guest_reporter',
        reason: selectedReason,
        details: details.trim(),
        createdAt: new Date().toISOString()
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Report submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface-container border border-outline-variant rounded-2xl shadow-hard-lg p-6 sm:p-8 flex flex-col gap-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-3">
          <div className="w-10 h-10 rounded-xl bg-error/15 border border-error flex items-center justify-center text-error shadow-hard shrink-0">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-modern-20 text-xl font-normal text-on-surface tracking-wide">
              Report <span className="text-error font-bold">Content</span>
            </h3>
            <span className="font-mono text-[10px] text-outline">
              Help keep OnlyMeme clean & safe
            </span>
          </div>
        </div>

        {submitted ? (
          <div className="py-6 flex flex-col items-center justify-center gap-3 text-center animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-primary" />
            <h4 className="font-headline text-sm font-bold text-on-surface">Report Submitted</h4>
            <p className="font-body text-xs text-on-surface-variant max-w-xs">
              Thank you for keeping the community safe. Our Super-Admin moderation queue has been notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            
            {/* Target Post Snippet */}
            <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center gap-2.5">
              <img
                src={post.mediaUrl}
                alt="Reported meme"
                className="w-10 h-10 rounded-lg object-cover border border-outline-variant shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="font-mono text-[10px] text-outline block">Reporting post:</span>
                <p className="font-body text-xs text-on-surface truncate font-semibold">
                  {post.caption || 'Untitled Meme'}
                </p>
              </div>
            </div>

            {/* Reason Radio Options */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-outline uppercase font-semibold">
                Reason for report
              </label>
              <div className="flex flex-col gap-1.5">
                {reasons.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                      selectedReason === r.id
                        ? 'bg-error/10 border-error text-on-surface'
                        : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={selectedReason === r.id}
                      onChange={() => setSelectedReason(r.id)}
                      className="mt-0.5 text-error focus:ring-error"
                    />
                    <div className="min-w-0">
                      <span className="font-headline text-xs font-bold block">{r.label}</span>
                      <span className="font-mono text-[10px] text-outline block">{r.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Description */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[10px] text-outline uppercase font-semibold">
                Additional context (optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain why this content should be reviewed..."
                rows={2}
                maxLength={200}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2 text-xs text-on-surface font-body focus:outline-none focus:border-error resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl text-outline hover:text-on-surface font-mono text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-error hover:bg-red-500 text-white font-headline text-xs font-bold shadow-hard btn-neo transition-all disabled:opacity-50"
              >
                <span>Submit Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
