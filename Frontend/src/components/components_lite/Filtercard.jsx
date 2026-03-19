import React from "react";
import { RadioGroup } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedFilters } from "@/redux/jobSlice";

const filterData = [
  { filterType: "Location", array: ["Delhi", "Mumbai", "Kolhapur", "Pune", "Bangalore", "Hyderabad", "Chennai", "Remote"] },
  { filterType: "Technology", array: ["Mern", "React", "Data Scientist", "Fullstack", "Node", "Python", "Java", "frontend", "backend", "mobile", "desktop"] },
  { filterType: "Experience", array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"] },
  { filterType: "Salary", array: ["0-5 LPA", "5-10 LPA", "10-20 LPA", "20+ LPA"] },
];

const Filter = () => {
  const dispatch = useDispatch();
  const searchedFilters =
    useSelector((store) => store.job?.searchedFilters) || {
      Location: "",
      Technology: "",
      Experience: "",
      Salary: "",
    };

  const handleSelectionChange = (filterType, value) => {
    dispatch(
      setSearchedFilters({
        ...searchedFilters,
        [filterType]: value,
      })
    );
  };

  const clearFilters = () => {
    dispatch(
      setSearchedFilters({
        Location: "",
        Technology: "",
        Experience: "",
        Salary: "",
      })
    );
  };

  return (
    <div className="w-full card-surface rounded-2xl p-4 text-slate-100">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-bold text-lg">Filter Jobs</h1>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs text-slate-300 hover:text-white hover:underline"
        >
          Clear
        </button>
      </div>
      <hr className="my-3 border-slate-700" />

      {filterData.map((data, index) => (
        <div key={index} className="mb-4">
          <h2 className="font-bold text-sm text-slate-200">{data.filterType}</h2>
          <RadioGroup 
            value={searchedFilters[data.filterType]} 
            onChange={(value) => handleSelectionChange(data.filterType, value)}
          >
            <div className="flex flex-col mt-2">
              {/* Add an "All" option to let users clear the filter for this category */}
              <RadioGroup.Option
                value=""
                className={({ checked }) =>
                  `flex items-center space-x-2 my-1 cursor-pointer px-2 py-1 rounded text-xs sm:text-sm ${
                    checked
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`
                }
              >
                {({ checked }) => (
                  <>
                    <span
                      className={`w-4 h-4 inline-block border rounded-full transition-colors ${
                        checked ? "bg-indigo-500 border-indigo-500" : "border-slate-400"
                        }`}
                    />
                    <span>All</span>
                  </>
                )}
              </RadioGroup.Option>

              {data.array.map((item, indx) => (
                <RadioGroup.Option
                  key={indx}
                  value={item}
                  className={({ checked }) =>
                    `flex items-center space-x-2 my-1 cursor-pointer px-2 py-1 rounded text-xs sm:text-sm transition-colors ${
                      checked
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`
                  }
                >
                  {({ checked }) => (
                    <>
                      <span
                        className={`w-4 h-4 inline-block border rounded-full transition-colors ${
                          checked ? "bg-indigo-500 border-indigo-500" : "border-slate-400"
                          }`}
                      />
                      <span>{item}</span>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default Filter;
