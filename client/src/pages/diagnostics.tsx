import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Rover } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Wifi, Battery, Activity, CpuIcon, ThermometerIcon } from "lucide-react";
import { chartColors } from "@/lib/theme";
import { getRoverStatusColor } from "@/lib/utils";

const Diagnostics = () => {
  const { data: rovers, isLoading } = useQuery<Rover[]>({
    queryKey: ['/api/rovers'],
    refetchInterval: 5000,
  });

  const [selectedTab, setSelectedTab] = useState("health");

  // Prepare data for the battery chart
  const batteryData = rovers?.map(rover => ({
    name: rover.name,
    battery: rover.batteryLevel,
    status: rover.status,
    connected: rover.connected
  }));

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <Card className="mb-6">
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

  const connectedRovers = rovers?.filter(rover => rover.connected) || [];
  const disconnectedRovers = rovers?.filter(rover => !rover.connected) || [];
  const errorRovers = rovers?.filter(rover => rover.status === 'error') || [];
  
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Diagnostics</h2>
        <p className="text-muted-foreground">Monitor system health and troubleshoot issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Wifi className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Connected</h3>
                <p className="text-xl font-semibold">{connectedRovers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <Wifi className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Disconnected</h3>
                <p className="text-xl font-semibold">{disconnectedRovers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-warning/10 p-3 rounded-full mr-4">
                <Battery className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Low Battery</h3>
                <p className="text-xl font-semibold">
                  {rovers?.filter(rover => rover.batteryLevel < 20).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-destructive/10 p-3 rounded-full mr-4">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Errors</h3>
                <p className="text-xl font-semibold">{errorRovers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="health" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="battery">Battery Status</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Rover Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {rovers && rovers.length > 0 ? (
                <div className="space-y-4">
                  {rovers.map(rover => (
                    <div key={rover.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${rover.connected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <h3 className="font-medium">{rover.name}</h3>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getRoverStatusColor(rover.status, rover.connected)}`}>
                          {rover.connected ? rover.status.charAt(0).toUpperCase() + rover.status.slice(1) : "Disconnected"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 rounded p-2">
                          <div className="text-xs text-muted-foreground">Battery</div>
                          <div className="flex items-end">
                            <span className="text-lg font-medium">{rover.batteryLevel}%</span>
                            <Battery className={`h-4 w-4 ml-1 ${rover.batteryLevel < 20 ? 'text-destructive' : 'text-green-500'}`} />
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded p-2">
                          <div className="text-xs text-muted-foreground">Status</div>
                          <div className="flex items-end">
                            <span className="text-lg font-medium">
                              {rover.connected ? rover.status.charAt(0).toUpperCase() + rover.status.slice(1) : "Offline"}
                            </span>
                            <Activity className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded p-2">
                          <div className="text-xs text-muted-foreground">IP Address</div>
                          <div className="flex items-end">
                            <span className="text-lg font-medium font-mono">{rover.ipAddress || 'Unknown'}</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded p-2">
                          <div className="text-xs text-muted-foreground">Last Seen</div>
                          <div className="flex items-end">
                            <span className="text-lg font-medium">
                              {rover.lastSeen ? new Date(rover.lastSeen).toLocaleTimeString() : 'Never'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {rover.status === 'error' && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>
                            This rover is reporting an error state. Check connection and battery status.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No rovers found in the system.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="battery">
          <Card>
            <CardHeader>
              <CardTitle>Battery Status</CardTitle>
            </CardHeader>
            <CardContent>
              {batteryData && batteryData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={batteryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        label={{ value: 'Battery Level (%)', angle: -90, position: 'insideLeft' }} 
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, 'Battery Level']}
                        labelFormatter={(label) => `Rover: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="battery" 
                        name="Battery Level" 
                        fill={chartColors.primary}
                        maxBarSize={60}
                        label={{
                          position: 'top',
                          formatter: (value: any) => `${value}%`
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No battery data available.
                </div>
              )}

              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-medium">Battery Health Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Battery className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Good</span>
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      {rovers?.filter(r => r.batteryLevel >= 50).length || 0} rovers
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Battery className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium">Low</span>
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      {rovers?.filter(r => r.batteryLevel < 50 && r.batteryLevel >= 20).length || 0} rovers
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Battery className="h-5 w-5 text-red-500 mr-2" />
                      <span className="font-medium">Critical</span>
                    </div>
                    <div className="text-muted-foreground text-sm mt-1">
                      {rovers?.filter(r => r.batteryLevel < 20).length || 0} rovers
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication Diagnostics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Connection Status</h3>
                  <div className="space-y-4">
                    {rovers?.map(rover => (
                      <div key={rover.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${rover.connected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <span>{rover.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">Signal:</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4].map(i => (
                              <div 
                                key={i} 
                                className={`w-1.5 h-${i + 1} rounded-sm ${rover.connected ? 'bg-primary' : 'bg-gray-300'}`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">System Performance</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <CpuIcon className="h-4 w-4 mr-2 text-primary" />
                        <div className="font-medium">Server CPU Load</div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '28%' }}></div>
                      </div>
                      <div className="text-xs text-right mt-1">28%</div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <ThermometerIcon className="h-4 w-4 mr-2 text-primary" />
                        <div className="font-medium">System Temperature</div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: '62%' }}></div>
                      </div>
                      <div className="text-xs text-right mt-1">62°C</div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <Activity className="h-4 w-4 mr-2 text-primary" />
                        <div className="font-medium">Network Bandwidth</div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '43%' }}></div>
                      </div>
                      <div className="text-xs text-right mt-1">43%</div>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">WebSocket Status</h4>
                    <div className="flex items-center">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                      <span>Connected to server</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Active clients: {connectedRovers.length + 1} (server + {connectedRovers.length} rovers)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {errorRovers.length > 0 ? (
                <div className="space-y-4">
                  {errorRovers.map(rover => (
                    <Alert key={rover.id} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Rover Error: {rover.name}</AlertTitle>
                      <AlertDescription>
                        This rover is reporting an error state. ID: {rover.identifier}, Last seen: {rover.lastSeen ? new Date(rover.lastSeen).toLocaleString() : 'Unknown'}
                      </AlertDescription>
                    </Alert>
                  ))}
                  
                  <div className="border rounded-md mt-6">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="font-medium">System Error Log</h3>
                    </div>
                    <div className="p-2 max-h-60 overflow-y-auto bg-gray-900 text-gray-100 font-mono text-sm">
                      <div className="p-2">[ERROR] 10:24:15 - Rover Delta (R-004) - Connection timeout after 30s</div>
                      <div className="p-2">[WARN] 10:22:01 - Rover Beta (R-002) - Battery level below 50%</div>
                      <div className="p-2">[ERROR] 10:15:42 - Rover Delta (R-004) - Failed to execute movement command. Response: Timeout</div>
                      <div className="p-2">[WARN] 09:58:30 - Server - High CPU load (78%) detected</div>
                      <div className="p-2">[ERROR] 09:45:12 - Rover Delta (R-004) - Sensor data transmission failed</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-medium">No Errors Detected</h3>
                  <p className="text-muted-foreground mt-2">All systems are operating normally.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Diagnostics;
