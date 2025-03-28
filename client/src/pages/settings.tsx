import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Trash2, WifiOff, Clock, ArrowUpDown, RotateCw, Server, Shield, Users, Database } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleResetDefaults = () => {
    toast({
      title: "Reset to defaults",
      description: "Settings have been reset to default values.",
    });
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Settings</h2>
        <p className="text-muted-foreground">Configure system and rover settings</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="rover">Rover Configuration</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure general system behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-refresh">Auto-refresh Dashboard</Label>
                      <p className="text-sm text-muted-foreground">Automatically refresh dashboard data</p>
                    </div>
                    <Switch id="auto-refresh" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications">Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts about rover status changes</p>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="refresh-interval">Dashboard Refresh Interval</Label>
                    <div className="flex items-center mt-2">
                      <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select defaultValue="5000">
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1000">1 second</SelectItem>
                          <SelectItem value="5000">5 seconds</SelectItem>
                          <SelectItem value="10000">10 seconds</SelectItem>
                          <SelectItem value="30000">30 seconds</SelectItem>
                          <SelectItem value="60000">1 minute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="data-retention">Data Retention Period</Label>
                    <div className="flex items-center mt-2">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select defaultValue="7">
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="language">Language</Label>
                    <div className="flex items-center mt-2">
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize the user interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme-color">Accent Color</Label>
                    <div className="flex mt-2 space-x-2">
                      {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'].map((color) => (
                        <button
                          key={color}
                          className={`${color} h-8 w-8 rounded-full border-2 border-white focus:outline-none focus:ring-2 focus:ring-offset-2`}
                          aria-label={`Select ${color.replace('bg-', '').replace('-500', '')} theme color`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font-size">Font Size</Label>
                    <div className="pt-2">
                      <Slider defaultValue={[16]} min={12} max={20} step={1} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Small</span>
                        <span>Default</span>
                        <span>Large</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chart-type">Default Chart Type</Label>
                    <div className="flex items-center mt-2">
                      <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select defaultValue="line">
                        <SelectTrigger>
                          <SelectValue placeholder="Select chart type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="area">Area Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="time-format">Time Format</Label>
                    <div className="flex items-center mt-2">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select defaultValue="24h">
                        <SelectTrigger>
                          <SelectValue placeholder="Select time format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24-hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animations">UI Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable animated transitions</p>
                    </div>
                    <Switch id="animations" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleResetDefaults}>
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rover">
          <Card>
            <CardHeader>
              <CardTitle>Rover Configuration</CardTitle>
              <CardDescription>Configure default settings for rovers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="default-speed">Default Movement Speed</Label>
                    <div className="pt-2">
                      <Slider defaultValue={[50]} min={0} max={100} step={5} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Slow</span>
                        <span>Fast</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telemetry-rate">Telemetry Update Rate (ms)</Label>
                    <div className="flex items-center mt-2">
                      <RotateCw className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select defaultValue="2000">
                        <SelectTrigger>
                          <SelectValue placeholder="Select update rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500">500 ms (Fast)</SelectItem>
                          <SelectItem value="1000">1000 ms (Normal)</SelectItem>
                          <SelectItem value="2000">2000 ms (Default)</SelectItem>
                          <SelectItem value="5000">5000 ms (Low Bandwidth)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-connect">Auto-connect Rovers</Label>
                      <p className="text-sm text-muted-foreground">Automatically connect to detected rovers</p>
                    </div>
                    <Switch id="auto-connect" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emergency-stop">Emergency Stop Button</Label>
                      <p className="text-sm text-muted-foreground">Show emergency stop button on all control panels</p>
                    </div>
                    <Switch id="emergency-stop" defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="camera-quality">Default Camera Quality</Label>
                    <div className="flex items-center mt-2">
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (320p)</SelectItem>
                          <SelectItem value="medium">Medium (720p)</SelectItem>
                          <SelectItem value="high">High (1080p)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="battery-warning">Low Battery Warning Threshold</Label>
                    <div className="pt-2">
                      <Slider defaultValue={[20]} min={5} max={50} step={5} />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5%</span>
                        <span>25%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="default-camera">Default Active Camera</Label>
                    <div className="flex items-center mt-2">
                      <Select defaultValue="front">
                        <SelectTrigger>
                          <SelectValue placeholder="Select camera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="front">Front Camera</SelectItem>
                          <SelectItem value="rear">Rear Camera</SelectItem>
                          <SelectItem value="instrument">Instrument Camera</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lights-on-startup">Lights On By Default</Label>
                      <p className="text-sm text-muted-foreground">Enable lights when rover is connected</p>
                    </div>
                    <Switch id="lights-on-startup" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Rover Command Macros</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Patrol Mode</p>
                      <p className="text-sm text-muted-foreground">move forward 5m, wait 5s, rotate 90°, repeat</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Return Home</p>
                      <p className="text-sm text-muted-foreground">navigate to origin coordinates</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Create New Macro
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleResetDefaults}>
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
              <CardDescription>Configure network and connectivity options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="server-address">Server Address</Label>
                    <div className="flex items-center mt-2">
                      <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input id="server-address" defaultValue={window.location.hostname} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="server-port">WebSocket Port</Label>
                    <div className="flex items-center mt-2">
                      <Input id="server-port" defaultValue="5000" type="number" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reconnect-attempts">Reconnection Attempts</Label>
                    <div className="flex items-center mt-2">
                      <WifiOff className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select defaultValue="5">
                        <SelectTrigger>
                          <SelectValue placeholder="Select attempts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 attempt</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                          <SelectItem value="infinite">Infinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="connection-timeout">Connection Timeout (ms)</Label>
                    <div className="flex items-center mt-2">
                      <Input id="connection-timeout" defaultValue="30000" type="number" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-reconnect">Auto Reconnect</Label>
                      <p className="text-sm text-muted-foreground">Automatically attempt to reconnect when disconnected</p>
                    </div>
                    <Switch id="auto-reconnect" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compress-data">Compress Data</Label>
                      <p className="text-sm text-muted-foreground">Compress data transmissions to reduce bandwidth</p>
                    </div>
                    <Switch id="compress-data" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="use-ssl">Use SSL/TLS</Label>
                      <p className="text-sm text-muted-foreground">Secure connections with SSL/TLS</p>
                    </div>
                    <Switch id="use-ssl" defaultChecked={window.location.protocol === 'https:'} />
                  </div>

                  <div>
                    <Label htmlFor="ping-interval">Ping Interval (ms)</Label>
                    <div className="flex items-center mt-2">
                      <Input id="ping-interval" defaultValue="10000" type="number" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Network Diagnostics</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">WebSocket Status</div>
                      <div className="flex items-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
                        <span>Connected</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Connection Latency</div>
                      <div>45 ms</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Connected Clients</div>
                      <div>4</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Data Transfer Rate</div>
                      <div>2.4 KB/s</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Test Connection
                    </Button>
                    <Button variant="outline" size="sm">
                      View Detailed Stats
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleResetDefaults}>
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="authentication-method">Authentication Method</Label>
                    <div className="flex items-center mt-2">
                      <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select defaultValue="token">
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Authentication</SelectItem>
                          <SelectItem value="token">Token-based</SelectItem>
                          <SelectItem value="oauth">OAuth 2.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="access-token">Access Token</Label>
                    <div className="flex items-center mt-2">
                      <Input id="access-token" defaultValue="****************************************" type="password" />
                      <Button variant="outline" className="ml-2">
                        Regenerate
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="rover-auth">Rover Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require authentication for rover connections</p>
                    </div>
                    <Switch id="rover-auth" defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <div className="flex items-center mt-2">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="0">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="activity-log">Activity Logging</Label>
                      <p className="text-sm text-muted-foreground">Log all rover commands and activities</p>
                    </div>
                    <Switch id="activity-log" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="command-confirmation">Command Confirmation</Label>
                      <p className="text-sm text-muted-foreground">Require confirmation for critical commands</p>
                    </div>
                    <Switch id="command-confirmation" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">User Management</h3>
                <div className="border rounded-md">
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Users</h4>
                      <Button variant="outline" size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">A</div>
                        <div className="ml-3">
                          <div className="font-medium">Admin User</div>
                          <div className="text-xs text-muted-foreground">admin@example.com</div>
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        Administrator
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-medium">O</div>
                        <div className="ml-3">
                          <div className="font-medium">Operator</div>
                          <div className="text-xs text-muted-foreground">operator@example.com</div>
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                        Operator
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">V</div>
                        <div className="ml-3">
                          <div className="font-medium">Viewer</div>
                          <div className="text-xs text-muted-foreground">viewer@example.com</div>
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        Viewer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleResetDefaults}>
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced system parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="log-level">Logging Level</Label>
                    <div className="flex items-center mt-2">
                      <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select defaultValue="info">
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                          <SelectItem value="trace">Trace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="max-connections">Maximum Concurrent Connections</Label>
                    <div className="flex items-center mt-2">
                      <Input id="max-connections" defaultValue="10" type="number" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="debug-mode">Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable additional debugging information</p>
                    </div>
                    <Switch id="debug-mode" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="buffer-size">Sensor Data Buffer Size</Label>
                    <div className="flex items-center mt-2">
                      <Input id="buffer-size" defaultValue="100" type="number" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="command-timeout">Command Execution Timeout (ms)</Label>
                    <div className="flex items-center mt-2">
                      <Input id="command-timeout" defaultValue="5000" type="number" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="performance-mode">High Performance Mode</Label>
                      <p className="text-sm text-muted-foreground">Optimize for performance (uses more resources)</p>
                    </div>
                    <Switch id="performance-mode" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">System Maintenance</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Data Management</h4>
                    <p className="text-sm text-muted-foreground mb-4">Manage system data and logs</p>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Database className="mr-2 h-4 w-4" />
                        Clear Telemetry Data
                      </Button>
                      <Button variant="outline">
                        <Database className="mr-2 h-4 w-4" />
                        Export System Logs
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">System Diagnostics</h4>
                    <p className="text-sm text-muted-foreground mb-4">Run system diagnostics and troubleshooting tools</p>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        Run Connection Test
                      </Button>
                      <Button variant="outline">
                        Check System Health
                      </Button>
                    </div>
                  </div>

                  <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                    <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mb-4">These actions cannot be undone</p>
                    <div className="flex space-x-2">
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Reset All Settings
                      </Button>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleResetDefaults}>
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Settings;
