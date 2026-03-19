import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "../../redux/jobSlice";

const Header = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = query.trim();
    dispatch(setSearchedQuery(trimmed));
    navigate("/browse");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <section className="relative py-10 sm:py-14 lg:py-18">
      <div className="absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-40 w-full max-w-4xl bg-gradient-to-tr from-indigo-900 via-slate-950 to-emerald-900 blur-3xl opacity-70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-10">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-medium tracking-wide text-indigo-700">
            Trusted by modern teams hiring globally
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight">
            Find your dream job
            <br />
            <span className="text-gradient font-extrabold">
              &amp; build your future
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0">
            Discover curated opportunities from startups and leading companies worldwide.
            Apply in a few clicks and track everything in one simple dashboard.
          </p>

          {/* Search bar */}
          <div className="mt-4 sm:mt-6 max-w-xl mx-auto lg:mx-0">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center bg-slate-900 border border-slate-800 rounded-2xl shadow-md shadow-slate-950/40 px-3 py-2.5">
              <div className="flex-1 flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-200 text-xs font-semibold">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search by job title, company, or skills"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="btn-primary w-full sm:w-auto sm:min-w-[120px] flex items-center justify-center gap-1"
              >
                Search jobs
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs sm:text-sm text-slate-500">
            <span>Popular: Frontend · Product · Data Science · Remote</span>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="relative h-72 w-full max-w-sm">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 shadow-xl shadow-sky-100" />
            <div className="absolute inset-2 rounded-3xl bg-slate-950/90 shadow-lg flex flex-col justify-between p-5">
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-500">Live openings</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2">
                    <div>
                      <p className="font-semibold text-slate-100">Product Designer</p>
                      <p className="text-slate-500">Figma • Remote</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-medium px-2 py-0.5">
                      New
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-100 px-3 py-2">
                    <div>
                      <p className="font-semibold text-slate-100">Frontend Engineer</p>
                      <p className="text-slate-500">React • Full time</p>
                    </div>
                    <span className="rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-medium px-2 py-0.5">
                      Featured
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Over 12k+ jobs listed</span>
                <div className="flex -space-x-2">
                  <span className="h-6 w-6 rounded-full bg-indigo-100 border border-white" />
                  <span className="h-6 w-6 rounded-full bg-sky-100 border border-white" />
                  <span className="h-6 w-6 rounded-full bg-emerald-100 border border-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
