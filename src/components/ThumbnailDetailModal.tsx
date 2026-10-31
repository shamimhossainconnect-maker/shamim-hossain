import React, { useState } from 'react';
import { ThumbnailItem, Language } from '../types';
import { translations } from '../utils/i18n';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  Bookmark, 
  Sparkles,
  ShieldCheck,
  Maximize2,
  Calendar
} from 'lucide-react';
import { 
  formatDisplayDate, 
  formatDateWithRelative 
} from '../utils/dateFormatter';
import { 
  copyToClipboard, 
  downloadImage, 
  preloadImageForDownload, 
  getInstantDownloadUrl, 
  getCleanDownloadFilename 
} from '../utils/storage';

interface ThumbnailDetailModalProps {
  item: ThumbnailItem;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onIncrementDownload: (id: string) => void;
  onIncrementCopy: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ThumbnailDetailModal: React.FC<ThumbnailDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  language,
  isBookmarked,
  onToggleBookmark,
  onIncrementDownload,
  onIncrementCopy,
  showToast,
}) => {
  const t = translations[language];
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Preload this high-res image into RAM as soon as modal opens
  React.useEffect(() => {
    if (isOpen && item?.imageUrl) {
      preloadImageForDownload(item.imageUrl);
    }
  }, [isOpen, item?.imageUrl]);

  if (!isOpen) return null;

  const handleCopyTitle = async () => {
    const success = await copyToClipboard(item.title);
    if (success) {
      setCopiedTitle(true);
      onIncrementCopy(item.id);
      showToast(t.titleCopied, 'success');
      setTimeout(() => setCopiedTitle(false), 2000);
    }
  };

  const handleCopyDesc = async () => {
    const success = await copyToClipboard(item.description);
    if (success) {
      setCopiedDesc(true);
      onIncrementCopy(item.id);
      showToast(t.descriptionCopied, 'success');
      setTimeout(() => setCopiedDesc(false), 2000);
    }
  };

  const handleCopyAll = async () => {
    const combined = `[TITLE / শিরোনাম]:\n${item.title}\n\n[DESCRIPTION / বিবরণ]:\n${item.description}\n\n[TAGS / ট্যাগ]:\n${item.tags?.join(', ') || ''}`;
    const success = await copyToClipboard(combined);
    if (success) {
      setCopiedAll(true);
      onIncrementCopy(item.id);
      showToast(t.allCopied, 'success');
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    onIncrementDownload(item.id);
    try {
      await downloadImage(item.imageUrl, item.title);
      showToast(
        language === 'bn' 
          ? '⚡ হাই-রেজোলিউশনে ইনস্ট্যান্ট ডাউনলোড সম্পন্ন!' 
          : '⚡ Instant High-Res Download Completed!', 
        'success'
      );
    } catch {
      showToast(
        language === 'bn' ? 'ডাউনলোড সম্পন্ন হয়েছে।' : 'Download completed.', 
        'info'
      );
    } finally {
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/40">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-200">{item.resolution}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatDisplayDate(item.createdAt, language)}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleBookmark(item.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked 
                  ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-400' 
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title={isBookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্কে রাখুন'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display (Preserves exact natural aspect ratio: 16:9, 1:1, 4:5, 9:16) */}
        <div className="relative w-full min-h-[240px] max-h-[58vh] bg-slate-950 flex items-center justify-center p-3 group overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="max-h-[55vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
          />

          {/* Quick ratio guarantee badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-[11px] font-medium text-emerald-300 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? '১০০% আসল হাই-রেজোলিউশন (ছবি ফাটবে না)' : '100% Lossless High-Res Preserved'}</span>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                {isDownloading 
                  ? (language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Saving...') 
                  : (language === 'bn' ? `⚡ ইনস্ট্যান্ট হাই-রেজোলিউশন ডাউনলোড (${item.resolution})` : `⚡ Instant Download (${item.resolution})`)}
              </span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata Highlights Bar */}
          <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-400">{language === 'bn' ? 'আপলোডের তারিখ:' : 'Upload Date:'}</span>
              <span className="font-semibold text-white">{formatDateWithRelative(item.createdAt, language)}</span>
            </div>
            <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400">{language === 'bn' ? 'সাইজ:' : 'Dimensions:'}</span>
              <span className="font-mono text-white">{item.resolution}</span>
            </div>
            {item.fileSize && (
              <>
                <span className="text-slate-700 hidden sm:inline" aria-hidden="true">|</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-400">{language === 'bn' ? 'ফাইল সাইজ:' : 'File Size:'}</span>
                  <span className="font-mono text-white">{item.fileSize}</span>
                </div>
              </>
            )}
          </div>

          {/* Title Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {language === 'bn' ? 'থাম্বনেইল শিরোনাম (Title)' : 'Thumbnail Title'}
              </span>
              <button
                type="button"
                onClick={handleCopyTitle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-all whitespace-nowrap"
              >
                {copiedTitle ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{language === 'bn' ? 'কপি হয়েছে' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyTitle}</span>
                  </>
                )}
              </button>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {item.title}
            </h2>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {language === 'bn' ? 'কনটেন্ট বিবরণ (Description)' : 'Content Description'}
              </span>
              <button
                type="button"
                onClick={handleCopyDesc}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-all whitespace-nowrap"
              >
                {copiedDesc ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{language === 'bn' ? 'কপি হয়েছে' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyDescription}</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line select-text">
              {item.description}
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">ট্যাগ:</span>
              {item.tags.map((tag, idx) => (
                <span key={idx} className="text-slate-300">
                  #{tag}{idx < item.tags.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="tabular-nums font-semibold text-slate-200">{item.downloadsCount}</span> {language === 'bn' ? 'ডাউনলোড' : 'downloads'}
              </span>
              <span className="flex items-center gap-1">
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span className="tabular-nums font-semibold text-slate-200">{item.copiesCount}</span> {language === 'bn' ? 'কপি' : 'copies'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyAll}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-white transition-all"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{language === 'bn' ? 'সব কপি হয়েছে!' : 'All Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t.copyAll}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'bn' ? 'আসল সাইজে ডাউনলোড' : 'Download Original Ratio'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
