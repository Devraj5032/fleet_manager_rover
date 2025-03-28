import React from "react";
import { Shield, Zap, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export interface StatsProps {
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-muted-foreground text-sm">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Stats = ({ className }: StatsProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/stats'],
    refetchInterval: 5000,
  });
  
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-16 animate-pulse bg-muted rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  const stats = [
    {
      title: "Connected Rovers",
      value: data?.connectedRovers || 0,
      icon: <Shield className="h-6 w-6 text-primary" />,
      color: "bg-primary/10"
    },
    {
      title: "Active Rovers",
      value: data?.activeRovers || 0,
      icon: <Zap className="h-6 w-6 text-secondary" />,
      color: "bg-secondary/10"
    },
    {
      title: "Total Rovers",
      value: data?.totalRovers || 0,
      icon: <FileText className="h-6 w-6 text-accent" />,
      color: "bg-accent/10"
    },
    {
      title: "System Alerts",
      value: data?.errorRovers || 0,
      icon: <AlertCircle className="h-6 w-6 text-destructive" />,
      color: "bg-destructive/10"
    }
  ];
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default Stats;
