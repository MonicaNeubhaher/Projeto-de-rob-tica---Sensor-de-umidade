export enum Sender {
  User = 'user',
  Bot = 'bot',
  System = 'system'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

export interface SensorData {
  temperature: number;
  humidity: number;
}

export interface SerialLog {
  id: string;
  timestamp: string;
  message: string;
}
