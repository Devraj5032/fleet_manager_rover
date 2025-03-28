import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Truck, Info, Download, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Sidebar = () => {
  const [location] = useLocation();
  
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    refetchInterval: 5000,
  });
  
  // Navigation items
  const navItems = [
    { 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5 mr-2" />, 
      href: "/" 
    },
    { 
      label: "Rovers", 
      icon: <Truck className="h-5 w-5 mr-2" />, 
      href: "/rovers" 
    },
    { 
      label: "Diagnostics", 
      icon: <Info className="h-5 w-5 mr-2" />, 
      href: "/diagnostics" 
    },
    { 
      label: "Data Logs", 
      icon: <Download className="h-5 w-5 mr-2" />, 
      href: "/data-logs" 
    },
    { 
      label: "Settings", 
      icon: <Settings className="h-5 w-5 mr-2" />, 
      href: "/settings" 
    },
  ];
  
  return (
    <aside className="bg-background w-64 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Navigation</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <div
                className={`flex items-center px-3 py-2 rounded-md mb-1 ${
                  (location === item.href || (item.href !== "/" && location.startsWith(item.href)))
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => window.location.href = item.href}
                style={{ cursor: 'pointer' }}
              >
                {item.icon}
                {item.label}
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Server Information</div>
        <div className="bg-muted rounded-md p-3 text-xs">
          <div className="flex justify-between mb-1">
            <span>Server IP:</span>
            <span className="font-mono">{window.location.hostname}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Active Rovers:</span>
            <span>{stats ? `${stats.connectedRovers}/${stats.totalRovers}` : 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span>Uptime:</span>
            <span id="server-uptime">00:00:00</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
