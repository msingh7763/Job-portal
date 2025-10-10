import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      if (res && res.data && res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      } else {
        console.error("Error logging out:", res.data);
      }
    } catch (error) {
      console.error("Axios error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div className="bg-gray-950 text-white shadow-md">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-5">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <span className="text-purple-500">Job</span>{" "}
          <span className="text-orange-400">Portal</span>
        </h1>

        {/* Nav Links */}
        <ul className="flex font-medium items-center gap-6">
          {user && user.role === "Recruiter" ? (
            <>
              <li>
                <Link to="/admin/companies" className="hover:text-purple-400">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/admin/jobs" className="hover:text-purple-400">
                  Jobs
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/Home" className="hover:text-purple-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/Browse" className="hover:text-purple-400">
                  Browse
                </Link>
              </li>
              <li>
                <Link to="/Jobs" className="hover:text-purple-400">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/Creator" className="hover:text-purple-400">
                  About
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Buttons or Avatar */}
        {!user ? (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <button className="border border-purple-400 text-purple-400 px-4 py-1.5 rounded-lg hover:bg-purple-500 hover:text-white transition">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-orange-500 px-4 py-1.5 rounded-lg hover:bg-orange-600 transition">
                Register
              </button>
            </Link>
          </div>
        ) : (
          <div className="relative" ref={menuRef}>
            {/* Avatar Button */}
            <div
              onClick={() => setOpen(!open)}
              className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 hover:scale-105 transition-transform"
            >
              <img
                src={user?.profile?.profilePhoto || "/default-avatar.png"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 mt-3 w-60 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-4 z-50 animate-fadeIn">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user?.profile?.profilePhoto || "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-gray-600"
                  />
                  <div>
                    <h3 className="font-semibold text-white">
                      {user?.fullname || "User"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {user?.profile?.bio || "Web enthusiast"}
                    </p>
                  </div>
                </div>

                <div className="h-[1px] bg-gray-700 my-2"></div>

                {/* Profile Button - Visible for all */}
                <Link
                  to="/Profile"
                  className="flex items-center gap-2 text-gray-300 hover:text-purple-400 py-2 transition"
                  onClick={() => setOpen(false)}
                >
                  <User2 className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300 py-2 w-full text-left transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
