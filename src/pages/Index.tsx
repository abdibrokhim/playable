import { Toaster } from "@/components/ui/toaster";
import MusicPlayer from "@/components/MusicPlayer";
import ChatInterface from "@/components/ChatInterface";
import { LogViewer } from "@/components/LogViewer";
import { Analytics } from "@vercel/analytics/react";
import { useState, useEffect } from "react";
import { logger } from "@/utils/logger";

const Index = () => {
  const [chatting, setChatting] = useState(false);
  const [preference, setPreference] = useState<"male" | "female" | "group" | null>(null);
  
  // Log key events for debugging
  useEffect(() => {
    logger.info("Index", "Application initialized");
    
    // Log localStorage for debugging gender/user settings
    const userId = localStorage.getItem("user_id");
    const userGender = localStorage.getItem("user_gender");
    const username = localStorage.getItem("username");
    
    logger.debug("Index", "User data from localStorage", {
      userId,
      userGender,
      username
    });
    
    return () => {
      logger.info("Index", "Application closing");
    };
  }, []);

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
            <div className="mt-6 text-center text-xs text-foreground/50 animate-fade-in">
              <p>Playing random tracks from YouTube.</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Chat Interface */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
          <div className="w-full max-w-md">
            <ChatInterface 
              chatting={chatting} 
              setChatting={setChatting}
              preference={preference}
              setPreference={setPreference}
            />
            <div className="mt-6 text-center text-xs text-foreground/50 animate-fade-in">
              <p>Messages are not saved.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Toaster />
      <LogViewer />
    </div>
  );
};

export default Index;
