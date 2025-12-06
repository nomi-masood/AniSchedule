import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="animate-pulse text-sm font-medium text-slate-400">Syncing with Japan...</p>
      </div>
    </div>
  );
};

export default Loading;
