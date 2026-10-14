import { ThumbnailItem } from '../types';
import techThumb from '../assets/images/thumb_tech_review_1791905093096.jpg';
import travelThumb from '../assets/images/thumb_nature_travel_1791905093811.jpg';
import podcastThumb from '../assets/images/thumb_podcast_talk_1791905094834.jpg';
import cookingThumb from '../assets/images/thumb_cooking_recipe_1791905093560.jpg';

export const ADMIN_PASSWORD = '2468';

const STORAGE_KEY = 'thumbnailhub_items_v2';
const BOOKMARKS_KEY = 'thumbnailhub_bookmarks_v2';
const AUTH_KEY = 'thumbnailhub_admin_authenticated';

// Initial default items with high-resolution imported thumbnail assets
export const DEFAULT_ITEMS: ThumbnailItem[] = [
  {
    id: 'item-1',
    title: 'আলটিমেট ফিউচারিস্টিক গ্যাজেট ও নেক্সট-জেন টেক রিভিউ (২০২৬)',
    description: 'আগামী প্রজন্মের সবচেয়ে অদ্ভুত ও আধুনিক ৫টি টেকনোলজি গ্যাজেট নিয়ে বিস্তারিত পর্যালোচনা। স্মার্ট গ্যাজেট, ড্রোন এবং ফিউচারিস্টিক ডিসপ্লে ইন্টারফেসের রিয়েল টেস্ট ও আনবক্সিং গাইড।',
    imageUrl: techThumb,
    category: 'টেক ও গ্যাজেট',
    tags: ['Tech Review', 'Futuristic', 'Gadgets', 'YouTube Thumbnail', 'Unboxing'],
    resolution: '1920x1080 (16:9)',
    downloadsCount: 142,
    copiesCount: 89,
    createdAt: '2026-03-28',
    featured: true,
    author: 'Admin',
    fileSize: '1.8 MB',
  },
  {
    id: 'item-2',
    title: 'ট্রপিক্যাল প্যারাডাইজ: রোমাঞ্চকর পাহাড়ি সানরাইজ ট্রেক ভ্লগ',
    description: 'ঘন সবুজ পাহাড়ের চূড়া ও নীল জলরাশির মোহনায় সকালের সূর্যোদয় দেখার রোমাঞ্চকর ট্রাভেল গাইড। ট্রেকিংয়ের সময় সেরা স্পট, ট্রাভেল বাজেট এবং ড্রোন শট ধারণের নিখুঁত পরামর্শ।',
    imageUrl: travelThumb,
    category: 'ট্রাভেল ও ভ্লগ',
    tags: ['Travel Vlog', 'Mountains', 'Sunrise', 'Nature', 'Cinematic'],
    resolution: '1920x1080 (16:9)',
    downloadsCount: 215,
    copiesCount: 134,
    createdAt: '2026-04-02',
    featured: true,
    author: 'Admin',
    fileSize: '2.1 MB',
  },
  {
    id: 'item-3',
    title: 'দ্য ইভনিং চ্যাট: কালচার, ক্রিয়েটিভিটি ও নতুন আইডিয়ার পডকাস্ট',
    description: 'ক্রিয়েটিভ ইন্ডাস্ট্রির বর্তমান ট্রেন্ড এবং মননশীল চিন্তাভাবনা নিয়ে বিশেষ স্টুডিও আড্ডা। অডিও প্রোডাকশন সেটআপ, মাইক পজিশনিং এবং লাইভ ইন্টারভিউ টেকনিকের অভিজ্ঞতা শেয়ার।',
    imageUrl: podcastThumb,
    category: 'পডকাস্ট ও টকশো',
    tags: ['Podcast', 'Talk Show', 'Interview', 'Studio', 'Discussion'],
    resolution: '1920x1080 (16:9)',
    downloadsCount: 98,
    copiesCount: 76,
    createdAt: '2026-04-05',
    featured: false,
    author: 'Admin',
    fileSize: '1.6 MB',
  },
  {
    id: 'item-4',
    title: 'মাস্টারক্লাস কুলিনারি আর্ট: পারফেক্ট পাস্তা তৈরির গোপন রেসিপি',
    description: 'রেস্তোরাঁ স্টাইলের খাঁটি ক্রিস্পি ফ্লেভারযুক্ত পারফেক্ট পাস্তা ঘরে তৈরির পূর্ণাঙ্গ রেসিপি ও শেফ সিক্রেটস। সস প্রিপারেশন ও গার্নিশিং টেকনিক বিস্তারিত শেখানো হয়েছে।',
    imageUrl: cookingThumb,
    category: 'রান্না ও রেসিপি',
    tags: ['Food & Recipe', 'Pasta Masterclass', 'Cooking', 'Culinary', 'Chef'],
    resolution: '1920x1080 (16:9)',
    downloadsCount: 184,
    copiesCount: 112,
    createdAt: '2026-04-09',
    featured: false,
    author: 'Admin',
    fileSize: '1.9 MB',
  },
];

export function loadItems(): ThumbnailItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveItems(DEFAULT_ITEMS);
      return DEFAULT_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveItems(DEFAULT_ITEMS);
      return DEFAULT_ITEMS;
    }
    // Update default seed items image paths so Vite bundled URLs always resolve
    const updated = parsed.map((item) => {
      if (item.id === 'item-1') return { ...item, imageUrl: techThumb };
      if (item.id === 'item-2') return { ...item, imageUrl: travelThumb };
      if (item.id === 'item-3') return { ...item, imageUrl: podcastThumb };
      if (item.id === 'item-4') return { ...item, imageUrl: cookingThumb };
      return item;
    });
    return updated;
  } catch (err) {
    console.error('Failed to parse items from localStorage', err);
    return DEFAULT_ITEMS;
  }
}

export function saveItems(items: ThumbnailItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to localStorage', err);
  }
}

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(id: string): string[] {
  const current = getBookmarks();
  const exists = current.includes(id);
  const updated = exists ? current.filter(item => item !== id) : [...current, id];
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update bookmarks', err);
  }
  return updated;
}

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(val: boolean): void {
  try {
    if (val) {
      sessionStorage.setItem(AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  } catch (err) {
    console.error('Failed to set auth state', err);
  }
}

/**
 * Downloads image directly to user's computer/phone preserving exact resolution, ratio and original format
 */
export async function downloadImage(imageUrl: string, suggestedFilename: string): Promise<boolean> {
  try {
    let ext = '.jpg';
    if (imageUrl.startsWith('data:image/png')) ext = '.png';
    else if (imageUrl.startsWith('data:image/webp')) ext = '.webp';
    else if (imageUrl.startsWith('data:image/jpeg') || imageUrl.startsWith('data:image/jpg')) ext = '.jpg';
    else if (imageUrl.includes('.png')) ext = '.png';
    else if (imageUrl.includes('.webp')) ext = '.webp';

    const cleanBaseName = (suggestedFilename || 'photo')
      .replace(/[^a-zA-Z0-9_\-\u0980-\u09FF]/g, '_')
      .slice(0, 60);

    // If it's a data url or blob url, trigger direct download immediately
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${cleanBaseName}${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    }

    // Fetch original blob preserving exact bytes and dimensions
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    if (blob.type === 'image/png') ext = '.png';
    else if (blob.type === 'image/webp') ext = '.webp';
    else if (blob.type === 'image/jpeg') ext = '.jpg';

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${cleanBaseName}${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch (error) {
    console.warn('Direct blob fetch failed, falling back to direct link download', error);
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = (suggestedFilename || 'photo') + '.jpg';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Robust copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed', err);
    return false;
  }
}
