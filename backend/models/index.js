const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false 
});

sequelize.authenticate()
  .then(() => console.log("✅ Connecté à SQLite"))
  .catch(err => console.error("❌ Erreur de connexion :", err));


const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "user" },
  favoriteCoin: { type: DataTypes.STRING, defaultValue: "BTC" },
  facebook: { type: DataTypes.STRING, allowNull: true },
  instagram: { type: DataTypes.STRING, allowNull: true },
  twitter: { type: DataTypes.STRING, allowNull: true },
  linkedin: { type: DataTypes.STRING, allowNull: true },
  profile: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });

const Transaction = sequelize.define("Transaction", {
  coin: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
  price_usd: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  type: { type: DataTypes.ENUM("buy", "sell"), allowNull: false },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  userId: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

const Offer = sequelize.define("Offer", {
  coin: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
  price_usd: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  type: { type: DataTypes.ENUM("sell"), defaultValue: "sell" },
  sellerId: { type: DataTypes.INTEGER, allowNull: false },
  remaining: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
  status: { type: DataTypes.ENUM("open", "closed"), defaultValue: "open" }
}, { timestamps: true });

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Offer, { foreignKey: "sellerId" });
Offer.belongsTo(User, { foreignKey: "sellerId", as: "User" });

module.exports = {
  sequelize,
  User,
  Transaction,
  Offer
};