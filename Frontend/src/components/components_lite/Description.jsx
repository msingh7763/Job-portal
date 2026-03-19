import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";
import Navbar from "./Navbar";
import { formatSalary } from "@/utils/formatSalary";

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
        const res = await api.get(`/api/job/get/${jobId}`);
        if (res.data.status) {
          dispatch(setSingleJob({ ...res.data.job, matchInfo: res.data.matchInfo }));
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
      const res = await api.post(`/api/application/apply/${jobId}`);
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

  if (loading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="card-surface p-6 text-center text-slate-200 text-sm">
            Loading job details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="card-surface p-6 text-center text-red-400 text-sm">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!singleJob) return null;

  return (
    <div className="page-shell">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="card-surface p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
                {singleJob.title}
              </h1>
              {singleJob.matchInfo && (
                <p className="mt-2 text-xs sm:text-sm text-emerald-300">
                  Match score:{" "}
                  <span className="font-semibold">
                    {singleJob.matchInfo.matchScore}%
                  </span>
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                <Tag text={`${singleJob.position} Positions`} color="blue" />
                <Tag text={formatSalary(singleJob.salary)} color="orange" />
                <Tag text={singleJob.location} color="purple" />
                <Tag text={singleJob.jobType} color="black" />
              </div>
            </div>
            <button
              onClick={applyJobHandler}
              disabled={isApplied || applying}
              className={`mt-2 md:mt-0 px-6 py-2 rounded-lg font-semibold text-white text-sm sm:text-base ${
                isApplied || applying
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500"
              }`}
            >
              {isApplied ? "Already Applied" : applying ? "Applying..." : "Apply now"}
            </button>
          </div>

          {/* Description */}
          <p className="border-b border-slate-700 mt-6 pb-4 text-slate-200 text-sm sm:text-base">
            {singleJob.description}
          </p>

          {/* Job Details */}
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <Detail label="Role" value={`${singleJob.position} Positions`} />
            <Detail label="Location" value={singleJob.location} />
            <Detail label="Salary" value={formatSalary(singleJob.salary)} />
            <Detail label="Experience" value={singleJob.experience || "-"} />
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

          {/* Skill match & gaps */}
          {singleJob.matchInfo && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-100 mb-2">
                  Matched skills
                </h2>
                <SkillList
                  emptyLabel="No matched skills yet."
                  items={singleJob.matchInfo.matchedSkills}
                  type="matched"
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-100 mb-2">
                  Skill gaps
                </h2>
                <SkillList
                  emptyLabel="You match all listed skills for this role."
                  items={singleJob.matchInfo.missingSkills}
                  type="missing"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple component for labels
const Detail = ({ label, value }) => (
  <div className="flex gap-2 font-medium text-slate-200 text-sm">
    <span className="font-semibold text-slate-100">{label}:</span>
    <span className="text-slate-200">{value}</span>
  </div>
);

// Tag component for job header
const Tag = ({ text, color }) => {
  const colors = {
    blue: "text-blue-300 border-blue-400",
    orange: "text-orange-300 border-orange-400",
    purple: "text-purple-300 border-purple-400",
    black: "text-slate-100 border-slate-500",
  };
  return (
    <span
      className={`px-3 py-1 rounded-lg border font-semibold text-xs sm:text-sm ${colors[color] || "border-slate-500 text-slate-100"}`}
    >
      {text}
    </span>
  );
};

const SkillList = ({ items, emptyLabel, type }) => {
  if (!items || items.length === 0) {
    return <p className="text-xs text-slate-400">{emptyLabel}</p>;
  }

  const baseClasses =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border";
  const colorClasses =
    type === "matched"
      ? "bg-emerald-900/40 border-emerald-500 text-emerald-200"
      : "bg-amber-900/40 border-amber-500 text-amber-200";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((skill, idx) => (
        <span key={idx} className={`${baseClasses} ${colorClasses}`}>
          {skill}
        </span>
      ))}
    </div>
  );
};

export default Description;
