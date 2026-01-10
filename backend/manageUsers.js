// backend/manageUsers.js
const sequelize = require("./models/index.js");
const User = require("./models/User.js");
const bcrypt = require("bcrypt");

(async () => {
  await sequelize.sync();

  console.log("===== Liste des utilisateurs =====");
  const users = await User.findAll({
    attributes: ["id", "username", "email", "role", "socialMedia"],
  });
  console.table(users.map(u => u.toJSON()));

  // Exemple : modifier un utilisateur
  const userIdToUpdate = 1; // <- ID de l'utilisateur
  const newRole = "admin";  // <- rôle à changer
  const newPassword = "newpass123"; // <- mot de passe si tu veux changer
  const newSocialMedia = { insta: "newInsta", linkedin: "newLink" }; // <- social media

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.update(
    { role: newRole, password: hashedPassword, socialMedia: newSocialMedia },
    { where: { id: userIdToUpdate } }
  );

  console.log(`\n===== Utilisateur ID ${userIdToUpdate} mis à jour =====`);
  const updatedUser = await User.findByPk(userIdToUpdate);
  console.table([updatedUser.toJSON()]);

  process.exit();
})();
