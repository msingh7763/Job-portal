// src/components/authentication/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components_lite/Navbar";
import api from "@/utils/api";
import { toast } from "sonner";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "Student",
    file: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);


    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await api.post("/api/users/register", formData);

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Register error:", error);

      const apiError = error.response?.data;
      const message =
        apiError?.message ||
        apiError?.errors?.map((err) => err.msg).join(", ") ||
        apiError?.errors ||
        "Network or server error";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        >

          {/* Left Illustration */}
          <div className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center p-10">
            <img
              src="https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg"
              alt="Illustration"
              className="rounded-xl shadow-xl object-cover"
            />
          </div>

          {/* Form */}
          <form
            onSubmit={submitHandler}
            className="w-full md:w-1/2 p-8 flex flex-col gap-4 text-white"
          >
            <h1 className="text-3xl font-bold text-center">
              Create Account
            </h1>

            <p className="text-gray-400 text-center text-sm mb-2">
              Sign up to access jobs and opportunities
            </p>

            {/* Profile Preview */}
            <div className="flex flex-col items-center gap-2">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
                  Photo
                </div>
              )}
            </div>

            {/* Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={changeFileHandler}
              className="w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-600 file:text-white
              hover:file:bg-orange-500 cursor-pointer"
            />

            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                placeholder="Muskan Kumari"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="muskan.kumari@gmail.com"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm text-gray-300 mb-1">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Enter password"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                placeholder="+91 1234567890"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Register As
              </label>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Student"
                    checked={input.role === "Student"}
                    onChange={changeEventHandler}
                    className="accent-orange-500"
                  />
                  Student
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Recruiter"
                    checked={input.role === "Recruiter"}
                    onChange={changeEventHandler}
                    className="accent-orange-500"
                  />
                  Recruiter
                </label>
              </div>

            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 mt-3 rounded-lg font-semibold bg-orange-600 hover:bg-orange-500 transition shadow-lg"
            >
              Create Account
            </button>

            {/* Login */}
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-400 font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;