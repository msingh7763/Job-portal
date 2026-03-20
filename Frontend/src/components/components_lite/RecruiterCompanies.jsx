import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import api from "@/utils/api";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const initialForm = {
  companyName: "",
  logo: null,
};

const RecruiterCompanies = () => {
  const { user } = useSelector((store) => store.auth);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [logoPreview, setLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [editingCompany, setEditingCompany] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", website: "", location: "" });
  const [editLogoPreview, setEditLogoPreview] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/company/get");
      if (res.data?.success) {
        setCompanies(res.data.companies || []);
      } else {
        setError(res.data?.message || "Failed to load companies.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load companies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "Recruiter") {
      fetchCompanies();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      const file = files?.[0] || null;
      setForm((prev) => ({ ...prev, logo: file }));
      setLogoPreview(file ? URL.createObjectURL(file) : null);
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = (company) => {
    setEditingCompany(company);
    setEditForm({
      name: company.name || "",
      description: company.description || "",
      website: company.website || "",
      location: company.location || "",
    });
    setEditLogoPreview(company.logo || null);
  };

  const closeEditModal = () => {
    setEditingCompany(null);
    setEditForm({ name: "", description: "", website: "", location: "" });
    setEditLogoPreview(null);
    setEditSubmitting(false);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      const file = files?.[0] || null;
      setEditForm((prev) => ({ ...prev, logo: file }));
      setEditLogoPreview(file ? URL.createObjectURL(file) : editingCompany?.logo || null);
      return;
    }

    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCompany) return;
    if (!editForm.name.trim()) {
      toast.error("Please enter a company name.");
      return;
    }

    setEditSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", editForm.name.trim());
      formData.append("description", editForm.description || "");
      formData.append("website", editForm.website || "");
      formData.append("location", editForm.location || "");
      if (editForm.logo) {
        formData.append("file", editForm.logo);
      }

      const res = await api.put(`/api/company/update/${editingCompany._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        toast.success("Company updated successfully.");
        fetchCompanies();
        closeEditModal();
      } else {
        toast.error(res.data?.message || "Failed to update company.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update company.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    const confirm = window.confirm("Are you sure you want to delete this company?");
    if (!confirm) return;

    setDeletingId(companyId);
    try {
      const res = await api.delete(`/api/company/delete/${companyId}`);
      if (res.data?.success) {
        toast.success("Company deleted.");
        setCompanies((prev) => prev.filter((c) => c._id !== companyId));
      } else {
        toast.error(res.data?.message || "Failed to delete company.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete company.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim()) {
      toast.error("Please enter a company name.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("companyName", form.companyName.trim());
      if (form.logo) {
        formData.append("file", form.logo);
      }

      const res = await api.post("/api/company/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        toast.success("Company registered successfully.");
        setForm(initialForm);
        setLogoPreview(null);
        fetchCompanies();
      } else {
        toast.error(res.data?.message || "Failed to register company.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to register company.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-6 pb-10 px-4">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
              Your <span className="text-indigo-300">Companies</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Create and manage companies you hire for.</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="text-sm font-semibold text-slate-100">{user?.fullname || ""}</p>
            <p className="text-xs text-slate-300">{user?.email || ""}</p>
          </div>
        </header>

        {!user || user.role !== "Recruiter" ? (
          <div className="card-surface p-6 text-slate-200">
            You need to be logged in as a <span className="font-semibold">Recruiter</span> to view this page.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="card-surface p-4">
                <p className="text-xs text-slate-400">Total companies</p>
                <p className="text-2xl font-bold text-indigo-300">{companies.length}</p>
              </div>
              <div className="card-surface p-4">
                <p className="text-xs text-slate-400">Jobs posted</p>
                <p className="text-2xl font-bold text-indigo-300">{companies.reduce((sum, c) => sum + (c.jobs?.length || 0), 0)}</p>
              </div>
              <div className="card-surface p-4">
                <p className="text-xs text-slate-400">Quick links</p>
                <div className="mt-2 flex flex-col gap-2">
                  <Link
                    to="/admin/jobs"
                    className="rounded-lg bg-indigo-600/20 px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-500/30"
                  >
                    Manage Jobs
                  </Link>
                  <Link
                    to="/"
                    className="rounded-lg bg-slate-700/40 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700/60"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>

            <div className="card-surface p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Add new company</h2>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-slate-200 mb-1">Company name</label>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100"
                    placeholder="e.g. Acme Corp"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-200 mb-1">Logo (optional)</label>
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100"
                  />
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="mt-3 h-20 w-20 rounded-lg object-cover border border-slate-700"
                    />
                  )}
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 transition"
                  >
                    {submitting ? "Adding..." : "Add Company"}
                  </button>
                </div>
              </form>
            </div>

            {editingCompany && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-700 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">Edit company</h3>
                      <p className="text-sm text-slate-400">Update details and logo.</p>
                    </div>
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="text-slate-400 hover:text-white"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit} className="mt-5 grid gap-4">
                    <div>
                      <label className="block text-slate-200 text-sm mb-1">Company name</label>
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full rounded-md bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-200 text-sm mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full rounded-md bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-slate-200 text-sm mb-1">Website</label>
                        <input
                          name="website"
                          value={editForm.website}
                          onChange={handleEditChange}
                          className="w-full rounded-md bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-200 text-sm mb-1">Location</label>
                        <input
                          name="location"
                          value={editForm.location}
                          onChange={handleEditChange}
                          className="w-full rounded-md bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-200 text-sm mb-1">Logo (optional)</label>
                      <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleEditChange}
                        className="w-full rounded-md bg-slate-900/70 border border-slate-700 px-3 py-2 text-slate-100"
                      />
                      {editLogoPreview && (
                        <img
                          src={editLogoPreview}
                          alt="Logo preview"
                          className="mt-3 h-20 w-20 rounded-lg object-cover border border-slate-700"
                        />
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={editSubmitting}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                      >
                        {editSubmitting ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="card-surface p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Your companies</h2>
              {loading ? (
                <p className="text-slate-400">Loading companies...</p>
              ) : error ? (
                <p className="text-rose-300">{error}</p>
              ) : companies.length === 0 ? (
                <p className="text-sm text-slate-400">You don’t have any companies yet. Start by adding one above.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {companies.map((company) => (
                    <div key={company._id} className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={company.logo || "/default-company.svg"}
                          alt={company.name || "Company logo"}
                          onError={(e) => {
                            e.currentTarget.src = "/default-company.svg";
                          }}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-700"
                        />
                        <div>
                          <h3 className="font-semibold text-slate-100">{company.name}</h3>
                          <p className="text-xs text-slate-400">ID: {company._id}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-3">
                        {company.description || "No description yet"}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(company)}
                          className="flex-1 rounded-lg border border-indigo-500 text-indigo-100 px-3 py-2 text-xs hover:bg-indigo-500/20"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCompany(company._id)}
                          disabled={deletingId === company._id}
                          className="flex-1 rounded-lg border border-rose-500 text-rose-200 px-3 py-2 text-xs hover:bg-rose-500/20 disabled:opacity-50"
                        >
                          {deletingId === company._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterCompanies;
