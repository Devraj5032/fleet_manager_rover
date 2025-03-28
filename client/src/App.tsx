import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import RoverDetails from "@/pages/rover-details";
import Diagnostics from "@/pages/diagnostics";
import DataLogs from "@/pages/data-logs";
import Settings from "@/pages/settings";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { WebSocketProvider } from "@/lib/websocket";

function Router() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/rovers/:id" component={RoverDetails} />
            <Route path="/diagnostics" component={Diagnostics} />
            <Route path="/data-logs" component={DataLogs} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <Router />
        <Toaster />
      </WebSocketProvider>
    </QueryClientProvider>
  );
}

export default App;
