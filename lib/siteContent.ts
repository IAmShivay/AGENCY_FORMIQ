import { supabase } from './supabaseClient';

export interface HeroMedia {
  video_url: string;
  video_thumbnail: string;
  gallery: { url: string; label: string }[];
}

const DEFAULT_HERO_MEDIA: HeroMedia = {
  video_url: 'https://res.cloudinary.com/dzwekdoeo/video/upload/v1792316284/MINE_ounxke.mp4',
  video_thumbnail: 'https://res.cloudinary.com/dzwekdoeo/video/upload/v1792316284/MINE_ounxke.jpg',
  gallery: [
    { url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Client Meetings' },
    { url: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ad Campaigns' },
    { url: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Global Work' },
  ],
};

export async function getHeroMedia(): Promise<HeroMedia> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'hero_media')
      .single();

    if (error || !data) return DEFAULT_HERO_MEDIA;
    return { ...DEFAULT_HERO_MEDIA, ...data.value };
  } catch {
    return DEFAULT_HERO_MEDIA;
  }
}

export async function saveHeroMedia(media: HeroMedia): Promise<boolean> {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      { key: 'hero_media', value: media, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

  return !error;
}

export { DEFAULT_HERO_MEDIA };

export interface FounderPopupContent {
  enabled?: boolean;
  video_url: string;
  video_thumbnail?: string;
  founder_name: string;
  founder_role: string;
  founder_avatar?: string;
  badge_text?: string;
  heading: string;
  subheading: string;
  whatsapp_number: string;
  whatsapp_message: string;
  form_url?: string;
  form_button_text?: string;
  whatsapp_button_text?: string;
  delay_seconds?: number;
}

export const DEFAULT_FOUNDER_POPUP: FounderPopupContent = {
  enabled: true,
  video_url: 'https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.mp4',
  video_thumbnail: 'https://res.cloudinary.com/dzwekdoeo/video/upload/v1792311864/gemini_generated_video_80d8115b_ipzljn.jpg',
  founder_name: 'Shivay Sharma',
  founder_role: 'Founder & CEO',
  founder_avatar: '/favicon.png',
  badge_text: 'Founder’s Message',
  heading: 'Transforming Ideas Into Reality',
  subheading: 'Watch this quick video to see how we help businesses scale with modern websites, targeted ads & AI automation.',
  whatsapp_number: '919832078313',
  whatsapp_message: 'Hi Shivay! I saw your founder video on FormiqStudio and would love to discuss a project.',
  form_url: '',
  form_button_text: 'Get Free Consultation',
  whatsapp_button_text: 'Chat on WhatsApp',
  delay_seconds: 1.2,
};

export async function getFounderPopupContent(): Promise<FounderPopupContent> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'founder_popup')
      .single();

    if (error || !data) return DEFAULT_FOUNDER_POPUP;
    return { ...DEFAULT_FOUNDER_POPUP, ...data.value };
  } catch {
    return DEFAULT_FOUNDER_POPUP;
  }
}

export async function saveFounderPopupContent(content: FounderPopupContent): Promise<boolean> {
  const { error } = await supabase
    .from('site_content')
    .upsert(
      { key: 'founder_popup', value: content, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

  return !error;
}
