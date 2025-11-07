
import React from 'react';
import { MicIcon } from './icons/MicIcon';
import { StopIcon } from './icons/StopIcon';

interface RecorderControlProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const RecorderControl: React.FC<RecorderControlProps> = ({ isRecording, onStart, onStop }) => {
  const buttonClasses = `
    relative flex items-center justify-center w-20 h-20 rounded-full
    transition-all duration-300 ease-in-out transform
    focus:outline-none focus:ring-4 focus:ring-opacity-50
  `;

  const recordingClasses = `
    bg-red-500 text-white shadow-lg scale-110 hover:bg-red-600 focus:ring-red-400
  `;

  const idleClasses = `
    bg-brand-accent text-white shadow-lg hover:bg-blue-500 focus:ring-blue-400
  `;

  const pulseAnimation = isRecording ? (
    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
  ) : null;

  return (
    <button
      onClick={isRecording ? onStop : onStart}
      className={`${buttonClasses} ${isRecording ? recordingClasses : idleClasses}`}
      aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
    >
      {pulseAnimation}
      <span className="relative z-10">
        {isRecording ? <StopIcon className="w-8 h-8" /> : <MicIcon className="w-8 h-8" />}
      </span>
    </button>
  );
};
