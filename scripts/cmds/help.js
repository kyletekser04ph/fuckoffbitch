const { GoatWrapper } = require('fca-liane-utils');
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐐 | Goat Bot V2 ]";

const gothicFont = {
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
    S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    0: "𝟢", 1: "𝟣", 2: "𝟤", 3: "𝟥", 4: "𝟦", 5: "𝟧", 6: "𝟨", 7: "𝟩", 8: "𝟪", 9: "𝟫"
};

const convertToGothic = (text) => {
    return text.split('').map(char => gothicFont[char] || char).join('');
};

module.exports = {
    config: {
        name: "help",
        version: "1.18",
        author: "Kylepogi",
        countDown: 5,
        role: 0,
        shortDescription: {
            vi: "Xem cách dùng lệnh",
            en: "View command usage"
        },
        longDescription: {
            vi: "Xem cách sử dụng của các lệnh",
            en: "View command usage"
        },
        category: "info",
        guide: {
            en: "{pn} [empty | <page number> | <command name>]"
                + "\n   {pn} <command name> [-u | usage | -g | guide]: show command usage"
                + "\n   {pn} <command name> [-i | info]: show command info"
                + "\n   {pn} <command name> [-r | role]: show command role"
                + "\n   {pn} <command name> [-a | alias]: show command alias"
        },
        priority: 1
    },

    langs: {
        en: {
            help: "Here are the available commands:"
        }
    },

    run: async ({ api, event, args, Utils, prefix }) => {
        const input = args.join(' ');
        const allCommands = [...commands.values()];
        const totalCommands = allCommands.length;

        try {
            if (!input) {
                const page = 1;
                const pageSize = 20;
                const start = (page - 1) * pageSize;
                const end = Math.min(totalCommands, start + pageSize);

                let message = `📋 | ${convertToGothic('Command List')}:\n`;
                message += `Prefix: ${prefix || "[no prefix]"}\n`;
                message += `Total Commands: ${convertToGothic(totalCommands.toString())}\n\n`;

                allCommands.slice(start, end).forEach((cmd, index) => {
                    message += `${convertToGothic(`${index + 1}. ${prefix}${cmd.config.name}`)}\n`;
                });

                message += `\nType "help <command>" for more details.`;
                return api.sendMessage(message, event.threadID, event.messageID);
            }

            if (!isNaN(input)) {
                const page = parseInt(input);
                const pageSize = 20;
                const start = (page - 1) * pageSize;
                const end = Math.min(totalCommands, start + pageSize);

                if (start >= totalCommands) {
                    return api.sendMessage("Invalid page number.", event.threadID, event.messageID);
                }

                let message = `📋 | ${convertToGothic('Command List')}:\n`;
                message += `Page: ${page}\n\n`;

                allCommands.slice(start, end).forEach((cmd, index) => {
                    message += `${convertToGothic(`${index + 1}. ${prefix}${cmd.config.name}`)}\n`;
                });

                return api.sendMessage(message, event.threadID, event.messageID);
            }

            const command = allCommands.find(cmd => cmd.config.name === input || cmd.config.aliases?.includes(input));
            if (command) {
                const { name, version, role, aliases, shortDescription, longDescription } = command.config;

                let message = `「 Command Info 」\n`;
                message += `Name: ${name}\n`;
                message += `Version: ${version}\n`;
                message += `Role: ${role}\n`;
                message += `Aliases: ${aliases?.join(", ") || "None"}\n`;
                message += `Short Description: ${shortDescription?.en}\n`;
                message += `Long Description: ${longDescription?.en}\n`;

                return api.sendMessage(message, event.threadID, event.messageID);
            }

            return api.sendMessage("Command not found.", event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
        }
    }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
