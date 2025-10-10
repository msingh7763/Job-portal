import React, { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
  { filterType: "Location", array: ["Delhi", "Mumbai", "Kolhapur", "Pune", "Bangalore", "Hyderabad", "Chennai", "Remote"] },
  { filterType: "Technology", array: ["Mern", "React", "Data Scientist", "Fullstack", "Node", "Python", "Java", "frontend", "backend", "mobile", "desktop"] },
  { filterType: "Experience", array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"] },
  { filterType: "Salary", array: ["0-50k", "50k-100k", "100k-200k", "200k+"] },
];

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  return (
    <div className="w-full bg-white rounded-md p-4">
      <h1 className="font-bold text-lg mb-2">Filter Jobs</h1>
      <hr className="mb-3" />

      {filterData.map((data, index) => (
        <div key={index} className="mb-4">
          <h2 className="font-bold">{data.filterType}</h2>
          <RadioGroup value={selectedValue} onChange={setSelectedValue}>
            <div className="flex flex-col mt-2">
              {data.array.map((item, indx) => (
                <RadioGroup.Option
                  key={indx}
                  value={item}
                  className={({ checked }) =>
                    `flex items-center space-x-2 my-1 cursor-pointer px-2 py-1 rounded ${checked ? "bg-purple-600 text-white" : "bg-gray-100"
                    }`
                  }
                >
                  {({ checked }) => (
                    <>
                      <span
                        className={`w-4 h-4 inline-block border rounded-full ${checked ? "bg-white border-white" : "border-gray-400"
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
