import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, UserPlus, Users } from "lucide-react";
import { logger } from "@/utils/logger";

type GroupJoinMethod = "create" | "join" | "random";

interface GroupChatOptionsProps {
  onBack: () => void;
  onStartGroupChat: (method: GroupJoinMethod, groupCode?: string) => void;
}

export const GroupChatOptions = ({ onBack, onStartGroupChat }: GroupChatOptionsProps) => {
  const [joinMethod, setJoinMethod] = useState<GroupJoinMethod | null>(null);
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState("");

  const handleMethodSelect = (method: GroupJoinMethod) => {
    logger.info("GroupChatOptions", "Selected join method", { method });
    setJoinMethod(method);
    
    if (method === "create" || method === "random") {
      // These methods don't need a code, proceed directly
      onStartGroupChat(method);
    }
  };

  const handleBack = () => {
    logger.info("GroupChatOptions", "Going back to selection");
    if (joinMethod) {
      setJoinMethod(null);
    } else {
      onBack();
    }
  };

  const handleJoinByCode = () => {
    logger.info("GroupChatOptions", "Attempting to join by code", { groupCode });
    
    // Validate the group code (6-digit alphanumeric)
    if (!groupCode || groupCode.length !== 6 || !/^[a-zA-Z0-9]{6}$/.test(groupCode)) {
      setError("Please enter a valid 6-digit alphanumeric code");
      logger.warn("GroupChatOptions", "Invalid group code format", { groupCode });
      return;
    }
    
    setError("");
    onStartGroupChat("join", groupCode);
  };

  // Show join method selection
  if (!joinMethod) {
    return (
      <div className="w-full">
        <button 
          onClick={handleBack} 
          className="text-sm text-player-foreground mb-4 flex items-center hover:underline"
        >
          ← Back to preferences
        </button>
        
        <h3 className="text-lg font-medium mb-4 text-center">Group Chat Options</h3>
        
        <div className="flex flex-col space-y-3">
          <Button 
            variant="outline" 
            className="w-full player-glass border-player-muted/30 hover:bg-player-muted/10"
            onClick={() => setJoinMethod("join")}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Join existing group
          </Button>
          
          <Button 
            variant="outline"
            className="w-full player-glass border-player-muted/30 hover:bg-player-muted/10"
            onClick={() => handleMethodSelect("create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create new group
          </Button>
          
          <Button 
            variant="outline"
            className="w-full player-glass border-player-muted/30 hover:bg-player-muted/10"
            onClick={() => handleMethodSelect("random")}
          >
            <Users className="mr-2 h-4 w-4" />
            Join random group
          </Button>
        </div>
      </div>
    );
  }

  // Show code entry for joining existing group
  if (joinMethod === "join") {
    return (
      <div className="w-full">
        <button 
          onClick={handleBack} 
          className="text-sm text-player-foreground mb-4 flex items-center hover:underline"
        >
          ← Back to group options
        </button>
        
        <h3 className="text-lg font-medium mb-4 text-center">Join Group by Code</h3>
        
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Enter 6-digit group code"
              value={groupCode}
              onChange={(e) => {
                // Only allow alphanumeric characters and limit to 6 chars
                const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6);
                setGroupCode(sanitized);
              }}
              maxLength={6}
              className="bg-player-muted/10 border-player-muted/30 text-center text-lg tracking-wider"
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
          
          <Button 
            onClick={handleJoinByCode}
            className="w-full bg-player-foreground hover:bg-player-foreground/90"
            disabled={!groupCode || groupCode.length !== 6}
          >
            Join Group
          </Button>
        </div>
      </div>
    );
  }

  return null;
}; 