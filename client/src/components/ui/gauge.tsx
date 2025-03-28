import React from "react";
import { cn } from "@/lib/utils";

interface GaugeProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  label?: string;
  unit?: string;
  showValue?: boolean;
  className?: string;
  labelClassName?: string;
}

export const Gauge = ({
  value,
  max = 100,
  size = "md",
  color = "hsl(var(--primary))",
  label,
  unit = "%",
  showValue = true,
  className,
  labelClassName,
}: GaugeProps) => {
  // Normalize value between 0 and 100%
  const normalizedValue = Math.min(Math.max(0, value), max);
  const percentage = (normalizedValue / max) * 100;
  
  // Calculate size
  const dimensionMap = {
    sm: { container: "w-16 h-8", gauge: "h-16 w-16", inner: "w-10 h-10", fontSize: "text-xs" },
    md: { container: "w-24 h-12", gauge: "h-24 w-24", inner: "w-14 h-14", fontSize: "text-sm" },
    lg: { container: "w-32 h-16", gauge: "h-32 w-32", inner: "w-20 h-20", fontSize: "text-base" },
  };
  
  // Set color based on percentage
  const getColorClass = () => {
    if (percentage <= 20) return "text-red-500";
    if (percentage <= 50) return "text-amber-500";
    return "text-green-500";
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("relative overflow-hidden", dimensionMap[size].container)}>
        <div 
          className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full", dimensionMap[size].gauge)}
          style={{
            background: `conic-gradient(${color} 0% ${percentage}%, #E0E0E0 ${percentage}% 100%)`,
          }}
        />
        <div 
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full bg-white", 
            dimensionMap[size].inner
          )}
          style={{
            transform: "translate(-50%, 25%)",
          }}
        />
        {showValue && (
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 transform translate-y-[-100%] font-semibold",
            dimensionMap[size].fontSize,
            getColorClass()
          )}>
            {value}{unit}
          </div>
        )}
      </div>
      {label && (
        <div className={cn("text-xs text-muted-foreground mt-1", labelClassName)}>
          {label}
        </div>
      )}
    </div>
  );
};

export default Gauge;
