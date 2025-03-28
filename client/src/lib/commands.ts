import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/lib/websocket";
import { useCallback } from "react";
import { WebSocketMessage } from "@shared/schema";

// Command types
export type CommandType = 
  | 'move' 
  | 'stop' 
  | 'camera' 
  | 'lights' 
  | 'voice' 
  | 'custom';

export interface CommandParams {
  roverId: number;
  command: string;
}

export interface UseCommandResult {
  sendCommand: (params: CommandParams) => Promise<void>;
  sendWebSocketCommand: (params: CommandParams) => void;
}

// Parse and validate command
export function parseCommand(command: string): { isValid: boolean; error?: string } {
  if (!command || command.trim() === '') {
    return { isValid: false, error: 'Command cannot be empty' };
  }
  
  const parts = command.trim().split(' ');
  const action = parts[0].toLowerCase();
  
  switch (action) {
    case 'move':
      if (parts.length < 3) {
        return { isValid: false, error: 'Move command requires direction and distance' };
      }
      
      const direction = parts[1].toLowerCase();
      if (!['forward', 'backward', 'left', 'right'].includes(direction)) {
        return { isValid: false, error: 'Invalid direction. Use forward, backward, left, or right' };
      }
      
      const distance = parseFloat(parts[2]);
      if (isNaN(distance) || distance <= 0) {
        return { isValid: false, error: 'Distance must be a positive number' };
      }
      
      return { isValid: true };
      
    case 'stop':
      return { isValid: true };
      
    case 'camera':
      if (parts.length < 2) {
        return { isValid: false, error: 'Camera command requires a parameter (e.g., front, rear)' };
      }
      
      const camera = parts[1].toLowerCase();
      if (!['front', 'rear', 'instrument'].includes(camera)) {
        return { isValid: false, error: 'Invalid camera. Use front, rear, or instrument' };
      }
      
      return { isValid: true };
      
    case 'lights':
      if (parts.length < 2) {
        return { isValid: false, error: 'Lights command requires on/off parameter' };
      }
      
      const lightState = parts[1].toLowerCase();
      if (!['on', 'off'].includes(lightState)) {
        return { isValid: false, error: 'Invalid lights state. Use on or off' };
      }
      
      return { isValid: true };
      
    case 'voice':
      if (parts.length < 2) {
        return { isValid: false, error: 'Voice command requires a message' };
      }
      
      return { isValid: true };
      
    default:
      return { isValid: false, error: `Unknown command: ${action}` };
  }
}

// Hook to send commands via API
export function useCommand(): UseCommandResult {
  const { sendMessage } = useWebSocket();
  
  const sendCommand = useCallback(async ({ roverId, command }: CommandParams) => {
    try {
      const validation = parseCommand(command);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      
      await apiRequest('POST', `/api/rovers/${roverId}/command`, { command });
    } catch (error) {
      console.error('Failed to send command:', error);
      throw error;
    }
  }, []);
  
  const sendWebSocketCommand = useCallback(({ roverId, command }: CommandParams) => {
    const validation = parseCommand(command);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    const message: WebSocketMessage = {
      type: 'COMMAND',
      roverId,
      payload: { command }
    };
    
    sendMessage(message);
  }, [sendMessage]);
  
  return { sendCommand, sendWebSocketCommand };
}
