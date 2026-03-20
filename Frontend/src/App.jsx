import React from "react";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import ForgotPassword from "./components/authentication/ForgotPassword";
import ProtectedRoute from "./components/authentication/ProtectedRoute";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./components/components_lite/Home";
import PrivacyPolicy from "./components/components_lite/PrivacyPolicy";
import TermsOfService from "./components/components_lite/TermsOfService";
import Jobs from "./components/components_lite/Jobs";
import Browse from "./components/components_lite/Browse";
import Profile from "./components/components_lite/Profile";
import Description from "./components/components_lite/Description";
import RecruiterJobs from "./components/components_lite/RecruiterJobs";
import RecruiterCompanies from "./components/components_lite/RecruiterCompanies";
import SavedJobs from "./components/components_lite/SavedJobs";
import MyApplications from "./components/components_lite/MyApplications";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ForgotPassword />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/description",
    element: <Description />,
  },
  {
    path: "/description/:id",
    element: <Description />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/saved",
    element: (
      <ProtectedRoute>
        <SavedJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/applications",
    element: (
      <ProtectedRoute>
        <MyApplications />
      </ProtectedRoute>
    ),
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <RecruiterCompanies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <RecruiterJobs />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;