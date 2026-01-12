const express = require("express");
const router = express.Router();
const { Offer, User } = require("../models/index");
const { verifyToken } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const offers = await Offer.findAll({
      where: { status: "open" },
      include: [{
        model: User,
        as: "User",
        attributes: ["username"]
      }],
      order: [["createdAt", "DESC"]]
    });
    res.json(offers);
  } catch (err) {
    console.error("❌ Erreur récupération offres :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des offres" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { coin, amount, price_usd } = req.body;
    const offer = await Offer.create({
      coin,
      amount,
      price_usd,
      sellerId: req.user.id,
      remaining: amount
    });
    res.json(offer);
  } catch (err) {
    console.error("❌ Erreur création offre :", err);
    res.status(500).json({ error: "Erreur lors de la création de l'offre" });
  }
});

module.exports = router;