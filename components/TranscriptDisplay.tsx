
import React, { useEffect, useRef } from 'react';
import type { TranscriptEntry } from '../types';

interface TranscriptDisplayProps {
  history: TranscriptEntry[];
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ history }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
      {history.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-brand-subtext text-lg">Your transcription will appear here...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry, index) => (
            <p key={index} className="text-brand-text leading-relaxed">
              {entry.text}
            </p>
          ))}
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};
