const express = require("express");
const router = express.Router();
const { Transaction } = require("../models/index"); // ← CHANGEMENT ICI
const { verifyToken } = require("../middleware/auth");

// GET /api/transactions
router.get("/", verifyToken, async (req, res) => {
  console.log("🎯 Route /api/transactions atteinte");
  console.log("🔍 req.user :", req.user);

  try {
    const txs = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [["date", "DESC"]]
    });
    console.log("✅ transactions trouvées :", txs.length);
    res.json(txs);
  } catch (err) {
    console.error("❌ Erreur DB transactions :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des transactions" });
  }
});

// POST /api/transactions
router.post("/", verifyToken, async (req, res) => {
  try {
    const { coin, amount, price_usd, type } = req.body;
    const tx = await Transaction.create({
      coin,
      amount,
      price_usd,
      type,
      userId: req.user.id
    });
    res.json(tx);
  } catch (err) {
    console.error("❌ Erreur création transaction :", err);
    res.status(500).json({ error: "Erreur lors de la création de la transaction" });
  }
});

module.exports = router;