const fs = require('fs');
const path = require('path');
const os = require('os');
const moment = require('moment-timezone');
const cron = require('node-cron');

module.exports = {
  config: {
    name: "autouptime",
    version: "6.9",
    author: "Kylepogi", // don't change the author😠
    countDown: 5,
    role: 0,
    shortDescription: "Auto send uptime",
    longDescription: "Auto send uptime for all threads",
    category: "seen",
  },
  lastSentMinute: null,
  messageSent: false, // Flag to track if a message has been sent

  onLoad: async function ({ api }) {
    const checkForUpdates = async () => {
      cron.schedule('*/6 * * * *', async () => { // Run every hour at minute 0
        try {
          const uptime = process.uptime();
          const startTime = Date.now();
          const hours = Math.floor(uptime / 3600);
          const minutes = Math.floor((uptime % 3600) / 60);
          const seconds = Math.floor(uptime % 60);

          const uptimeString = `${hours} Hr(s) ${minutes} Min(s) ${seconds} Sec(s)`;

          const now = moment().tz('Asia/Manila');
          const serverTime = now.format('DD-MMMM-YYYY || hh:mm:ss A');

          const totalMemory = `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`;
          const operatingSystem = `${os.type()} ${os.release()}`;
          const cpuInfo = `${os.cpus()[0].model} (${os.cpus().length} cores)`;

          const endTime = Date.now();
          const botPing = endTime - startTime;

          const mediaBanStatus = false; // Example, replace as needed
          const mediaBanText = mediaBanStatus ? "❯ Media Banned: Yes 😿" : "❯ Media Banned: No ✅";

          const statusMessage = `𝗔𝗨𝗧𝗢 𝗨𝗣𝗧𝗜𝗠𝗘: 🟢 Bot Has Been Working For
❯ Uptime: ${uptimeString}
❯ Bot Ping: ${botPing} ms
❯ Memory: ${totalMemory}
❯ OS: ${operatingSystem}
❯ CPU: ${cpuInfo}
❯ D/T: ${serverTime}
${mediaBanText}
\n𝗈𝗐𝗇𝖾𝗋: Kylepogi: https://www.facebook.com/kylepogiv20`;

          // Get all thread IDs
          const threadIDs = global.db.allThreadData.map(i => i.threadID);
          threadIDs.forEach(threadID => {
            api.sendMessage(statusMessage, threadID);
          });
        } catch (error) {
          console.error(error);
        }
      });
    };

    checkForUpdates();
  },

  onStart: async function ({ message, event, usersData, threadsData }) {
    try {
      const uptime = process.uptime();
      const startTime = Date.now();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const uptimeString = `${hours} Hr(s) ${minutes} Min(s) ${seconds} Sec(s)`;

      const now = moment().tz('Asia/Manila');
      const serverTime = now.format('DD-MMMM-YYYY || hh:mm:ss A');

      const totalMemory = `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`;
      const operatingSystem = `${os.type()} ${os.release()}`;
      const cpuInfo = `${os.cpus()[0].model} (${os.cpus().length} cores)`;

      const endTime = Date.now();
      const botPing = endTime - startTime;

      const mediaBanStatus = false; // Example, replace as needed
      const mediaBanText = mediaBanStatus ? "❯ Media Banned: Yes 😿" : "❯ Media Banned: No ✅";

      const statusMessage = `𝗔𝗨𝗧𝗢 𝗨𝗣𝗧𝗜𝗠𝗘: 🟢 Bot Has Been Working For
❯ Uptime: ${uptimeString}
❯ Bot Ping: ${botPing} ms
❯ Memory: ${totalMemory}
❯ OS: ${operatingSystem}
❯ CPU: ${cpuInfo}
❯ D/T: ${serverTime}
${mediaBanText}
\n𝗈𝗐𝗇𝖾𝗋: Kylepogi: https://www.facebook.com/kylepogiv20`;

      message.reply(statusMessage);
      api.setMessageReaction("✅", event.messageID, (err) => {
        if (err) console.error(err);
      });
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while retrieving status data.");
      api.setMessageReaction("❌", event.messageID, (err) => {
        if (err) console.error(err);
      });
    }
  },
};
