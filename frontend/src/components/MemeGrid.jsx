import React, { useEffect, useRef } from 'react';
import MemeCard from './MemeCard';
import { Loader2 } from 'lucide-react';

export default function MemeGrid({
  posts = [],
  currentUser,
  onLike,
  onComment,
  onReport,
  onDelete,
  onEdit,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false
}) {
  const sentinelRef = useRef(null);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoadingMore) {
        onLoadMore();
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [hasMore, onLoadMore, isLoadingMore]);

  return (
    <div className="flex flex-col gap-4">
      {/* Responsive Masonry Columns */}
      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="break-inside-avoid">
            <MemeCard
              post={post}
              currentUser={currentUser}
              onLike={onLike}
              onComment={onComment}
              onReport={onReport}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="py-6 flex items-center justify-center text-outline font-mono text-xs gap-2"
        >
          {isLoadingMore ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Fetching more high-entropy memes...</span>
            </>
          ) : (
            <span>Scroll for more</span>
          )}
        </div>
      )}
    </div>
  );
}
