import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, MessageCircle, Send, Users, ClipboardCopy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { PreferenceSelect } from "@/components/PreferenceSelect";
import { GroupChatOptions } from "@/components/GroupChatOptions";
import { useChat } from "@/hooks/useChat";
import { Badge } from "@/components/ui/badge";
import { logger } from "@/utils/logger";

interface ChatInterfaceProps {
  chatting: boolean;
  setChatting: (chatting: boolean) => void;
  preference: "male" | "female" | "group" | null;
  setPreference: (preference: "male" | "female" | "group" | null) => void;
}

type GroupJoinMethod = "create" | "join" | "random";

const ChatInterface = ({ 
  chatting, 
  setChatting,
  preference,
  setPreference
}: ChatInterfaceProps) => {
  const { 
    messages, 
    sendMessage, 
    partnerDisconnected, 
    partnerTyping, 
    connect, 
    disconnect, 
    sendTypingIndicator,
    groupCode,
    groupMembers,
    isGroupChat
  } = useChat();
  
  const [inputMessage, setInputMessage] = useState("");
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Log values on change for debugging
  useEffect(() => {
    logger.debug("ChatInterface", "State updated", { 
      chatting, 
      preference, 
      isGroupChat, 
      groupCode, 
      groupMembers: groupMembers?.length
    });
  }, [chatting, preference, isGroupChat, groupCode, groupMembers?.length]);

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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      logger.info("ChatInterface", "Sending message", { content: inputMessage.trim() });
      sendMessage(inputMessage.trim());
      setInputMessage("");
      // Stop typing indicator after sending message
      sendTypingIndicator(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    // Handle typing indicator with debounce
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Send typing indicator when user starts typing
    if (e.target.value && !inputMessage) {
      sendTypingIndicator(true);
    }
    
    // Set timeout to stop typing indicator after 1 second of no typing
    typingTimeoutRef.current = setTimeout(() => {
      if (e.target.value.length === 0) {
        sendTypingIndicator(false);
      }
    }, 1000);
  };

  const handlePreferenceSelect = (selectedPreference: "male" | "female" | "group" | null) => {
    logger.info("ChatInterface", "Preference selected", { preference: selectedPreference });
    setPreference(selectedPreference);
    if (selectedPreference === "group") {
      setShowGroupOptions(true);
    } else {
      setShowGroupOptions(false);
    }
  };

  const handleBackToPreferences = () => {
    logger.info("ChatInterface", "Going back to preferences");
    setShowGroupOptions(false);
  };

  const handleCopyGroupCode = () => {
    if (groupCode) {
      navigator.clipboard.writeText(groupCode);
      toast({
        title: "Code copied",
        description: "Group code copied to clipboard.",
      });
      logger.info("ChatInterface", "Group code copied to clipboard", { groupCode });
    }
  };

  const handleStartGroupChat = (method: GroupJoinMethod, code?: string) => {
    logger.info("ChatInterface", "Starting group chat", { method, code });
    
    // Make sure user has set their gender
    const userGender = localStorage.getItem("user_gender");
    if (!userGender) {
      // Prompt user to set their gender
      const gender = window.prompt("Please select your gender (male/female):");
      if (gender && (gender.toLowerCase() === "male" || gender.toLowerCase() === "female")) {
        localStorage.setItem("user_gender", gender.toLowerCase());
      } else {
        toast({
          title: "Gender required",
          description: "Please specify your gender to enable matching.",
          variant: "destructive",
        });
        return;
      }
    }
    
    connect("group", method, code);
    setChatting(true);
    
    const messages = {
      create: "Creating a new group chat...",
      join: "Joining the group chat...",
      random: "Finding a random group to join..."
    };
    
    toast({
      title: "Connecting to group chat",
      description: messages[method],
    });
  };

  const handleDirectChat = () => {
    if (!preference || preference === "group") {
      toast({
        title: "Select a preference",
        description: "Please select whom you'd like to chat with.",
        variant: "default",
      });
      return;
    }
    
    logger.info("ChatInterface", "Starting direct chat", { preference });
    
    // Make sure user has set their gender
    const userGender = localStorage.getItem("user_gender");
    if (!userGender) {
      // Prompt user to set their gender
      const gender = window.prompt("Please select your gender (male/female):");
      if (gender && (gender.toLowerCase() === "male" || gender.toLowerCase() === "female")) {
        localStorage.setItem("user_gender", gender.toLowerCase());
      } else {
        toast({
          title: "Gender required",
          description: "Please specify your gender to enable matching.",
          variant: "destructive",
        });
        return;
      }
    }
    
    connect(preference);
    setChatting(true);
    
    toast({
      title: "Finding a partner...",
      description: "We're connecting you with someone to chat with.",
    });
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
    
    if (preference === "group") {
      setShowGroupOptions(true);
    } else {
      handleDirectChat();
    }
  };

  const handleDisconnect = () => {
    logger.info("ChatInterface", "Disconnecting");
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
              Connect with a random person and <br></br>chat while listening to music
            </p>
          </div>
          
          {showGroupOptions ? (
            <GroupChatOptions 
              onBack={handleBackToPreferences}
              onStartGroupChat={handleStartGroupChat}
            />
          ) : (
            <>
              <PreferenceSelect 
                preference={preference} 
                setPreference={handlePreferenceSelect}
              />

              <Button 
                className="w-full bg-player-foreground hover:bg-player-foreground/90 text-white"
                onClick={handleStartChat}
                size="lg"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Chatting
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="player-glass rounded-2xl p-6 max-w-md w-full mx-auto flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-player-muted/30">
        <div className="flex items-center">
          <div className="bg-player-foreground/10 p-2 rounded-full mr-3">
            {isGroupChat ? (
              <Users className="h-5 w-5 text-player-foreground" />
            ) : (
              <User className="h-5 w-5 text-player-foreground" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium">
                {isGroupChat ? "Group Chat" : "Anonymous Chat"}
              </h2>
              {isGroupChat && groupCode && (
                <div className="flex items-center gap-1">
                  <Badge 
                    variant="outline" 
                    className="text-xs flex items-center gap-1 cursor-pointer hover:bg-player-muted/20"
                    onClick={handleCopyGroupCode}
                  >
                    Code: {groupCode}
                    <ClipboardCopy className="h-3 w-3 ml-1" />
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {isGroupChat ? (
                <span className="text-xs text-foreground/70">
                  {groupMembers.length} {groupMembers.length === 1 ? 'person' : 'people'} in group
                </span>
              ) : (
                <span className="text-xs text-foreground/70">
                  Chatting with a {preference === "group" ? "group" : preference}
                </span>
              )}
              {partnerTyping && !isGroupChat && (
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
                {isGroupChat && !msg.isOwnMessage && msg.sender && (
                  <p className="text-xs font-medium text-foreground/70 mb-1">{msg.sender}</p>
                )}
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
          onChange={handleInputChange}
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
