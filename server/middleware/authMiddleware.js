const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // **Extract Token from Header**
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing." });
  }

  // **Bearer Token Format**
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing." });
  }

  try {
    // **Verify Token**
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
