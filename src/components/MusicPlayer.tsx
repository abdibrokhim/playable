import { useState, useEffect, useMemo } from "react";
import { useRandomTrack } from "@/hooks/useRandomTrack";
import YouTubeAudio from "./YouTubeAudio";
import PlayerControls from "./PlayerControls";
import { toast } from "@/components/ui/use-toast";

const MusicPlayer = () => {
  const { currentTrack, loading, getNextTrack } = useRandomTrack();
  const [isPlaying, setIsPlaying] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  const togglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setIsPlaying(false);
    setReady(false);
    getNextTrack();
  };

  const toggleMute = () => {
    if (muted) {
      // Unmute - restore previous volume
      setVolume(previousVolume);
      setMuted(false);
    } else {
      // Mute - save current volume first
      setPreviousVolume(volume);
      setVolume(0);
      setMuted(true);
    }
  };
  
  // Handle volume changes from slider
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
  };

  const handleAudioReady = () => {
    setReady(true);
    setIsPlaying(true);
  };

  // Generate random wave heights for a more realistic visualization
  const waveHeights = useMemo(() => {
    // Create more bars for a richer visualization
    return Array.from({ length: 24 }, () => ({
      height: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 0.5,
      speed: 0.8 + Math.random() * 1.2
    }));
  }, [currentTrack]);

  // Simulate audio intensity changes
  const [intensity, setIntensity] = useState(0.5);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    // Simulate changing audio intensity
    const intensityInterval = setInterval(() => {
      setIntensity(Math.random() * 0.6 + 0.4);
    }, 800);
    
    return () => clearInterval(intensityInterval);
  }, [isPlaying]);

  useEffect(() => {
    if (currentTrack && ready) {
      toast({
        title: "Now Playing",
        description: `${currentTrack.title} by ${currentTrack.artist}`,
        duration: 3000,
      });
    }
  }, [currentTrack, ready]);

  return (
    <div className="player-glass rounded-2xl p-6 max-w-md w-full mx-auto">
      <div className="flex flex-col items-center">
        {/* Album Art */}
        <div className="relative mb-6 w-48 h-48 rounded-xl overflow-hidden shadow-lg">
          {loading ? (
            <div className="absolute inset-0 bg-player-muted animate-pulse-subtle flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-player-accent border-t-transparent animate-spin" />
            </div>
          ) : (
            <img
              src={currentTrack?.thumbnailUrl || "https://placehold.co/400"}
              alt={currentTrack?.title || "Album Art"}
              className="w-full h-full object-cover animate-scale-in"
            />
          )}
        </div>

        {/* Track Info */}
        <div className="text-center mb-6 w-full">
          {loading ? (
            <>
              <div className="h-6 w-3/4 bg-player-muted rounded-md animate-pulse-subtle mx-auto mb-2" />
              <div className="h-4 w-1/2 bg-player-muted rounded-md animate-pulse-subtle mx-auto" />
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-1 tracking-tight truncate">
                {currentTrack?.title || "Unknown Track"}
              </h2>
              <p className="text-sm text-player-foreground/70">
                {currentTrack?.artist || "Unknown Artist"}
              </p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="track-progress">
            <div className="track-progress-fill">
              <div className={`wave-container ${isPlaying ? 'active' : 'paused'}`}>
                {waveHeights.map((wave, index) => (
                  <div 
                    key={index} 
                    className="wave" 
                    style={{ 
                      animationDuration: `${wave.speed}s`,
                      animationDelay: `${wave.delay}s`,
                      opacity: 0.7 - (index % 5 * 0.05),
                      transform: `scaleY(${wave.height * intensity})`,
                      '--random-height': `${wave.height * 30}%`
                    } as React.CSSProperties}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          nextTrack={nextTrack}
          volume={volume}
          setVolume={handleVolumeChange}
          muted={muted}
          toggleMute={toggleMute}
        />
      </div>

      {/* YouTube Audio (hidden) */}
      <YouTubeAudio
        track={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
        onReady={handleAudioReady}
      />
    </div>
  );
};

export default MusicPlayer;

