const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

const Transaction = sequelize.define("Transaction", {
  coin: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 6), allowNull: false },
  price_usd: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  type: { type: DataTypes.ENUM("buy", "sell"), allowNull: false },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  userId: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

module.exports = Transaction;