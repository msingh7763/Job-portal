/**
 * Helper utility to filter jobs by combining a text search query and multiple structured filters.
 *
 * @param {Array} jobs - The full array of job objects
 * @param {String} searchedQuery - A generic string searched from the navbar
 * @param {Object} searchedFilters - Structured filters e.g. { Location: "", Technology: "", Experience: "", Salary: "" }
 * @returns {Array} - The filtered jobs
 */
export const filterJobsLogic = (jobs, searchedQuery, searchedFilters) => {
  if (!jobs || jobs.length === 0) return [];

  let filtered = [...jobs];

  // 1. Apply generic text search (from navbar/home)
  if (searchedQuery && searchedQuery.trim() !== "") {
    const query = searchedQuery.toLowerCase();
    filtered = filtered.filter((job) => {
      return (
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.experience?.toLowerCase().includes(query) ||
        job.salary?.toLowerCase().includes(query)
      );
    });
  }

  // 2. Apply structured multi-category filters (from the sidebar)
  if (searchedFilters) {
    const { Location, Technology, Experience, Salary } = searchedFilters;

    if (Location) {
      filtered = filtered.filter((job) => 
        job.location?.toLowerCase() === Location.toLowerCase() // Exact or strict inclusion
      );
    }

    if (Technology) {
      filtered = filtered.filter((job) => {
        // Search the title, description, or requirements array for the technology
        const tech = Technology.toLowerCase();
        const inTitle = job.title?.toLowerCase().includes(tech);
        const inDesc = job.description?.toLowerCase().includes(tech);
        const inReqs = job.requirements?.some((req) => req.toLowerCase().includes(tech));
        return inTitle || inDesc || inReqs;
      });
    }

    if (Experience) {
      filtered = filtered.filter((job) => 
        job.experience?.toLowerCase() === Experience.toLowerCase()
      );
    }

    if (Salary) {
      // Salary filter uses LPA ranges (e.g. "0-5 LPA", "20+ LPA").
      // Convert both the selected filter and the job's salary into numeric values for comparison.
      const parsedRange = Salary.toString().toLowerCase().replace(/lpa/g, "").trim();
      let min = 0;
      let max = Infinity;

      if (parsedRange.includes("-")) {
        const [minStr, maxStr] = parsedRange.split("-");
        min = parseFloat(minStr) || 0;
        max = parseFloat(maxStr) || Infinity;
      } else if (parsedRange.endsWith("+")) {
        min = parseFloat(parsedRange.slice(0, -1)) || 0;
        max = Infinity;
      } else {
        min = parseFloat(parsedRange) || 0;
        max = min;
      }

      filtered = filtered.filter((job) => {
        const salaryValue = parseFloat(
          String(job.salary || "").replace(/[^0-9.]/g, "")
        );
        if (Number.isNaN(salaryValue)) return false;
        return salaryValue >= min && salaryValue <= max;
      });
    }
  }

  return filtered;
};
