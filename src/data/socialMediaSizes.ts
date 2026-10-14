export interface SocialMediaPreset {
  platform: string;
  name: string;
  width: number;
  height: number;
  ratio: string;
}

export interface PlatformGroup {
  id: string;
  name: string;
  iconName?: string;
  presets: SocialMediaPreset[];
}

export const SOCIAL_MEDIA_PLATFORMS: PlatformGroup[] = [
  {
    id: 'facebook',
    name: '১. Facebook',
    presets: [
      { platform: 'Facebook', name: 'Square Post', width: 1080, height: 1080, ratio: '1:1' },
      { platform: 'Facebook', name: 'Portrait Post', width: 1080, height: 1350, ratio: '4:5' },
      { platform: 'Facebook', name: 'Landscape Post', width: 1200, height: 630, ratio: '1.91:1' },
      { platform: 'Facebook', name: 'Story', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'Facebook', name: 'Reel', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'Facebook', name: 'Cover Photo', width: 851, height: 315, ratio: '2.7:1' },
      { platform: 'Facebook', name: 'Profile Picture', width: 320, height: 320, ratio: '1:1' },
    ],
  },
  {
    id: 'instagram',
    name: '২. Instagram',
    presets: [
      { platform: 'Instagram', name: 'Square Post', width: 1080, height: 1080, ratio: '1:1' },
      { platform: 'Instagram', name: 'Portrait Post', width: 1080, height: 1350, ratio: '4:5' },
      { platform: 'Instagram', name: 'Landscape Post', width: 1080, height: 566, ratio: '1.91:1' },
      { platform: 'Instagram', name: 'Story', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'Instagram', name: 'Reel', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'Instagram', name: 'Profile Picture', width: 320, height: 320, ratio: '1:1' },
    ],
  },
  {
    id: 'youtube',
    name: '৩. YouTube',
    presets: [
      { platform: 'YouTube', name: 'Video Thumbnail', width: 1280, height: 720, ratio: '16:9' },
      { platform: 'YouTube', name: 'Channel Banner', width: 2560, height: 1440, ratio: '16:9' },
      { platform: 'YouTube', name: 'Profile Picture', width: 800, height: 800, ratio: '1:1' },
      { platform: 'YouTube', name: 'Shorts Video', width: 1080, height: 1920, ratio: '9:16' },
    ],
  },
  {
    id: 'tiktok',
    name: '৪. TikTok',
    presets: [
      { platform: 'TikTok', name: 'Video', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'TikTok', name: 'Cover', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'TikTok', name: 'Profile Picture', width: 200, height: 200, ratio: '1:1' },
    ],
  },
  {
    id: 'linkedin',
    name: '৫. LinkedIn',
    presets: [
      { platform: 'LinkedIn', name: 'Square Post', width: 1200, height: 1200, ratio: '1:1' },
      { platform: 'LinkedIn', name: 'Portrait Post', width: 1080, height: 1350, ratio: '4:5' },
      { platform: 'LinkedIn', name: 'Landscape Post', width: 1200, height: 627, ratio: '1.91:1' },
      { platform: 'LinkedIn', name: 'Personal Cover', width: 1584, height: 396, ratio: '4:1' },
      { platform: 'LinkedIn', name: 'Company Cover', width: 1128, height: 191, ratio: '5.9:1' },
      { platform: 'LinkedIn', name: 'Profile Picture', width: 400, height: 400, ratio: '1:1' },
    ],
  },
  {
    id: 'twitter',
    name: '৬. X (Twitter)',
    presets: [
      { platform: 'X (Twitter)', name: 'Image Post', width: 1600, height: 900, ratio: '16:9' },
      { platform: 'X (Twitter)', name: 'Square Post', width: 1080, height: 1080, ratio: '1:1' },
      { platform: 'X (Twitter)', name: 'Header Banner', width: 1500, height: 500, ratio: '3:1' },
      { platform: 'X (Twitter)', name: 'Profile Picture', width: 400, height: 400, ratio: '1:1' },
    ],
  },
  {
    id: 'whatsapp',
    name: '৭. WhatsApp',
    presets: [
      { platform: 'WhatsApp', name: 'Status', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'WhatsApp', name: 'Image Post', width: 1080, height: 1080, ratio: '1:1' },
      { platform: 'WhatsApp', name: 'Profile Picture', width: 500, height: 500, ratio: '1:1' },
    ],
  },
  {
    id: 'pinterest',
    name: '৮. Pinterest',
    presets: [
      { platform: 'Pinterest', name: 'Standard Pin', width: 1000, height: 1500, ratio: '2:3' },
      { platform: 'Pinterest', name: 'Square Pin', width: 1000, height: 1000, ratio: '1:1' },
      { platform: 'Pinterest', name: 'Video Pin', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'Pinterest', name: 'Profile Picture', width: 400, height: 400, ratio: '1:1' },
    ],
  },
  {
    id: 'telegram',
    name: '৯. Telegram',
    presets: [
      { platform: 'Telegram', name: 'Square Post', width: 1080, height: 1080, ratio: '1:1' },
      { platform: 'Telegram', name: 'Portrait Post', width: 1080, height: 1350, ratio: '4:5' },
      { platform: 'Telegram', name: 'Story', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'Telegram', name: 'Profile Picture', width: 512, height: 512, ratio: '1:1' },
    ],
  },
  {
    id: 'threads',
    name: '১০. Threads',
    presets: [
      { platform: 'Threads', name: 'Square Post', width: 1080, height: 1080, ratio: '1:1' },
      { platform: 'Threads', name: 'Portrait Post', width: 1080, height: 1350, ratio: '4:5' },
      { platform: 'Threads', name: 'Landscape Post', width: 1200, height: 675, ratio: '16:9' },
      { platform: 'Threads', name: 'Profile Picture', width: 320, height: 320, ratio: '1:1' },
    ],
  },
  {
    id: 'snapchat',
    name: '১১. Snapchat',
    presets: [
      { platform: 'Snapchat', name: 'Snap / Story', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'Snapchat', name: 'Spotlight Video', width: 1080, height: 1920, ratio: '9:16' },
      { platform: 'Snapchat', name: 'Profile Picture', width: 320, height: 320, ratio: '1:1' },
    ],
  },
  {
    id: 'reddit',
    name: '১২. Reddit',
    presets: [
      { platform: 'Reddit', name: 'Square Post', width: 1080, height: 1080, ratio: '1:1' },
      { platform: 'Reddit', name: 'Landscape Post', width: 1200, height: 675, ratio: '16:9' },
      { platform: 'Reddit', name: 'Banner', width: 1920, height: 384, ratio: '5:1' },
      { platform: 'Reddit', name: 'Profile Picture', width: 256, height: 256, ratio: '1:1' },
    ],
  },
  {
    id: 'website',
    name: '১৩. সাধারণ ওয়েবসাইট / নিউজ পোর্টাল',
    presets: [
      { platform: 'Website / News', name: 'Website Banner', width: 1920, height: 600, ratio: '16:5' },
      { platform: 'Website / News', name: 'News Thumbnail', width: 1200, height: 675, ratio: '16:9' },
      { platform: 'Website / News', name: 'Article Image', width: 1200, height: 800, ratio: '3:2' },
      { platform: 'Website / News', name: 'Square News Graphic', width: 1080, height: 1080, ratio: '1:1' },
      { platform: 'Website / News', name: 'Portrait News Graphic', width: 1080, height: 1350, ratio: '4:5' },
    ],
  },
];
