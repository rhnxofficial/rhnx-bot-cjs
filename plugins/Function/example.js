"use strict";

module.exports = {
  name: "hookExample",
  description: "Contoh plugin hook dengan before & after",
  type: "hook",

  before: async (m, { conn }) => {
    if (m.text && m.text.toLowerCase() === "tess") {
      await conn.sendMessage(
        m.chat,
        { text: "✅ Before hook: tes function berhasil" },
        { quoted: m }
      );
    }
  },

  after: async (m, { conn, command }) => {
    if (command) {
      await conn.sendMessage(
        m.chat,
        { text: `✅ After hook aktif (command *${command}* sudah diproses)` },
        { quoted: m }
      );
    } else if (m.text) {
      await conn.sendMessage(
        m.chat,
        { text: "ℹ️ After hook aktif. Pesan biasa diterima." },
        { quoted: m }
      );
    }
  },
};