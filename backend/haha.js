const { User } = require("./models/index");

(async () => {
  await User.update(
    { role: "admin" },
    { where: { email: "dawi@gmail.com" } }
  );
  console.log("Rôle mis à jour");
  process.exit(0);
})();