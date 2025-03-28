import React, { useState } from "react";
import Stats from "@/components/dashboard/Stats";
import RoverList from "@/components/dashboard/RoverList";
import CommandConsole from "@/components/dashboard/CommandConsole";
import RoverControl from "@/components/dashboard/RoverControl";
import SensorDataDisplay from "@/components/dashboard/SensorData";

const Dashboard = () => {
  const [selectedRoverId, setSelectedRoverId] = useState<number | undefined>(undefined);
  
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Monitor and control your connected rovers</p>
      </div>
      
      <Stats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <RoverList 
            className="mb-6" 
            onSelectRover={(roverId) => setSelectedRoverId(roverId)}
          />
          <CommandConsole selectedRoverId={selectedRoverId} />
        </div>
        
        <div className="col-span-2">
          {selectedRoverId ? (
            <>
              <RoverControl 
                className="mb-6" 
                roverId={selectedRoverId} 
              />
              <SensorDataDisplay roverId={selectedRoverId} />
            </>
          ) : (
            <div className="bg-muted rounded-lg p-12 flex flex-col items-center justify-center h-full text-center">
              <h3 className="text-xl font-semibold mb-2">No Rover Selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a rover from the list to view control panel and sensor data.
                You'll be able to send commands and view real-time telemetry.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
