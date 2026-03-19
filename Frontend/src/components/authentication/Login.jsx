// src/components/authentication/Login.jsx
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { setUser } from "../../redux/authSlice";

import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import api from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // ✅ Form Validation
    if (!input.email || !input.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await api.post("/api/users/login", input);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Network or server error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex flex-col">
      <Navbar />

      <div className="flex items-center justify-center flex-1 px-4 py-10">

        {/* Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        >

          {/* Left Side Image */}
          <div className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center p-8">
            <img
              src="https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg"
              alt="Illustration"
              className="rounded-xl shadow-lg object-cover"
            />
          </div>

          {/* Login Form */}
          <form
            onSubmit={submitHandler}
            className="w-full md:w-1/2 p-8 flex flex-col gap-5 text-white"
          >
            <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
            <p className="text-gray-400 text-center text-sm">
              Login to your job portal account
            </p>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                Email
              </label>
              <input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="muskan.kumari@gmail.com"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter password"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {/* Show Hide Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-white"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Forgot Password */}
            <p className="text-right text-sm">
              <a
                href="/forgot-password"
                className="text-orange-500 hover:text-orange-400"
              >
                Forgot password?
              </a>
            </p>

            {/* Role */}
            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                Login As
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-lg font-semibold bg-orange-600 hover:bg-orange-500 transition duration-300 shadow-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register */}
            <p className="text-center text-gray-400 text-sm mt-3">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-orange-500 hover:text-orange-400 font-semibold"
              >
                Register
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;