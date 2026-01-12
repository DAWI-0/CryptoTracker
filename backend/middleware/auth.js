const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  console.log("🔐 verifyToken appelé");
  const token = req.cookies?.token;
  console.log("🍪 token reçu :", token);

  if (!token) {
    console.log("pas de token");
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("token valide, user :", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ token invalide :", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

const { User } = require("../models/index");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Update req.user with fresh data
    req.user = user.toJSON();

    if (user.role !== "admin") {
      console.log(` Access denied. User ${user.id} is ${user.role}, required: admin`);
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (err) {
    console.error("Error in isAdmin middleware:", err);
    res.status(500).json({ error: "Server error checking rights" });
  }
};

module.exports = { verifyToken, isAdmin };