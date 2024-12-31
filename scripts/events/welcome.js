const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "welcome",
    version: "1.9",
    author: "kylepogi",
    category: "events",
  },

  langs: {
    en: {
      session1: "morning",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      welcomeMessage:
        "🔴🟠🟡🟢 𝗞𝘆𝗹𝗲'𝘀 𝗕𝗼𝘁 𝗰𝗼𝗻𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!!\nThank you for inviting me to the group!\nadded by: {author}\nBot prefix: %1\nTo view the list of commands, please enter: %1help\n\n📅|⏰Date and Time:\n{serverTime}\n⚡Bot Ping: {botPing} ms\n=======[ owner: Kylepogi ] =======",
      multiple1: "you",
      multiple2: "you guys",
      defaultWelcomeMessage: `Hello {userNameTag}.\nWelcome {multiple} to the chat group:{boxName}\n\n📅|⏰Date and Time:\n{serverTime}\n⚡Bot Ping: {botPing} ms\nHave a nice {session} (≡^∇^≡)`,
    },
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType === "log:subscribe") {
      const authorName = await usersData.getName(event.author);  // Fetch author name
      return message.send(getLang("added", authorName));
    }

    const startTime = Date.now(); // Track start time for bot ping
    const hours = parseInt(getTime("HH"), 10);
    const now = moment().tz("Asia/Manila");
    const serverTime = now.format("DD-MMMM-YYYY || hh:mm:ss A");
    const botPing = Date.now() - startTime;

    const { threadID } = event;
    const { nickNameBot } = global.GoatBot.config;
    const prefix = global.utils.getPrefix(threadID);
    const dataAddedParticipants = event.logMessageData.addedParticipants;

    // Handle bot being added to the group
    if (dataAddedParticipants.some((user) => user.userFbId === api.getCurrentUserID())) {
      if (nickNameBot) api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
      return message.send(getLang("welcomeMessage", prefix));
    }

    // Ensure thread data for welcome message handling exists
    if (!global.temp.welcomeEvent[threadID]) {
      global.temp.welcomeEvent[threadID] = {
        joinTimeout: null,
        dataAddedParticipants: [],
      };
    }

    // Update temp data with added participants
    global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout); // Clear any existing timeout

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
      const threadData = await threadsData.get(threadID);
      if (!threadData.settings?.sendWelcomeMessage) return;  // Exit early if welcome messages are disabled

      const { dataAddedParticipants } = global.temp.welcomeEvent[threadID];
      const dataBanned = threadData.data.banned_ban || [];
      const threadName = threadData.threadName || "this group";
      const userName = [];
      const mentions = [];
      const multiple = dataAddedParticipants.length > 1;

      // Prepare list of users and mentions excluding banned ones
      for (const user of dataAddedParticipants) {
        if (dataBanned.some((bannedUser) => bannedUser.id === user.userFbId)) continue;
        userName.push(user.fullName);
        mentions.push({ tag: user.fullName, id: user.userFbId });
      }

      if (userName.length === 0) return; // Exit if no valid users

      // Prepare and format the welcome message
      const session = hours <= 10 ? getLang("session1")
        : hours <= 12 ? getLang("session2")
        : hours <= 18 ? getLang("session3")
        : getLang("session4");

      let welcomeMessage = threadData.data.welcomeMessage || getLang("defaultWelcomeMessage");
      welcomeMessage = welcomeMessage
        .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
        .replace(/\{boxName\}|\{threadName\}/g, threadName)
        .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
        .replace(/\{session\}/g, session)
        .replace(/\{serverTime\}/g, serverTime)
        .replace(/\{botPing\}/g, botPing);

      const form = {
        body: welcomeMessage,
        mentions: mentions.length > 0 ? mentions : null,
      };

      // Add attachments if available
      if (threadData.data.welcomeAttachment) {
        const attachments = await Promise.allSettled(
          threadData.data.welcomeAttachment.map((file) => drive.getFile(file, "stream"))
        );
        form.attachment = attachments
          .filter(({ status }) => status === "fulfilled")
          .map(({ value }) => value);
      }

      // Send the welcome message
      message.send(form);
      delete global.temp.welcomeEvent[threadID];  // Clean up after sending the message
    }, 1500);  // Delay before sending welcome message
  },
};
