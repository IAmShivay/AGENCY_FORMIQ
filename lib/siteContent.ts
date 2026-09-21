import { supabase } from './supabaseClient';

export interface HeroMedia {
  video_url: string;
  video_thumbnail: string;
  gallery: { url: string; label: string }[];
}

const DEFAULT_HERO_MEDIA: HeroMedia = {
  video_url: 'https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4',
  video_thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
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
