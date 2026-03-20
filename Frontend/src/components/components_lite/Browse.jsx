import React, { useEffect, useMemo } from "react";
import Navbar from "./Navbar";
import Job1 from "./Job1";
import FilterCard from "./Filtercard";
import JobSkeleton from "./JobSkeleton";
import { useDispatch, useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setSearchedQuery, setSearchedFilters } from "../../redux/jobSlice";
import { filterJobsLogic } from "../../utils/filterHelper";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Cybersecurity Engineer",
  "Product Manager",
  "UX/UI Designer",
];

const Browse = () => {
  const { loading, page, setPage, totalPages } = useGetAllJobs();
  const { allJobs, searchedQuery, searchedFilters } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      // Clear out the text query and filters when unmounting
      dispatch(setSearchedQuery(""));
      dispatch(setSearchedFilters({ Location: "", Technology: "", Experience: "", Salary: "" }));
    };
  }, [dispatch]);

  // Use the shared filtering logic
  const refinedJobs = filterJobsLogic(allJobs, searchedQuery, searchedFilters);

  const hasActiveSearch = useMemo(() => {
    const hasQuery = searchedQuery?.trim()?.length > 0;
    const hasFilters = Object.values(searchedFilters || {}).some((v) => v && v !== "");
    return hasQuery || hasFilters;
  }, [searchedQuery, searchedFilters]);

  const categoryGrid = useMemo(() => {
    if (hasActiveSearch) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 mb-4">
          Browse by category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => dispatch(setSearchedQuery(category))}
              className="text-left card-surface p-5 rounded-2xl hover:shadow-lg transition"
            >
              <p className="font-semibold text-slate-100">{category}</p>
              <p className="text-sm text-slate-400 mt-1">Search jobs for {category}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }, [dispatch, hasActiveSearch]);

  return (
    <div className="page-shell">
      <Navbar />
      <div className="w-full mx-auto px-2 sm:px-4 pt-4 pb-8">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              {hasActiveSearch ? (
                <>
                  Search <span className="text-indigo-300">Results</span>
                </>
              ) : (
                <>
                  Browse <span className="text-indigo-300">Categories</span>
                </>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {hasActiveSearch
                ? `Showing ${refinedJobs.length} matching opportunities.`
                : "Pick a category to begin your search."}
            </p>
          </div>
        </header>

        <div className="flex gap-5">
          {/* Left Sidebar (Filter) matching Jobs page */}
          <div className="hidden md:block w-1/4">
            <div className="card-surface h-full p-4">
              <FilterCard />
            </div>
          </div>

          <div className="flex-1">
            {categoryGrid}

            {loading && allJobs.length === 0 ? (
              // Initial Loading State: Skeletons
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <JobSkeleton key={i} />
                ))}
              </div>
            ) : !hasActiveSearch && refinedJobs.length === 0 ? (
              // Prompt user to select a category
              <div className="flex-1 flex items-center justify-center py-10">
                <p className="text-slate-400 text-sm">
                  Choose a category above to start viewing jobs.
                </p>
              </div>
            ) : refinedJobs.length === 0 ? (
              // Empty State when searching
              <div className="flex-1 flex items-center justify-center py-10">
                <p className="text-slate-400 text-sm">
                  No jobs match your current search. Try another keyword or filter.
                </p>
              </div>
            ) : (
              // Data State
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {refinedJobs.map((job) => (
                    <Job1 key={job._id || job.id} job={job} />
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;