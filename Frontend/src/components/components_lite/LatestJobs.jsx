import React from "react";
import { useSelector } from "react-redux";
import JobCards from "./JobCards";

const LatestJobs = () => {
  // Safely access jobs from Redux without creating new references
  const allJobs = useSelector((state) => state.job?.allJobs);

  return (
    <div className="max-w-5xl mx-auto my-10">
      {/* Section Title */}
      <h2 className="text-4xl font-bold text-center">
        <span className="text-[#6A38C2]">Latest & Top </span>Job Openings
      </h2>

      {/* Job Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-5">
        {!allJobs || allJobs.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No Jobs Available
          </p>
        ) : (
          allJobs.slice(0, 6).map((job) =>
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
