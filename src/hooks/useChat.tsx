import { useState, useEffect, useRef } from "react";

type Message = {
  content: string;
  isOwnMessage: boolean;
};

type Preference = "male" | "female" | "not-sure";

// This is a simulated websocket implementation
// In a real app, you would use actual WebSocket connections
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userIdRef = useRef<string>(`user-${Math.random().toString(36).substring(2, 9)}`);
  const preferenceRef = useRef<Preference | null>(null);

  // Simulate random message responses
  const randomMessages = [
    "Hey, how's it going?",
    "What kind of music do you listen to?",
    "I'm enjoying this song right now!",
    "Have you heard this artist before?",
    "Where are you from?",
    "What brings you here today?",
    "Do you come here often? 😅",
    "I love discovering new music through random chats",
    "What are your hobbies?",
    "The music player is pretty cool, right?",
  ];

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Simulate connecting to a chat partner
  const connect = (preference: Preference) => {
    setMessages([]);
    setPartnerDisconnected(false);
    preferenceRef.current = preference;
    
    // Simulate connection delay
    setTimeout(() => {
      setConnected(true);
      
      // Add a welcome message
      setMessages([
        {
          content: "You're now chatting with a random stranger. Say hi!",
          isOwnMessage: false,
        },
      ]);
      
      // Schedule first random response
      scheduleRandomResponse();
    }, 1500);
  };

  const disconnect = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setConnected(false);
  };

  const sendMessage = (content: string) => {
    const newMessage: Message = {
      content,
      isOwnMessage: true,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Show typing indicator after user sends message
    setTimeout(() => {
      setPartnerTyping(true);
    }, 500);
    
    // Schedule a response
    scheduleRandomResponse();
  };

  const scheduleRandomResponse = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Random delay between 1-3 seconds
    const delay = Math.floor(Math.random() * 2000) + 1000;
    
    timeoutRef.current = setTimeout(() => {
      // 10% chance of disconnection
      if (Math.random() < 0.1) {
        setPartnerTyping(false);
        setPartnerDisconnected(true);
        setConnected(false);
        return;
      }
      
      // Add a random message from the partner
      const randomIndex = Math.floor(Math.random() * randomMessages.length);
      const content = randomMessages[randomIndex];
      
      setPartnerTyping(false);
      
      setMessages((prev) => [
        ...prev,
        {
          content,
          isOwnMessage: false,
        },
      ]);
      
      // 70% chance of following up with another message
      if (Math.random() < 0.7) {
        setTimeout(() => {
          setPartnerTyping(true);
          scheduleRandomResponse();
        }, 1000);
      }
    }, delay);
  };

  return {
    messages,
    connected,
    partnerDisconnected,
    partnerTyping,
    sendMessage,
    connect,
    disconnect,
  };
};
