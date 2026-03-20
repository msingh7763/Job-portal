import React, { useEffect, useMemo, useState } from "react";
import api from "@/utils/api";
import Navbar from "./Navbar";
import JobSkeleton from "./JobSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { setAllJobs } from "../../redux/jobSlice";
import { toast } from "sonner";
import { formatSalary } from "@/utils/formatSalary";

const statusStyles = {
  applied: "bg-indigo-600 text-white",
  viewed: "bg-sky-600 text-white",
  shortlisted: "bg-amber-500 text-white",
  interview: "bg-emerald-500 text-white",
  hired: "bg-emerald-600 text-white",
  rejected: "bg-rose-600 text-white",
};

const getResumeUrl = (url) => {
  if (!url) return "";
  if (/\.pdf(\?|$)/i.test(url) && url.includes("/image/upload/")) {
    return url.replace("/image/upload/", "/raw/upload/");
  }
  return url;
};

const initialForm = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  location: "",
  jobType: "",
  experience: "",
  position: "1",
  companyId: "",
};

const RecruiterJobs = () => {
  const { user } = useSelector((store) => store.auth);
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(initialForm);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  // Recruiter view state for applicants modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState({});

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/job/getadminjobs");

      if (res.data?.status) {
        setJobs(res.data.jobs || []);
        setError("");
      } else {
        setError(res.data?.message || "Unable to load jobs");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const closeApplicantsModal = () => {
    setSelectedJob(null);
    setApplicants([]);
    setApplicantsError("");
  };

  const fetchApplicants = async (jobId) => {
    if (!jobId) return;

    setApplicantsLoading(true);
    setApplicantsError("");

    try {
      const res = await api.get(`/api/application/${jobId}/applicants`);
      if (res.data?.success) {
        setApplicants(res.data.job?.applications || []);
      } else {
        setApplicantsError(res.data?.message || "Failed to load applicants.");
      }
    } catch (err) {
      console.error(err);
      setApplicantsError("Failed to load applicants.");
    } finally {
      setApplicantsLoading(false);
    }
  };

  const openApplicantsModal = async (job) => {
    setSelectedJob(job);
    await fetchApplicants(job._id);
  };

  const updateApplicantStatus = async (applicationId, status) => {
    if (!applicationId || !status) return;

    setStatusUpdating((prev) => ({ ...prev, [applicationId]: true }));
    try {
      const res = await api.post(`/api/application/status/${applicationId}/update`, {
        status,
      });

      if (res.data?.success) {
        await fetchApplicants(selectedJob?._id);
      } else {
        toast.error(res.data?.message || "Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/company/get");
      if (res.data?.success) {
        setCompanies(res.data.companies || []);
        if (res.data.companies?.length) {
          const firstCompanyId = res.data.companies[0]._id;
          setForm((prev) => ({
            ...prev,
            companyId: prev.companyId || firstCompanyId,
            position: prev.position || "1",
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching companies", err);
      setError("Failed to load companies.");
    }
  };

  useEffect(() => {
    if (user?.role === "Recruiter") {
      fetchJobs();
      fetchCompanies();
    } else {
      setLoading(false);
    }
  }, [user]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return jobs;

    return jobs.filter((job) => {
      const title = String(job.title || "").toLowerCase();
      const company = String(job.company?.name || "").toLowerCase();
      const location = String(job.location || "").toLowerCase();
      return title.includes(query) || company.includes(query) || location.includes(query);
    });
  }, [jobs, search]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "companyLogo") {
      const file = files?.[0] || null;
      setCompanyLogo(file);
      setCompanyLogoPreview(file ? URL.createObjectURL(file) : null);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Job title is required.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Job description is required.");
      return;
    }

    if (!form.requirements.trim()) {
      toast.error("Requirements are required.");
      return;
    }

    if (!form.salary.trim()) {
      toast.error("Salary is required.");
      return;
    }

    if (!form.location.trim()) {
      toast.error("Location is required.");
      return;
    }

    if (!form.jobType.trim()) {
      toast.error("Job type is required.");
      return;
    }

    if (!form.experience.trim()) {
      toast.error("Experience is required.");
      return;
    }

    if (!form.position || Number(form.position) < 1) {
      toast.error("Open positions must be at least 1.");
      return;
    }

    if (!form.companyId) {
      toast.error("Please select a company before posting a job.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("requirements", form.requirements);
      formData.append("salary", form.salary);
      formData.append("location", form.location);
      formData.append("jobType", form.jobType);
      formData.append("experience", form.experience);
      formData.append("position", form.position);
      formData.append("companyId", form.companyId);
      if (companyLogo) {
        formData.append("file", companyLogo);
      }

      const res = await api.post("/api/job/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.status) {
        toast.success("Job posted successfully.");
        setForm({
          ...initialForm,
          companyId: companies[0]?._id || "",
        });
        setCompanyLogo(null);
        setCompanyLogoPreview(null);

        dispatch(setAllJobs([res.data.job, ...allJobs]));
        await fetchJobs();
      } else {
        toast.error(res.data?.message || "Failed to post job.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-6 pb-10 px-4">
        {/* Header */}
        <header className="mb-6 flex justify-between">
          <h1 className="text-3xl font-bold text-white">
            Recruiter Dashboard
          </h1>

          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 px-4 py-2 rounded text-white"
          >
            {showForm ? "Hide Form" : "Post Job"}
          </button>
        </header>

        {/* Form */}
        {showForm && (
          <div className="card-surface rounded-2xl border border-slate-700 bg-slate-950/70 p-6 shadow-xl shadow-indigo-900/30 mb-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Post a new job</h2>
                <p className="text-sm text-slate-400">Fill in the details and publish the role for candidates to apply.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...initialForm,
                      companyId: companies[0]?._id || "",
                    })
                  }
                  className="rounded-lg border border-indigo-600 bg-indigo-600/10 px-4 py-2 text-sm font-semibold text-indigo-200 transition hover:bg-indigo-600/20"
                >
                  Reset
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-white">Role details</h3>
                  <p className="text-xs text-slate-400 mt-1">Add the main role information that candidates will see first.</p>

                  <div className="mt-5 space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-200">Job title</label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-200">Open positions</label>
                        <input
                          type="number"
                          name="position"
                          min={1}
                          value={form.position}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-200">Experience</label>
                        <input
                          name="experience"
                          value={form.experience}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-200">Location</label>
                        <input
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-200">Salary</label>
                        <input
                          name="salary"
                          value={form.salary}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-200">Job type</label>
                      <select
                        name="jobType"
                        value={form.jobType}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="" disabled>
                          Select job type
                        </option>
                        <option value="Remote">Remote</option>
                        <option value="Onsite">Onsite</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-white">Company & assets</h3>
                  <p className="text-xs text-slate-400 mt-1">Link this job to a company and optionally upload a logo.</p>

                  <div className="mt-5 space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-200">Company</label>
                      <select
                        name="companyId"
                        value={form.companyId}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="" disabled>
                          Select company
                        </option>
                        {companies.map((company) => (
                          <option key={company._id} value={company._id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-200">Company logo (optional)</label>
                      <input
                        type="file"
                        name="companyLogo"
                        accept="image/*"
                        onChange={handleChange}
                        className="input"
                      />
                      {companyLogoPreview && (
                        <img
                          src={companyLogoPreview}
                          alt="Logo preview"
                          className="mt-2 h-20 w-20 rounded-lg object-cover border border-slate-700"
                        />
                      )}
                    </div>
                  </div>
                </section>
              </div>

              <section className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-white">What you’re looking for</h3>
                <p className="text-xs text-slate-400 mt-1">Describe the experience and skills candidates should bring.</p>

                <div className="mt-5 space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-200">Requirements</label>
                    <textarea
                      name="requirements"
                      value={form.requirements}
                      onChange={handleChange}
                      className="input min-h-[120px]"
                    />
                    <p className="text-xs text-slate-500">Comma-separated skills/requirements help applicants know what you need.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-200">Job description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="input min-h-[160px]"
                    />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>
        )}

        {/* Jobs ALWAYS visible */}
        <div className="card-surface p-6">
          <h2 className="text-xl text-white mb-4">Your Jobs</h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-400">No jobs yet</p>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="p-4 border border-gray-700 rounded"
                >
                  <h3 className="text-white font-semibold">
                    {job.title}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {job.location} • {formatSalary(job.salary)}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openApplicantsModal(job)}
                      className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      View applicants
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Applicants for "{selectedJob.title}"
                </h2>
                {selectedJob.company?.name && (
                  <p className="text-xs text-slate-400">{selectedJob.company.name}</p>
                )}
              </div>
              <button
                type="button"
                onClick={closeApplicantsModal}
                className="rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              {applicantsLoading ? (
                <p className="text-slate-400">Loading applicants…</p>
              ) : applicantsError ? (
                <p className="text-rose-300">{applicantsError}</p>
              ) : applicants.length === 0 ? (
                <p className="text-slate-400">No applicants yet.</p>
              ) : (
                <div className="space-y-4">
                  {applicants.map((application) => {
                    const applicant = application.applicant || {};
                    const status = application.status || "applied";
                    const isUpdating = statusUpdating[application._id];

                    return (
                      <div
                        key={application._id}
                        className="rounded-xl border border-slate-700 bg-slate-950/50 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {applicant.fullname || "Unknown candidate"}
                            </p>
                            <p className="text-xs text-slate-400">{applicant.email}</p>
                            <p className="text-xs text-slate-400">
                              Applied: {new Date(application.createdAt).toLocaleDateString()}
                            </p>

                            {(applicant.location || applicant.experience || applicant.profile?.bio || (applicant.profile?.skills?.length > 0)) && (
                              <div className="mt-2 space-y-1 text-xs text-slate-400">
                                {applicant.location && <div>Location: {applicant.location}</div>}
                                {applicant.experience && <div>Experience: {applicant.experience}</div>}
                                {applicant.profile?.bio && <div>Bio: {applicant.profile.bio}</div>}
                                {applicant.profile?.skills?.length > 0 && (
                                  <div>Skills: {applicant.profile.skills.join(", ")}</div>
                                )}
                              </div>
                            )}

                            {(() => {
                              const resumeUrl = getResumeUrl(applicant.profile?.resume || application.resume);
                              const resumeName = applicant.profile?.resumeOriginalName || "Resume";
                              if (!resumeUrl) return null;
                              return (
                                <div className="mt-2">
                                  <a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={resumeName}
                                    className="text-xs font-semibold text-indigo-200 hover:text-indigo-100"
                                  >
                                    View resume
                                  </a>
                                </div>
                              );
                            })()}
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              statusStyles[status] || "bg-slate-700 text-white"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isUpdating || status === "shortlisted"}
                            onClick={() => updateApplicantStatus(application._id, "shortlisted")}
                            className="rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating || status === "interview"}
                            onClick={() => updateApplicantStatus(application._id, "interview")}
                            className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Mark Interview
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating || status === "hired"}
                            onClick={() => updateApplicantStatus(application._id, "hired")}
                            className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Hire
                          </button>

                          <button
                            type="button"
                            disabled={isUpdating || status === "rejected"}
                            onClick={() => updateApplicantStatus(application._id, "rejected")}
                            className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;