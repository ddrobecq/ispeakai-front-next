'use client';

import { useMutation } from '@tanstack/react-query';
import { sendMessageApi, createConversationApi } from '../api';
import { sendAudioMessage } from '../services/chatApi';
import { useChatStore } from '../store/chat.store';
import { TMessage } from '@/shared/types';

export function useChat(conversationId: string | null) {
  const { addMessage } = useChatStore();

  // Check if audio mode is supported (for now: assume true for Gemini API)
  const supportsAudio = true;

  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      if (!conversationId) throw new Error('No conversation ID');
      return sendMessageApi(conversationId, userMessage);
    },
    onMutate: (userMessage) => {
      // Add user message immediately to UI
      addMessage({
        role: 'user',
        content: userMessage,
      } as TMessage);
    },
    onSuccess: (data) => {
      // Add assistant message after receiving response
      addMessage({
        role: 'assistant',
        content: data.assistantMessage,
        audio_url: data.audioUrl,
      } as TMessage);
    },
  });

  const sendAudioMessageMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      if (!conversationId) throw new Error('No conversation ID');
      return sendAudioMessage(conversationId, audioBlob);
    },
    retry: false,
    onSuccess: (data) => {
      // Add assistant message with audio after receiving response
      addMessage({
        role: 'assistant',
        content: data.assistantMessage,
        audio_url: data.audioUrl,
      } as TMessage);
    },
  });

  return {
    sendMessage: sendMessageMutation.mutateAsync,
    sendAudioMessage: sendAudioMessageMutation.mutateAsync,
    supportsAudio,
    isLoading: sendMessageMutation.isPending || sendAudioMessageMutation.isPending,
    error: sendMessageMutation.error || sendAudioMessageMutation.error,
  };
}

export function useCreateConversation() {
  const { setConversationId } = useChatStore();

  return useMutation({
    mutationFn: (title?: string) => createConversationApi(title),
    onSuccess: (data) => {
      setConversationId(data.id);
    },
  });
}

