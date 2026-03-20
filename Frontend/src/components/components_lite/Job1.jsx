import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import api from "@/utils/api";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { formatSalary } from "@/utils/formatSalary";

const Job1 = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [logoSrc, setLogoSrc] = useState(job?.company?.logo || "/default-company.svg");

  useEffect(() => {
    setLogoSrc(job?.company?.logo || "/default-company.svg");
  }, [job?.company?.logo]);

  const isSaved = useMemo(() => {
    if (!user || !user.savedJobs) return false;
    return user.savedJobs.some((entry) => {
      const savedId = typeof entry === "object" ? entry?._id : entry;
      return String(savedId) === String(job._id);
    });
  }, [user, job?._id]);

  const formattedMatch = typeof job.matchScore === "number" ? `${job.matchScore}%` : "—";

  const handleToggleSave = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const res = await api.post("/api/users/saved/toggle", { jobId: job._id });
        if (res.data.success) {
          const nextSavedJobs = Array.isArray(res.data.savedJobs)
            ? res.data.savedJobs
            : isSaved
              ? (user.savedJobs || []).filter((id) => String(id?._id || id) !== String(job._id))
              : [...(user.savedJobs || []), job._id];

          // merge savedJobs into auth.user
          dispatch(
            setUser({
              ...user,
              savedJobs: nextSavedJobs,
            })
          );
        }
      } catch (error) {
        console.error("Error toggling saved job", error);
      }
    },
    [job._id, user, dispatch, navigate]
  );

  return (
    <div className="card-surface p-5 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/40 h-full flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
            <img
              src={logoSrc}
              alt={job?.company?.name || "Company logo"}
              onError={() => setLogoSrc("/default-company.svg")}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-slate-100">
              {job?.company?.name || "Unknown Company"}
            </h1>
            <p className="text-xs text-slate-500">{job.location || "Remote"}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleSave}
          aria-label={isSaved ? "Unsave job" : "Save job"}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition ${
            isSaved
              ? "border-purple-500 bg-purple-50 text-purple-700"
              : "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
          }`}
        >
          <Bookmark className={isSaved ? "fill-purple-500" : ""} />
        </button>
      </div>

      <div className="mt-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100">{job.title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-1">
              {job?.description}
            </p>
          </div>

          {typeof job.matchScore === "number" && user && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {formattedMatch}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge label={job.jobType} tone="indigo" />
          <Badge label={formatSalary(job.salary)} tone="amber" />
          <Badge label={job.experience} tone="emerald" />
          {job.requirements?.slice(0, 3).map((req) => (
            <Badge key={req} label={req} tone="slate" />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => navigate(`/description/${job._id}`)}
          className="w-full rounded-md border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-100 py-2 hover:bg-slate-700 transition"
        >
          View details
        </button>
        <button
          type="button"
          onClick={handleToggleSave}
          className={`w-full rounded-md text-xs font-semibold py-2 transition ${
            isSaved
              ? "bg-purple-600 text-white hover:bg-purple-500"
              : "bg-indigo-600 text-white hover:bg-indigo-500"
          }`}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
};

const Badge = ({ label, tone }) => {
  const colors = {
    indigo: "bg-indigo-600/20 border-indigo-500 text-indigo-100",
    amber: "bg-amber-600/20 border-amber-500 text-amber-100",
    emerald: "bg-emerald-600/20 border-emerald-500 text-emerald-100",
    slate: "bg-slate-700/40 border-slate-600 text-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] ${
        colors[tone] || colors.slate
      }`}
    >
      {label}
    </span>
  );
};

export default Job1;
