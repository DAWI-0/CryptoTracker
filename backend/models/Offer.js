const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const Offer = sequelize.define("Offer", {
  coin: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
  price_usd: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  type: { type: DataTypes.ENUM("sell"), defaultValue: "sell" },
  sellerId: { type: DataTypes.INTEGER, allowNull: false },
  remaining: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
  status: { type: DataTypes.ENUM("open", "closed"), defaultValue: "open" }
}, { timestamps: true });

module.exports = Offer;