// one-shot script (ex. migrate.js)
const { User } = require("./models/index");

(async () => {
  await User.update(
    { role: "admin" },
    { where: { email: "n@n.com" } }
  );
  console.log("✅ Rôle mis à jour");
  process.exit(0);
})();