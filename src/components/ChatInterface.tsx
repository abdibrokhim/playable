import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, MessageCircle, Send, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { PreferenceSelect } from "@/components/PreferenceSelect";
import { useChat } from "@/hooks/useChat";

interface ChatInterfaceProps {
  chatting: boolean;
  setChatting: (chatting: boolean) => void;
  preference: "male" | "female" | "not-sure" | null;
  setPreference: (preference: "male" | "female" | "not-sure" | null) => void;
}

const ChatInterface = ({ 
  chatting, 
  setChatting,
  preference,
  setPreference
}: ChatInterfaceProps) => {
  const { messages, sendMessage, partnerDisconnected, partnerTyping, connect, disconnect } = useChat();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle disconnect notification
  useEffect(() => {
    if (partnerDisconnected && chatting) {
      toast({
        title: "Partner disconnected",
        description: "Your chat partner has left the conversation.",
        variant: "destructive",
      });
      setChatting(false);
    }
  }, [partnerDisconnected, chatting, setChatting]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleStartChat = () => {
    if (!preference) {
      toast({
        title: "Select a preference",
        description: "Please select whom you'd like to chat with.",
        variant: "default",
      });
      return;
    }
    
    connect(preference);
    setChatting(true);
    
    toast({
      title: "Finding a partner...",
      description: "We're connecting you with someone to chat with.",
    });
  };

  const handleDisconnect = () => {
    disconnect();
    setChatting(false);
  };

  if (!chatting) {
    return (
      <div className="player-glass rounded-2xl p-8 max-w-md w-full mx-auto">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Start Chatting</h2>
            <p className="text-sm text-foreground/70">
              Connect with a random person and chat while listening to music
            </p>
          </div>
          
          <PreferenceSelect 
            preference={preference} 
            setPreference={setPreference} 
          />

          <Button 
            className="w-full bg-player-foreground hover:bg-player-foreground/90 text-white"
            onClick={handleStartChat}
            size="lg"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Start Chatting
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="player-glass rounded-2xl p-6 max-w-md w-full mx-auto flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-player-muted/30">
        <div className="flex items-center">
          <div className="bg-player-foreground/10 p-2 rounded-full mr-3">
            <Users className="h-5 w-5 text-player-foreground" />
          </div>
          <div>
            <h2 className="font-medium">Anonymous Chat</h2>
            <div className="flex items-center">
              <span className="text-xs text-foreground/70">
                Chatting with {preference === "not-sure" ? "someone" : `a ${preference}`}
              </span>
              {partnerTyping && (
                <span className="ml-2 text-xs text-player-foreground animate-pulse">typing...</span>
              )}
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDisconnect}
          className="text-destructive hover:text-destructive"
        >
          Disconnect
        </Button>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 break-words ${
                  msg.isOwnMessage 
                  ? 'bg-player-foreground text-white rounded-br-none' 
                  : 'bg-player-muted/30 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="mt-4 flex items-center space-x-2">
        <Input
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 bg-player-muted/10 border-player-muted/90"
        />
        <Button 
          onClick={handleSendMessage} 
          size="icon"
          disabled={!inputMessage.trim()}
          className="bg-player-foreground hover:bg-player-foreground/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
