const express = require("express");
const router = express.Router();
const { User, Transaction, Offer } = require("../models/index");
const { verifyToken, isAdmin } = require("../middleware/auth");
const { Op } = require("sequelize"); // Import Op for date filtering

/* ----------  STATS & CHARTS DATA  ---------- */
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    // 1. Basic Counters
    const [userCount, txCount, offerCount] = await Promise.all([
      User.count(),
      Transaction.count(),
      Offer.count()
    ]);

    // 2. Recent Data for Tables
    const recentTx = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      raw: true
    });

    const recentOffers = await Offer.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      raw: true
    });

    // 3. Chart Data (Last 7 Days Activity)
    // We simulate a grouping here. Ideally, use Sequelize.fn('count') with group by date.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const lastWeekTx = await Transaction.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      attributes: ['createdAt']
    });

    // Process data for the Frontend Chart
    const chartMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      chartMap[dateStr] = 0;
    }

    lastWeekTx.forEach(tx => {
      const dateStr = new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      if (chartMap[dateStr] !== undefined) chartMap[dateStr]++;
    });

    const chartData = Object.keys(chartMap).reverse().map(key => ({
      name: key,
      transactions: chartMap[key]
    }));

    res.json({
      stats: { userCount, txCount, offerCount },
      recentTx,
      recentOffers,
      chartData // Sent to frontend
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur chargement dashboard" });
  }
});

module.exports = router;