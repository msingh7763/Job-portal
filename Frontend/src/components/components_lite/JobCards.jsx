import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatSalary } from "@/utils/formatSalary";

const JobCards = ({ job }) => {
  const navigate = useNavigate();
  const [logoSrc, setLogoSrc] = useState(job?.company?.logo || "/default-company.svg");

  useEffect(() => {
    setLogoSrc(job?.company?.logo || "/default-company.svg");
  }, [job?.company?.logo]);

  return (
    <button
      type="button"
      onClick={() => navigate(`/description/${job._id}`)}
      className="text-left card-surface w-full p-4 sm:p-5 rounded-2xl cursor-pointer hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-indigo-200/40 transition-all flex flex-col gap-3"
    >
      {/* Company & Location */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
            <img
              src={logoSrc}
              alt={job.company?.name || "Company logo"}
              onError={() => setLogoSrc("/default-company.svg")}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-slate-100">
              {job.company?.name || "Unknown Company"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {job.location || "India"}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] sm:text-xs text-slate-600">
          {job.jobType}
        </span>
      </div>

      {/* Job Title & Description */}
      <div className="space-y-1">
        <h2 className="font-semibold text-base sm:text-lg text-slate-100">
          {job.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
          {job.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex gap-2 items-center mt-1 flex-wrap text-[10px] sm:text-xs">
        <span className="px-2 py-1 rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50 font-medium">
          {job.position} open
        </span>
        <span className="px-2 py-1 rounded-full border border-amber-200 text-amber-700 bg-amber-50 font-medium">
          {formatSalary(job.salary)}
        </span>
        <span className="px-2 py-1 rounded-full border border-purple-200 text-purple-700 bg-purple-50 font-medium">
          {job.location}
        </span>
      </div>
    </button>
  );
};

export default JobCards;
