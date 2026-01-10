const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const upload = require("../middleware/upload"); // ← upload d’image

/* ================== USER ================== */

// GET /api/user/me → profil connecté
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
});

// PUT /api/user/me → mettre à jour son profil
router.put("/me", verifyToken, async (req, res) => {
  try {
    const { username, email, password, favoriteCoin, facebook, twitter, linkedin, instagram, profile } = req.body;
    const updateData = { username, email, favoriteCoin, facebook, twitter, instagram, linkedin, profile };
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await User.update(updateData, { where: { id: req.user.id } });
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
});

// DELETE /api/user/me → supprimer son compte
router.delete("/me", verifyToken, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.user.id } });
    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression du compte" });
  }
});

/* ================== AVATAR ================== */

// POST /api/user/avatar → uploader une image de profil
router.post("/avatar", verifyToken, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    user.profile = `/avatars/${req.file.filename}`;
    await user.save();

    res.json({ message: "Avatar uploadé", profile: user.profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l’upload de l’avatar" });
  }
});

/* ================== ADMIN ================== */

// GET /api/user → liste tous les users (admin)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

// PUT /api/user/:id → modifier un user (admin)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { username, email, role, favoriteCoin, socialMedia, profile } = req.body;
    const [updated] = await User.update(
      { username, email, role, favoriteCoin, socialMedia, profile },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "User updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l’utilisateur" });
  }
});

// DELETE /api/user/:id → supprimer un user (admin)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression de l’utilisateur" });
  }
});

module.exports = router;