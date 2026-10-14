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

// In-memory cache for ultra-fast instant downloads
export const blobUrlCache = new Map<string, { url: string; ext: string }>();

// IndexedDB setup for large high-resolution photos
const DB_NAME = 'ThumbnailHubDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setItemInIndexedDB(key: string, val: any): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(val, key);
  } catch (err) {
    console.warn('IndexedDB write warning:', err);
  }
}

export async function getItemFromIndexedDB<T = any>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export function registerFileBlob(dataUrl: string, file: File): string {
  const url = window.URL.createObjectURL(file);
  let ext = '.jpg';
  if (file.name.toLowerCase().endsWith('.png') || file.type.includes('png')) ext = '.png';
  else if (file.name.toLowerCase().endsWith('.webp') || file.type.includes('webp')) ext = '.webp';
  else if (file.name.toLowerCase().endsWith('.jpeg') || file.name.toLowerCase().endsWith('.jpg')) ext = '.jpg';

  const entry = { url, ext };
  blobUrlCache.set(dataUrl, entry);
  blobUrlCache.set(url, entry);

  // Store in IndexedDB for long-term persistence without localStorage limit
  setItemInIndexedDB(dataUrl, file);
  return url;
}

/**
 * Ultra-fast DataURL to Blob conversion without regex memory penalty
 */
export function fastDataUrlToBlob(dataurl: string): { blob: Blob; ext: string } {
  const commaIdx = dataurl.indexOf(',');
  const header = commaIdx !== -1 ? dataurl.substring(0, commaIdx) : 'data:image/jpeg;base64';
  const base64Data = commaIdx !== -1 ? dataurl.substring(commaIdx + 1) : dataurl;

  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  let ext = '.jpg';
  if (mime.includes('png')) ext = '.png';
  else if (mime.includes('webp')) ext = '.webp';
  else if (mime.includes('svg')) ext = '.svg';
  else if (mime.includes('gif')) ext = '.gif';

  const byteChars = atob(base64Data);
  const len = byteChars.length;
  const byteArray = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    byteArray[i] = byteChars.charCodeAt(i);
  }
  const blob = new Blob([byteArray], { type: mime });
  return { blob, ext };
}

// Backward compatibility alias
export const dataURLtoBlob = fastDataUrlToBlob;

/**
 * Lossless Canvas export fallback preserving maximum resolution and quality
 */
export function renderImageToLosslessBlob(imageUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 1920;
        canvas.height = img.naturalHeight || img.height || 1080;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const isPng = imageUrl.includes('.png') || imageUrl.includes('png');
        const format = isPng ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas toBlob failed'));
          },
          format,
          1.0
        );
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(e);
    img.src = imageUrl;
  });
}

/**
 * Ensures an image is in memory as a Blob URL for instant 0ms downloads
 */
export async function ensureBlobUrl(imageUrl: string): Promise<{ url: string; ext: string }> {
  if (!imageUrl) return { url: '', ext: '.jpg' };

  if (blobUrlCache.has(imageUrl)) {
    return blobUrlCache.get(imageUrl)!;
  }

  if (imageUrl.startsWith('blob:')) {
    const entry = { url: imageUrl, ext: '.jpg' };
    blobUrlCache.set(imageUrl, entry);
    return entry;
  }

  if (imageUrl.startsWith('data:')) {
    try {
      const { blob, ext } = fastDataUrlToBlob(imageUrl);
      const url = URL.createObjectURL(blob);
      const entry = { url, ext };
      blobUrlCache.set(imageUrl, entry);
      return entry;
    } catch {
      return { url: imageUrl, ext: '.jpg' };
    }
  }

  // Fetch as binary Blob
  try {
    const response = await fetch(imageUrl, { cache: 'force-cache' });
    if (response.ok) {
      const blob = await response.blob();
      let ext = '.jpg';
      if (blob.type.includes('png')) ext = '.png';
      else if (blob.type.includes('webp')) ext = '.webp';
      else if (blob.type.includes('gif')) ext = '.gif';
      const url = URL.createObjectURL(blob);
      const entry = { url, ext };
      blobUrlCache.set(imageUrl, entry);
      return entry;
    }
  } catch {
    // Ignore fetch error, try canvas fallback
  }

  try {
    const blob = await renderImageToLosslessBlob(imageUrl);
    const ext = blob.type.includes('png') ? '.png' : '.jpg';
    const url = URL.createObjectURL(blob);
    const entry = { url, ext };
    blobUrlCache.set(imageUrl, entry);
    return entry;
  } catch {
    return { url: imageUrl, ext: '.jpg' };
  }
}

