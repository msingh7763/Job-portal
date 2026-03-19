import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import api from "@/utils/api";
import { setUser } from "@/redux/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await api.post("/api/users/logout");
      if (res && res.data && res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      } else {
        console.error("Error logging out:", res.data);
        toast.error(res.data?.message || "Logout failed");
      }
    } catch (error) {
      console.error("Axios error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div className="bg-slate-950/80 backdrop-blur border-b border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-sm font-bold">
            JP
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-100">
            Job<span className="text-indigo-500">Portal</span>
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg border border-slate-700 bg-slate-900/70 hover:bg-slate-800"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-5 bg-white mb-1"></span>
          <span className="block h-0.5 w-5 bg-white mb-1"></span>
          <span className="block h-0.5 w-5 bg-white"></span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex font-medium items-center gap-6 text-sm">
          {/** Use NavLink so active page is highlighted */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-indigo-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              Home
            </NavLink>
          </li>

          {user?.role === "Recruiter" ? (
            <>
              <li className="ml-4 text-xs uppercase tracking-wide text-slate-400">
                Recruiter
              </li>
              <li>
                <NavLink
                  to="/admin/companies"
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-indigo-400 font-semibold"
                        : "text-slate-200 hover:text-white"
                    }`
                  }
                >
                  My companies
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/jobs"
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-indigo-400 font-semibold"
                        : "text-slate-200 hover:text-white"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/jobs"
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-indigo-400 font-semibold"
                        : "text-slate-200 hover:text-white"
                    }`
                  }
                >
                  Jobs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/browse"
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-indigo-400 font-semibold"
                        : "text-slate-200 hover:text-white"
                    }`
                  }
                >
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/saved"
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-indigo-400 font-semibold"
                        : "text-slate-200 hover:text-white"
                    }`
                  }
                >
                  Saved
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/applications"
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-indigo-400 font-semibold"
                        : "text-slate-200 hover:text-white"
                    }`
                  }
                >
                  Applications
                </NavLink>
              </li>
            </>
          )}


        </ul>

        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login">
                <button className="btn-secondary">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="btn-primary">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={logoutHandler}
                className="btn-secondary px-3 py-1.5 text-sm font-medium"
                title="Logout"
              >
                Logout
              </button>
              <div className="relative" ref={menuRef}>
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

              {open && (
                <div className="absolute right-0 mt-3 w-60 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl p-4 z-50">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={user?.profile?.profilePhoto || "/default-avatar.png"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-slate-600"
                    />
                    <div>
                      <h3 className="font-semibold text-white">
                        {user?.fullname || "User"}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {user?.profile?.bio || "Web enthusiast"}
                      </p>
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-700 my-2" />

                  <Link
                  to="/profile"
                    className="flex items-center gap-2 text-slate-300 hover:text-purple-300 py-2"
                    onClick={() => setOpen(false)}
                  >
                    <User2 className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 py-2 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-3 space-y-3">
          <ul className="flex flex-col gap-2">
            {user && user.role === "Recruiter" ? (
              <>
              <li>
                <NavLink
                  to="/admin/companies"
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-indigo-600/10 text-indigo-300"
                        : "text-slate-100 hover:bg-slate-800"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My companies
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/jobs"
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-indigo-600/10 text-indigo-300"
                        : "text-slate-100 hover:bg-slate-800"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recruiter dashboard
                </NavLink>
              </li>
            </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-indigo-600/10 text-indigo-300"
                          : "text-slate-200 hover:bg-slate-800"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/jobs"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-indigo-600/10 text-indigo-300"
                          : "text-slate-200 hover:bg-slate-800"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/browse"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-indigo-600/10 text-indigo-300"
                          : "text-slate-200 hover:bg-slate-800"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Categories
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/saved"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-indigo-600/10 text-indigo-300"
                          : "text-slate-200 hover:bg-slate-800"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Saved
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/applications"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-indigo-600/10 text-indigo-300"
                          : "text-slate-200 hover:bg-slate-800"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Applications
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="flex-1 rounded-lg border border-indigo-100 text-center px-3 py-2 text-indigo-600 hover:bg-indigo-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 text-center px-3 py-2 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                logoutHandler();
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-lg bg-red-500 text-white px-3 py-2 text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
