import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import JobCards from "./JobCards";

const LatestJobs = () => {
  // Safely access jobs from Redux without creating new references
  const allJobs = useSelector((state) => state.job?.allJobs);

  const [activeTab, setActiveTab] = useState("Full Time");

  const filteredJobs = useMemo(() => {
    if (!allJobs || allJobs.length === 0) return [];
    if (activeTab === "All") return allJobs;
    if (activeTab === "Remote") return allJobs.filter((job) => job.jobType?.toLowerCase().includes("remote"));
    if (activeTab === "Part Time") return allJobs.filter((job) => job.jobType?.toLowerCase().includes("part"));
    // Default Full Time
    return allJobs.filter((job) => job.jobType?.toLowerCase().includes("full"));
  }, [allJobs, activeTab]);

  return (
    <div className="max-w-6xl mx-auto my-10">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">
            Recommended jobs
          </h2>
          <p className="text-sm text-slate-500">
            Handpicked opportunities based on popular searches.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 p-1 text-xs sm:text-sm">
          {["Full Time", "Part Time", "Remote"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === tab
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {!allJobs || allJobs.length === 0 ? (
          <p className="text-center text-slate-500 col-span-full text-sm sm:text-base">
            No jobs available right now. Please check back soon.
          </p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center text-slate-500 col-span-full text-sm sm:text-base">
            No {activeTab.toLowerCase()} roles found yet. Try another tab.
          </p>
        ) : (
          filteredJobs.slice(0, 6).map((job) =>
            job?._id ? (
              <JobCards key={job._id} job={job} />
            ) : (
              <p key={Math.random()} className="text-red-500">
                Invalid Job Data
              </p>
            )
          )
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
