import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { SensorData as SensorDataType } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface SensorDataProps {
  className?: string;
  roverId: number;
}

const SensorDataDisplay = ({ className, roverId }: SensorDataProps) => {
  const { data: sensorData, isLoading } = useQuery<SensorDataType[]>({
    queryKey: [`/api/rovers/${roverId}/sensor-data`],
    refetchInterval: 2000,
  });
  
  // Get latest sensor data
  const latestSensorData = sensorData && sensorData.length > 0 ? sensorData[0] : null;
  
  // Format chart data - last 20 entries in reverse order for timeline
  const chartData = sensorData ? 
    [...sensorData].reverse().slice(0, 20).map(data => ({
      time: new Date(data.timestamp).toLocaleTimeString(),
      temperature: data.temperature,
      humidity: data.humidity,
      pressure: data.pressure ? data.pressure / 10 : 0, // Scale down for visualization
    })) : [];
  
  if (isLoading) {
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
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sensor Data & Telemetry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Environment Sensors */}
          <div>
            <h4 className="text-sm font-medium mb-3">Environment Sensors</h4>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 h-40">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="var(--color-success)" 
                      fill="var(--color-success-light)" 
                      name="Temperature (°C)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="var(--color-info)" 
                      fill="var(--color-info-light)"
                      name="Humidity (%)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pressure" 
                      stroke="var(--color-warning)" 
                      fill="var(--color-warning-light)"
                      name="Pressure (hPa/10)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No sensor data available
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-xs text-muted-foreground">Temperature</div>
                <div className="font-medium text-lg">{latestSensorData?.temperature?.toFixed(1) || '--'}°C</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-xs text-muted-foreground">Humidity</div>
                <div className="font-medium text-lg">{latestSensorData?.humidity?.toFixed(0) || '--'}%</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-xs text-muted-foreground">Pressure</div>
                <div className="font-medium text-lg">{latestSensorData?.pressure?.toFixed(0) || '--'} hPa</div>
              </div>
            </div>
          </div>

          {/* Position & Orientation */}
          <div>
            <h4 className="text-sm font-medium mb-3">Position & Orientation</h4>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-center h-40">
              <div className="w-full h-full relative">
                {latestSensorData?.latitude && latestSensorData?.longitude ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-medium">Map Visualization</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Position: {latestSensorData.latitude.toFixed(4)}°, {latestSensorData.longitude.toFixed(4)}°
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No position data available
                  </div>
                )}
                
                {latestSensorData?.latitude && (
                  <>
                    <div className="absolute top-2 right-2 bg-white bg-opacity-75 p-1 rounded text-xs">
                      GPS Signal: {(latestSensorData.signalStrength || 0) > 70 ? 'Strong' : 'Weak'}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-white bg-opacity-75 p-1 rounded text-xs">
                      Coordinates: {latestSensorData.latitude.toFixed(4)}°, {latestSensorData.longitude.toFixed(4)}°
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-xs text-muted-foreground">Altitude</div>
                <div className="font-medium text-sm">{latestSensorData?.altitude?.toFixed(0) || '--'}m</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-xs text-muted-foreground">Heading</div>
                <div className="font-medium text-sm">{latestSensorData?.heading?.toFixed(0) || '--'}°</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-xs text-muted-foreground">Speed</div>
                <div className="font-medium text-sm">{latestSensorData?.speed?.toFixed(1) || '--'} m/s</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border border-gray-200 text-center">
                <div className="text-xs text-muted-foreground">Tilt</div>
                <div className="font-medium text-sm">{latestSensorData?.tilt?.toFixed(1) || '--'}°</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorDataDisplay;
