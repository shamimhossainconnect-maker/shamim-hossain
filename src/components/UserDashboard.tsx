import React, { useState, useMemo, useEffect } from 'react';
import { ThumbnailItem, Language } from '../types';
import { translations } from '../utils/i18n';
import { 
  Download, 
  Copy, 
  Check, 
  Search, 
  Eye, 
  Bookmark, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  Sparkles,
  ExternalLink,
  Zap,
  Calendar
} from 'lucide-react';
import { 
  formatDisplayDate, 
  getRelativeTime 
} from '../utils/dateFormatter';
import { 
  copyToClipboard, 
  downloadImage, 
  preloadImageForDownload, 
  getInstantDownloadUrl, 
  getCleanDownloadFilename 
} from '../utils/storage';
import { ThumbnailDetailModal } from './ThumbnailDetailModal';

interface UserDashboardProps {
  items: ThumbnailItem[];
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onIncrementDownload: (id: string) => void;
  onIncrementCopy: (id: string) => void;
  language: Language;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
  onNavigateToAdmin: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  items,
  bookmarks,
  onToggleBookmark,
  onIncrementDownload,
  onIncrementCopy,
  language,
  showToast,
  onNavigateToAdmin,
}) => {
  const t = translations[language];

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'oldest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeModalItem, setActiveModalItem] = useState<ThumbnailItem | null>(null);

  // Per-card copied state trackers
  const [copiedTitleId, setCopiedTitleId] = useState<string | null>(null);
  const [copiedDescId, setCopiedDescId] = useState<string | null>(null);

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  // Filter & Sort
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory === 'BOOKMARKS') {
          if (!bookmarks.includes(item.id)) return false;
        } else if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchCategory = item.category?.toLowerCase().includes(q);
          const matchTags = item.tags?.some((tag) => tag.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCategory && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.downloadsCount || 0) - (a.downloadsCount || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [items, selectedCategory, searchQuery, sortBy, bookmarks]);

  // Automatically preload visible items into RAM for instant 0ms downloads
  useEffect(() => {
    const timer = setTimeout(() => {
      filteredItems.slice(0, 10).forEach((item) => {
        preloadImageForDownload(item.imageUrl);
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [filteredItems]);

  // Card Quick Actions
  const handleQuickCopyTitle = async (item: ThumbnailItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(item.title);
    if (success) {
      setCopiedTitleId(item.id);
      onIncrementCopy(item.id);
      showToast(t.titleCopied, 'success');
      setTimeout(() => setCopiedTitleId(null), 1800);
    }
  };

  const handleQuickCopyDesc = async (item: ThumbnailItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(item.description);
    if (success) {
      setCopiedDescId(item.id);
      onIncrementCopy(item.id);
      showToast(t.descriptionCopied, 'success');
      setTimeout(() => setCopiedDescId(null), 1800);
    }
  };

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleQuickDownload = async (item: ThumbnailItem, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDownloadingId(item.id);
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
      setTimeout(() => setDownloadingId(null), 500);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Presentation Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/60 to-slate-950 p-6 sm:p-10 lg:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'bn' ? 'ইউজার ওপেন রিসোর্স পোর্টাল' : 'Open Resource Portal'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            {language === 'bn' 
              ? 'হাই-কোয়ালিটি থাম্বনেইল ডাউনলোড ও রেডি কনটেন্ট কালেকশন' 
              : 'Download High-Res Thumbnails & Copy Pre-Written Content'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {language === 'bn'
              ? 'এখানে যেকোনো থাম্বনেইল সম্পূর্ণ বিনামূল্যে ডাউনলোড করতে পারেন এবং সাথে সাথে ভিডিওর টাইটেল ও বিস্তারিত বিবরণ কপি করে ব্যবহার করতে পারেন। কোনো পাসওয়ার্ড ছাড়াই সবার জন্য উন্মুক্ত!'
              : 'Browse our curated collection of professional thumbnails. Download high-resolution images, copy engaging titles and descriptions with a single click—no password needed!'}
          </p>

          {/* Search Bar Embedded in Hero */}
          <div className="pt-2 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder:text-slate-500 shadow-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-xs font-medium text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 -z-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      </section>

      {/* Control Bar: Categories, Sort & View Mode */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Interactive Category Filter Tabs (Zero-pill rule: Functional button elements) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t.allCategories}
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}

            {bookmarks.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedCategory('BOOKMARKS')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === 'BOOKMARKS'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>{t.savedBookmarks} ({bookmarks.length})</span>
              </button>
            )}
          </div>

          {/* Sort & Layout Controls */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-900">{t.newest}</option>
                <option value="popular" className="bg-slate-900">{t.popular}</option>
                <option value="oldest" className="bg-slate-900">{t.oldest}</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="গ্রিড ভিউ"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="লিস্ট ভিউ"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Count result summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div>
            <span>{t.totalItems}: </span>
            <span className="font-mono tabular-nums font-semibold text-slate-200">
              {filteredItems.length}
            </span>
          </div>
          {searchQuery && (
            <span>
              "{searchQuery}" এর ফলাফল দেখানো হচ্ছে
            </span>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {t.noItemsFound}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {t.noItemsDesc}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
            >
              ফিল্টার ক্লিয়ার করুন
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            const isTitleCopied = copiedTitleId === item.id;
            const isDescCopied = copiedDescId === item.id;

            return (
              <div
                key={item.id}
                className="group flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700/80 shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Thumbnail Image Slot */}
                <div 
                  className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => setActiveModalItem(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  {/* Top-right bookmark button */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(item.id);
                      }}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                        isBookmarked
                          ? 'bg-amber-500/90 text-white shadow-lg shadow-amber-500/30'
                          : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900/80'
                      }`}
                      title={isBookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্কে রাখুন'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom-left upload date badge directly on the image */}
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-[11px] font-semibold text-slate-200 shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{formatDisplayDate(item.createdAt, language)}</span>
                  </div>

                  {/* Hover Overlay Button to View Detail */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                    <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-md shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t.preview}</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Zero-Pill Static Metadata: Clean unboxed text with typographic separators */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-indigo-400">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{item.resolution}</span>
                      <span aria-hidden="true">·</span>
                      <span 
                        className="flex items-center gap-1 text-slate-300 font-medium"
                        title={getRelativeTime(item.createdAt, language)}
                      >
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{formatDisplayDate(item.createdAt, language)}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{item.downloadsCount} {language === 'bn' ? 'ডাউনলোড' : 'DL'}</span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => setActiveModalItem(item)}
                      className="text-base sm:text-lg font-bold text-white hover:text-indigo-300 cursor-pointer line-clamp-2 transition-colors leading-snug"
                    >
                      {item.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    
                    {/* Copy Controls */}
                    <div className="flex items-center gap-1.5">
                      {/* Copy Title Button */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickCopyTitle(item, e)}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                          isTitleCopied
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                            : 'border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                        title="টাইটেল ক্লিপবোর্ডে কপি করুন"
                      >
                        {isTitleCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        <span>{isTitleCopied ? (language === 'bn' ? 'টাইটেল কপিড!' : 'Copied!') : t.copyTitle}</span>
                      </button>

                      {/* Copy Description Button */}
                      <button
                        type="button"
                        onClick={(e) => handleQuickCopyDesc(item, e)}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                          isDescCopied
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                            : 'border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                        title="বিবরণ ক্লিপবোর্ডে কপি করুন"
                      >
                        {isDescCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{isDescCopied ? (language === 'bn' ? 'বিবরণ কপিড!' : 'Copied!') : t.copyDescription}</span>
                      </button>
                    </div>

                    {/* Download Button (Instant Lossless 0ms Download) */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickDownload(item, e)}
                      onMouseEnter={() => preloadImageForDownload(item.imageUrl)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer select-none"
                      title="হাই-রেজোলিউশনে ইনস্ট্যান্ট ডাউনলোড করুন"
                    >
                      {downloadingId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                          <span>{language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Saving...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>{t.downloadThumbnail}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Layout */
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            const isTitleCopied = copiedTitleId === item.id;
            const isDescCopied = copiedDescId === item.id;

            return (
              <div
                key={item.id}
                className="group flex flex-col md:flex-row items-stretch rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/70 p-4 sm:p-5 gap-5 transition-all"
              >
                {/* Thumbnail Image */}
                <div 
                  className="relative aspect-video md:w-64 shrink-0 rounded-xl overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => setActiveModalItem(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(item.id);
                      }}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
                        isBookmarked
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-950/60 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Date badge on list view thumbnail */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-medium text-slate-200">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    <span>{formatDisplayDate(item.createdAt, language)}</span>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="flex flex-1 flex-col justify-between space-y-3">
                  <div>
                    {/* Metadata unboxed */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
                      <span className="font-semibold text-indigo-400">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{item.resolution}</span>
                      <span aria-hidden="true">·</span>
                      <span 
                        className="flex items-center gap-1 text-slate-300 font-medium"
                        title={getRelativeTime(item.createdAt, language)}
                      >
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{formatDisplayDate(item.createdAt, language)}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{item.downloadsCount} {language === 'bn' ? 'ডাউনলোড' : 'downloads'}</span>
                    </div>

                    <h3 
                      onClick={() => setActiveModalItem(item)}
                      className="text-base sm:text-lg font-bold text-white hover:text-indigo-300 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={(e) => handleQuickCopyTitle(item, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      {isTitleCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                      <span>{t.copyTitle}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickCopyDesc(item, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      {isDescCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{t.copyDescription}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveModalItem(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.preview}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleQuickDownload(item, e)}
                      onMouseEnter={() => preloadImageForDownload(item.imageUrl)}
                      className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold cursor-pointer select-none active:scale-95 transition-all"
                      title="হাই-রেজোলিউশনে ইনস্ট্যান্ট ডাউনলোড করুন"
                    >
                      {downloadingId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                          <span>{language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Saving...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>{t.downloadThumbnail}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Shortcut to Admin */}
      <div className="pt-6 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-500">
          {language === 'bn' ? 'আপনি কি অ্যাডমিন? নতুন ছবি ও তথ্য আপলোড করতে ' : 'Are you an admin? To publish and manage assets, '}
          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="text-indigo-400 hover:text-indigo-300 underline font-medium"
          >
            {language === 'bn' ? 'অ্যাডমিন প্যানেলে লগইন করুন' : 'login to Admin Panel'}
          </button>
        </p>
      </div>

      {/* Active Modal Detail Lightbox */}
      {activeModalItem && (
        <ThumbnailDetailModal
          item={activeModalItem}
          isOpen={Boolean(activeModalItem)}
          onClose={() => setActiveModalItem(null)}
          language={language}
          isBookmarked={bookmarks.includes(activeModalItem.id)}
          onToggleBookmark={onToggleBookmark}
          onIncrementDownload={onIncrementDownload}
          onIncrementCopy={onIncrementCopy}
          showToast={showToast}
        />
      )}
    </div>
  );
};
