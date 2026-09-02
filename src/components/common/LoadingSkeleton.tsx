import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-slate-100 bg-slate-50/50">
        <SkeletonBox className="h-4 w-28" />
        <div className="flex-1" />
        <SkeletonBox className="h-8 w-48 rounded-lg" />
        <SkeletonBox className="h-8 w-24 rounded-lg" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <SkeletonBox
                key={cIdx}
                className={`h-4 ${
                  cIdx === 0 ? 'w-32' : cIdx === 1 ? 'w-48' : cIdx === 2 ? 'w-24' : 'w-16'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <SkeletonBox className="h-3 w-20" />
            <SkeletonBox className="h-8 w-8 rounded-lg" />
          </div>
          <SkeletonBox className="h-7 w-16" />
          <SkeletonBox className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
};
