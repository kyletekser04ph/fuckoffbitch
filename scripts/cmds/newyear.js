const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "newyear",
        version: "1.0",
        author: "Kylepogi", // Author credit
        countDown: 5,
        role: 0,
        shortDescription: "New Year Countdown",
        longDescription: "Christmas and New Year Countdown",
        category: "Countdown",
    },
    onStart: async function() {
        console.log("New Year module has started!");
    },
    onChat: async function({ event, message, getLang }) {
        const manilaTime = moment.tz('Asia/Manila');
        const formattedDateTime = manilaTime.format('MMMM D, YYYY h:mm A');

        const currentYear = manilaTime.year();
        const nextNewYear = moment.tz(`January 1, ${currentYear + 1} 00:00:00`, "MMMM D, YYYY h:mm:ss", 'Asia/Manila');
        const now = moment();

        const duration = moment.duration(nextNewYear.diff(now));
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        // Reply with countdown message
        return message.reply({
            body: `🎉✨ 𝗡𝗲𝘄 𝗬𝗲𝗮𝗿 𝗖𝗼𝘂𝗻𝘁𝗱𝗼𝘄𝗻 ✨🎉\n━━━━━━━━━━━━━━━━━━\n🎆 ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining until the New Year!\n📅 Current Date and Time: ${formattedDateTime}\n━━━━━━━━━━━━━━━━━━\n🎇 Let’s welcome the New Year with joy and positivity! 🎇`,
        });
    }
};
