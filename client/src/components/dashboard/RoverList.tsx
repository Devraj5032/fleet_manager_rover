import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Rover } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export interface RoverListProps {
  className?: string;
  onSelectRover?: (roverId: number) => void;
}

// Get status indicator color
const getStatusIndicator = (status?: string, connected?: boolean) => {
  if (!connected) return "connection-dot connection-disconnected";
  switch (status) {
    case "active": return "connection-dot connection-active";
    case "idle": return "connection-dot connection-idle";
    case "error": return "connection-dot connection-error";
    default: return "connection-dot connection-disconnected";
  }
};

// Get status label
const getStatusLabel = (status?: string, connected?: boolean) => {
  if (!connected) return "Disconnected";
  switch (status) {
    case "active": return "Online";
    case "idle": return "Idle";
    case "error": return "Error";
    default: return "Disconnected";
  }
};

// Get status label color
const getStatusLabelColor = (status?: string, connected?: boolean) => {
  if (!connected) return "bg-gray-100 text-gray-800";
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "idle": return "bg-yellow-100 text-yellow-800";
    case "error": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const RoverList = ({ className, onSelectRover }: RoverListProps) => {
  const { data: rovers, isLoading } = useQuery<Rover[]>({
    queryKey: ['/api/rovers'],
    refetchInterval: 5000,
  });
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Connected Rovers</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="mb-3">
              <Skeleton className="h-24 w-full mb-3" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Connected Rovers</CardTitle>
      </CardHeader>
      <CardContent>
        {rovers && rovers.length > 0 ? (
          <>
            {rovers.map((rover) => (
              <div key={rover.id} className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className={getStatusIndicator(rover.status, rover.connected)}></span>
                    <h4 className="font-medium">{rover.name}</h4>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getStatusLabelColor(rover.status, rover.connected)}`}>
                    {getStatusLabel(rover.status, rover.connected)}
                  </div>
                </div>
                <div className="grid grid-cols-2 text-sm text-muted-foreground">
                  <div>ID: <span className="font-mono">{rover.identifier}</span></div>
                  <div>Battery: <span>{rover.batteryLevel}%</span></div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onSelectRover && onSelectRover(rover.id)}
                  >
                    Control
                  </Button>
                  <Link href={`/rovers/${rover.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {rovers.length > 3 && (
              <Button variant="link" className="w-full mt-2">
                Show all rovers →
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No rovers connected. Waiting for rover connections...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoverList;
