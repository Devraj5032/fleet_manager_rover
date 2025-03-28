import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Rover, SensorData as SensorDataType, CommandLog } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoverControl from "@/components/dashboard/RoverControl";
import SensorDataDisplay from "@/components/dashboard/SensorData";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const RoverDetails = () => {
  const { id } = useParams<{ id: string }>();
  const roverId = parseInt(id);
  
  const { data: rover, isLoading: isRoverLoading } = useQuery<Rover>({
    queryKey: [`/api/rovers/${roverId}`],
    refetchInterval: 5000,
  });
  
  const { data: commandLogs, isLoading: isLogsLoading } = useQuery<CommandLog[]>({
    queryKey: [`/api/rovers/${roverId}/command-logs`],
    refetchInterval: 5000,
  });
  
  if (isRoverLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!rover) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h2 className="text-2xl font-bold mb-2">Rover Not Found</h2>
        <p className="text-muted-foreground">The rover with ID {roverId} could not be found.</p>
      </div>
    );
  }
  
  // Get status indicator color
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
    <>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h2 className="text-2xl font-semibold mr-3">{rover.name}</h2>
          <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(rover.status, rover.connected)}`}>
            {rover.connected ? rover.status.charAt(0).toUpperCase() + rover.status.slice(1) : "Disconnected"}
          </div>
        </div>
        <p className="text-muted-foreground">ID: {rover.identifier} | Last seen: {rover.lastSeen ? format(new Date(rover.lastSeen), 'MMM d, yyyy HH:mm:ss') : 'Never'}</p>
      </div>
      
      <Tabs defaultValue="control">
        <TabsList className="mb-6">
          <TabsTrigger value="control">Control</TabsTrigger>
          <TabsTrigger value="data">Sensor Data</TabsTrigger>
          <TabsTrigger value="logs">Command Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="control">
          <RoverControl roverId={roverId} />
        </TabsContent>
        
        <TabsContent value="data">
          <SensorDataDisplay roverId={roverId} />
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Command History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLogsLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : commandLogs && commandLogs.length > 0 ? (
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Command</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Response</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {commandLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-4 py-2 text-sm">{format(new Date(log.timestamp), 'HH:mm:ss')}</td>
                          <td className="px-4 py-2 text-sm font-mono">{log.command}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              log.status === 'success' ? 'bg-green-100 text-green-800' :
                              log.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">{log.response || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No command history available for this rover.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Rover Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Rover Information</h3>
                  <div className="bg-muted rounded-md p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Name</div>
                        <div>{rover.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Identifier</div>
                        <div>{rover.identifier}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">IP Address</div>
                        <div>{rover.ipAddress || 'Unknown'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div>{rover.status}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Battery</div>
                        <div>{rover.batteryLevel}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Last Seen</div>
                        <div>{rover.lastSeen ? format(new Date(rover.lastSeen), 'MMM d, yyyy HH:mm:ss') : 'Never'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Connection Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    These settings control how the system communicates with the rover.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Auto Reconnect</div>
                        <div className="text-sm text-muted-foreground">Automatically attempt to reconnect if connection is lost</div>
                      </div>
                      <div className="w-12 h-6 bg-muted rounded-full px-1 flex items-center">
                        <div className="bg-primary w-4 h-4 rounded-full" style={{ marginLeft: '50%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Telemetry Interval</div>
                        <div className="text-sm text-muted-foreground">How often the rover sends sensor data</div>
                      </div>
                      <div className="text-right">
                        <div>2 seconds</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default RoverDetails;
