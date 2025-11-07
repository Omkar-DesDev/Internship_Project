
import React, { useState, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { RecorderControl } from './components/RecorderControl';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { StatusIndicator } from './components/StatusIndicator';
import { startTalkTypeSession, LiveSession } from './services/geminiService';
import type { TranscriptEntry } from './types';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState('Click the button and start speaking.');
  
  const sessionRef = useRef<LiveSession | null>(null);
  const currentInputRef = useRef<string>('');
  const isNewTurnRef = useRef(true);

  const handleStartRecording = useCallback(async () => {
    if (isRecording) return;
    try {
      setStatusMessage('Connecting to Gemini...');
      setTranscriptHistory([]);
      currentInputRef.current = '';
      isNewTurnRef.current = true;

      const session = await startTalkTypeSession({
        onOpen: () => {
          setIsRecording(true);
          setStatusMessage('Connection established. You can start speaking now.');
        },
        onMessage: (message) => {
          if (message.serverContent?.inputTranscription) {
            const { text } = message.serverContent.inputTranscription;
            currentInputRef.current += text;
            setTranscriptHistory(prev => {
              if (isNewTurnRef.current) {
                isNewTurnRef.current = false;
                return [...prev, { text: currentInputRef.current }];
              }
              const lastIndex = prev.length - 1;
              if (lastIndex < 0) return [{ text: currentInputRef.current }];
              const newHistory = [...prev];
              newHistory[lastIndex] = { text: currentInputRef.current };
              return newHistory;
            });
          }
          if (message.serverContent?.turnComplete) {
            currentInputRef.current = '';
            isNewTurnRef.current = true;
          }
        },
        onError: (e) => {
          console.error('Session error:', e);
          setStatusMessage('An error occurred. Please try again.');
          setIsRecording(false);
        },
        onClose: () => {
          setIsRecording(false);
          setStatusMessage('Session closed. Click to start a new one.');
        },
      });
      sessionRef.current = session;
    } catch (error) {
      console.error('Failed to start recording:', error);
      setStatusMessage('Could not get microphone access. Please check permissions.');
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleStopRecording = useCallback(() => {
    if (!isRecording || !sessionRef.current) return;
    sessionRef.current.close();
    sessionRef.current = null;
    setIsRecording(false);
    setStatusMessage('Recording stopped. Click to start again.');
  }, [isRecording]);

  return (
    <div className="flex flex-col h-screen bg-brand-secondary font-sans">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-between p-4 md:p-8">
        <div className="w-full max-w-4xl flex-grow flex flex-col bg-brand-primary rounded-lg shadow-2xl overflow-hidden">
          <TranscriptDisplay history={transcriptHistory} />
          <div className="p-4 bg-brand-primary border-t border-brand-secondary/50">
            <StatusIndicator message={statusMessage} isRecording={isRecording} />
          </div>
        </div>
        <div className="w-full flex justify-center items-center py-6">
          <RecorderControl
            isRecording={isRecording}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
          />
        </div>
      </main>
    </div>
  );
}
