const { sequelize, User } = require("./models/index.js");
const fs = require('fs');

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");

        const users = await User.findAll({
            attributes: ["id", "username", "email", "role"],
        });

        const content = JSON.stringify(users, null, 2);
        fs.writeFileSync('users_clean.json', content, 'utf8');
        console.log("Written to users_clean.json");
        console.log(content);

    } catch (error) {
        console.error("Error checking users:", error.message);
        if (error.original) {
            console.error("Original error:", error.original.message);
        }
    } finally {
        await sequelize.close();
    }
})();
