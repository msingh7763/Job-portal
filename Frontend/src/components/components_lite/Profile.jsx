import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import {
  Contact,
  Mail,
  Pen,
  Building2,
  Globe,
  MapPin,
} from "lucide-react";
import { useSelector } from "react-redux";
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";
import useGetAppliedJobs from "../../hooks/useGetAllAppliedJobs.jsx";
import api from "@/utils/api";

const getResumeLinks = (url) => {
  if (!url) return { viewUrl: "", downloadUrl: "" };

  let normalizedUrl = String(url).trim();
  if (normalizedUrl.includes("/image/upload/")) {
    normalizedUrl = normalizedUrl.replace("/image/upload/", "/raw/upload/");
  }

  const parts = normalizedUrl.split("?");
  const baseUrl = parts[0];
  const query = parts[1] ? `?${parts[1]}` : "";
  const hasExtension = /\.[a-z0-9]+$/i.test(baseUrl);
  const withExtension =
    !hasExtension && baseUrl.includes("/job-portal/resumes/")
      ? `${baseUrl}.pdf`
      : baseUrl;

  const viewUrl = `${withExtension}${query}`;
  const downloadUrl = viewUrl.includes("/raw/upload/")
    ? viewUrl
    : viewUrl.includes("/upload/")
      ? viewUrl.replace("/upload/", "/upload/fl_attachment/")
      : viewUrl;

  return { viewUrl, downloadUrl };
};

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs, allJobs } = useSelector((store) => store.job);

  const isRecruiter = user?.role === "Recruiter";

  const recruiterJobsCount = useMemo(() => {
    if (!isRecruiter || !allJobs) return 0;
    return allJobs.filter((job) => job.created_by === user?._id).length;
  }, [allJobs, isRecruiter, user?._id]);

  useGetAppliedJobs();

  useEffect(() => {
    if (isRecruiter) {
      api
        .get("/api/company/get")
        .then((res) => {
          if (res.data?.success) setCompanies(res.data.companies || []);
        })
        .catch((err) => {
          console.error("Failed to fetch recruiter companies", err);
        });
    }
  }, [isRecruiter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-6 px-4">
        {/* Profile Card */}
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            
            {/* LEFT SECTION */}
            <div className="flex gap-4 items-center md:flex-col md:items-start">
              <div className="relative">
                <img
                  src={user?.profile?.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="h-24 w-24 rounded-2xl object-cover ring-2 ring-purple-500 shadow-lg"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white">
                  {user?.fullname}
                </h1>

                <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
                  {user?.role || "Candidate"}
                </span>

                <p className="mt-3 text-sm text-slate-400 max-w-sm">
                  {user?.profile?.bio ||
                    (user?.role === "Recruiter"
                      ? "Add a short bio so candidates can understand your background."
                      : "Add a short bio so recruiters can understand your background.")}
                </p>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex-1 space-y-6">
              
              {/* CONTACT + EDIT */}
              <div className="flex justify-between items-start">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail size={16} className="text-purple-400" />
                    <a
                      href={`mailto:${user?.email}`}
                      className="hover:text-purple-300"
                    >
                      {user?.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Contact size={16} className="text-purple-400" />
                    <span>{user?.phoneNumber || "Add phone number"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm hover:scale-105 transition"
                >
                  <Pen size={14} />
                  Edit
                </button>
              </div>

              {/* STATS */}
              {!isRecruiter && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:scale-105 transition">
                    <p className="text-xs text-slate-400">Applied</p>
                    <h2 className="text-xl font-bold text-white">
                      {allAppliedJobs?.length || 0}
                    </h2>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:scale-105 transition">
                    <p className="text-xs text-slate-400">Saved</p>
                    <h2 className="text-xl font-bold text-white">
                      {user?.savedJobs?.length || 0}
                    </h2>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:scale-105 transition">
                    <p className="text-xs text-slate-400">Resume</p>
                    <h2 className="text-xl font-bold text-white">
                      {user?.profile?.resume ? "Yes" : "No"}
                    </h2>
                  </div>
                </div>
              )}

              {/* COMPANY SECTION */}
              {isRecruiter && (
                <div>
                  <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Building2 size={18} /> Companies
                  </h2>

                  {companies.length === 0 ? (
                    <div className="text-sm text-slate-400 bg-white/5 p-4 rounded-xl border border-white/10">
                      No companies added yet.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {companies.map((company) => (
                        <div
                          key={company._id}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 transition"
                        >
                          <h3 className="text-white font-semibold flex items-center gap-2">
                            <Building2 size={16} /> {company.name}
                          </h3>

                          <p className="text-sm text-slate-400 mt-1">
                            {company.description || "No description available"}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />{" "}
                              {company.location || "Not defined"}
                            </span>

                            <span className="flex items-center gap-1">
                              <Globe size={14} />{" "}
                              {company.website || "Not defined"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SKILLS + RESUME */}
              {!isRecruiter && (
                <div className="grid sm:grid-cols-2 gap-6">
                  
                  {/* Skills */}
                  <div>
                    <h2 className="text-white font-semibold mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {user?.profile?.skills?.length > 0 ? (
                        user.profile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/20"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-sm">
                          No skills added yet.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resume */}
                  <div>
                    <h2 className="text-white font-semibold mb-2">Resume</h2>
                    {user?.profile?.resume ? (
                      <div className="flex flex-wrap gap-3 text-sm">
                        <a
                          target="_blank"
                          href={getResumeLinks(user.profile.resume).viewUrl}
                          rel="noreferrer"
                          className="text-purple-400 hover:underline"
                        >
                          View {user.profile.resumeOriginalName || "resume.pdf"}
                        </a>
                        <a
                          target="_blank"
                          href={getResumeLinks(user.profile.resume).downloadUrl}
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">
                        No resume uploaded yet.
                      </span>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* APPLIED JOBS */}
        {!isRecruiter && (
          <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h1 className="text-white font-semibold mb-3">Applied Jobs</h1>
            <AppliedJob />
          </div>
        )}

        {/* MODAL */}
        <EditProfileModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default Profile;