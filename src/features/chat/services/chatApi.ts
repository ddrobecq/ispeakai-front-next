import { api } from '@/shared/lib/axios';

export interface AudioMessageResponse {
  assistantMessage: string;
  audioUrl: string;
}

export async function sendAudioMessage(
  conversationId: string,
  audioBlob: Blob
): Promise<AudioMessageResponse> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.webm');
  formData.append('conversationId', conversationId);

  const response = await api.post<AudioMessageResponse>(
    '/chat/message-audio',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
