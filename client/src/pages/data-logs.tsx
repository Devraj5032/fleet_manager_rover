import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Rover, CommandLog, SensorData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Search, Filter, ChevronDown, Database, DownloadCloud } from "lucide-react";
import { format } from "date-fns";
import { chartColors } from "@/lib/theme";
import { formatBytes } from "@/lib/utils";

const DataLogs = () => {
  const [selectedRoverId, setSelectedRoverId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { data: rovers, isLoading: isRoversLoading } = useQuery<Rover[]>({
    queryKey: ['/api/rovers'],
  });
  
  const { data: commandLogs, isLoading: isCommandLogsLoading } = useQuery<CommandLog[]>({
    queryKey: selectedRoverId ? [`/api/rovers/${selectedRoverId}/command-logs`] : null,
    enabled: !!selectedRoverId,
  });
  
  const { data: sensorData, isLoading: isSensorDataLoading } = useQuery<SensorData[]>({
    queryKey: selectedRoverId ? [`/api/rovers/${selectedRoverId}/sensor-data`] : null,
    enabled: !!selectedRoverId,
  });
  
  // Filter command logs by search query
  const filteredCommandLogs = commandLogs?.filter(log => 
    log.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.response?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format sensor data for chart - last 20 entries in reverse order for timeline
  const chartData = sensorData ? 
    [...sensorData].reverse().slice(0, 20).map(data => ({
      time: new Date(data.timestamp).toLocaleTimeString(),
      temperature: data.temperature,
      humidity: data.humidity,
      pressure: data.pressure ? data.pressure / 10 : 0, // Scale down for visualization
    })) : [];
  
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Data Logs</h2>
        <p className="text-muted-foreground">View and analyze rover command logs and sensor data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Total Commands</h3>
                <p className="text-xl font-semibold">{commandLogs?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-secondary/10 p-3 rounded-full mr-4">
                <Database className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Sensor Readings</h3>
                <p className="text-xl font-semibold">{sensorData?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Success Rate</h3>
                <p className="text-xl font-semibold">
                  {commandLogs?.length 
                    ? `${Math.round((commandLogs.filter(log => log.status === 'success').length / commandLogs.length) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <DownloadCloud className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-muted-foreground text-sm">Data Transfer</h3>
                <p className="text-xl font-semibold">
                  {formatBytes(Math.random() * 1024 * 1024 * 10)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <Select value={selectedRoverId} onValueChange={setSelectedRoverId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Rover" />
          </SelectTrigger>
          <SelectContent>
            {isRoversLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : rovers && rovers.length > 0 ? (
              rovers.map(rover => (
                <SelectItem key={rover.id} value={rover.id.toString()}>
                  {rover.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>No rovers available</SelectItem>
            )}
          </SelectContent>
        </Select>
        
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search logs..." 
              className="pl-8 w-[250px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {!selectedRoverId ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center">
            <Database className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Select a Rover to View Data</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-md">
              Choose a rover from the dropdown above to view its command history and sensor data logs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="commands">
          <TabsList className="mb-6">
            <TabsTrigger value="commands">Command Logs</TabsTrigger>
            <TabsTrigger value="sensor">Sensor Data</TabsTrigger>
            <TabsTrigger value="visualization">Data Visualization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="commands">
            <Card>
              <CardHeader>
                <CardTitle>Command History</CardTitle>
              </CardHeader>
              <CardContent>
                {isCommandLogsLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : filteredCommandLogs && filteredCommandLogs.length > 0 ? (
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
                        {filteredCommandLogs.map((log) => (
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
                    {searchQuery 
                      ? 'No command logs match your search criteria.' 
                      : 'No command logs available for this rover.'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sensor">
            <Card>
              <CardHeader>
                <CardTitle>Sensor Data Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {isSensorDataLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : sensorData && sensorData.length > 0 ? (
                  <div className="border rounded-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Time</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Temp (°C)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Humidity (%)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Pressure (hPa)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Heading (°)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Speed (m/s)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Battery (%)</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Signal (%)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-border">
                        {sensorData.slice(0, 10).map((data) => (
                          <tr key={data.id}>
                            <td className="px-4 py-2 text-sm">
                              {format(new Date(data.timestamp), 'HH:mm:ss')}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {data.temperature?.toFixed(1) || '-'}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {data.humidity?.toFixed(0) || '-'}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {data.pressure?.toFixed(0) || '-'}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {data.heading?.toFixed(0) || '-'}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {data.speed?.toFixed(2) || '-'}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {data.batteryLevel || '-'}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {data.signalStrength || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No sensor data available for this rover.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visualization">
            <Card>
              <CardHeader>
                <CardTitle>Data Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Environment Sensors</h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 h-72">
                      {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Line 
                              type="monotone" 
                              dataKey="temperature" 
                              stroke={chartColors.success} 
                              name="Temperature (°C)"
                              activeDot={{ r: 6 }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="humidity" 
                              stroke={chartColors.info} 
                              name="Humidity (%)"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="pressure" 
                              stroke={chartColors.warning} 
                              name="Pressure (hPa/10)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No sensor data available for visualization
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Command Statistics</h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 h-72">
                      {commandLogs && commandLogs.length > 0 ? (
                        <div className="h-full flex flex-col">
                          <div className="flex-1 flex items-center justify-center">
                            <div className="w-48 h-48 rounded-full flex items-center justify-center relative">
                              {/* Success percentage circle */}
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  fill="transparent"
                                  stroke="#e6e6e6"
                                  strokeWidth="10"
                                />
                                {commandLogs.length > 0 && (
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="transparent"
                                    stroke={chartColors.success}
                                    strokeWidth="10"
                                    strokeDasharray={`${2 * Math.PI * 45 * (commandLogs.filter(log => log.status === 'success').length / commandLogs.length)} ${2 * Math.PI * 45}`}
                                    strokeDashoffset={2 * Math.PI * 45 * 0.25}
                                    transform="rotate(-90 50 50)"
                                  />
                                )}
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold">
                                  {Math.round((commandLogs.filter(log => log.status === 'success').length / commandLogs.length) * 100)}%
                                </span>
                                <span className="text-sm text-muted-foreground">Success Rate</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <div className="bg-white p-2 rounded border text-center">
                              <div className="text-xs text-muted-foreground">Total</div>
                              <div className="font-medium">{commandLogs.length}</div>
                            </div>
                            <div className="bg-white p-2 rounded border text-center">
                              <div className="text-xs text-muted-foreground">Success</div>
                              <div className="font-medium text-green-600">{commandLogs.filter(log => log.status === 'success').length}</div>
                            </div>
                            <div className="bg-white p-2 rounded border text-center">
                              <div className="text-xs text-muted-foreground">Failed</div>
                              <div className="font-medium text-red-600">{commandLogs.filter(log => log.status === 'failed').length}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No command data available for visualization
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
};

export default DataLogs;
