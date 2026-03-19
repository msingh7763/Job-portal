import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import api from "@/utils/api";
import Job1 from "./Job1";

const SavedJobs = () => {
  const { user } = useSelector((store) => store.auth);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/users/saved");
        if (res.data?.success) {
          setSavedJobs(res.data.savedJobs || []);
        } else {
          setError(res.data?.message || "Failed to load saved jobs.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSaved();
    } else {
      setLoading(false);
      setError("Please log in to view your saved jobs.");
    }
  }, [user]);

  return (
    <div className="page-shell">
      <Navbar />
      <div className="w-full mx-auto px-2 sm:px-4 pt-4 pb-8">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Saved Jobs</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Jobs you saved for later.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="text-slate-400">Loading saved jobs...</div>
        ) : error ? (
          <div className="text-rose-300">{error}</div>
        ) : savedJobs.length === 0 ? (
          <div className="text-slate-400">You have no saved jobs yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJobs.map((job) => (
              <Job1 key={job._id || job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
