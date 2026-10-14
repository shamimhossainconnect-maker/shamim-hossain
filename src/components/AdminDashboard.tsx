import React, { useState, useRef } from 'react';
import { ThumbnailItem, Language } from '../types';
import { translations } from '../utils/i18n';
import { SOCIAL_MEDIA_PLATFORMS, SocialMediaPreset } from '../data/socialMediaSizes';
import { SocialMediaSizeGuide } from './SocialMediaSizeGuide';
import { 
  UploadCloud, 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  RefreshCw, 
  CheckCircle2, 
  Eye, 
  Copy, 
  Download, 
  Layers, 
  Search,
  Sparkles,
  Smartphone,
  Maximize2
} from 'lucide-react';

interface AdminDashboardProps {
  items: ThumbnailItem[];
  onAddItem: (item: Omit<ThumbnailItem, 'id' | 'downloadsCount' | 'copiesCount' | 'createdAt'>) => void;
  onUpdateItem: (item: ThumbnailItem) => void;
  onDeleteItem: (id: string) => void;
  onResetDefault: () => void;
  onSwitchToUserPanel: (targetItemId?: string) => void;
  language: Language;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

const DEFAULT_CATEGORIES = [
  'টেক ও গ্যাজেট',
  'ট্রাভেল ও ভ্লগ',
  'পডকাস্ট ও টকশো',
  'রান্না ও রেসিপি',
  'গেমিং ও স্পোর্টস',
  'শিক্ষা ও ক্যারিয়ার',
  'বিজনেস ও মার্কেটিং',
  'গ্রাফিক ডিজাইন',
  'সোশ্যাল মিডিয়া পোস্ট',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onResetDefault,
  onSwitchToUserPanel,
  language,
  showToast,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sub-tabs in Admin Panel
  const [activeAdminTab, setActiveAdminTab] = useState<'content' | 'guide'>('content');

  // Form State
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [resolution, setResolution] = useState('1920 × 1080 px (16:9)');
  const [detectedNativeRes, setDetectedNativeRes] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState('1.5 MB');

  // Search & Filter state in Admin table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Statistics
  const totalUploads = items.length;
  const totalDownloads = items.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0);
  const totalCopies = items.reduce((acc, curr) => acc + (curr.copiesCount || 0), 0);
  const uniqueCategoriesCount = new Set(items.map((i) => i.category)).size;

  // Helper to detect image intrinsic dimensions & ratio
  const detectImageDimensions = (url: string) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      let ratioStr = `${w}:${h}`;
      const ratioVal = w / h;
      if (Math.abs(ratioVal - 16 / 9) < 0.05) ratioStr = '16:9';
      else if (Math.abs(ratioVal - 1) < 0.02) ratioStr = '1:1';
      else if (Math.abs(ratioVal - 4 / 5) < 0.03) ratioStr = '4:5';
      else if (Math.abs(ratioVal - 9 / 16) < 0.05) ratioStr = '9:16';
      else if (Math.abs(ratioVal - 1.91) < 0.05) ratioStr = '1.91:1';
      else if (Math.abs(ratioVal - 2 / 3) < 0.05) ratioStr = '2:3';
      else if (Math.abs(ratioVal - 3 / 2) < 0.05) ratioStr = '3:2';

