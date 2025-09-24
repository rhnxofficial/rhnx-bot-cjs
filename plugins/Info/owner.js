"use strict";

module.exports = {
  name: "owner",
  alias: ["creator", "dev"],
  description: "Menampilkan informasi Owner bot",
  access: { private: false, owner: false },

  run: async (m, { conn }) => {
    if (!global.owner) {
      return m.reply("⚠️ Data owner belum diset!");
    }

    const text = `
👑 *Owner Bot*
• Nama   : ${owner.name}
• Nomor  : wa.me/${owner.contact}
• Email  : ${owner.email || "-"}
    `.trim();

    await conn.sendMessage(m.chat, { text }, { quoted: m });
  },

  after: async (m, { command }) => {
    console.log(`[AFTER] Command '${command}' dipanggil oleh ${m.sender}`);
  },
};