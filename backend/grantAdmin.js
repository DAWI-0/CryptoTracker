const { sequelize, User } = require("./models/index.js");

(async () => {
    const userId = process.argv[2];
    if (!userId) {
        console.error("Usage: node grantAdmin.js <userId>");
        process.exit(1);
    }

    try {
        await sequelize.authenticate();
        console.log(`Database connected. Checking User ID: ${userId}`);

        const user = await User.findByPk(userId);
        if (!user) {
            console.error("User not found!");
            process.exit(1);
        }

        console.log(`Current Role for ${user.username}: ${user.role}`);

        if (user.role === 'admin') {
            console.log("User is already admin.");
        } else {
            user.role = 'admin';
            await user.save();
            console.log(`✅ successfully upgraded ${user.username} (ID: ${user.id}) to ADMIN.`);
        }

    } catch (error) {
        console.error("Error granting admin:", error);
    } finally {
        await sequelize.close();
    }
})();
