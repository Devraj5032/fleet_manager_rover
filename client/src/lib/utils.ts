import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format bytes to readable format
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Get rover status indicator color class
export function getRoverStatusColor(status?: string, connected?: boolean) {
  if (!connected) return "bg-gray-100 text-gray-800";
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "idle": return "bg-yellow-100 text-yellow-800";
    case "error": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

// Get rover status indicator dot class
export function getRoverStatusDot(status?: string, connected?: boolean) {
  if (!connected) return "connection-dot connection-disconnected";
  switch (status) {
    case "active": return "connection-dot connection-active";
    case "idle": return "connection-dot connection-idle";
    case "error": return "connection-dot connection-error";
    default: return "connection-dot connection-disconnected";
  }
}

// Format duration in seconds to human readable format (hh:mm:ss)
export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':');
}
