export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.role;

    if (!role) {
      return res
        .status(401)
        .json({ message: "Unauthorized", success: false });
    }

    if (!allowedRoles.includes(role)) {
      return res
        .status(403)
        .json({ message: "Forbidden", success: false });
    }

    next();
  };
};

