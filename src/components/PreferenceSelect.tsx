import { Circle, SparklesIcon, HelpCircle } from "lucide-react";

interface PreferenceSelectProps {
  preference: "male" | "female" | "not-sure" | null;
  setPreference: (preference: "male" | "female" | "not-sure" | null) => void;
}

export const PreferenceSelect = ({ preference, setPreference }: PreferenceSelectProps) => {
  return (
    <div className="w-full">
      <p className="text-sm mb-3 text-center">Whom would you like to chat with?</p>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setPreference("male")}
          className={`player-glass transition-all flex flex-col items-center justify-center p-4 border ${
            preference === "male"
              ? "border-player-foreground/80 bg-player-foreground/10"
              : "border-player-muted/30 hover:bg-player-muted/10"
          } rounded-lg`}
          aria-selected={preference === "male"}
        >
          <Circle
            className={`h-8 w-8 mb-2 ${
              preference === "male" ? "text-player-foreground" : "text-foreground/70"
            }`}
          />
          <span className="text-sm font-medium">Male</span>
        </button>

        <button
          onClick={() => setPreference("female")}
          className={`player-glass transition-all flex flex-col items-center justify-center p-4 border ${
            preference === "female"
              ? "border-player-foreground/80 bg-player-foreground/10"
              : "border-player-muted/30 hover:bg-player-muted/10"
          } rounded-lg`}
          aria-selected={preference === "female"}
        >
          <SparklesIcon
            className={`h-8 w-8 mb-2 ${
              preference === "female" ? "text-player-foreground" : "text-foreground/70"
            }`}
          />
          <span className="text-sm font-medium">Female</span>
        </button>

        <button
          onClick={() => setPreference("not-sure")}
          className={`player-glass transition-all flex flex-col items-center justify-center p-4 border ${
            preference === "not-sure"
              ? "border-player-foreground/80 bg-player-foreground/10"
              : "border-player-muted/30 hover:bg-player-muted/10"
          } rounded-lg`}
          aria-selected={preference === "not-sure"}
        >
          <HelpCircle
            className={`h-8 w-8 mb-2 ${
              preference === "not-sure" ? "text-player-foreground" : "text-foreground/70"
            }`}
          />
          <span className="text-sm font-medium">Not Sure</span>
        </button>
      </div>
    </div>
  );
};
