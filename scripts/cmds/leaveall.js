module.exports = {
  config: {
    name: "leaveall",
    aliases: ["autoleave"],
    version: "1.0",
    author: "GoatAI by LiANE",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "GoatBot - Leave all groups",
      tl: "GoatBot - Iwan ang lahat ng mga group"
    },
    longDescription: {
      en: "GoatBot - Leave your bot from all group chats",
      tl: "GoatBot - Iwan ang iyong bot sa lahat ng mga group chat"
    },
    category: "goatBot",
    guide: {
      en: "{p}leaveall",
      tl: "{p}leaveall"
    }
  },

  onStart: async function ({ api }) {
    const threadList = await api.getThreadList(100, null, ["INBOX"]);

    threadList.forEach(thread => {
      api.removeUserFromGroup(api.getCurrentUserID(), thread.threadID);
    });

    message.reply("I have left all group chats.");
  }
};