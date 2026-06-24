'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Typography,
  Stack,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
  Chip,
} from '@mui/material';
import { Send as SendIcon, Mic as MicIcon, MicOff as MicOffIcon, Logout as LogoutIcon, Settings as SettingsIcon, Brightness4 as DarkIcon, Brightness7 as LightIcon, NavigateBefore as NavBeforeIcon, NavigateNext as NavNextIcon, Stop as StopIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import { useChat, useCreateConversation } from '../hooks/useSpeech';
import { useSpeechRecorder } from '../hooks/useSpeechRecorder';
import { useChatStore } from '../store/chat.store';
import { MessageList } from './MessageList';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useThemeMode } from '@/shared/hooks/useTheme';

function ChatPageContent() {
  const { user, logout } = useAuthStore();
  const { messages, conversationId, audioModeEnabled, addMessage, loadFromStorage } = useChatStore();
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const recognitionRef = useRef<any>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  // Audio recording state
  const { startRecording, stopRecording, isRecording, recordingTime, error: recordingError, resetRecording } = useSpeechRecorder();
  const [isAudioSending, setIsAudioSending] = useState(false);

  console.log('ChatPageContent rendered - messages:', messages.length);

  const createConversationMutation = useCreateConversation();
  const { sendMessage, sendAudioMessage, supportsAudio, isLoading, error } = useChat(conversationId);

  // Initialize speech recognition
  useEffect(() => {
    setIsMounted(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript + ' ';
        }
      }
      if (finalText.trim()) {
        handleTranscript(finalText.trim());
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // Load conversation from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Handle scroll indicators
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setCanScrollUp(container.scrollTop > 0);
      setCanScrollDown(
        container.scrollTop < container.scrollHeight - container.clientHeight - 10
      );
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollUp = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollBy({ top: -100, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
    }
  };

  // Create conversation if needed
  useEffect(() => {
    if (!conversationId && createConversationMutation.status === 'idle') {
      createConversationMutation.mutate('English Lesson');
    }
  }, [conversationId, createConversationMutation]);

  // Auto-focus input when teacher responds
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        inputFieldRef.current?.focus();
        // Play audio if available
        if (lastMessage.audio_url) {
          playAudio(lastMessage.audio_url);
        }
      }
    }
  }, [isLoading, messages]);

  const handleTranscript = async (transcript: string) => {
    if (!conversationId || !transcript.trim()) return;

    try {
      setInputText('');
      await sendMessage(transcript);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationId || !inputText.trim()) return;

    try {
      await sendMessage(inputText);
      setInputText('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Audio recording handlers
  const handleAudioRecordingStart = async () => {
    resetRecording();
    await startRecording();
  };

  const handleAudioRecordingStop = async () => {
    const audioBlob = await stopRecording();
    if (!audioBlob || !conversationId) {
      console.error('No audio blob or conversation ID');
      resetRecording();
      return;
    }

    // Add user audio message to store (text representation)
    addMessage({
      role: 'user',
      content: '🎤 Voice message',
    });

    try {
      setIsAudioSending(true);
      const response = await sendAudioMessage(audioBlob);
      // Response is already added by the mutation
    } catch (err) {
      console.error('Error sending audio:', err);
    } finally {
      setIsAudioSending(false);
      resetRecording();
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().catch((err) => {
        console.error('Error playing audio:', err);
      });
    }
  };

  if (!isMounted) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', margin: 0, padding: 0, bgcolor: 'background.default', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Header - Thin, minimal - Only show when there are messages */}
      {messages.length > 0 && (
        <AppBar 
          position="static" 
          sx={{ 
            zIndex: 10,
            height: 56,
            boxShadow: 1,
            width: '100%',
            margin: 0,
            padding: 0,
            marginTop: '2px',
          }}
        >
          <Toolbar sx={{ minHeight: 56, pl: 2, pr: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="inherit" sx={{ mr: 1 }} onClick={toggleMode}>
                {mode === 'light' ? <DarkIcon fontSize="small" /> : <LightIcon fontSize="small" />}
              </IconButton>
              
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                IspeakAI
              </Typography>

              {/* Audio Mode Badge */}
              {audioModeEnabled && (
                <Chip 
                  label="🎤 Audio Mode ON" 
                  size="small"
                  sx={{ ml: 2, fontSize: '0.75rem' }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" title="Settings" sx={{ mr: 0.5 }}>
                <SettingsIcon fontSize="small" />
              </IconButton>

              <IconButton color="inherit" title="Profile" sx={{ mr: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>👤</Typography>
              </IconButton>

              <IconButton color="inherit" onClick={logout} title="Logout">
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ m: 1, width: '100%', boxSizing: 'border-box' }}>
          {error instanceof Error ? error.message : 'An error occurred'}
        </Alert>
      )}

      {/* Recording Error */}
      {recordingError && (
        <Alert severity="error" sx={{ m: 1, width: '100%', boxSizing: 'border-box' }}>
          {recordingError.message}
        </Alert>
      )}

      {/* Messages Container */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          ml: 0,
          mr: 0,
        }}
      >
        <MessageList messages={messages} />

        {/* Scroll Indicators */}
        {messages.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 2,
              opacity: canScrollUp || canScrollDown ? 1 : 0,
              transition: 'opacity 0.3s',
              visibility: canScrollUp || canScrollDown ? 'visible' : 'hidden',
            }}
          >
            {canScrollUp && (
              <IconButton 
                size="small" 
                onClick={scrollUp}
                sx={{ color: 'text.secondary' }}
              >
                <NavBeforeIcon />
              </IconButton>
            )}
            {canScrollDown && (
              <IconButton 
                size="small" 
                onClick={scrollDown}
                sx={{ color: 'text.secondary' }}
              >
                <NavNextIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      {/* Input Area - Fixed at bottom with proper padding */}
      <Paper
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100vw',
          pl: 2,
          pr: 2,
          pt: 2,
          pb: 3,
          borderRadius: 0,
          zIndex: 20,
          boxShadow: 3,
          bgcolor: 'background.paper',
          boxSizing: 'border-box',
        }}
      >
        <Box
          component="form"
          onSubmit={handleTextSubmit}
          sx={{
            maxWidth: '100%',
            margin: '0 auto',
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          {/* Input Field */}
          <TextField
            inputRef={inputFieldRef}
            fullWidth
            size="small"
            placeholder="Type your message here"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading || isRecording}
            variant="outlined"
          />

          {/* Send Button */}
          <IconButton
            type="submit"
            disabled={isLoading || !inputText.trim() || isRecording}
            color="primary"
            sx={{ p: 1 }}
            title="Send message"
          >
            <SendIcon />
          </IconButton>

          {/* Audio Button (if audio supported) */}
          {audioModeEnabled && supportsAudio && (
            <IconButton
              onClick={isRecording ? handleAudioRecordingStop : handleAudioRecordingStart}
              disabled={isLoading || isAudioSending}
              color={isRecording ? 'error' : 'primary'}
              sx={{ p: 1 }}
              title={isRecording ? 'Stop recording' : 'Tap to record'}
            >
              {isAudioSending ? <UploadIcon /> : isRecording ? <StopIcon /> : <MicIcon />}
            </IconButton>
          )}

          {/* Speak Button (fallback Web Speech API) */}
          <IconButton
            onClick={toggleListening}
            disabled={isLoading || isRecording}
            color={isListening ? 'error' : 'primary'}
            sx={{ p: 1 }}
            title={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>

          {/* Loading/Recording Indicator */}
          {(isLoading || isAudioSending) && <CircularProgress size={24} />}
          {isRecording && (
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main' }}>
              {recordingTime}s
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Hidden audio player for auto-playing responses */}
      <audio ref={audioPlayerRef} />

      {/* Spacer for footer - NOT NEEDED for fixed elements, but maintains scroll space */}
      <Box sx={{ height: '120px' }} />
    </Box>
  );
}

export function ChatPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <ChatPageContent />;
}
