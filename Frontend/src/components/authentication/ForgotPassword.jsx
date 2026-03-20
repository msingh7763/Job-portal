import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components_lite/Navbar";
import api from "@/utils/api";
import { toast } from "sonner";

const ForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const isResetMode = Boolean(token);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (isResetMode) {
        if (!password || password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        res = await api.post(`/api/users/reset-password/${token}`, {
          password,
        });
      } else {
        res = await api.post("/api/users/forgot-password", {
          email,
        });
      }

      if (res.data.success) {
        toast.success(res.data.message);

        if (isResetMode) {
          navigate("/login");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={submitHandler}
          className="bg-gray-800 p-8 rounded-xl w-[400px] text-white"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isResetMode ? "Reset Password" : "Forgot Password"}
          </h2>

          <p className="text-gray-400 text-sm mb-4 text-center">
            {isResetMode
              ? "Enter your new password"
              : "Enter your email to reset password"}
          </p>

          {isResetMode ? (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-4"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-4"
              />
            </>
          ) : (
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-4"
            />
          )}

          <button
            type="submit"
            className="w-full py-2 bg-orange-600 rounded hover:bg-orange-500"
          >
            {isResetMode ? "Reset Password" : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;