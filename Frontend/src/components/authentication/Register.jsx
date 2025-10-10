// src/components/authentication/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components_lite/Navbar";
import axios from "axios"
import { USER_API_ENDPOINT } from "@/utils/data"
import { toast } from "sonner"

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "Student", // default role
    file: "",
    phoneNumber: "",
  });

  const navigate = useNavigate()
  // Handle input fields
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle file
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  // Submit
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
      // formData.append("file", input.file); // frontend

    }
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "content-Type": "multipart/form-data",

        },
        withCredentials: true,



      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Network or server error");


    }

  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-2 py-3">
        <div className="flex w-300 h-170 max-w-4xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Left side - Image */}
          <div className="w-1/2 bg-gray-900 hidden md:flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg"
              alt="Illustration"
              className="w-3/4 h-auto object-cover rounded-l-2xl"
            />
          </div>

          {/* Right side - Form */}
          <form
            onSubmit={submitHandler}
            className="w-full md:w-1/2 p-6 flex flex-col gap-3 text-white"
          >
            <h1 className="font-bold text-2xl mb-4 text-center text-gray-100">
              Register
            </h1>

            {/* Full Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="Muskan Kumari"
                className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-900/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="muskan.kumari@gmail.com"
                className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-900/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm text-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter password"
                className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-900/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm text-white"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1 font-medium text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="+91 1234567890"
                className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-900/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm text-white"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block mb-2 font-medium text-gray-300">Role</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Student"
                    checked={input.role === "Student"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 accent-gray-900"
                  />
                  <span className="text-gray-300 font-medium">Student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Recruiter"
                    checked={input.role === "Recruiter"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 accent-gray-500"
                  />
                  <span className="text-gray-300 font-medium">Recruiter</span>
                </label>
              </div>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block mb-1 font-medium text-gray-200">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="w-full border border-gray-700 rounded-lg px-4 py-2 cursor-pointer bg-black-900/70 text-gray-100 shadow-sm"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 mt-3 rounded-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 shadow-md transition"
            >
              Register
            </button>

            {/* Login link */}
            <p className="mt-3 text-center text-gray-400 font-medium text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline hover:text-gray-200 text-orange-600"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
