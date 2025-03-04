import { Toaster } from "@/components/ui/toaster";
import MusicPlayer from "@/components/MusicPlayer";
import ChatInterface from "@/components/ChatInterface";
import { Analytics } from "@vercel/analytics/react";
import { useState } from "react";

const Index = () => {
  const [chatting, setChatting] = useState(false);
  const [preference, setPreference] = useState<"male" | "female" | "not-sure" | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <Analytics />
      
      <main className="flex flex-1 flex-col md:flex-row w-full">
        {/* Left side - Music Player */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center border-r border-foreground/10">
          <div className="w-full max-w-md">
            <header className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight animate-fade-in">
                Playable
              </h1>
            </header>
            
            <MusicPlayer />
            
            <footer className="mt-6 text-center text-xs text-foreground/50 animate-fade-in">
              <p>Playing random tracks from YouTube</p>
              <a href="https://github.com/abdibrokhim/playable" target="_blank" rel="noopener noreferrer" className="text-[10px] underline hover:animate-fade-in">open source</a>
            </footer>
          </div>
        </div>

        {/* Right side - Chat Interface */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
          <ChatInterface 
            chatting={chatting} 
            setChatting={setChatting}
            preference={preference}
            setPreference={setPreference}
          />
        </div>
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
