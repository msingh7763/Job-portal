import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  allJobs: [],
  allAdminJobs: [], // This will hold
  singleJob: null, // This will hold the job details when a user clicks on a job
  searchJobByText: "",
  allAppliedJobs: [], // This will hold
  searchedQuery: "",
  searchedFilters: {
    Location: "",
    Technology: "",
    Experience: "",
    Salary: "",
  },
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setAllJobs(state, action) {
      state.allJobs = action.payload; // Update state with fetched jobs
    },
    appendJobs(state, action) {
      state.allJobs = [...state.allJobs, ...action.payload]; // Concat new jobs for pagination
    },
    setSingleJob(state, action) {
      state.singleJob = action.payload; // Update state with fetched job details
    },
    setAllAdminJobs(state, action) {
      state.allAdminJobs = action.payload; // Update state with fetched admin jobs
    },
    setSearchJobByText(state, action) {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs(state, action) {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery(state, action) {
      state.searchedQuery = action.payload;
    },
    setSearchedFilters(state, action) {
      state.searchedFilters = action.payload;
    },
  },
});

export const {
  setAllJobs,
  appendJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setSearchedFilters,
} = jobSlice.actions;
export default jobSlice.reducer;