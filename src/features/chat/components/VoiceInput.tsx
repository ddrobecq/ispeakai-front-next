'use client';

import { useEffect, useRef, useState } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  disabled?: boolean;
}

export function VoiceInput({
  onTranscript,
  isListening,
  setIsListening,
  disabled = false,
}: VoiceInputProps) {
  const recognitionRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [error, setError] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    setIsMounted(true);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setUnsupported(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Change to 'fr-FR' for French, 'es-ES' for Spanish, etc.
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setInterimTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalText += transcript + ' ';
        } else {
          interimText += transcript;
        }
      }

      setInterimTranscript(interimText);

      // Only send final transcript when recognized
      if (finalText.trim()) {
        onTranscript(finalText.trim());
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Voice error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onTranscript, setIsListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (!isMounted) {
    return (
      <div className="p-4 rounded-full font-medium bg-blue-500 text-white">
        🎤 Speak
      </div>
    );
  }

  if (unsupported) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Web Speech API not supported. Use Chrome, Edge, or Safari.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`p-4 rounded-full font-medium transition ${
          isListening
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400'
        }`}
      >
        {isListening ? '🛑 Stop' : '🎤 Speak'}
      </button>
      {interimTranscript && (
        <div className="text-sm text-gray-600 italic">
          Hearing: {interimTranscript}...
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
