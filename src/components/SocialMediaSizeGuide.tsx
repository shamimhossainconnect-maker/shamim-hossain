import React, { useState } from 'react';
import { SOCIAL_MEDIA_PLATFORMS, SocialMediaPreset } from '../data/socialMediaSizes';
import { Language } from '../types';
import { 
  Copy, 
  Check, 
  Search, 
  Layers, 
  Sparkles, 
  Maximize,
  ArrowRight
} from 'lucide-react';
import { copyToClipboard } from '../utils/storage';

interface SocialMediaSizeGuideProps {
  language: Language;
  onSelectPreset?: (preset: SocialMediaPreset) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SocialMediaSizeGuide: React.FC<SocialMediaSizeGuideProps> = ({
  language,
  onSelectPreset,
  showToast,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedPreset, setCopiedPreset] = useState<string | null>(null);

  const handleCopySize = async (preset: SocialMediaPreset, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${preset.width} × ${preset.height} px (${preset.ratio})`;
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedPreset(`${preset.platform}-${preset.name}`);
      showToast(
        language === 'bn' 
          ? `${preset.platform} ${preset.name} সাইজ কপি হয়েছে: ${text}` 
          : `Copied size: ${text}`, 
        'success'
      );
      setTimeout(() => setCopiedPreset(null), 1800);
    }
  };

  // Filtered platforms and presets
  const filteredGroups = SOCIAL_MEDIA_PLATFORMS.map((group) => {
    const isPlatformMatch = selectedPlatform === 'all' || group.id === selectedPlatform;
    if (!isPlatformMatch) return null;

    const matchedPresets = group.presets.filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.platform.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        `${p.width}x${p.height}`.includes(q) ||
        p.ratio.includes(q)
      );
    });

    if (matchedPresets.length === 0) return null;

    return {
      ...group,
      presets: matchedPresets,
    };
  }).filter(Boolean) as typeof SOCIAL_MEDIA_PLATFORMS;

  const totalPresetsCount = SOCIAL_MEDIA_PLATFORMS.reduce(
    (acc, curr) => acc + curr.presets.length,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-white">
              {language === 'bn' 
                ? 'সোশ্যাল মিডিয়া সাইজ ও রেজোলিউশন গাইড (১৩টি প্ল্যাটফর্ম)' 
                : 'Social Media Size & Resolution Guide (13 Platforms)'}
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {language === 'bn'
              ? 'এখানে Facebook, Instagram, YouTube সহ ১৩টি প্ল্যাটফর্মের স্ট্যান্ডার্ড সাইজ তালিকাভুক্ত রয়েছে। যেকোনো সাইজে ক্লিক করে আপলোড ফর্মে যুক্ত করতে পারেন।'
              : 'Complete dimensions for 13 social platforms. Click any size to apply to the upload form.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'সাইজ বা প্ল্যাটফর্ম খুঁজুন...' : 'Search size or platform...'}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Platform Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedPlatform('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedPlatform === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
          }`}
        >
          {language === 'bn' ? `সবগুলো (${totalPresetsCount})` : `All (${totalPresetsCount})`}
        </button>

        {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => setSelectedPlatform(platform.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedPlatform === platform.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            {platform.name}
          </button>
        ))}
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
                <span className="text-sm font-bold text-white tracking-wide">
                  {group.name}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {group.presets.length} {language === 'bn' ? 'ফরম্যাট' : 'formats'}
                </span>
              </div>

              {/* Presets List */}
              <div className="space-y-2">
                {group.presets.map((preset) => {
                  const key = `${preset.platform}-${preset.name}`;
                  const isCopied = copiedPreset === key;

                  return (
                    <div
                      key={preset.name}
                      onClick={() => onSelectPreset?.(preset)}
                      className="group/item flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-indigo-500/50 cursor-pointer transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-200 group-hover/item:text-indigo-300 transition-colors">
                          {preset.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                          <span className="tabular-nums font-medium text-slate-300">
                            {preset.width} × {preset.height} px
                          </span>
                          <span>·</span>
                          <span className="text-indigo-400 font-semibold">{preset.ratio}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Copy size text button */}
                        <button
                          type="button"
                          onClick={(e) => handleCopySize(preset, e)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="সাইজ কপি করুন"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Apply size to upload form button */}
                        {onSelectPreset && (
                          <button
                            type="button"
                            onClick={() => onSelectPreset(preset)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[10px] font-semibold transition-all"
                            title="এই সাইজে আপলোড করুন"
                          >
                            <span>{language === 'bn' ? 'সিলেক্ট' : 'Apply'}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
