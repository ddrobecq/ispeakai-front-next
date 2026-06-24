import { create } from 'zustand';
import { TChatState } from '../types';

interface ChatStore extends TChatState {
  audioModeEnabled: boolean;
  setConversationId: (id: string) => void;
  addMessage: (message: any) => void;
  clearMessages: () => void;
  loadFromStorage: () => void;
  setAudioModeEnabled: (enabled: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  conversationId: null,
  isLoading: false,
  audioModeEnabled: true,

  setConversationId: (id) => {
    localStorage.setItem('chat-conversation-id', id);
    set({ conversationId: id });
  },

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () => {
    localStorage.removeItem('chat-conversation-id');
    set({ messages: [], conversationId: null });
  },

  loadFromStorage: () => {
    const savedConvId = localStorage.getItem('chat-conversation-id');
    if (savedConvId) {
      set({ conversationId: savedConvId });
    }
  },

  setAudioModeEnabled: (enabled) => {
    set({ audioModeEnabled: enabled });
  },
}));
