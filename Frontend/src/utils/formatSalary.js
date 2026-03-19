// Utility to display salary values consistently as "X LPA" when possible.
// If the value already contains "LPA" (case-insensitive), it is returned as-is.
// If the value is numeric (or numeric string), it is converted to "<value> LPA".
// Otherwise, it is returned as-is.

export function formatSalary(salary) {
  if (salary === undefined || salary === null) return "-";

  const value = String(salary).trim();
  if (value === "") return "-";

  // If already contains LPA (case-insensitive), return as-is
  if (/\bLPA\b/i.test(value)) {
    return value;
  }

  // If it looks like a number (e.g. 10, "10", "10.5"), append LPA
  const numeric = parseFloat(value.replace(/,/g, ""));
  if (!Number.isNaN(numeric) && /^-?\d+(\.\d+)?$/.test(value)) {
    return `${numeric} LPA`;
  }

  return value;
}
