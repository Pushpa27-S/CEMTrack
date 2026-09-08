import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  console.log("Authorization header received:", !!authHeader);

  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token received:", !!token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verification error:", err.name);
      console.log("JWT verification message:", err.message);

      return res.status(403).json({
        success: false,
        message: "Invalid or expired token.",
        errorType: err.name,
      });
    }

    console.log("JWT verified successfully");

    req.user = user;

    next();
  });
};

export default authenticateToken;