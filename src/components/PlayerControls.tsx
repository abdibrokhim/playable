
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const PlayerButton = forwardRef<HTMLButtonElement, PlayerButtonProps>(
  ({ className, active, ...props }, ref) => {
    return (
      <button
        className={cn(
          "button-hover rounded-full flex items-center justify-center transition-all duration-200",
          active ? "text-player-accent" : "text-player-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
PlayerButton.displayName = "PlayerButton";

interface PlayerControlsProps {
  isPlaying: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  muted: boolean;
  toggleMute: () => void;
}

const PlayerControls = ({
  isPlaying,
  togglePlay,
  nextTrack,
  volume,
  setVolume,
  muted,
  toggleMute,
}: PlayerControlsProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-4">
        <PlayerButton
          onClick={togglePlay}
          className="w-12 h-12 bg-player-foreground text-player-background"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </PlayerButton>
        <PlayerButton
          onClick={nextTrack}
          className="w-10 h-10 bg-player-muted"
          aria-label="Skip to next track"
        >
          <SkipForward className="w-4 h-4" />
        </PlayerButton>
      </div>

      <div className="flex items-center space-x-2">
        <PlayerButton
          onClick={toggleMute}
          className="w-8 h-8"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </PlayerButton>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
          aria-label="Volume"
        />
      </div>
    </div>
  );
};

export default PlayerControls;
