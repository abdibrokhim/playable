import { Mars, Venus, Users } from "lucide-react";

interface PreferenceSelectProps {
  preference: "male" | "female" | "group" | null;
  setPreference: (preference: "male" | "female" | "group" | null) => void;
  onBackToPreferences?: () => void;
  showBack?: boolean;
}

export const PreferenceSelect = ({ 
  preference, 
  setPreference,
  onBackToPreferences,
  showBack = false
}: PreferenceSelectProps) => {

  return (
    <div className="w-full">
      {showBack && (
        <button 
          onClick={onBackToPreferences} 
          className="text-sm text-player-foreground mb-4 flex items-center hover:underline"
        >
          ← Back to preferences
        </button>
      )}
      <p className="text-sm mb-3 text-center">Whom would you like to chat with?</p>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setPreference("male")}
          className={`player-glass button-hover transition-all flex flex-col items-center justify-center p-4 border ${
            preference === "male"
              ? "border-player-foreground/80 bg-player-foreground/10"
              : "border-player-muted/30 hover:bg-player-muted/10"
          } rounded-lg`}
          aria-selected={preference === "male"}
        >
          <Mars
            className={`h-8 w-8 mb-2 ${
              preference === "male" ? "text-player-foreground" : "text-foreground/70"
            }`}
          />
          <span className="text-sm font-medium">Male</span>
        </button>

        <button
          onClick={() => setPreference("female")}
          className={`player-glass button-hover transition-all flex flex-col items-center justify-center p-4 border ${
            preference === "female"
              ? "border-player-foreground/80 bg-player-foreground/10"
              : "border-player-muted/30 hover:bg-player-muted/10"
          } rounded-lg`}
          aria-selected={preference === "female"}
        >
          <Venus
            className={`h-8 w-8 mb-2 ${
              preference === "female" ? "text-player-foreground" : "text-foreground/70"
            }`}
          />
          <span className="text-sm font-medium">Female</span>
        </button>

        <button
          onClick={() => setPreference("group")}
          className={`player-glass button-hover transition-all flex flex-col items-center justify-center p-4 border ${
            preference === "group"
              ? "border-player-foreground/80 bg-player-foreground/10"
              : "border-player-muted/30 hover:bg-player-muted/10"
          } rounded-lg`}
          aria-selected={preference === "group"}
        >
          <Users
            className={`h-8 w-8 mb-2 ${
              preference === "group" ? "text-player-foreground" : "text-foreground/70"
            }`}
          />
          <span className="text-sm font-medium">Group Chat</span>
        </button>
      </div>
    </div>
  );
};
