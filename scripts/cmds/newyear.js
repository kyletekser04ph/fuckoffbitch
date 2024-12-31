const moment = require("moment-timezone");

// Object to store the "on" or "off" status for each thread
const threadStatus = {};

module.exports = {
    config: {
        name: "newyear",
        version: "1.2",
        author: "Kylepogi",
        countDown: 5,
        role: 2,
        shortDescription: "New Year Countdown",
        longDescription: "Christmas and New Year Countdown",
        category: "Countdown",
    },
    onStart: async function({ threads }) {
        console.log("New Year module has started!");
        
        // Notify all threads that the module is active and set default status to "on"
        for (const thread of threads) {
            const threadID = thread.threadID;
            threadStatus[threadID] = true; // Default to "on"
            thread.send({
                body: `🎉✨ 𝗡𝗲𝘄 𝗬𝗲𝗮𝗿 𝗠𝗼𝗱𝘂𝗹𝗲 𝗛𝗮𝘀 𝗦𝘁𝗮𝗿𝘁𝗲𝗱 ✨🎉\nThe countdown is currently ON.\nUse "newyear on" or "newyear off" to toggle the countdown.`
            }, threadID);
        }
    },
    onChat: async function({ event, message }) {
        const threadID = event.threadID;
        const body = event.body.trim().toLowerCase();

        // Handle "newyear on" command
        if (body === "newyear on") {
            threadStatus[threadID] = true; // Turn the countdown "on"
            return message.reply({
                body: "🎉✨ The New Year Countdown is now ON!"
            });
        }

        // Handle "newyear off" command
        if (body === "newyear off") {
            threadStatus[threadID] = false; // Turn the countdown "off"
            return message.reply({
                body: "🎉✨ The New Year Countdown is now OFF!"
            });
        }

        // Check if the countdown is enabled for this thread
        if (!threadStatus[threadID]) return;

        // Proceed with the countdown if it's enabled
        const manilaTime = moment.tz('Asia/Manila');
        const formattedDateTime = manilaTime.format('MMMM D, YYYY h:mm A');

        const currentYear = manilaTime.year();
        const nextNewYear = moment.tz(`January 1, ${currentYear + 1} 00:00:00`, "MMMM D, YYYY h:mm:ss", 'Asia/Manila');
        const now = moment();

        if (now.isAfter(nextNewYear)) {
            return message.reply({
                body: "🎉 Happy New Year! 🎉 Welcome to the new beginning. 🥳"
            });
        }

        const duration = moment.duration(nextNewYear.diff(now));
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        // Reply with the countdown message
        return message.reply({
            body: `🎉✨ 𝗡𝗲𝘄 𝗬𝗲𝗮𝗿 𝗖𝗼𝘂𝗻𝘁𝗱𝗼𝘄𝗻 ✨🎉\n━━━━━━━━━━━━━━━━━━\n🎆 ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining until the New Year!\n📅 Current Date and Time: ${formattedDateTime}\n━━━━━━━━━━━━━━━━━━\n🎇 Let’s welcome the New Year with joy and positivity! 🎇`,
        });
    }
};

