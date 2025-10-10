// src/components/authentication/Login.jsx
import { toast } from "sonner"; // or react-hot-toast
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom"
import { setUser } from "../../redux/authSlice";


import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import { USER_API_ENDPOINT } from "@/utils/data";
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setLoading } from "../../redux/authSlice";


const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "Student", // default role
  });

  // Handle input fields
  const navigate = useNavigate()
  const dispatch = useDispatch();
  // const {loading}=useSelector((store)=>store.auth)

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Submit

  const submitHandler = async (e) => {
    e.preventDefault();


    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: {
          "content-Type": "application/json",

        },
        withCredentials: true,



      });
      if (res.data.success) {
        dispatch(setUser(res.data));
        navigate("/");
        toast.success(res.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Network or server error");


    } finally {
      dispatch(setLoading(false));
    }



  };


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center flex-1 px-4 py-10">
        <div className="flex w-[70%] max-w-3xl h-[70%] bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">

          {/* Left side - illustration */}
          <div className="w-1/2 bg-gray-900 hidden md:flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg"
              alt="Illustration"
              className="w-3/4 h-auto"
            />
          </div>

          {/* Right side - Form */}
          <form
            onSubmit={submitHandler}
            className="w-full md:w-1/2 p-6 flex flex-col gap-4 text-white"
          >
            <h1 className="font-bold text-2xl mb-4 text-center text-gray-100">
              Login
            </h1>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-300">
                Email
              </label>
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

            {/* Role Selection */}
            <div>
              <label className="block mb-2 font-medium text-gray-300">
                Role
              </label>
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
                    className="w-4 h-4 accent-gray-900"
                  />
                  <span className="text-gray-300 font-medium">Recruiter</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 mt-3 rounded-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 shadow-md transition"
            >
              Login
            </button>

            {/* Register Link */}
            <p className="mt-3 text-center text-gray-400 font-medium text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="underline hover:text-gray-200 text-orange-600"
              >
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
