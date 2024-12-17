const fs = require("fs-extra");
const { utils } = global;
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "prefix",
    version: "1.4",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    shortDescription: "Change bot's prefix",
    longDescription: "Change the command prefix of the bot in your chat box or the entire bot system (admin only)",
    category: "config",
    guide: {
      vi: "   {pn} <new prefix>: change the prefix in your chat box"
        + "\nExample:"
        + "\n{pn} #"
        + "\n{pn} <new prefix> -g: change the prefix in the bot system (admin only)"
        + "\nExample:"
        + "\n{pn} # -g"
        + "\n{pn} reset: reset the prefix in your chat box to default",
      en: "   {pn} <new prefix>: change the prefix in your chat box"
        + "\nExample:"
        + "\n{pn} #"
        + "\n{pn} <new prefix> -g: change the prefix in the bot system (admin only)"
        + "\nExample:"
        + "\n{pn} # -g"
        + "\n{pn} reset: reset the prefix in your chat box to default"
    }
  },

  langs: {
    vi: {
      reset: "The prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change the prefix of the bot system",
      confirmGlobal: "Please react to this message to confirm the prefix change for the entire bot system",
      confirmThisThread: "Please react to this message to confirm the prefix change for your chat box",
      successGlobal: "The prefix of the bot system has been changed to: %1",
      successThisThread: "The prefix of your chat box has been changed to: %1",
      myPrefix: "╭┈ ❒ 🤖 𝗞𝗬𝗟𝗘'𝗦 𝗕𝗢𝗧 ᵐᵃᵈᵉ ᵇʸ ᴳᵒᵃᵗ:\n━━━━━━━━━━━━━━━━━━━\n╰┈➤ 𝖡𝗈𝗍 𝖲𝗒𝗌𝗍𝖾𝗆 𝖯𝗋𝖾𝖿𝗂𝗑: %1\n╰┈❃➣ [💬] 𝖸𝗈𝗎𝗋 𝖢𝗁𝖺𝗍 𝖡𝗈𝗑 𝖯𝗋𝖾𝖿𝗂𝗑: [ %2 ]\n╰┈❃➣ 🇵🇭PHILIPPINES Timezone: %3\n━━━━━━━━━━━━━━━━━━━\n[❓] — 𝗵𝗼𝘄 𝘁𝗼 𝘂𝘀𝗲𝗱?\𝗇╰┈❃➣ ℹ️𝗧𝘆𝗽𝗲: help or %2help to view all bot commands\n〡\n╰┈❃➣ 『owner』: 𝗞𝘆𝗹𝗲𝗽𝗼𝗴𝗶",
      philippinesTimezone: "🇵🇭 Philippines Timezone: GMT+8"
    },
    en: {
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change the prefix of the bot system",
      confirmGlobal: "Please react to this message to confirm the prefix change for the entire bot system",
      confirmThisThread: "Please react to this message to confirm the prefix change for your chat box",
      successGlobal: "The prefix of the bot system has been changed to: %1",
      successThisThread: "The prefix of your chat box has been changed to: %1",
      myPrefix: "╭┈ ❒ 🤖 𝗞𝗬𝗟𝗘'𝗦 𝗕𝗢𝗧 ᵐᵃᵈᵉ ᵇʸ ᴳᵒᵃᵗ:\n━━━━━━━━━━━━━━━━━━━\n╰┈➤ 𝖡𝗈𝗍 𝖲𝗒𝗌𝗍𝖾𝗆 𝖯𝗋𝖾𝖿𝗂𝗑: %1\n╰┈❃➣ [💬] 𝖸𝗈𝗎𝗋 𝖢𝗁𝖺𝗍 𝖡𝗈𝗑 𝖯𝗋𝖾𝖿𝗂𝗑: [ %2 ]\n╰┈❃➣ 🇵🇭PHILIPPINES Timezone:\n%3\n╰───⪼『𝘒𝘺𝘭𝘦𝘱𝘰𝘨𝘪』",
      philippinesTimezone: "🇵🇭 Philippines Timezone: GMT+8"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.SyntaxError();

    if (args[0] === 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g") {
      if (role < 2)
        return message.reply(getLang("onlyAdmin"));
      else
        formSet.setGlobal = true;
    }
    else {
      formSet.setGlobal = false;
    }

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author)
      return;
    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }
    else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      return () => {
        const philippinesTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
        return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID), philippinesTime));
      };
    }
    else if (event.body && event.body.toLowerCase() === "timezone philippines") {
      return () => {
        return message.reply(getLang("philippinesTimezone"));
      };
    }
  }
};
