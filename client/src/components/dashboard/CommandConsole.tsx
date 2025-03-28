import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCommand, parseCommand } from "@/lib/commands";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { CommandLog, Rover } from "@shared/schema";

export interface CommandConsoleProps {
  className?: string;
  selectedRoverId?: number;
}

const CommandConsole = ({ className, selectedRoverId }: CommandConsoleProps) => {
  const [command, setCommand] = useState("");
  const [roverId, setRoverId] = useState<string>(selectedRoverId?.toString() || "");
  const { sendCommand } = useCommand();
  const { toast } = useToast();
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const { data: rovers } = useQuery<Rover[]>({
    queryKey: ['/api/rovers'],
  });
  
  const { data: commandLogs } = useQuery<CommandLog[]>({
    queryKey: roverId && roverId !== 'all' ? [`/api/rovers/${roverId}/command-logs`] : ['/api/command-logs'],
    enabled: true,
    refetchInterval: 2000,
  });
  
  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandLogs]);
  
  // Update roverId when selectedRoverId changes
  useEffect(() => {
    if (selectedRoverId) {
      setRoverId(selectedRoverId.toString());
    } else {
      setRoverId("all");
    }
  }, [selectedRoverId]);
  
  const handleSubmit = async () => {
    if (!command.trim()) return;
    if (!roverId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a rover",
      });
      return;
    }
    
    // Validate command
    const validation = parseCommand(command);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Command",
        description: validation.error,
      });
      return;
    }
    
    try {
      await sendCommand({ roverId: parseInt(roverId), command });
      setCommand("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Command Error",
        description: (error as Error).message,
      });
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  
  // Format log message
  const formatLogMessage = (log: CommandLog) => {
    const timestamp = new Date(log.timestamp).toLocaleTimeString();
    
    if (log.status === 'pending') {
      return `[${timestamp}] Executing: ${log.command}...`;
    } else if (log.status === 'success') {
      return `[${timestamp}] Success: ${log.response || log.command}`;
    } else {
      return `[${timestamp}] Failed: ${log.response || 'Unknown error'}`;
    }
  };
  
  // Get log class
  const getLogClass = (status?: string) => {
    switch (status) {
      case 'pending': return 'log-info';
      case 'success': return 'log-success';
      case 'failed': return 'log-error';
      default: return '';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle>Command Console</CardTitle>
        <Select value={roverId} onValueChange={setRoverId}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Rover" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rovers</SelectItem>
            {rovers?.map((rover) => (
              <SelectItem key={rover.id} value={rover.id.toString()}>
                {rover.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="terminal mb-3" ref={terminalRef}>
          <div className="terminal-line log-info">[System] Connected to server at {window.location.host}</div>
          
          {!roverId && (
            <div className="terminal-line log-warn">[System] Please select a rover to send commands</div>
          )}
          
          {roverId && commandLogs?.length === 0 && (
            <div className="terminal-line log-info">[System] No command history for this rover</div>
          )}
          
          {commandLogs?.map((log) => (
            <div key={log.id} className={`terminal-line ${getLogClass(log.status)}`}>
              {formatLogMessage(log)}
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            type="text"
            placeholder="Enter command..."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-r-none"
            disabled={!roverId}
          />
          <Button 
            onClick={handleSubmit}
            className="rounded-l-none"
            disabled={!roverId || !command.trim()}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommandConsole;
