import { api } from '@/shared/lib/axios';

export interface AudioMessageResponse {
  assistantMessage: string;
  audioUrl: string;
}

export async function sendAudioMessage(
  conversationId: string,
  audioBlob: Blob
): Promise<AudioMessageResponse> {
  console.log('[chatApi] sendAudioMessage called:', {
    conversationId,
    blobSize: audioBlob.size,
    blobType: audioBlob.type,
  });

  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.webm');
  formData.append('conversationId', conversationId);

  console.log('[chatApi] FormData created, sending to:', api.defaults.baseURL + '/chat/message-audio');
  console.log('[chatApi] API baseURL:', api.defaults.baseURL);

  try {
    const response = await api.post<AudioMessageResponse>(
      '/chat/message-audio',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('[chatApi] Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('[chatApi] Full error:', error);
    console.error('[chatApi] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      status: (error as any)?.response?.status,
      statusText: (error as any)?.response?.statusText,
      url: (error as any)?.config?.url,
      data: (error as any)?.response?.data,
      isAxiosError: (error as any)?.isAxiosError,
    });
    throw error;
  }
}
