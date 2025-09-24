"use strict";

const moment = require("moment-timezone");

const CONFIG = {
  RESET_MODE: "daily", 
  DEFAULT_LIMIT: 50,
  TIMEZONE: "Asia/Jakarta",
};

module.exports = {
  name: "limit",
  alias: ["limit", "cekbalance"],
  description: "Cek sisa limit user",
  tags: ["info"],
  access: { nogroupstore: true, premium: false },

  run: async (m, { conn, q }) => {
    let user = global.db.data.users[m.sender];
    if (!user) {
      return m.reply("⚠️ Data kamu belum terdaftar di database.");
    }

    let now = moment().tz(CONFIG.TIMEZONE);
    let resetTime = CONFIG.RESET_MODE === "daily"
      ? now.clone().endOf("day").format("HH:mm:ss")
      : now.clone().endOf("hour").format("HH:mm:ss");

    let text = `
📊 *Limit Info*
👤 User: ${user.name || m.pushName}
🔑 ID: ${m.sender}
🎯 Role: ${user.role || "Beginner"}

🔋 Sisa Limit: *${user.limit}*
⏳ Reset: jam *${resetTime}* WIB
`.trim();

    await conn.sendMessage(m.chat, { text }, { quoted: m });
  },
};