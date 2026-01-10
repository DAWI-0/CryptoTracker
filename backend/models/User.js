const { DataTypes } = require("sequelize");
const { sequelize } = require("./index"); // ← Importer depuis index.js

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user"
  },
  favoriteCoin: {
    type: DataTypes.STRING,
    defaultValue: "BTC"
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = User;