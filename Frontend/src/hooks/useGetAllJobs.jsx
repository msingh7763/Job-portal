import { setAllJobs, appendJobs } from "@/redux/jobSlice";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchedQuery } = useSelector((store) => store.job);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/api/job/get", {
          params: {
            keyword: searchedQuery,
            page,
            limit: 9,
          },
        });
        console.log("API Response:", res.data);
        if (res.data.status) {
          // Append when we are on subsequent pages
          if (page > 1) {
            dispatch(appendJobs(res.data.jobs));
          } else {
            dispatch(setAllJobs(res.data.jobs));
          }
          setTotalPages(res.data.totalPages || 1);
        } else {
          setError("Failed to fetch jobs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [dispatch, searchedQuery, page]);

  return { loading, error, page, setPage, totalPages };
};

export default useGetAllJobs;