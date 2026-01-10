require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const { sequelize } = require("./models/index");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const offerRoutes = require("./routes/offerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

/* ➊ SERVIR LES AVATARS */
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/dashboard", dashboardRoutes);


/* SYNC & START */
sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database synced");
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
});