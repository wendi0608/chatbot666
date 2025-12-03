export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  mode?: 'local' | 'cloud';
}

export enum ChatMode {
  LOCAL = 'LOCAL',
  DEEPSEEK = 'DEEPSEEK',
}

export interface QAPair {
  question: string;
  answer: string;
}