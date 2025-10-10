import React from "react";
import { useNavigate } from "react-router-dom";

const JobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-md shadow-xl bg-white border border-gray-200 cursor-pointer hover:shadow-2xl hover:shadow-blue-200 hover:p-3 transition-all"
    >
      {/* Company & Location */}
      <div>
        <h1 className="text-lg font-medium">{job.company.name}</h1>
        <p className="text-sm text-gray-600">India</p>
      </div>

      {/* Job Title & Description */}
      <div>
        <h2 className="font-bold text-lg my-2">{job.title}</h2>
        <p className="text-sm text-gray-600">{job.description}</p>
      </div>

      {/* Badges */}
      <div className="flex gap-2 items-center mt-4 flex-wrap">
        <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
          {job.position} Open Positions
        </div>
        <div className="px-2 py-1 rounded-full bg-orange-100 text-[#FA4F09] font-bold text-xs">
          {job.salary} LPA
        </div>
        <div className="px-2 py-1 rounded-full bg-purple-100 text-[#6B3AC2] font-bold text-xs">
          {job.location}
        </div>
        <div className="px-2 py-1 rounded-full bg-gray-100 text-black font-bold text-xs">
          {job.jobType}
        </div>
      </div>
    </div>
  );
};

export default JobCards;
