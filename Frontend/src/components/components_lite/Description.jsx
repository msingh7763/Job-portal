import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "@/utils/data";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";

const Description = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.status) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications?.some(
              (app) => app.applicant === user?._id
            ) || false
          );
        } else {
          setError("Failed to fetch job.");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Error fetching job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, dispatch, user?._id]);

  const applyJobHandler = async () => {
    if (isApplied || applying) return;
    setApplying(true);
    try {
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true);
        const updatedJob = {
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedJob));
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return <div className="text-center mt-10 font-medium text-gray-700">Loading...</div>;

  if (error)
    return (
      <div className="text-center mt-10 font-medium text-red-500">
        {error}
      </div>
    );

  if (!singleJob) return null;

  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">{singleJob.title}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            <Tag text={`${singleJob.position} Positions`} color="blue" />
            <Tag text={`${singleJob.salary} LPA`} color="orange" />
            <Tag text={singleJob.location} color="purple" />
            <Tag text={singleJob.jobType} color="black" />
          </div>
        </div>
        <button
          onClick={applyJobHandler}
          disabled={isApplied || applying}
          className={`mt-4 md:mt-0 px-6 py-2 rounded-lg font-semibold text-white ${isApplied || applying
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-900"
            }`}
        >
          {isApplied ? "Already Applied" : applying ? "Applying..." : "Apply"}
        </button>
      </div>

      {/* Description */}
      <p className="border-b border-gray-300 mt-6 pb-4 text-gray-800 font-medium">
        {singleJob.description}
      </p>

      {/* Job Details */}
      <div className="mt-6 space-y-2">
        <Detail label="Role" value={`${singleJob.position} Positions`} />
        <Detail label="Location" value={singleJob.location} />
        <Detail label="Salary" value={`${singleJob.salary} LPA`} />
        <Detail label="Experience" value={`${singleJob.experienceLevel} Years`} />
        <Detail
          label="Total Applicants"
          value={singleJob.applications?.length || 0}
        />
        <Detail label="Job Type" value={singleJob.jobType} />
        <Detail
          label="Post Date"
          value={new Date(singleJob.createdAt).toLocaleDateString()}
        />
      </div>
    </div>
  );
};

// Simple component for labels
const Detail = ({ label, value }) => (
  <div className="flex gap-2 font-medium text-gray-700">
    <span className="font-bold">{label}:</span>
    <span>{value}</span>
  </div>
);

// Tag component for job header
const Tag = ({ text, color }) => {
  const colors = {
    blue: "text-blue-600 border-blue-600",
    orange: "text-orange-600 border-orange-600",
    purple: "text-purple-700 border-purple-700",
    black: "text-black border-black",
  };
  return (
    <span
      className={`px-3 py-1 rounded-lg border font-bold ${colors[color] || "border-gray-400 text-gray-800"}`}
    >
      {text}
    </span>
  );
};

export default Description;
