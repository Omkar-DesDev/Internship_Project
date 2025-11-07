
import React from 'react';

interface StatusIndicatorProps {
    message: string;
    isRecording: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ message, isRecording }) => {
  return (
    <div className="flex items-center justify-center gap-3 text-brand-subtext">
      {isRecording && (
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
      )}
      <p className="text-sm text-center">{message}</p>
    </div>
  );
};
