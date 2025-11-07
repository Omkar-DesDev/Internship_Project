
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";
import { encode } from '../utils/audioUtils';

export interface LiveSession {
  sendRealtimeInput: (input: { media: Blob }) => void;
  close: () => void;
}

interface SessionCallbacks {
  onOpen: () => void;
  onMessage: (message: LiveServerMessage) => void;
  onError: (e: ErrorEvent) => void;
  onClose: () => void;
}

export async function startTalkTypeSession(callbacks: SessionCallbacks): Promise<LiveSession> {
  // FIX: Use process.env.API_KEY for the API key as per the guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  
  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: () => {
        callbacks.onOpen();
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        
        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          sessionPromise.then((session) => {
            session.sendRealtimeInput({ media: pcmBlob });
          });
        };
        
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: callbacks.onMessage,
      onerror: callbacks.onError,
      onclose: () => {
        inputAudioContext.close();
        stream.getTracks().forEach(track => track.stop());
        callbacks.onClose();
      },
    },
    config: {
      responseModalities: [Modality.AUDIO], // Still required by Live API
      inputAudioTranscription: {},
      systemInstruction: 'You are a real-time transcription service. Accurately transcribe the user\'s speech. Do not generate any spoken response.',
    },
  });

  return sessionPromise;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}