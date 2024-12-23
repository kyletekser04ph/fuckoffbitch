const moment = require('moment-timezone');
const axios = require('axios');
const fs = require('fs-extra'); // Use `fs-extra` for methods like `outputFile`
const path = require('path');
const cron = require('node-cron');

module.exports.config = {
  name: "autoowner",
  version: "3.0.0",
  role: 0,
  author: "Kylepogi",//don't change the author kung ayaw mong ma pwetan
  description: "Automatically sends owner information",
  category: "Autoowner",
  countDown: 3
};

module.exports.onLoad = async function ({ api }) {
  const tmpFolderPath = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tmpFolderPath)) {
    fs.mkdirSync(tmpFolderPath);
  }

  // Schedule a task to run every 6 minutes
  cron.schedule('*/9 * * * *', () => {
    const currentTimePH = moment().tz('Asia/Manila').format('hh:mm A');
    console.log(`Current time in PH: ${currentTimePH}`);
  });
};

module.exports.onStart = async function ({ api, event }) {
  try {
    const loadingMessage = "⏱ Loading Auto owner information, please wait...";
    api.sendMessage(loadingMessage, event.threadID);

    const ownerInfo = {
      name: 'Kyle Bait-it',
      gender: 'Boy',
      talent: 'Overthinking, eating vegetables, being handsome',
      sports: 'Soccer, Sepak Takraw, Taekwondo, Karate, Kickboxing, Boxing, etc.',
      hobby: 'Playing games, etc.',
      relationship: '𝗟𝗶𝗲 𝗔𝗻𝗻 (𝗝𝘂𝗹𝗶𝗲 𝗔𝗻𝗻 𝗠𝗼𝗻𝘁𝗲𝗯𝗼𝗻)',
      facebookLink: 'https://www.facebook.com/kylepogiv20',
      bio: '𝘀𝗵𝗲/𝗵𝗲𝗿.'
    };

    const videoUrl = "https://i.imgur.com/C8IedFb.mp4";
    const videoPath = path.join(__dirname, 'tmp', 'owner_video.mp4');

    // Download video and save locally
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    await fs.outputFile(videoPath, videoResponse.data);

    const responseMessage = `🔔 𝗔𝗨𝗧𝗢 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢:\n
➣ 📜 | Owner Information ❏
࿇ ══━━━━✥◈✥━━━━══ ࿇    
𝗡𝗔𝗠𝗘: ${ownerInfo.name}  
━━━━━━━━━━━━━━━━━
▣ Gender: ${ownerInfo.gender}
▣ Talent: ${ownerInfo.talent}
▣ Sports: ${ownerInfo.sports}
▣ Hobby: ${ownerInfo.hobby}
▣ Relationship: ${ownerInfo.relationship}
━━━━━━━━━━━━━━━━━
🔗 Facebook Link: ${ownerInfo.facebookLink}
━━━━━━━━━━━━━━━━━
▣ Bio: ${ownerInfo.bio}
࿇ ══━━━━✥◈✥━━━━══ ࿇`;

    const imageSearchOptions = ["Ichigo", "Aizen", "Rukia", "Ryukazi", "Ryuken", "Kira", "death note", "bleach", "your name"];
    const randomQuery = imageSearchOptions[Math.floor(Math.random() * imageSearchOptions.length)];
    const imageUrl = `https://pin-kshitiz.vercel.app/pin?search=${encodeURIComponent(randomQuery)}`;

    const imageResponse = await axios.get(imageUrl);
    const imageResults = imageResponse.data.result;

    if (imageResults.length > 0) {
      const randomImage = imageResults[Math.floor(Math.random() * imageResults.length)];
      const imageBuffer = await axios.get(randomImage, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, 'tmp');
      await fs.outputFile(imagePath, imageBuffer.data);

      const imageStream = fs.createReadStream(imagePath);

      await api.sendMessage({
        body: responseMessage,
        attachment: [fs.createReadStream(videoPath), imageStream]
      }, event.threadID);

      // Clean up temporary files
      await fs.unlink(imagePath);
      await fs.unlink(videoPath);
    } else {
      api.sendMessage("No images found for the given query.", event.threadID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
  }
};
