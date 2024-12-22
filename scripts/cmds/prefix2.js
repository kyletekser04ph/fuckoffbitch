const { GoatWrapper } = require('fca-liane-utils');
const os = require("os");

const uptimeFacts = [
  "The only limit to our realization of tomorrow will be our doubts of today.",
  "Every day may not be good, but there's something good in every day.",
  "Success is stumbling from failure to failure with no loss of enthusiasm.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "The best way to predict the future is to create it.",
  "The journey of a thousand miles begins with one step.",
  "Believe you can and you're halfway there.",
  "Life is 10% what happens to us and 90% how we react to it."
];
const startTime = new Date();

module.exports = {
  config: {
    name: "prefix2",
    aliases: ["prefix nito?", "ano prefix?", "p", "prefix"],
    author: "Kylepogi",
    countDown: 0,
    role: 0,
    category: "system",
    longDescription: {
      en: "Get System Information",
    },
  },
  
  onStart: async function ({ api, event, args, threadsData, usersData }) {
    try {
      const uptimeInSeconds = (new Date() - startTime) / 1000;
      const days = Math.floor(uptimeInSeconds / (3600 * 24));
      const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
      const secondsLeft = Math.floor(uptimeInSeconds % 60);
      const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;

      const totalMemoryGB = os.totalmem() / 1024 ** 3;
      const freeMemoryGB = os.freemem() / 1024 ** 3;
      const usedMemoryGB = totalMemoryGB - freeMemoryGB;

      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const currentDate = new Date();
      const date = currentDate.toLocaleDateString("en-US", { year: "numeric", month: "numeric", day: "numeric" });
      const time = currentDate.toLocaleTimeString("en-US", { timeZone: "Asia/Manila", hour12: true });

      const timeStart = Date.now();
      await api.sendMessage({ body: "📡 hello master 𝗠𝘆 𝗽𝗿𝗲𝗳𝗶𝘅 𝗶𝘀...." }, event.threadID);
      const ping = Date.now() - timeStart;

      const randomFact = uptimeFacts[Math.floor(Math.random() * uptimeFacts.length)];
      const systemInfo = `𝗛𝗲𝗹𝗹𝗼 𝗭𝗲𝗻𝗽𝗮𝗶 𝗜 𝗮𝗺 𝗭𝗲𝗽𝗵𝘆𝗿𝘂𝘀 𝗕𝗼𝘁 𝗠𝗬 𝗣𝗥𝗘𝗙𝗜𝗫??!!\n╭──────┉┉┉─────╮\n
〡ʜᴇʀᴇ ɪs ᴍʏ 𝗣𝗿𝗲𝗳𝗶𝘅: [ . ]〡\n╰──────┉┉┉─────╯\n⏳ 𝗕𝗢𝗧𝗥𝗨𝗡𝗧𝗜𝗠𝗘:\n╠⧽⧽『${uptimeFormatted}』⧼⧼\n╠╾➤📌 𝗨𝗣𝗧𝗜𝗠𝗘 𝗙𝗔𝗖𝗧: ${randomFact}\n▬▬▬▬▬▬▬ᴷʸˡᵉᵇᵒᵗˢ▬▬▬▬▬\n╰╾➤📆 𝙳𝚊𝚝𝚎: ${date}\n╠╾➤⏰ 𝚃𝚒𝚖𝚎: ${time}\n╠╾➤👥𝚞𝚜𝚎𝚛'𝚜: ${allUsers.length}\n╠╾➤🔰 𝙶𝚛𝚘𝚞𝚙𝚜: ${allThreads.length}\n╰╾➤⚡𝚜𝚙𝚎𝚎𝚍: ${ping}𝚖𝚜`;

      const attachment = await global.utils.getStreamFromURL("https://i.imgur.com/TfkHB4l.jpeg");

      api.sendMessage(
        { body: systemInfo, attachment },
        event.threadID,
        (err, messageInfo) => {
          if (err) {
            console.error("Error sending message with attachment:", err);
            api.sendMessage("Unable to send system information.", event.threadID, event.messageID); // Send error message if sending fails
          } else {
            console.log("Message with attachment sent successfully:", messageInfo);
          }
        }
      );
    } catch (error) {
      console.error("Error retrieving system information:", error);
      api.sendMessage("Unable to retrieve system information.", event.threadID, event.messageID); // Send error message if retrieval fails
    }
  },
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: false });
