module.exports = {
    config: {
        name: "maintenance",
        version: "1.0",
        author: "Kylepogi", // Author info, avoid changing unless necessary.
        countDown: 5,
        role: 0,
        shortDescription: "Maintenance commands for the bot",
        longDescription: "Enable or disable maintenance mode for all commands.",
        category: "maintaining",
    },
    onStart: async function () {
        // Initialize maintenance mode
        console.log("Bot is in maintenance mode.");
    },
    onChat: async function ({ event, message, getLang, commandArgs }) {
        const isMaintenance = false; // Update with your actual logic for maintenance checking
        const allowedAdminUID = '61565022752745';

        if (isMaintenance) {
            return message.reply("⛔𝙰𝚌𝚌𝚎𝚜𝚜 𝙳𝚎𝚗𝚒𝚎𝚍.\nThe bot is currently under maintenance. Please try again later.\n𝚌𝚘𝚗𝚝𝚊𝚌𝚝 𝚖𝚢 𝚘𝚠𝚗𝚎𝚛: https://www.facebook.com/kylepogiv20");
        }

        // Command to turn maintenance mode on/off
        if (commandArgs[0] === 'maintenance') {
            if (commandArgs[1] === 'on') {
                if (event.senderID === allowedAdminUID) {
                    // Logic to enable maintenance
                    return message.reply("Maintenance mode has been enabled.");
                } else {
                    return message.reply("You do not have permission to enable maintenance mode.");
                }
            } else if (commandArgs[1] === 'off') {
                if (event.senderID === allowedAdminUID) {
                    // Logic to disable maintenance
                    return message.reply("Maintenance mode has been disabled.");
                } else {
                    return message.reply("You do not have permission to disable maintenance mode.");
                }
            }
        }

        // Handle chat when the bot is not in maintenance mode
        if (message.text.toLowerCase() === 'hello') {
            return message.reply("Hello, how can I assist you?");
        }
    },
};
