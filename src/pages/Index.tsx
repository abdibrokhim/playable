
import { Toaster } from "@/components/ui/toaster";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md">
        <header className="mb-10 text-center">
          <div className="text-xs uppercase tracking-widest text-foreground/50 mb-1 animate-fade-in">
            Random Tune
          </div>
          <h1 className="text-2xl font-semibold tracking-tight animate-fade-in">
            Harmony Player
          </h1>
        </header>
        
        <MusicPlayer />
        
        <footer className="mt-10 text-center text-xs text-foreground/50 animate-fade-in">
          <p>Playing random tracks from YouTube</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
