export interface ThumbnailItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  resolution: string;
  downloadsCount: number;
  copiesCount: number;
  createdAt: string;
  featured?: boolean;
  author?: string;
  fileSize?: string;
}

export type ActivePanel = 'user' | 'admin';

export type Language = 'bn' | 'en';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}
