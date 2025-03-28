import React from "react";
import { useWebSocket } from "@/lib/websocket";
import { Bolt, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const { connected } = useWebSocket();
  
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    refetchInterval: 5000,
  });
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Bolt className="h-8 w-8" />
          <h1 className="text-xl font-bold">Rover Command & Control System</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm">
            <span className="mr-2">Server Status:</span>
            <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${connected ? 'bg-green-400 shadow-sm shadow-green-300' : 'bg-red-500'}`}></span>
            <span>{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <Button variant="secondary" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
