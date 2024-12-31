module.exports = {
    config: {
        name: "antibot",
        version: "1.0",
        author: "Kylepogi", // Original author, please keep credit intact.
        countDown: 5,
        role: 0,
        shortDescription: "Antibot and report to suspend other bots",
        longDescription: "Antibot functionality for group chats",
        category: "antibot",
    },

    onStart: async function() {
        console.log('Antibot module has started.');
    },

    onChat: async function({ event, message, getLang, bot }) {
        const { senderID, threadID, body } = event;
        const knownBots = ['bot_id_1', 'bot_id_2']; // Example of known bot IDs (you can dynamically detect bots or add more)

        // Bot detection based on sender ID (known bot IDs)
        if (knownBots.includes(senderID)) {
            // If the sender is a bot, report and remove from the group
            await message.reply("Bot detected and will be removed.");
            await bot.removeUserFromThread(senderID, threadID); // Remove bot from the group chat
        }

        // Optional: Detect new bots based on message patterns or specific behavior
        // Example: If the message contains a certain pattern, treat it as a bot
        const botPatterns = [
            /bot/i, // Detects if the message contains the word "bot"
            /spam/i, // Detects messages with the word "spam"
        ];

        // Check for message patterns
        if (botPatterns.some(pattern => pattern.test(body))) {
            // If the message matches bot behavior, report and remove user
            await message.reply("Potential bot detected due to suspicious behavior.");
            await bot.removeUserFromThread(senderID, threadID);
        }

        // Add more advanced bot detection techniques here, like checking for:
        // - Message frequency
        // - Automated patterns (e.g., URLs, repeated messages, etc.)
    }
};
