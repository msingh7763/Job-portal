import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/utils/api";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import { Loader2, X } from "lucide-react";

const EditProfileModal = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null,
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await api.post("/api/users/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("failed to connect");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-950 via-slate-900 to-slate-800 text-white rounded-2xl w-full max-w-lg p-5 shadow-2xl relative border border-slate-700">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 text-gray-300 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center text-blue-400">
          Edit profile
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Full name"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
            />
            <InputField
              label="Phone"
              name="phoneNumber"
              type="tel"
              value={input.phoneNumber}
              onChange={changeEventHandler}
            />
          </div>

          <InputField
            label="Email"
            name="email"
            type="email"
            value={input.email}
            onChange={changeEventHandler}
          />

          <InputField
            label="Short bio"
            name="bio"
            value={input.bio}
            onChange={changeEventHandler}
            textarea
          />

          {user?.role !== "Recruiter" && (
            <>
              <InputField
                label="Skills (comma separated)"
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
              />

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Resume (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm border border-gray-500 rounded-md bg-gray-800 p-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-semibold flex items-center justify-center text-sm transition duration-200 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-blue-500/40"
            }`}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable input field component
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  textarea = false,
}) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-300">
      {label}
    </label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        className="w-full border border-gray-500 rounded-md bg-gray-800 text-white p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-500 rounded-md bg-gray-800 text-white p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
      />
    )}
  </div>
);

export default EditProfileModal;
