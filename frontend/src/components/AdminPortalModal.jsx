import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Trash2,
  Zap,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Flame,
  ExternalLink,
  ShieldCheck,
  Eye,
  Filter
} from 'lucide-react';

export default function AdminPortalModal({
  isOpen,
  onClose,
  posts = [],
  reports = [],
  onNukePost,
  onDismissReport,
  adminUser
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'all' | 'edgy'
  const [nukedNotice, setNukedNotice] = useState('');
  const [nukedCount, setNukedCount] = useState(0);

  if (!isOpen) return null;

  const handleNuke = (postId, caption) => {
    onNukePost(postId);
    setNukedCount(prev => prev + 1);
    setNukedNotice(`💥 Meme Nuked: "${(caption || 'Post').substring(0, 30)}..." purged from feeds!`);
    setTimeout(() => setNukedNotice(''), 3000);
  };

  const handleDismiss = (reportId) => {
    onDismissReport(reportId);
    setNukedNotice('Report dismissed as false positive.');
    setTimeout(() => setNukedNotice(''), 2500);
  };

  // Filtered post listings
  const filteredPosts = posts.filter(p => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCaption = (p.caption || '').toLowerCase().includes(q);
      const matchAuthor = (p.authorName || '').toLowerCase().includes(q);
      const matchTag = (p.tag || '').toLowerCase().includes(q);
      if (!matchCaption && !matchAuthor && !matchTag) return false;
    }

    // Tab filter
    if (activeTab === 'reports') {
      return reports.some(r => r.postId === p.id) || (p.reportCount || 0) > 0;
    }
    if (activeTab === 'edgy') {
      return p.isEdgy || p.tag === '#edgy';
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-surface-container-lowest/95 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      
      {/* Admin Window Container */}
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-surface-container border-2 border-error/50 rounded-2xl shadow-hard-lg flex flex-col overflow-hidden my-auto">
        
        {/* Top Header Bar */}
        <div className="p-4 border-b border-outline-variant/60 bg-surface-container-low flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-error/20 border-2 border-error flex items-center justify-center shadow-hard shrink-0 text-error">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-modern-20 text-2xl font-normal text-on-surface tracking-wide">
                  Super-Admin <span className="text-error font-bold">Moderation Portal</span>
                </h2>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-error/20 text-error border border-error/40 font-bold uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 1-Click Nuke Authority
                </span>
              </div>
              <span className="font-mono text-[11px] text-outline">
                Admin: {adminUser?.displayName || 'Super Admin'} • Protected Session
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nuked Success Notification Toast */}
        {nukedNotice && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-error/20 border border-error text-error flex items-center gap-2 font-mono text-xs animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-error" />
            <span className="font-bold">{nukedNotice}</span>
          </div>
        )}

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border-b border-outline-variant/50 bg-surface-container-lowest">
          <div className="bg-surface-container p-2.5 rounded-xl border border-outline-variant/40">
            <span className="font-mono text-[10px] text-outline uppercase block">Vault Memes</span>
            <span className="font-headline text-lg font-bold text-on-surface">{posts.length}</span>
          </div>
          <div className="bg-surface-container p-2.5 rounded-xl border border-outline-variant/40">
            <span className="font-mono text-[10px] text-error uppercase block flex items-center gap-1">
              <Flag className="w-3 h-3" /> Pending Reports
            </span>
            <span className="font-headline text-lg font-bold text-error">{reports.length}</span>
          </div>
          <div className="bg-surface-container p-2.5 rounded-xl border border-outline-variant/40">
            <span className="font-mono text-[10px] text-primary uppercase block">Nukes Executed</span>
            <span className="font-headline text-lg font-bold text-primary">{nukedCount}</span>
          </div>
          <div className="bg-surface-container p-2.5 rounded-xl border border-outline-variant/40">
            <span className="font-mono text-[10px] text-secondary uppercase block">AI Engine</span>
            <span className="font-headline text-xs font-bold text-secondary flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Active
            </span>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 border-b border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container">
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                activeTab === 'reports'
                  ? 'bg-error text-white shadow-hard'
                  : 'bg-surface-container-low border border-outline-variant text-outline hover:text-on-surface'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report Queue ({reports.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-primary text-on-primary shadow-hard'
                  : 'bg-surface-container-low border border-outline-variant text-outline hover:text-on-surface'
              }`}
            >
              <span>All Memes ({posts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('edgy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                activeTab === 'edgy'
                  ? 'bg-tertiary text-on-tertiary shadow-hard'
                  : 'bg-surface-container-low border border-outline-variant text-outline hover:text-on-surface'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Edgy Posts</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by caption, tag, author..."
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-8 pr-3 py-1.5 text-xs text-on-surface font-body placeholder:text-outline/60 focus:outline-none focus:border-error"
            />
          </div>

        </div>

        {/* Posts Moderation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
              <CheckCircle2 className="w-12 h-12 text-primary" />
              <h4 className="font-modern-20 text-xl text-on-surface">
                {activeTab === 'reports' ? 'Report Queue is Clean!' : 'No Memes Match Search'}
              </h4>
              <p className="font-body text-xs text-on-surface-variant max-w-sm">
                {activeTab === 'reports'
                  ? 'There are currently zero pending reports from community members.'
                  : 'Try adjusting your search query or switching tabs.'}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const postReports = reports.filter(r => r.postId === post.id);

              return (
                <div
                  key={post.id}
                  className="bg-surface-container-low border border-outline-variant rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-outline shadow-sm"
                >
                  {/* Left: Thumbnail & Info */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <img
                      src={post.mediaUrl}
                      alt={post.caption}
                      className="w-16 h-16 rounded-xl object-cover border border-outline-variant shrink-0 bg-surface-container-lowest"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-on-surface truncate">
                          {post.authorName || 'Creator'}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-surface-container text-outline border border-outline-variant">
                          {post.tag}
                        </span>
                        {post.isEdgy && (
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-tertiary/20 text-tertiary border border-tertiary/40 font-bold">
                            Edgy
                          </span>
                        )}
                        {postReports.length > 0 && (
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-error text-white font-bold flex items-center gap-1">
                            <Flag className="w-2.5 h-2.5" /> {postReports.length} {postReports.length === 1 ? 'Report' : 'Reports'}
                          </span>
                        )}
                      </div>

                      <p className="font-body text-xs text-on-surface truncate mb-1">
                        {post.caption || 'Untitled Meme'}
                      </p>

                      {/* AI Safety Metrics Pills */}
                      <div className="flex items-center gap-2 font-mono text-[10px] text-outline flex-wrap">
                        <span>Sexuality: <b className="text-on-surface">{post.sexualityScore || 0}%</b></span>
                        <span>•</span>
                        <span>Vulgarity: <b className="text-on-surface">{post.vulgarityScore || 0}%</b></span>
                        <span>•</span>
                        <span>AI Wit: <b className="text-secondary">{post.aiRating || '—'}/100</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Reports details & 1-Click Nuke Action */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    
                    {/* Dismiss false-positive report button */}
                    {postReports.length > 0 && (
                      <button
                        onClick={() => handleDismiss(postReports[0].id)}
                        className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant text-outline hover:text-on-surface font-mono text-xs font-bold transition-colors"
                        title="Dismiss report as false positive"
                      >
                        Dismiss
                      </button>
                    )}

                    {/* Super-Admin 1-Click Quick-Delete ("Nuke") Button */}
                    <button
                      onClick={() => handleNuke(post.id, post.caption)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-error hover:bg-red-600 text-white font-headline text-xs font-bold shadow-hard active:translate-y-0.5 transition-all btn-neo"
                      title="Instantly delete post and wipe from storage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>1-Click Nuke</span>
                    </button>

                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-surface-container-low border-t border-outline-variant/60 flex items-center justify-between text-outline font-mono text-[11px]">
          <span>Super-Admin session authenticated</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high text-xs font-bold"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
}
