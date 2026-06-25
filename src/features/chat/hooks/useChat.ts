import { useMutation, useQuery } from '@tanstack/react-query';
import { sendMessageApi, getHistoryApi, createConversationApi } from '../api';
import { useChatStore } from '../store/chat.store';

export function useChat(conversationId: string | null) {
  const { addMessage } = useChatStore();

  const sendMessageMutation = useMutation({
    mutationFn: (userMessage: string) => {
      if (!conversationId) throw new Error('No conversation ID');
      return sendMessageApi(conversationId, userMessage);
    },
    onSuccess: (data) => {
      addMessage({
        role: 'user',
        content: data.userMessage,
      });
      addMessage({
        role: 'assistant',
        content: data.assistantMessage,
        audio_url: data.audioUrl,
      });
    },
  });

  return { sendMessage: sendMessageMutation.mutateAsync, isLoading: sendMessageMutation.isPending };
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
