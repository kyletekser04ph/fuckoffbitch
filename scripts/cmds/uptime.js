const moment = require('moment');

module.exports = {
  config: {
    name: "uptime",
    aliases: ['up'],
    version: "1.0",
    author: "HeDroxuu",
    category: "system",
    guide: {
      en: "Use {p}uptime or {p}upt"
    }
  },
  onStart: async function ({ message }) {
    const uptime = process.uptime();
    const formattedUptime = formatMilliseconds(uptime * 1000);

    const response = `╭╼╾『📡 𝗦𝗬𝗦𝗧𝗘𝗠 𝗨𝗣𝗧𝗜𝗠𝗘』\n${formattedUptime}`;

    message.reply(response);
  }
};

function formatMilliseconds(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `╰─> 𝘿𝘢𝘺𝘴 ─ ${days}\n╰─➣ 𝙃𝘳𝘴─ ${hours % 24}\n╰─➣ 𝙈𝘪𝘯𝘴 ─ ${minutes % 60}\n╰─➣ 𝙎𝘦𝘤 ─ ${seconds % 60}`;
}