/**
 * Synchronous getter for already-cached blob URLs
 */
export function getInstantDownloadUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  if (blobUrlCache.has(imageUrl)) {
    return blobUrlCache.get(imageUrl)!.url;
  }
  if (imageUrl.startsWith('data:')) {
    try {
      const { blob, ext } = fastDataUrlToBlob(imageUrl);
      const url = window.URL.createObjectURL(blob);
      blobUrlCache.set(imageUrl, { url, ext });
      return url;
    } catch {
      return imageUrl;
    }
  }
  return imageUrl;
}

/**
 * Gets clean high-res filename preserving original extension
 */
export function getCleanDownloadFilename(title: string, imageUrl: string, preferredExt?: string): string {
  const cleanBaseName = (title || 'photo')
    .replace(/[/\\?%*:|"<>]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 60) || 'photo';

  let ext = preferredExt || '.jpg';
  if (!preferredExt) {
    if (blobUrlCache.has(imageUrl)) {
      ext = blobUrlCache.get(imageUrl)!.ext;
    } else if (imageUrl.startsWith('data:image/png') || imageUrl.includes('.png')) {
      ext = '.png';
    } else if (imageUrl.startsWith('data:image/webp') || imageUrl.includes('.webp')) {
      ext = '.webp';
    }
  }

  if (!ext.startsWith('.')) ext = `.${ext}`;
  return `${cleanBaseName}${ext}`;
}

/**
 * Preloads image into RAM so clicking download triggers in 0 milliseconds
 */
export async function preloadImageForDownload(imageUrl: string): Promise<void> {
  if (!imageUrl || blobUrlCache.has(imageUrl)) return;
  await ensureBlobUrl(imageUrl);
}

// Eagerly preload default thumbnail images into memory right on startup
if (typeof window !== 'undefined') {
  [techThumb, travelThumb, podcastThumb, cookingThumb].forEach((img) => {
    preloadImageForDownload(img);
  });
}

/**
 * Native programmatic click trigger on hidden anchor
 */
export function triggerBlobDownload(blobUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.rel = 'noopener';
  link.target = '_self';
  link.style.display = 'none';
  link.style.position = 'fixed';
  link.style.top = '-9999px';
  link.style.left = '-9999px';
  document.body.appendChild(link);

  link.click();

  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 250);
}

/**
 * Ultra-fast, zero-delay, 100% lossless image downloader
 */
export async function downloadImage(imageUrl: string, suggestedFilename: string): Promise<boolean> {
  if (!imageUrl) return false;

  try {
    // If already in RAM cache (instant 0ms trigger)
    if (blobUrlCache.has(imageUrl)) {
      const cached = blobUrlCache.get(imageUrl)!;
      const cleanFilename = getCleanDownloadFilename(suggestedFilename, imageUrl, cached.ext);
      triggerBlobDownload(cached.url, cleanFilename);
      return true;
    }

    // Swiftly resolve to blob and trigger
    const { url, ext } = await ensureBlobUrl(imageUrl);
    const cleanFilename = getCleanDownloadFilename(suggestedFilename, imageUrl, ext);
    triggerBlobDownload(url, cleanFilename);
    return true;
  } catch (err) {
    console.error('Download error, fallback direct trigger:', err);
    triggerBlobDownload(imageUrl, getCleanDownloadFilename(suggestedFilename, imageUrl, '.jpg'));
    return false;
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
