
import React from 'react';
import { MicIcon } from './icons/MicIcon';

export const Header: React.FC = () => {
  return (
    <header className="w-full p-4 bg-brand-primary shadow-md flex items-center justify-center">
       <div className="flex items-center gap-3">
        <MicIcon className="w-8 h-8 text-brand-accent" />
        <h1 className="text-2xl font-bold text-brand-text">TalkType</h1>
      </div>
    </header>
  );
};
