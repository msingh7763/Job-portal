import React, { useState } from "react";
import Navbar from "../components_lite/Navbar";
import api from "@/utils/api";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/users/forgot-password", {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message);
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
            Forgot Password
          </h2>

          <p className="text-gray-400 text-sm mb-4 text-center">
            Enter your email to reset password
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 mb-4"
          />

          <button
            type="submit"
            className="w-full py-2 bg-orange-600 rounded hover:bg-orange-500"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;