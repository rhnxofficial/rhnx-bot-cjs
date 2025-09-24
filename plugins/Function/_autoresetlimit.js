"use strict";

const moment = require("moment-timezone");

const CONFIG = {
  RESET_MODE: "daily",
  DEFAULT_LIMIT: 50,  
  TIMEZONE: "Asia/Jakarta",
};

module.exports = {
  name: "limitHook",
  description: "Hook untuk reset & cek limit user",
  type: "hook",

  before: async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return;

    let now = moment().tz(CONFIG.TIMEZONE);
    let key = CONFIG.RESET_MODE === "daily"
      ? now.format("YYYY-MM-DD")
      : now.format("YYYY-MM-DD HH");

    if (user.limit <= 0 && user.lastReset !== key) {
      user.limit = CONFIG.DEFAULT_LIMIT;
      user.lastReset = key;

      await conn.sendMessage(m.chat, {
        text: `🔄 Limit kamu sudah direset jadi *${CONFIG.DEFAULT_LIMIT}* (${CONFIG.RESET_MODE === "daily" ? "reset harian" : "reset per jam"})`
      }, { quoted: m });
    }
  },
};