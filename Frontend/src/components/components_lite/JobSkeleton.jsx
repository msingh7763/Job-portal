import React from "react";

const JobSkeleton = () => {
  return (
    <div className="p-4 rounded-md shadow-xl bg-[#0f172a] border border-[#1e293b] w-full animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Skeleton */}
          <div className="h-10 w-10 bg-[#334155] rounded-full"></div>
          {/* Company Name & Location Skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-[#334155] rounded"></div>
            <div className="h-3 w-16 bg-[#334155] rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        {/* Title Skeleton */}
        <div className="h-5 w-3/4 bg-[#334155] rounded mb-3"></div>
        {/* Description Lines Skeleton */}
        <div className="h-3 w-full bg-[#334155] rounded mb-2"></div>
        <div className="h-3 w-full bg-[#334155] rounded mb-2"></div>
        <div className="h-3 w-4/5 bg-[#334155] rounded"></div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        {/* Badges Skeleton */}
        <div className="h-5 w-16 bg-[#334155] rounded-full"></div>
        <div className="h-5 w-20 bg-[#334155] rounded-full"></div>
        <div className="h-5 w-16 bg-[#334155] rounded-full"></div>
      </div>
    </div>
  );
};

export default JobSkeleton;
