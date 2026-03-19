import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import HomeFeatures from "./HomeFeatures";
import Categories from "./Categories";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "../../hooks/useGetAllJobs";

const Home = () => {
  const { loading } = useGetAllJobs();

  return (
    <div className="page-shell">
      <Navbar />
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <Header />
          <HomeFeatures />
          <section className="space-y-6">
            <Categories />
            <LatestJobs loading={loading} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
