"use strict";

module.exports = {
  name: "ping",
  alias: ["p"],
  description: "Cek respon bot oke",
access: { private: true,owner: true, }, 
  run: async (m, { conn, q }) => {
    const start = Date.now();

    const msg = await m.reply("🏓 Pong...");

    const speed = Date.now() - start;
    await conn.sendMessage(m.chat, { text: `⚡ Respon: ${speed}ms` }, { quoted: msg });
  },

  
  after: async (m, { conn, command }) => {
    console.log(`[AFTER] Command '${command}' dari ${m.sender} selesai dieksekusi`);

    
    if (command === "ping") {
      await conn.sendMessage(m.chat, {
        text: "✅ After hook aktif (ping sudah diproses)",
      });
    }
  },
};