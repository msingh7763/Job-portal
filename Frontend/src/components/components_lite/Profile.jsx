import React, { useState } from "react";
import Navbar from "./Navbar";
import { Contact, Mail, Pen } from "lucide-react";
import { useSelector } from "react-redux";
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";

const isResume = true;

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow shadow-gray-400 hover:shadow-yellow-400">
        {/* Top Section */}
        <div className="flex justify-between">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-300 cursor-pointer">
              <img
                src={user?.profile?.profilePhoto}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p>{user?.profile?.bio || "No bio available"}</p>
            </div>
          </div>

          {/* Smaller Edit Button */}
          <button
            onClick={() => setOpen(true)}
            className="flex w-20 h-10 items-center gap-1 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow-md"
          >
            <Pen size={10} /> Edit
          </button>
        </div>

        {/* Contact Info */}
        <div className="my-5 space-y-2">
          <div className="flex items-center gap-3">
            <Mail />
            <a href={`mailto:${user?.email}`} className="text-blue-600 hover:underline">
              {user?.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Contact />
            <a href={`tel:${user?.phoneNumber}`} className="text-blue-600 hover:underline">
              {user?.phoneNumber}
            </a>
          </div>
        </div>

        {/* Skills */}
        <div className="my-5">
          <h1 className="font-bold mb-2">Skills</h1>
          <div className="flex flex-wrap gap-2">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-gray-200 text-gray-800 text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="my-5">
          <label className="text-md font-bold">Resume</label>
          <div className="mt-1">
            {isResume && user?.profile?.resume ? (
              <a
                target="_blank"
                href={user.profile.resume}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Download {user.profile.resumeOriginalName}
              </a>
            ) : (
              <span>No Resume Found</span>
            )}
          </div>
        </div>
      </div>

      {/* Applied Jobs */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl my-5 p-5">
        <h1 className="text-lg my-5 font-bold">Applied Jobs</h1>
        {/* <AppliedJob /> */}
        <p className="text-gray-500">Applied jobs list will go here...</p>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
