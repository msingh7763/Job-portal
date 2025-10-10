import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
//import { setSearchedQuery } from "../../redux/jobSlice";

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
    navigate("/browse");
  };

  return (
    <div className="px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">Categories</h1>
        <p className="text-gray-600">Explore our extensive job market</p>
      </div>

      {/* Scrollable categories row */}
      {/* Scrollable categories row */}
      <div className="w-1/2 mx-auto">
        <div className="flex space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pb-3">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => searchJobHandler(category)}
              className="flex-shrink-0 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-600 hover:text-white transition text-sm font-medium shadow"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Categories;

