import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import FeedFilterBar from './components/FeedFilterBar';
import EmptyFeedState from './components/EmptyFeedState';
import MemeCard from './components/MemeCard';
import MemeGrid from './components/MemeGrid';
import CommentsDrawer from './components/CommentsDrawer';
import AuthModal from './components/AuthModal';
import ProfileDrawer from './components/ProfileDrawer';
import UploadModal from './components/UploadModal';
import GiphyModal from './components/GiphyModal';
import MemeStudio from './components/MemeStudio';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPortalModal from './components/AdminPortalModal';
import ReportModal from './components/ReportModal';
import { evaluateMemeContent } from './services/aiModerator';
import { useAuth } from './hooks/useAuth';
import { db, isFirebaseConfigured } from './firebase/config';
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

export default function App() {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut, updateBio } = useAuth();
  const [activeTab, setActiveTab] = useState('hot');
  const [posts, setPosts] = useState([]); // Strictly starts empty (zero default data)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGiphyModalOpen, setIsGiphyModalOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [activeStudioMedia, setActiveStudioMedia] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  // Admin Access & Moderation States
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReportPost, setActiveReportPost] = useState(null);
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem('onlymeme_local_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [adminUserOverride, setAdminUserOverride] = useState(null);

  const activeUser = adminUserOverride || user;

  // Sync posts from Firestore when configured
  useEffect(() => {
    try {
      if (isFirebaseConfigured) {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const livePosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(livePosts);
        }, (error) => {
          console.warn('Firestore live listener notice (starting empty):', error);
        });
        return () => unsubscribe();
      } else {
        // In local demo mode, load posts saved in localStorage if any
        const savedPosts = localStorage.getItem('onlymeme_local_posts');
        if (savedPosts) {
          try {
            setPosts(JSON.parse(savedPosts));
          } catch (e) {
            localStorage.removeItem('onlymeme_local_posts');
          }
        }
      }
    } catch (e) {
      console.warn('Realtime listener fallback active');
    }
  }, []);

  // Open Fabric.js Studio
  const handleOpenStudio = (media = null) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveStudioMedia(media);
    setIsStudioOpen(true);
  };

  // Open Media Uploader (Gated for guests)
  const handleOpenUpload = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsUploadModalOpen(true);
  };

  // Open GIPHY Discovery (Open to all visitors)
  const handleOpenGiphy = () => {
    setIsGiphyModalOpen(true);
  };

  // Open Admin Access (Portal if already admin, Login modal otherwise)
  const handleOpenAdmin = () => {
    if (activeUser?.role === 'admin') {
      setIsAdminPortalOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (adminUser) => {
    setAdminUserOverride(adminUser);
    setIsAdminPortalOpen(true);
  };

  // Open Community Report Modal
  const handleOpenReport = (post) => {
    setActiveReportPost(post);
    setIsReportModalOpen(true);
  };

  // Submit Community Safety Report
  const handleSubmitReport = async (reportData) => {
    const newReport = {
      id: 'rep_' + Date.now(),
      ...reportData
    };

    if (isFirebaseConfigured) {
      try {
        await addDoc(collection(db, 'reports'), {
          ...newReport,
          createdAt: serverTimestamp()
        });
        const postRef = doc(db, 'posts', reportData.postId);
        await updateDoc(postRef, { reportCount: increment(1) });
      } catch (e) {
        console.warn('Report write notice:', e);
      }
    } else {
      const updatedReports = [newReport, ...reports];
      setReports(updatedReports);
      localStorage.setItem('onlymeme_local_reports', JSON.stringify(updatedReports));

      // Increment reportCount on post in state
      setPosts(prev => prev.map(p => p.id === reportData.postId ? { ...p, reportCount: (p.reportCount || 0) + 1 } : p));
    }
  };

  // Super-Admin 1-Click Quick-Delete ("Nuke")
  const handleNukePost = async (postId) => {
    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (e) {
        console.warn('Firestore nuke error:', e);
      }
    } else {
      const remainingPosts = posts.filter(p => p.id !== postId);
      setPosts(remainingPosts);
      localStorage.setItem('onlymeme_local_posts', JSON.stringify(remainingPosts));
    }

    // Clear any reports for this post
    const remainingReports = reports.filter(r => r.postId !== postId);
    setReports(remainingReports);
    localStorage.setItem('onlymeme_local_reports', JSON.stringify(remainingReports));
  };

  // Dismiss false positive report
  const handleDismissReport = (reportId) => {
    const remainingReports = reports.filter(r => r.id !== reportId);
    setReports(remainingReports);
    localStorage.setItem('onlymeme_local_reports', JSON.stringify(remainingReports));
  };

  // Handle GIF selected from GIPHY
  const handleSelectGif = async (gif) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    // Run AI Evaluation on GIF title/caption
    const evalResult = await evaluateMemeContent({
      caption: gif.title || 'GIPHY Meme',
      tag: '#dank'
    });

    const newPost = {
      authorId: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      mediaUrl: gif.url,
      type: 'gif',
      caption: gif.title || 'GIPHY Trending GIF',
      tag: evalResult.isEdgy ? '#edgy' : '#dank',
      likeCount: 0,
      commentCount: 0,
      reportCount: 0,
      aiRating: evalResult.creativityScore,
      aiRoast: evalResult.comedicRoast,
      isEdgy: evalResult.isEdgy,
      sexualityScore: evalResult.sexualityScore,
      vulgarityScore: evalResult.vulgarityScore,
      aiEngine: evalResult.engine,
      createdAt: new Date().toISOString()
    };
    handlePublishPost(newPost);
  };

  // Publish a Post (Image or GIF)
  const handlePublishPost = async (postPayload) => {
    const newPostData = {
      ...postPayload,
      authorId: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
      likeCount: 0,
      commentCount: 0,
      reportCount: 0,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured) {
      try {
        const docRef = await addDoc(collection(db, 'posts'), {
          ...newPostData,
          createdAt: serverTimestamp()
        });
        // Increment user postsCount
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { postsCount: increment(1) });
      } catch (err) {
        console.error('Firestore post write error:', err);
      }
    } else {
      // Local demo mode persistence
      const updatedPosts = [
        { id: 'post_' + Date.now(), ...newPostData },
        ...posts
      ];
      setPosts(updatedPosts);
      localStorage.setItem('onlymeme_local_posts', JSON.stringify(updatedPosts));

      // Calculate real average AI Rating across all user's uploaded memes
      const userMemes = updatedPosts.filter(p => p.authorId === user.uid);
      const totalScore = userMemes.reduce((acc, p) => acc + (p.aiRating || 85), 0);
      const avgRating = Math.round(totalScore / (userMemes.length || 1));

      // Update local user stats
      const updatedUser = {
        ...user,
        postsCount: (user.postsCount || 0) + 1,
        avgAiRating: avgRating
      };
      localStorage.setItem('onlymeme_demo_user', JSON.stringify(updatedUser));
    }
  };

  // Handle Like
  const handleLikePost = async (postId, isLiked) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isFirebaseConfigured) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          likeCount: increment(isLiked ? 1 : -1)
        });
      } catch (e) {
        console.warn('Like sync notice:', e);
      }
    } else {
      // Local state update
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likeCount: Math.max(0, (p.likeCount || 0) + (isLiked ? 1 : -1))
          };
        }
        return p;
      }));
    }
  };

  // Handle Edit Post (Author only)
  const handleEditPost = async (postId, updatedData) => {
    if (!user) return;
    const target = posts.find(p => p.id === postId);
    if (!target) return;

    if (target.authorId !== user.uid) {
      alert('You can only edit memes you uploaded.');
      return;
    }

    if (isFirebaseConfigured) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          caption: updatedData.caption,
          tag: updatedData.tag,
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        console.warn('Edit post notice:', e);
      }
    } else {
      const updated = posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            caption: updatedData.caption,
            tag: updatedData.tag,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      setPosts(updated);
      localStorage.setItem('onlymeme_local_posts', JSON.stringify(updated));
    }
  };

  // Handle Delete Post (Author only)
  const handleDeletePost = async (postId) => {
    if (!user) return;
    const target = posts.find(p => p.id === postId);
    if (!target) return;

    if (target.authorId !== user.uid && user.role !== 'admin') {
      alert('You can only delete memes you uploaded.');
      return;
    }

    if (confirm('Are you sure you want to delete this meme?')) {
      if (isFirebaseConfigured) {
        try {
          await deleteDoc(doc(db, 'posts', postId));
        } catch (e) {
          console.warn('Delete post notice:', e);
        }
      } else {
        const remaining = posts.filter(p => p.id !== postId);
        setPosts(remaining);
        localStorage.setItem('onlymeme_local_posts', JSON.stringify(remaining));
      }
    }
  };

  // Filter and sort posts dynamically
  const filteredPosts = [...posts].filter(post => {
    if (activeTab === 'hot') return true;
    if (activeTab === 'new') return true;
    if (activeTab === 'top') return (post.likeCount || 0) >= 1;
    if (activeTab === 'edgy') return post.tag === '#dank' || post.tag === '#edgy';
    return true;
  }).sort((a, b) => {
    if (activeTab === 'hot' || activeTab === 'top') {
      return (b.likeCount || 0) - (a.likeCount || 0);
    }
    const timeA = new Date(a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt).getTime() || 0;
    const timeB = new Date(b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt).getTime() || 0;
    return timeB - timeA;
  });

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface flex flex-col font-body selection:bg-primary selection:text-on-primary">
      
      {/* Top Sticky Header */}
      <Header
        user={activeUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenStudio={() => handleOpenStudio()}
        onOpenUpload={handleOpenUpload}
        onOpenGiphy={handleOpenGiphy}
        onOpenAdmin={handleOpenAdmin}
        onOpenProfile={() => setIsProfileOpen(true)}
        onSignOut={() => {
          setAdminUserOverride(null);
          logOut();
        }}
      />

      {/* Main 12-Column Responsive Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Navigation Rail (2 Columns) */}
          <LeftSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenAdmin={handleOpenAdmin}
            isAdmin={activeUser?.role === 'admin'}
            posts={posts}
          />

          {/* Central Meme Stream (7 Columns) */}
          <main className="grid-cols-1 lg:col-span-7 flex flex-col gap-4">
            
            {/* Feed Filter Bar */}
            <FeedFilterBar
              currentFilter={activeTab}
              onFilterChange={setActiveTab}
            />

            {/* Posts Stream or Strict Clean-Slate Empty State */}
            {filteredPosts.length === 0 ? (
              <EmptyFeedState
                onOpenUpload={handleOpenUpload}
                onOpenStudio={() => handleOpenStudio()}
              />
            ) : (
              <MemeGrid
                posts={filteredPosts}
                currentUser={activeUser}
                onLike={handleLikePost}
                onComment={(post) => setActiveCommentPost(post)}
                onReport={handleOpenReport}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
              />
            )}

          </main>

          {/* Right Community Sidebar (3 Columns) */}
          <RightSidebar
            user={activeUser}
            posts={posts}
            onOpenStudio={() => handleOpenStudio()}
            onOpenUpload={handleOpenUpload}
          />

        </div>
      </div>

      {/* Auth Modal (Email & Password + Google OAuth + Silent Backend Validation) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSignInWithGoogle={signInWithGoogle}
        onSignInWithEmail={signInWithEmail}
        onSignUpWithEmail={signUpWithEmail}
      />

      {/* Slide-over Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={activeUser}
        onSignOut={() => {
          setAdminUserOverride(null);
          logOut();
        }}
        onUpdateBio={updateBio}
        userPosts={posts.filter(p => p.authorId === activeUser?.uid)}
      />

      {/* Media Upload Modal (Images & GIFs <= 10MB) */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        user={activeUser}
        onPublishPost={handlePublishPost}
        onOpenStudioWithMedia={(mediaUrl, type) => handleOpenStudio({ url: mediaUrl, type })}
      />

      {/* GIPHY GIF Discovery Picker */}
      <GiphyModal
        isOpen={isGiphyModalOpen}
        onClose={() => setIsGiphyModalOpen(false)}
        onSelectGif={handleSelectGif}
      />

      {/* Fabric.js Meme Maker Studio */}
      <MemeStudio
        isOpen={isStudioOpen}
        onClose={() => {
          setIsStudioOpen(false);
          setActiveStudioMedia(null);
        }}
        initialMedia={activeStudioMedia}
        user={activeUser}
        onPublishMeme={handlePublishPost}
      />

      {/* Real-time Slide-over Comments Drawer */}
      <CommentsDrawer
        isOpen={Boolean(activeCommentPost)}
        onClose={() => setActiveCommentPost(null)}
        post={activeCommentPost}
        currentUser={activeUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onCommentAdded={(postId, newCount) => {
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentCount: newCount } : p));
        }}
      />

      {/* Admin Login Modal (Triggered by clicking Admin Access) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        currentUser={activeUser}
      />

      {/* Super-Admin Moderation Portal with 1-Click Nuke */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        posts={posts}
        reports={reports}
        onNukePost={handleNukePost}
        onDismissReport={handleDismissReport}
        adminUser={activeUser}
      />

      {/* Community Post Reporting Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        post={activeReportPost}
        onSubmitReport={handleSubmitReport}
        currentUser={activeUser}
      />

    </div>
  );
}
