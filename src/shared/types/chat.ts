export interface TMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  audio_url?: string;
  created_at?: string;
}

export interface TConversation {
  id: string;
  title: string;
  language: string;
  created_at: string;
}
