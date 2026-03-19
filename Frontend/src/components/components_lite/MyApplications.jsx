import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import api from "@/utils/api";
import { useSelector } from "react-redux";

const statusStyles = {
  applied: "bg-indigo-600 text-white",
  viewed: "bg-sky-600 text-white",
  shortlisted: "bg-amber-500 text-white",
  interview: "bg-emerald-500 text-white",
  hired: "bg-emerald-600 text-white",
  rejected: "bg-rose-600 text-white",
};

const MyApplications = () => {
  const { user } = useSelector((store) => store.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/application/get");
        if (res.data?.success) {
          setApplications(res.data.application || []);
        } else {
          setError(res.data?.message || "Failed to load applications.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="page-shell">
      <Navbar />
      <div className="w-full mx-auto px-2 sm:px-4 pt-4 pb-8">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">My Applications</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Track your application status and view the jobs you applied for.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="text-slate-400">Loading your applications…</div>
        ) : error ? (
          <div className="text-rose-300">{error}</div>
        ) : applications.length === 0 ? (
          <div className="text-slate-400">
            You haven't applied anywhere yet. Browse jobs and apply to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((application) => {
              const job = application.job || {};
              const status = application.status || "applied";
              return (
                <div
                  key={application._id}
                  className="card-surface p-5 rounded-2xl border border-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">{job.title}</h2>
                      <p className="text-xs text-slate-400 mt-1">{job.company?.name || "Unknown company"}</p>
                      <p className="text-xs text-slate-400">{job.location || "—"}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[status] || "bg-slate-700 text-white"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-400 line-clamp-3">
                    {job.description || "No description available."}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                    <a
                      href={`/description/${job._id}`}
                      className="text-indigo-300 hover:text-indigo-200"
                    >
                      View job
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
