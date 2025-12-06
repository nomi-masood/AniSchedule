import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="relative block h-[380px] w-full overflow-hidden rounded-xl bg-surface/50">
      <div className="absolute inset-0 animate-pulse bg-white/5" />
      
      {/* Badge Placeholder */}
      <div className="absolute left-3 top-3 flex gap-2">
         <div className="h-5 w-12 rounded-full bg-slate-700/50 animate-pulse" />
      </div>

      {/* Content Placeholder */}
      <div className="absolute bottom-0 w-full p-4 space-y-3">
        <div className="flex items-center gap-2">
            <div className="h-3 w-10 rounded bg-slate-700/80 animate-pulse" />
            <div className="h-3 w-16 rounded bg-slate-700/80 animate-pulse" />
        </div>
        <div className="h-6 w-3/4 rounded bg-slate-700/80 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-slate-700/80 animate-pulse" />
      </div>
    </div>
  );
};

export default SkeletonCard;