      const detected = `${w} × ${h} px (${ratioStr})`;
      setDetectedNativeRes(detected);
      setResolution(detected);
    };
    img.src = url;
  };

  // Handle local image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        showToast(
          language === 'bn' 
            ? 'ছবির সাইজ ১৫ মেগাবাইটের কম হতে হবে!' 
            : 'Image size should be under 15MB!', 
          'warning'
        );
        return;
      }

      // Compute display file size
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSizeStr(`${mb} MB`);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = event.target.result as string;
          setImageUrl(res);
          detectImageDimensions(res);
          showToast(
            language === 'bn' 
              ? 'ছবি সফলভাবে লোড হয়েছে (আসল রেশিও সংরক্ষিত)!' 
              : 'Image loaded with exact ratio preserved!', 
            'success'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSizeStr(`${mb} MB`);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const res = event.target.result as string;
          setImageUrl(res);
          detectImageDimensions(res);
          showToast(
            language === 'bn' 
              ? 'ড্রপ করা ছবি সফলভাবে যুক্ত হয়েছে!' 
              : 'Dropped image loaded!', 
            'success'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setCategory(DEFAULT_CATEGORIES[0]);
    setCustomCategory('');
    setTagsInput('');
    setResolution('1920 × 1080 px (16:9)');
    setDetectedNativeRes(null);
    setFileSizeStr('1.5 MB');
    setIsEditing(null);
    setShowUploadModal(false);
  };

  const handleOpenEdit = (item: ThumbnailItem) => {
    setIsEditing(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setCategory(item.category);
    setTagsInput(item.tags?.join(', ') || '');
    setResolution(item.resolution || '1920 × 1080 px (16:9)');
    setFileSizeStr(item.fileSize || '1.5 MB');
    setShowUploadModal(true);
  };

  // Called when a social preset is picked from the guide or select
  const handleApplyPreset = (preset: SocialMediaPreset) => {
    const formatted = `${preset.platform} - ${preset.name}: ${preset.width} × ${preset.height} px (${preset.ratio})`;
    setResolution(formatted);
    setShowUploadModal(true);
    showToast(
      language === 'bn'
        ? `সাইজ প্রিসেট যুক্ত হয়েছে: ${preset.platform} (${preset.width}×${preset.height} px)`
        : `Applied preset: ${preset.platform} (${preset.width}x${preset.height})`,
      'success'
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে টাইটেল দিন!' : 'Please enter a title!', 'warning');
      return;
    }
    if (!imageUrl.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে একটি ছবি আপলোড করুন!' : 'Please upload or select an image!', 'warning');
      return;
    }

    const finalCategory = customCategory.trim() || category;
    const finalTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (isEditing) {
      const existing = items.find((i) => i.id === isEditing);
      if (existing) {
        onUpdateItem({
          ...existing,
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          category: finalCategory,
          tags: finalTags.length > 0 ? finalTags : ['Thumbnail'],
          resolution,
          fileSize: fileSizeStr,
        });
        showToast(t.updateSuccess, 'success');
      }
    } else {
      onAddItem({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        category: finalCategory,
        tags: finalTags.length > 0 ? finalTags : ['Thumbnail', 'Featured'],
        resolution,
        fileSize: fileSizeStr,
      });
      showToast(t.uploadSuccess, 'success');
    }

    resetForm();
  };

  // Filter items for the admin table
  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড ও কনটেন্ট ম্যানেজার' : 'Admin Content Management'}
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {t.adminPanelSubtitle}
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewUpload}</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchToUserPanel()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Eye className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">{language === 'bn' ? 'ইউজার ভিউ দেখুন' : 'View User Portal'}</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-Tabs: Content Manager vs Social Media Size Guide */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveAdminTab('content')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeAdminTab === 'content'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{language === 'bn' ? 'আপলোড ও কন্টেন্ট তালিকা' : 'Uploads & Content'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('guide')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            activeAdminTab === 'guide'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4 text-indigo-300" />
          <span>{language === 'bn' ? 'সোশ্যাল মিডিয়া সাইজ গাইড (১৩টি প্ল্যাটফর্ম)' : 'Social Media Sizes (13 Platforms)'}</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.statUploads}</span>
            <ImageIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {totalUploads}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {language === 'bn' ? 'সরাসরি ইউজার প্যানেলে দৃশ্যমান' : 'Live on user portal'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.statDownloads}</span>
            <Download className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {totalDownloads}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {language === 'bn' ? 'ব্যবহারকারীদের মোট ডাউনলোড' : 'User thumbnail downloads'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.statCopies}</span>
            <Copy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {totalCopies}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {language === 'bn' ? 'টাইটেল ও ডেসক্রিপশন কপি' : 'Title & desc copy hits'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.statCategories}</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono tabular-nums">
            {uniqueCategoriesCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {language === 'bn' ? 'সক্রিয় কনটেন্ট বিভাগ' : 'Distinct categories'}
          </div>
        </div>
      </div>

      {/* Tab View: Social Media Size Guide */}
      {activeAdminTab === 'guide' ? (
        <SocialMediaSizeGuide
          language={language}
          onSelectPreset={handleApplyPreset}
          showToast={showToast}
        />
      ) : (
        /* Tab View: Content Management Table */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-6">
          {/* Table Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveAdminTab('guide')}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs text-indigo-300 hover:bg-indigo-500/20 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? '১৩টি সোশ্যাল মিডিয়া সাইজ দেখুন' : 'View 13 Social Sizes'}</span>
              </button>

              <button
                type="button"
                onClick={onResetDefault}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title={t.resetConfirm}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.resetData}</span>
              </button>
            </div>
          </div>

          {/* Content Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">{language === 'bn' ? 'থাম্বনেইল প্রিভিউ' : 'Preview'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'টাইটেল ও বিবরণ' : 'Title & Description'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'প্ল্যাটফর্ম / রেশিও' : 'Platform / Ratio'}</th>
                  <th className="py-3 px-4 text-right">{language === 'bn' ? 'ডাউনলোড' : 'Downloads'}</th>
                  <th className="py-3 px-4 text-right">{language === 'bn' ? 'কপি' : 'Copies'}</th>
                  <th className="py-3 px-4 text-center">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <p className="text-sm font-medium">{t.noItemsFound}</p>
                      <p className="text-xs text-slate-600 mt-1">{t.noItemsDesc}</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Thumbnail Image */}
                      <td className="py-3 px-4 w-36">
                        <div className="relative aspect-video w-32 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Title and Description */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-white line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-slate-400 line-clamp-2 mt-0.5 text-[11px] leading-relaxed">
                          {item.description}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1.5 font-mono">
                          <span>{item.createdAt}</span>
                          <span>·</span>
                          <span>{item.fileSize || '1.8 MB'}</span>
                        </div>
                      </td>

                      {/* Platform / Resolution */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-indigo-400">
                          {item.category}
                        </div>
                        <div className="text-[11px] font-mono text-slate-300 mt-0.5">
                          {item.resolution}
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                        {item.downloadsCount}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                        {item.copiesCount}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSwitchToUserPanel(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                            title="ইউজার ভিউতে দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload / Edit Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isEditing ? t.editUpload : t.addNewUpload}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'bn'
                      ? 'ছবি আপলোড করলে স্বয়ংক্রিয়ভাবে আসল রেশিও ও সাইজ সংরক্ষিত হবে।'
                      : 'Exact ratio & dimensions are preserved for user download.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
              {/* Image Uploader & Preview Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {t.formImageLabel} *
                </label>
                
                {imageUrl ? (
                  <div className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                    <img
                      src={imageUrl}
                      alt="Upload Preview"
                      referrerPolicy="no-referrer"
                      className="w-full max-h-72 object-contain bg-slate-950"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500"
                      >
                        {language === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change Image'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          setDetectedNativeRes(null);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-red-600/80 text-white text-xs font-medium hover:bg-red-500"
                      >
                        {language === 'bn' ? 'রিমুভ' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/50 hover:bg-slate-950 cursor-pointer transition-all text-center"
                  >
                    <UploadCloud className="w-10 h-10 text-slate-500 mb-3" />
                    <p className="text-sm font-medium text-slate-300">
                      {t.dropImageText}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG, WebP (আসল রেশিও ও পিক্সেল কোয়ালিটি অপরিবর্তিত থাকবে)
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Alternative image URL input */}
                <div className="mt-3">
                  <span className="text-[11px] text-slate-500 block mb-1">
                    {t.orEnterImageUrl}
                  </span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value) detectImageDimensions(e.target.value);
                    }}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t.formTitleLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.formTitlePlaceholder}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  {t.formDescLabel} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.formDescPlaceholder}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y"
                />
              </div>

              {/* Social Media Platform Resolution Dropdown & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Social Media Dimension Preset Selector (All 13 Platforms Included!) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      {language === 'bn' ? 'প্ল্যাটফর্ম ও সাইজ রেশিও' : 'Platform & Size Ratio'} *
                    </label>
                    <span className="text-[10px] text-indigo-400 font-mono">
                      {detectedNativeRes ? '✓ আসল সাইজ ডিটেক্টেড' : '১৩টি প্ল্যাটফর্ম'}
                    </span>
                  </div>

                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                  >
                    {detectedNativeRes && (
                      <optgroup label="📸 আপলোড করা ছবির আসল রেজোলিউশন (Original Ratio)">
                        <option value={detectedNativeRes}>
                          আসল সাইজ: {detectedNativeRes}
                        </option>
                      </optgroup>
                    )}

                    {SOCIAL_MEDIA_PLATFORMS.map((group) => (
                      <optgroup key={group.id} label={group.name}>
                        {group.presets.map((preset) => {
                          const val = `${preset.platform} - ${preset.name}: ${preset.width} × ${preset.height} px (${preset.ratio})`;
                          return (
                            <option key={preset.name} value={val}>
                              {preset.name} — {preset.width} × {preset.height} px ({preset.ratio})
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {t.formCategoryLabel}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags & Custom Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {t.formTagsLabel}
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder={t.formTagsPlaceholder}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    {language === 'bn' ? 'কাস্টম ক্যাটাগরি (ঐচ্ছিক)' : 'Custom Category (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="যেমন: Facebook Reel, YouTube Thumbnail"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-800 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditing ? t.saveChanges : t.saveUpload}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="mt-4 text-base font-bold text-white">
              {t.deleteConfirm}
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              {language === 'bn' 
                ? 'এটি মুছে ফেললে ইউজার প্যানেল থেকেও স্থায়ীভাবে মুছে যাবে।'
                : 'This will permanently remove the thumbnail from the portal.'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteItem(deleteConfirmId);
                  setDeleteConfirmId(null);
                  showToast(t.deleteSuccess, 'info');
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 shadow-sm"
              >
                {language === 'bn' ? 'হ্যাঁ, মুছুন' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
