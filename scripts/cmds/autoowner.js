const moment = require('moment-timezone');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron'); // Assuming this is the cron library you're using

module.exports.config = {
  name: "autoowner",
  version: "3.0.0",
  role: 0,
  author: "Kylepogi", // Don't change the author 😈
  description: "Automatically sends owner information",
  category: "Autoowner",
  countDown: 3
};

module.exports.onLoad = async function ({ api }) {
  const tmpFolderPath = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tmpFolderPath)) {
    fs.mkdirSync(tmpFolderPath);
  }

  // Schedule a task to run every minute
  cron.schedule('*/6 * * * *', async () => {
    const currentTimePH = moment().tz('Asia/Manila').format('hh:mm A');
    console.log(`Current time in PH: ${currentTimePH}`);
  });
};

module.exports.onStart = async function ({ api, event }) {
  try {
    const loadingMessage = "⏱ Loading Auto owner information please wait...";
    await api.sendMessage(loadingMessage, event.threadID);

    const ownerInfo = {
      name: 'Kyle Bait-it',
      gender: 'Boy',
      talent: 'Overthinking, eating vegetables, being handsome',
      sports: 'Soccer, Sepak Takraw, Taekwondo, Karate, Kickboxing, Boxing, etc.',
      hobby: 'Playing games, etc.',
      relationship: '𝗟𝗶𝗲 𝗔𝗻𝗻(𝗝𝘂𝗹𝗶𝗲 𝗔𝗻𝗻 𝗠𝗼𝗻𝘁𝗲𝗯𝗼𝗻)',
      facebookLink: 'https://www.facebook.com/kylepogiv20',
      bio: '𝘀𝗵𝗲/𝗵𝗲𝗿.'
    };

    const videoUrl = "https://i.imgur.com/C8IedFb.mp4";
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoPath = path.join(__dirname, 'tmp', 'owner_video.mp4');

    fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

    const responseMessage = `🔔 𝗔𝗨𝗧𝗢 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢:
➣ 📜 | Owner Information ❏
࿇ ══━━━━✥◈✥━━━━══ ࿇    
𝗡𝗔𝗠𝗘: ${ownerInfo.name}  
━━━━━━━━━━━━━━━━━
👤 Gender: ${ownerInfo.gender}
🎨 Talent: ${ownerInfo.talent}
🏅 Sports: ${ownerInfo.sports}
🎮 Hobby: ${ownerInfo.hobby}
❤️ Relationship: ${ownerInfo.relationship}
━━━━━━━━━━━━━━━━━
🔗 Facebook Link: ${ownerInfo.facebookLink}
━━━━━━━━━━━━━━━━━
📝 Bio: ${ownerInfo.bio}
࿇ ══━━━━✥◈✥━━━━══ ࿇
    `;

    // Send the message to all threads
    const threadIDs = global.db.allThreadData.map(i => i.threadID);
    threadIDs.forEach(threadID => {
      api.sendMessage(responseMessage, threadID, (err) => {
        if (err) console.error(`Failed to send message to thread ${threadID}:`, err);
      });
    });
  } catch (err) {
    console.error('Error occurred while sending owner information:', err);
  }
};
