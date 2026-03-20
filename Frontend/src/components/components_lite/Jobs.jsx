import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import FilterCard from "./Filtercard";
import Job1 from "./Job1";
import JobSkeleton from "./JobSkeleton";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { filterJobsLogic } from "../../utils/filterHelper";

const Jobs = () => {
  const { loading, page, setPage, totalPages } = useGetAllJobs();
  const { allJobs, searchedQuery, searchedFilters } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    const refinedJobs = filterJobsLogic(allJobs, searchedQuery, searchedFilters);
    setFilterJobs(refinedJobs);
  }, [allJobs, searchedQuery, searchedFilters]);

  const activeFilters = Object.entries(searchedFilters || {})
    .filter(([, value]) => value)
    .map(([key, value]) => ({ key, value }));

  return (
    <div className="page-shell">
      <Navbar />
      <div className="w-full mx-auto pt-4 pb-8 px-2 sm:px-4">
        <header className="mb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              All <span className="text-indigo-300">Jobs</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Filter and explore roles tailored to your profile.
            </p>

            {activeFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400">Active filters:</span>
                {activeFilters.map(({ key, value }) => (
                  <span
                    key={`${key}-${value}`}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-700/20 px-3 py-1 text-indigo-100"
                  >
                    <span className="font-semibold">{key}:</span> {value}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="inline-flex items-center gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1">
              {filterJobs.length || 0} roles found
            </span>
            <span className="rounded-full border border-purple-500 bg-purple-500/10 px-3 py-1">
              {allJobs?.length || 0} total jobs
            </span>
          </div>
        </header>

        <div className="flex gap-5">
          <div className="hidden md:block w-1/4">
            <div className="card-surface h-full p-4">
              <FilterCard />
            </div>
          </div>

          {loading && allJobs.length === 0 ? (
            // Initial Loading State
            <div className="flex-1 overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <JobSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : filterJobs.length <= 0 ? (
            // Empty State
            <div className="flex-1 flex items-center justify-center">
              <span className="text-slate-400 text-sm md:text-base">
                No jobs found. Try changing your filters or search keywords.
              </span>
            </div>
          ) : (
            // Data State
            <div className="flex-1 overflow-y-auto pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    key={job._id || job.id}
                  >
                    <Job1 job={job} />
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination "Load More" Button */}
              {page < totalPages && (
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-full bg-indigo-600/20 text-indigo-300 font-semibold text-sm hover:bg-indigo-600/30 border border-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></span>
                        Loading...
                      </>
                    ) : (
                      "Load More Jobs"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;