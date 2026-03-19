import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "../../redux/jobSlice";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Cybersecurity Engineer",
  "Product Manager",
  "UX/UI Designer",
  "Graphics Engineer",
  "Graphics Designer",
  "Video Editor",
];

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/Browse");
  };

  return (
    <section className="px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Browse by <span className="text-purple-400">Category</span>
          </h2>
          <p className="text-sm text-slate-400">
            Quickly jump into the roles that match your skills and interests.
          </p>
        </div>

        <div className="card-surface px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 pb-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => searchJobHandler(category)}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-slate-800/80 text-slate-200 hover:bg-purple-600 hover:text-white border border-slate-700/80 hover:border-purple-400 text-xs sm:text-sm font-medium shadow-sm transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;

