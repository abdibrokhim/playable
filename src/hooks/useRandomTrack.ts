
import { useState, useEffect } from 'react';
import { Track } from '@/types/track';

// Sample tracks database with YouTube IDs
const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Lofi Study Session',
    artist: 'ChilledCow',
    youtubeId: 'jfKfPfyJRdk',
    thumbnailUrl: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    duration: 0, // Livestream
  },
  {
    id: '2',
    title: 'Relaxing Jazz Piano',
    artist: 'Cafe Music BGM',
    youtubeId: '70j-u8z2zvg',
    thumbnailUrl: 'https://i.ytimg.com/vi/70j-u8z2zvg/hqdefault.jpg',
    duration: 0, // Livestream
  },
  {
    id: '3',
    title: 'Ambient Study Music',
    artist: 'DreamhopMusic',
    youtubeId: 'sjkrrmBnpGE',
    thumbnailUrl: 'https://i.ytimg.com/vi/sjkrrmBnpGE/hqdefault.jpg',
    duration: 3600,
  },
  {
    id: '4',
    title: 'Work Music',
    artist: 'Yellow Brick Cinema',
    youtubeId: 'lTRiuFIWV54',
    thumbnailUrl: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg',
    duration: 0, // Livestream
  },
  {
    id: '5',
    title: 'Classical Music for Studying',
    artist: 'HALIDONMUSIC',
    youtubeId: 'y7e-GC6oGhg',
    thumbnailUrl: 'https://i.ytimg.com/vi/y7e-GC6oGhg/hqdefault.jpg',
    duration: 7200,
  },
];

export const useRandomTrack = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  const getRandomTrack = () => {
    setLoading(true);
    const randomIndex = Math.floor(Math.random() * sampleTracks.length);
    const track = sampleTracks[randomIndex];
    
    // Simulate loading
    setTimeout(() => {
      setCurrentTrack(track);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    getRandomTrack();
  }, []);

  return { currentTrack, loading, getRandomTrack };
};
