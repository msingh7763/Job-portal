import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AppliedJob = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg">
          <span className="text-2xl">📭</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-100">No applications yet</h3>
        <p className="max-w-md text-sm text-slate-400">
          You haven’t applied to any jobs yet. Once you do, your applications will show up here.
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition"
        >
          Browse jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700 rounded-2xl bg-slate-900/40 text-left">
        <caption className="sr-only">Recent applied jobs</caption>
        <thead className="bg-slate-900/60">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Date
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Job title
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Company
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 text-right">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {allAppliedJobs.map((appliedJob) => (
            <tr key={appliedJob._id} className="hover:bg-slate-800/60 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-200">
                {appliedJob?.createdAt?.split("T")[0]}
              </td>
              <td className="px-4 py-3 text-sm text-slate-200">
                {appliedJob.job?.title}
              </td>
              <td className="px-4 py-3 text-sm text-slate-200">
                {appliedJob.job?.company?.name}
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold text-white ${
                    appliedJob.status === "rejected"
                      ? "bg-rose-500"
                      : appliedJob.status === "accepted"
                      ? "bg-emerald-500"
                      : "bg-slate-600"
                  }`}
                >
                  {appliedJob.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedJob;
