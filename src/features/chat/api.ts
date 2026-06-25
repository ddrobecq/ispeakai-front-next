import { api } from '@/shared/lib/axios';

export async function sendMessageApi(
  conversationId: string,
  userMessage: string
): Promise<any> {
  const response = await api.post('/chat/message', {
    conversationId,
    userMessage,
  });
  return response.data;
}

export async function getHistoryApi(conversationId: string): Promise<any> {
  const response = await api.get(`/chat/history/${conversationId}`);
  return response.data;
}

export async function createConversationApi(title?: string): Promise<any> {
  const response = await api.post('/chat/conversation', { title });
  return response.data;
}
