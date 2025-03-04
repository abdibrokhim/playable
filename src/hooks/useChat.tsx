import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/utils/logger";

type Message = {
  content: string;
  isOwnMessage: boolean;
  sender?: string; // Optional sender name/id for group chats
};

// Replace "not-sure" with "group"
type Preference = "male" | "female" | "group";

// Room type for different chat scenarios
type RoomType = "couple" | "group";

type GroupJoinMethod = "create" | "join" | "random";

type UserProfile = {
  userId: string;
  username?: string; // Optional username for group chats
  preference: Preference;
  gender: "male" | "female";
  roomType?: RoomType;
  groupCode?: string; // For joining specific groups
  groupJoinMethod?: GroupJoinMethod; // How the user wants to join a group
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [groupCode, setGroupCode] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get or create a unique user ID from localStorage
  const getUserId = () => {
    let userId = localStorage.getItem("user_id");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("user_id", userId);
    }
    return userId;
  };
  
  // Get user gender from localStorage or prompt if not set
  const getUserGender = () => {
    let gender = localStorage.getItem("user_gender") as "male" | "female" | null;
    if (!gender) {
      // For simplicity, defaulting to male if not set, 
      // In a real app, you should prompt the user to set this
      gender = "male";
      localStorage.setItem("user_gender", gender);
    }
    return gender;
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      // Clean up typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Disconnect socket when component unmounts
      if (socketRef.current) {
        logger.info("useChat", "Disconnecting socket on unmount");
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Connect to a chat partner or group with the specified preference
  const connect = (
    preference: Preference, 
    groupJoinMethod?: GroupJoinMethod, 
    customGroupCode?: string
  ) => {
    logger.info("useChat", "Connecting to chat", { preference, groupJoinMethod, customGroupCode });
    
    setMessages([]);
    setPartnerDisconnected(false);
    
    // Create a new socket connection
    const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "http://localhost:3001";
    const socket = io(SOCKET_SERVER_URL);
    socketRef.current = socket;

    // Create user profile
    const userProfile: UserProfile = {
      userId: getUserId(),
      username: localStorage.getItem("username") || `User-${getUserId().substring(0, 5)}`,
      preference,
      gender: getUserGender(),
      roomType: preference === "group" ? "group" : "couple",
    };

    // Add group-specific properties
    if (preference === "group") {
      userProfile.groupJoinMethod = groupJoinMethod;
      
      if (groupJoinMethod === "join" && customGroupCode) {
        userProfile.groupCode = customGroupCode;
      }
      
      setIsGroupChat(true);
      logger.info("useChat", "Setting up group chat profile", userProfile);
    } else {
      setIsGroupChat(false);
      logger.info("useChat", "Setting up couple chat profile", userProfile);
    }

    // Set up event listeners
    socket.on("connect", () => {
      logger.info("useChat", "Socket connected, joining chat");
      // Send user profile and preference to server
      socket.emit("join_chat", userProfile);
    });

    socket.on("chat_started", (data) => {
      logger.info("useChat", "Chat started", data);
      setConnected(true);
      
      if (data && data.groupCode) {
        logger.info("useChat", `Group code received: ${data.groupCode}`);
        setGroupCode(data.groupCode);
      }
      
      setMessages([
        {
          content: preference === "group" 
            ? `You've joined a group chat. Group code: ${data?.groupCode || 'N/A'}`
            : "You're now chatting with a random stranger. Say hi!",
          isOwnMessage: false,
        },
      ]);
    });

    socket.on("chat_message", (data) => {
      logger.info("useChat", "Received message", data);
      setPartnerTyping(false);
      setMessages(prev => [...prev, {
        content: data.message,
        isOwnMessage: false,
        sender: data.sender,
      }]);
    });

    socket.on("group_members_update", (members) => {
      logger.info("useChat", "Group members updated", { members });
      setGroupMembers(members);
    });

    socket.on("user_joined_group", (username) => {
      logger.info("useChat", `User joined group: ${username}`);
      setMessages(prev => [...prev, {
        content: `${username} has joined the group chat`,
        isOwnMessage: false,
      }]);
    });

    socket.on("user_left_group", (username) => {
      logger.info("useChat", `User left group: ${username}`);
      setMessages(prev => [...prev, {
        content: `${username} has left the group chat`,
        isOwnMessage: false,
      }]);
    });

    socket.on("typing_started", (data) => {
      logger.debug("useChat", "Typing started", data);
      if (isGroupChat) {
        // For group chat, we show who is typing
        // This logic would be handled in the UI using the username from data
      } else {
        setPartnerTyping(true);
      }
    });

    socket.on("typing_stopped", () => {
      logger.debug("useChat", "Typing stopped");
      setPartnerTyping(false);
    });

    socket.on("partner_disconnected", () => {
      logger.info("useChat", "Partner disconnected");
      setPartnerTyping(false);
      setPartnerDisconnected(true);
      setConnected(false);
    });

    socket.on("no_match_found", () => {
      logger.warn("useChat", "No match found");
      setConnected(false);
      setMessages([
        {
          content: "No matching partner found. Try again later or choose a different preference.",
          isOwnMessage: false,
        },
      ]);
    });

    socket.on("group_not_found", () => {
      logger.warn("useChat", "Group not found");
      setConnected(false);
      setMessages([
        {
          content: "The group code you entered doesn't exist. Please try a different code.",
          isOwnMessage: false,
        },
      ]);
    });

    socket.on("waiting_for_match", () => {
      logger.info("useChat", "Waiting for match");
      setMessages(prev => [...prev, {
        content: "Waiting for a match... This may take a few moments.",
        isOwnMessage: false,
      }]);
    });

    socket.on("disconnect", () => {
      logger.info("useChat", "Socket disconnected");
    });

    socket.on("error", (error) => {
      logger.error("useChat", "Socket error", error);
    });
  };

  const disconnect = () => {
    logger.info("useChat", "Disconnecting from chat");
    if (socketRef.current) {
      socketRef.current.emit("disconnect_chat");
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnected(false);
    setGroupCode(null);
    setGroupMembers([]);
    setIsGroupChat(false);
  };

  const sendMessage = (content: string) => {
    if (!socketRef.current || !connected) {
      logger.warn("useChat", "Cannot send message, not connected");
      return;
    }
    
    logger.info("useChat", "Sending message", { 
      content, 
      isGroupChat, 
      groupCode 
    });
    
    // Add message to local state
    const newMessage: Message = {
      content,
      isOwnMessage: true,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send message to server
    socketRef.current.emit("send_message", {
      message: content,
      isGroupChat,
      groupCode,
    });
  };

  // Send typing indicator
  const sendTypingIndicator = (isTyping: boolean) => {
    if (!socketRef.current || !connected) return;
    
    logger.debug("useChat", `Sending typing indicator: ${isTyping}`, { isGroupChat, groupCode });
    
    if (isTyping) {
      socketRef.current.emit("typing_start", { isGroupChat, groupCode });
    } else {
      socketRef.current.emit("typing_stop", { isGroupChat, groupCode });
    }
  };

  return {
    messages,
    connected,
    partnerDisconnected,
    partnerTyping,
    sendMessage,
    sendTypingIndicator,
    connect,
    disconnect,
    groupCode,
    groupMembers,
    isGroupChat,
  };
};
