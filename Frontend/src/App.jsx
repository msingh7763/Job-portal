import React from 'react'
import Navbar from "./components/components_lite/Navbar"
import Login from "./components/authentication/Login"
import Register from "./components/authentication/Register"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/components_lite/Home"
import PrivacyPolicy from './components/components_lite/PrivacyPolicy';
import TermsOfService from './components/components_lite/TermsOfService';
import Jobs from './components/components_lite/Jobs';
import Browse from './components/components_lite/Browse';
import Profile from './components/components_lite/Profile';
import Description from './components/components_lite/Description';
import Creator from './components/components_lite/Creator';


const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />

  },
  {
    path: "/description",
    element: <Description />

  },
  {
    path: "/PrivacyPolicy",
    element: <PrivacyPolicy />
  },
  {
    path: "/TermsOfService",
    element: <TermsOfService />
  },
  {
    path: "/Jobs",
    element: <Jobs />

  },
  {
    path: "/Description/:id",
    element: <Description />

  },
  {
    path: "/Home",
    element: <Home />

  },
  {
    path: "/Browse",
    element: <Browse />

  },
  {
    path: "/admin/companies",
    element: <Home />




  }, {
    path: "/Creator",
    element: <Creator />
  }

]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>

    </div>
  )
}

export default App
