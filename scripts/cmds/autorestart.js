const fs = require("fs-extra");

module.exports = {
	config: {
		name: "autorestart",
		version: "1.1",
		author: "Kylepogi",//don't change the author
		countDown: 5,
		role: 2,
		description: {
			en: "Restart bot"
		},
		category: "Botself",
		guide: {
			en: "   {pn}: Restart bot"
		}
	},
		en: {
			restartting: "𝖠𝗎𝗍𝗈𝗆𝖺𝗍𝗂𝖼𝖺𝗅𝗅𝗒 𝖱𝖾𝗌𝗍𝖺𝗋𝗍𝗂𝗇𝗀 𝖡𝗈𝗍\n\n🔄 | Restarting bot..."
		}
	},

	onLoad: function ({ api }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;
		if (fs.existsSync(pathFile)) {
			const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
			api.sendMessage(`✅ | Bot restarted\n⏰ | Time: ${(Date.now() - time) / 1000}s`, tid);
			fs.unlinkSync(pathFile);
		}
	},

	onStart: async function ({ message, event, getLang }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;
		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
		await message.reply(getLang("restartting"));
		process.exit(2);
	}
};
    // Send the message to all threads
    const threadIDs = global.db.allThreadData.map(thread => thread.threadID);
    for (const threadID of threadIDs) {
      api.sendMessage(responseMessage, threadID, (err) => {
        if (err) {
          console.error(`Failed to send message to thread ${threadID}:`, err);
        }
      });
    }
  } catch (err) {
    console.error('Error occurred while sending owner information:', err);
  }
};

