import { useEffect, useState } from "react";
import api from "@/utils/api";

/**
 * Fetch a job by ID and return loading/error state.
 * Optionally returns the job data.
 */
const useGetSingleJob = (jobId) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/job/get/${jobId}`);
        setJob(res.data.job);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  return { job, loading, error };
};

export default useGetSingleJob;
