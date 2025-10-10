import React from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";

const Job1 = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <button className="border border-gray-300 p-2 rounded-full hover:bg-gray-100">
          <Bookmark />
        </button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 my-2">
        <div className="w-12 h-12 border border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
          <img
            src={job?.company?.logo}
            alt={job?.company?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="font-bold text-lg my-2">{job.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mt-4">
        <span className="px-2 py-1 border border-blue-700 text-blue-700 font-bold rounded-full">
          {job.position} Positions
        </span>
        <span className="px-2 py-1 border border-[#F83002] text-[#F83002] font-bold rounded-full">
          {job.jobType}
        </span>
        <span className="px-2 py-1 border border-[#7209b7] text-[#7209b7] font-bold rounded-full">
          {job.salary} LPA
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => navigate(`/description/${job._id}`)}
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
        >
          Details
        </button>
        <button className="px-4 py-2 bg-[#7209b7] text-white rounded hover:bg-purple-800">
          Save For Later
        </button>
      </div>
    </div>
  );
};

export default Job1;
