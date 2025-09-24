"use strict";

module.exports = {
  name: "susunkata-hook",
  description: "Hook untuk game Susun Kata",
  type: "hook", // tandai kalau ini hook

  before: async (m, { conn }) => {
    if (!m.isGroup) return;

    conn.susunkata = conn.susunkata || {};
    conn.susunkataCooldown = conn.susunkataCooldown || {};

    const id = m.chat;

    // cek apakah grup ini sedang ada game
    if (!(id in conn.susunkata)) return;

    const cooldownTime = 5000;
    const threshold = 0.72;
    const gameData = conn.susunkata[id];
    const soal = gameData[1]; // simpanan soal
    const jawaban = soal.jawaban.toLowerCase().trim();

    const teks = (m.body || "").trim().toLowerCase();
    if (!teks) return;

    // cek cooldown
    if (conn.susunkataCooldown[id]) {
      let lastInteraction = conn.susunkataCooldown[id];
      if (new Date() - lastInteraction < cooldownTime) {
        return;
      }
    }
    conn.susunkataCooldown[id] = new Date();

    // cek jawaban
    if (teks === jawaban) {
      const hadiah = gameData[2];

      let user = global.db.data.users[m.sender];
      user.balance += hadiah;
      user.exp += 999;

      m.reply(
        `🎉 *Benar!* Kamu jenius! 💡\n+${hadiah} Balance 💸\n+999 EXP 📈`
      );

      clearTimeout(gameData[3]);
      delete conn.susunkata[id];
    } else if (similarity(teks, jawaban) >= threshold) {
      m.reply("⚠️ Hampir benar, coba lagi!");
    } else {
      m.react("🗿");
    }
  },
};