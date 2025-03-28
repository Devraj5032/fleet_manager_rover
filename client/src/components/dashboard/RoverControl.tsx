import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { Rover, SensorData } from "@shared/schema";
import { Gauge } from "@/components/ui/gauge";
import { useCommand } from "@/lib/commands";
import { useToast } from "@/hooks/use-toast";
import { AlertOctagon, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, StopCircle, BellRing, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface RoverControlProps {
  className?: string;
  roverId: number;
}

const RoverControl = ({ className, roverId }: RoverControlProps) => {
  const [speed, setSpeed] = useState(50);
  const { sendCommand } = useCommand();
  const { toast } = useToast();
  
  const { data: rover, isLoading: isRoverLoading } = useQuery<Rover>({
    queryKey: [`/api/rovers/${roverId}`],
    refetchInterval: 5000,
  });
  
  const { data: sensorData, isLoading: isSensorDataLoading } = useQuery<SensorData[]>({
    queryKey: [`/api/rovers/${roverId}/sensor-data`],
    refetchInterval: 2000,
  });
  
  // Get latest sensor data
  const latestSensorData = sensorData && sensorData.length > 0 ? sensorData[0] : null;
  
  // Handle movement command
  const handleMovement = async (direction: string) => {
    try {
      await sendCommand({
        roverId,
        command: `move ${direction} ${speed / 25}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Movement Error",
        description: (error as Error).message,
      });
    }
  };
  
  // Handle stop command
  const handleStop = async () => {
    try {
      await sendCommand({
        roverId,
        command: "stop",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Stop Error",
        description: (error as Error).message,
      });
    }
  };
  
  // Handle toggle lights
  const handleToggleLights = async () => {
    try {
      await sendCommand({
        roverId,
        command: "lights on",
      });
      toast({
        title: "Lights Toggled",
        description: "Lights command sent to rover",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lights Error",
        description: (error as Error).message,
      });
    }
  };
  
  // Handle voice transmission
  const handleVoiceTransmission = async () => {
    try {
      await sendCommand({
        roverId,
        command: "voice activate",
      });
      toast({
        title: "Voice Transmission",
        description: "Voice transmission activated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Voice Error",
        description: (error as Error).message,
      });
    }
  };
  
  // Loading state
  if (isRoverLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  // Get rover status color
  const getStatusColor = (status?: string, connected?: boolean) => {
    if (!connected) return "bg-gray-100 text-gray-800";
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "idle": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center">
          <CardTitle>Rover Control: {rover?.name}</CardTitle>
          {rover && (
            <div className={`ml-3 text-xs px-2 py-1 rounded-full ${getStatusColor(rover.status, rover.connected)}`}>
              {rover.connected ? rover.status.charAt(0).toUpperCase() + rover.status.slice(1) : "Disconnected"}
            </div>
          )}
        </div>
        <Button variant="destructive" size="sm" onClick={handleStop}>
          <StopCircle className="mr-1 h-4 w-4" />
          Emergency Stop
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                {rover?.connected ? (
                  <div className="text-center">
                    <p>Live camera feed would display here</p>
                    <p className="text-sm text-gray-400 mt-1">Connected to {rover.name}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <AlertOctagon className="h-12 w-12 mx-auto mb-2 text-red-500" />
                    <p>Rover disconnected</p>
                    <p className="text-sm text-gray-400 mt-1">Cannot display camera feed</p>
                  </div>
                )}
              </div>
              <div className="absolute top-0 left-0 m-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Front Camera
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-muted-foreground mb-1">Front Camera</div>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  disabled={!rover?.connected}
                  onClick={() => sendCommand({ roverId, command: "camera front" })}
                >
                  Activate
                </Button>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-muted-foreground mb-1">Rear Camera</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  disabled={!rover?.connected}
                  onClick={() => sendCommand({ roverId, command: "camera rear" })}
                >
                  Activate
                </Button>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm text-muted-foreground mb-1">Instrument View</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  disabled={!rover?.connected}
                  onClick={() => sendCommand({ roverId, command: "camera instrument" })}
                >
                  Activate
                </Button>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium mb-3">Movement Controls</h4>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div></div>
                <Button 
                  variant="default" 
                  size="sm"
                  disabled={!rover?.connected}
                  onClick={() => handleMovement("forward")}
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
                <div></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <Button 
                  variant="default" 
                  size="sm"
                  disabled={!rover?.connected}
                  onClick={() => handleMovement("left")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  disabled={!rover?.connected}
                  onClick={handleStop}
                >
                  <StopCircle className="h-5 w-5" />
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  disabled={!rover?.connected}
                  onClick={() => handleMovement("right")}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div></div>
                <Button 
                  variant="default" 
                  size="sm"
                  disabled={!rover?.connected}
                  onClick={() => handleMovement("backward")}
                >
                  <ArrowDown className="h-5 w-5" />
                </Button>
                <div></div>
              </div>
              <div className="mt-4">
                <label className="block text-xs text-muted-foreground mb-1">Speed</label>
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={0}
                  max={100}
                  step={1}
                  disabled={!rover?.connected}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium mb-3">Gauges</h4>
              <div className="grid grid-cols-2 gap-3">
                <Gauge
                  value={rover?.batteryLevel || 0}
                  max={100}
                  size="md"
                  color={
                    (rover?.batteryLevel || 0) > 60 
                      ? "var(--color-success)" 
                      : (rover?.batteryLevel || 0) > 20 
                        ? "var(--color-warning)" 
                        : "var(--color-danger)"
                  }
                  label="Battery"
                  unit="%"
                />
                <Gauge
                  value={latestSensorData?.signalStrength || 0}
                  max={100}
                  size="md"
                  color="var(--color-info)"
                  label="Signal"
                  unit="%"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium mb-3">Options</h4>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  disabled={!rover?.connected}
                  onClick={handleToggleLights}
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Toggle Lights
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  disabled={!rover?.connected}
                  onClick={handleVoiceTransmission}
                >
                  <BellRing className="h-4 w-4 mr-1" />
                  Voice Transmission
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoverControl;
