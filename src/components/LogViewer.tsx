import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, DownloadCloud, Terminal } from "lucide-react";
import { logger } from "@/utils/logger";

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  message: string;
  data?: any;
  timestamp: string;
  level: LogLevel;
  component: string;
}

export const LogViewer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get logs every second
    const interval = setInterval(() => {
      if (isOpen) {
        setLogs(logger.getLogs());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when logs change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.length]);

  // Filter logs based on level
  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  // Download logs as JSON
  const handleDownloadLogs = () => {
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleLogViewer = () => {
    setIsOpen(!isOpen);
  };

  // Render only the button if closed
  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-5 right-5 bg-foreground/10 hover:bg-foreground/20"
        onClick={toggleLogViewer}
      >
        <Terminal className="h-5 w-5" />
      </Button>
    );
  }

  // Get log level color
  const getLogLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'debug': return 'text-gray-500';
      case 'info': return 'text-green-500';
      case 'warn': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="rounded-lg bg-background w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <h2 className="font-semibold">Debug Logs</h2>
            <span className="text-xs text-muted-foreground">
              {filteredLogs.length} entries
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="p-1 text-xs rounded bg-muted"
              value={filter}
              onChange={(e) => setFilter(e.target.value as LogLevel | 'all')}
            >
              <option value="all">All Levels</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleDownloadLogs}
              title="Download logs"
            >
              <DownloadCloud className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2 font-mono text-xs">
            {filteredLogs.map((log, index) => (
              <div key={index} className="border border-border rounded p-2">
                <div className="flex gap-2 mb-1">
                  <span className={`font-bold ${getLogLevelColor(log.level)}`}>
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-blue-500">
                    [{log.component}]
                  </span>
                  <span className="text-gray-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="pl-2 border-l-2 border-muted">
                  <div>{log.message}</div>
                  {log.data && (
                    <pre className="mt-1 bg-muted p-1 rounded text-[10px] whitespace-pre-wrap">
                      {typeof log.data === 'object' 
                        ? JSON.stringify(log.data, null, 2) 
                        : String(log.data)
                      }
                    </pre>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}; 