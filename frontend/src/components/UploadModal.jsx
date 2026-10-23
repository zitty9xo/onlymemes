import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Film, AlertTriangle, CheckCircle2, Sparkles, ArrowRight, Loader2, RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react';
import { validateMediaFile, uploadMediaFile, MAX_FILE_SIZE_BYTES } from '../services/mediaService';
import { evaluateMemeContent } from '../services/aiModerator';

export default function UploadModal({
  isOpen,
  onClose,
  user,
  onPublishPost,
  onOpenStudioWithMedia
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState('#dank');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [aiStep, setAiStep] = useState('');
  const [aiProgress, setAiProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const categories = [
    { id: '#dank', label: 'Dank' },
    { id: '#dev', label: 'Dev / Code' },
    { id: '#gaming', label: 'Gaming' },
    { id: '#crypto', label: 'Crypto' },
    { id: '#wholesome', label: 'Wholesome' }
  ];

  const resetModal = () => {
    setSelectedFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setCaption('');
    setSelectedTag('#dank');
    setUploadProgress(0);
    setIsUploading(false);
    setIsEvaluatingAI(false);
    setAiStep('');
    setAiProgress(0);
    setErrorMessage('');
    setIsDragging(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleFileSelection = (file) => {
    setErrorMessage('');
    if (!file) return;

    // Validate size and format
    const validation = validateMediaFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error);
      setSelectedFile(null);
      setPreviewUrl('');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select an image or GIF to publish.');
      return;
    }

    if (!user) {
      setErrorMessage('Please sign in to publish memes.');
      return;
    }

    setErrorMessage('');
    setIsEvaluatingAI(true);
    setAiProgress(10);
    setAiStep('Initiating OnlyMeme AI Safety & Comedy Audit...');

    try {
      // 1. Run AI Safety & Creativity Evaluation Pipeline
      const evalResult = await evaluateMemeContent({
        file: selectedFile,
        caption: caption.trim() || 'Untitled Meme',
        tag: selectedTag,
        onProgress: (pct, step) => {
          setAiProgress(pct);
          setAiStep(step);
        }
      });

      // 2. Gate posting flow: intercept violations
      if (!evalResult.approved) {
        setIsEvaluatingAI(false);
        setErrorMessage(`🚫 Content Rejected: ${evalResult.rejectionReason}`);
        return;
      }

      setIsEvaluatingAI(false);
      setIsUploading(true);
      setUploadProgress(15);

      // 3. Upload to Storage
      const mediaUrl = await uploadMediaFile(
        selectedFile,
        user.uid,
        (progress) => setUploadProgress(progress)
      );

      // 4. Publish post object with AI metadata
      const isGif = selectedFile.type === 'image/gif';
      await onPublishPost({
        mediaUrl,
        type: isGif ? 'gif' : 'image',
        caption: caption.trim() || 'Untitled Meme',
        tag: evalResult.isEdgy && selectedTag === '#dank' ? '#edgy' : selectedTag,
        fileSize: selectedFile.size,
        fileName: selectedFile.name,
        aiRating: evalResult.creativityScore,
        aiRoast: evalResult.comedicRoast,
        isEdgy: evalResult.isEdgy,
        sexualityScore: evalResult.sexualityScore,
        vulgarityScore: evalResult.vulgarityScore,
        aiEngine: evalResult.engine
      });

      handleClose();
    } catch (err) {
      console.error('Publish post failed:', err);
      setErrorMessage(err.message || 'Failed to process media. Please try again.');
      setIsEvaluatingAI(false);
      setIsUploading(false);
    }
  };

  const handleSendToStudio = () => {
    if (!previewUrl) return;
    onOpenStudioWithMedia(previewUrl, selectedFile?.type || 'image/png');
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-container-lowest/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-surface-container border border-outline-variant rounded-2xl shadow-hard-lg p-6 sm:p-8 flex flex-col gap-5 my-8">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isUploading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50"
          aria-label="Close upload modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-outline-variant/60 pb-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-primary flex items-center justify-center shadow-hard shrink-0">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-modern-20 text-2xl font-normal text-on-surface tracking-wide">
              Upload <span className="text-primary font-bold">Meme or GIF</span>
            </h2>
            <p className="font-mono text-xs text-outline">
              Max file size: 10 MB • PNG, JPG, WEBP, GIF
            </p>
          </div>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-error-container/30 border border-error text-error text-xs font-mono flex items-start gap-2.5 animate-shake shadow-hard">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-error" />
            <div className="flex-1">
              <span className="font-bold block uppercase text-[10px] tracking-wider">Validation Alert</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Upload Zone / Media Preview */}
        {!previewUrl ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-primary bg-primary/10 shadow-glow-primary scale-[1.01]'
                : 'border-outline-variant bg-surface-container-low hover:border-primary/60 hover:bg-surface-container-high/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleFileSelection(e.target.files?.[0])}
            />

            <div className="w-16 h-16 rounded-2xl bg-surface-container border border-outline-variant flex items-center justify-center shadow-hard">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-headline text-sm font-bold text-on-surface">
                Drag and drop your meme here, or <span className="text-primary underline">browse</span>
              </p>
              <p className="font-mono text-[11px] text-outline">
                Supports static memes & animated GIFs up to 10 MB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Media Preview Box */}
            <div className="relative rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant flex items-center justify-center max-h-80 shadow-inner group">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="max-h-80 w-auto object-contain"
              />

              {/* Media Info Overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur font-mono text-[10px] text-primary font-bold uppercase border border-primary/30">
                  {selectedFile?.type === 'image/gif' ? 'GIF' : 'IMAGE'}
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur font-mono text-[10px] text-on-surface font-semibold border border-outline-variant">
                  {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}
                </span>
              </div>

              {/* Reset Media Button */}
              <button
                type="button"
                onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}
                disabled={isUploading}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-surface-container-lowest/80 hover:bg-error/30 text-outline hover:text-error backdrop-blur border border-outline-variant transition-colors"
                title="Change media"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Post Metadata Inputs (Only visible when file selected) */}
        {previewUrl && (
          <form onSubmit={handlePublish} className="flex flex-col gap-4 animate-fadeIn">
            {/* Caption */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] text-outline uppercase font-semibold">
                  Caption / Title
                </label>
                <span className="font-mono text-[10px] text-outline">
                  {caption.length} / 150
                </span>
              </div>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Give your meme an iconic punchline..."
                maxLength={150}
                disabled={isUploading}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-surface font-body focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Tag / Category Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] text-outline uppercase font-semibold">
                Select Channel / Tag
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedTag(cat.id)}
                    disabled={isUploading}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                      selectedTag === cat.id
                        ? 'bg-primary text-on-primary shadow-hard'
                        : 'bg-surface-container-low border border-outline-variant text-outline hover:text-on-surface hover:border-primary/40'
                    }`}
                  >
                    {cat.id}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Evaluation Scanner Banner */}
            {isEvaluatingAI && (
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-surface-container-high border border-secondary/50 shadow-hard animate-fadeIn">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-secondary flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 animate-spin text-secondary" />
                    <span>AI Safety & Comedy Audit</span>
                  </span>
                  <span className="font-bold text-secondary font-mono">{aiProgress}%</span>
                </div>
                <p className="font-mono text-[11px] text-on-surface-variant flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{aiStep}</span>
                </p>
                <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden border border-outline-variant">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-300"
                    style={{ width: `${aiProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Progress Bar (during upload) */}
            {isUploading && (
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-primary flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading to storage...</span>
                  </span>
                  <span className="font-bold text-on-surface">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden border border-outline-variant">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/60">

              <button
                type="submit"
                disabled={isUploading || isEvaluatingAI}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-fixed text-on-primary font-headline text-xs font-bold shadow-hard active:translate-y-0.5 transition-all disabled:opacity-50 btn-neo"
              >
                {isEvaluatingAI ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Auditing with AI...</span>
                  </span>
                ) : isUploading ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <span>Publish Meme</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
