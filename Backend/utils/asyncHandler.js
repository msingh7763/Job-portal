/**
 * Wrapper for async route handlers to automatically pass errors to Express Next middleware,
 * removing the need for manual try-catch blocks in controllers.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
