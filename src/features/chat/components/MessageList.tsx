'use client';

import { useEffect, useRef } from 'react';
import { Box, Paper, Stack, Typography, useTheme, Avatar } from '@mui/material';
import { TMessage } from '@/shared/types';
import { AudioPlayer } from './AudioPlayer';

interface MessageListProps {
  messages: TMessage[];
  userName?: string;
}

export function MessageList({ messages, userName = 'U' }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          py: 4,
          textAlign: 'center',
        }}
      >
        <Box>
          <Box sx={{ fontSize: '3rem', mb: 2 }}>🎓</Box>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            Welcome to IspeakAI!
          </Typography>
          <Typography color="textSecondary" sx={{ maxWidth: '400px' }}>
            Let's improve your English skills together. Start by typing a message or click the mic to speak!
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ width: '100%', px: '20px' }}>
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          {message.role === 'assistant' && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.main,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              T
            </Avatar>
          )}

          <Paper
            sx={{
              maxWidth: '70%',
              p: 1.5,
              borderRadius: 2,
              backgroundColor:
                message.role === 'user'
                  ? theme.palette.primary.main
                  : theme.palette.mode === 'dark'
                  ? '#2a2a2a'
                  : '#ececec',
              color: message.role === 'user' ? '#fff' : theme.palette.text.primary,
              wordBreak: 'break-word',
              boxShadow: 'none',
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {message.content}
            </Typography>
            {message.role === 'assistant' && message.audio_url && (
              <Box sx={{ mt: 1 }}>
                <AudioPlayer audioUrl={message.audio_url} isPlaying={false} />
              </Box>
            )}
          </Paper>

          {message.role === 'user' && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.main,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          )}
        </Box>
      ))}
      <div ref={endRef} />
    </Stack>
  );
}
