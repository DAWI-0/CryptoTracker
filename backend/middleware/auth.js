const jwt = require("jsonwebtoken");

// Vérifier token
const verifyToken = (req, res, next) => {
  console.log("🔐 verifyToken appelé");
  const token = req.cookies?.token;
  console.log("🍪 token reçu :", token);

  if (!token) {
    console.log("❌ pas de token");
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ token valide, user :", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ token invalide :", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Vérifier admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

module.exports = { verifyToken, isAdmin };