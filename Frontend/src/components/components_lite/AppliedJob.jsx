import React from "react";
import { useSelector } from "react-redux";

const AppliedJob = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  if (!allAppliedJobs || allAppliedJobs.length === 0) {
    return <p className="text-gray-500">You have not applied to any job yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg">
        <caption className="text-left text-lg font-bold mb-2 p-2">
          Recent Applied Jobs
        </caption>
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Job Title</th>
            <th className="px-4 py-2 border-b">Company</th>
            <th className="px-4 py-2 border-b text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {allAppliedJobs.map((appliedJob) => (
            <tr key={appliedJob._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">
                {appliedJob?.createdAt?.split("T")[0]}
              </td>
              <td className="px-4 py-2 border-b">{appliedJob.job?.title}</td>
              <td className="px-4 py-2 border-b">{appliedJob.job?.company?.name}</td>
              <td className="px-4 py-2 border-b text-right">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${appliedJob.status === "rejected"
                      ? "bg-red-500"
                      : appliedJob.status === "accepted"
                        ? "bg-green-600"
                        : "bg-gray-500"
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
