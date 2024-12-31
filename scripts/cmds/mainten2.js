module.exports = {
    config: {
        name: "mainten2",
        version: "1.0",
        author: "Kylepogi", // Author info, avoid changing unless necessary.
        countDown: 5,
        role: 0,
        shortDescription: "Maintenance commands for the bot",
        longDescription: "Enable or disable maintenance mode for all commands.",
        category: "maintaining",
    },
    onStart: async function () {
        // Initialize maintenance mode (default: disabled)
        global.isMaintenance = false; // Use global variable for shared state
        return message.reply("Bot initialized. Maintenance mode is off.");
    },
    onChat: async function ({ event, message, commandArgs }) {
        const allowedAdminUID = '61565022752745'; // Replace with the actual admin UID

        // Handle maintenance state toggle
        if (commandArgs[0] === 'maintenance') {
            if (event.senderID === allowedAdminUID) {
                if (commandArgs[1] === 'on') {
                    global.isMaintenance = true;
                    return message.reply("✅ Maintenance mode has been enabled.");
                } else if (commandArgs[1] === 'off') {
                    global.isMaintenance = false;
                    return message.reply("✅ Maintenance mode has been disabled.");
                } else {
                    return message.reply("❌ Invalid maintenance command. Use 'on' or 'off'.");
                }
            } else {
                return message.reply("⛔ You do not have permission to toggle maintenance mode.");
            }
        }

        // Check if bot is in maintenance mode
        if (global.isMaintenance) {
            return message.reply(
                "⛔ The bot is currently under maintenance. Please try again later.\n" +
                "Contact my owner: https://www.facebook.com/kylepogiv20"
            );
        }

        // Handle general chat commands
        if (message.text.toLowerCase() === 'hello') {
            return message.reply("Hello, how can I assist you?");
        }

        // Default response for unrecognized commands
        return message.reply("I didn't understand that command. Please try again.");
    },
};
