"use strict";
require("../settings.js");
const chalk = require("chalk");
const { Boom } = require("@hapi/boom");
const { DisconnectReason } = require("baileys");
const spin = require("spinnies");
const qrcode = require("qrcode-terminal");

// === SPINNER === //
const spinner = {
  interval: 130,
  frames: [
    "✖ [░░░░░░░░░░░░░░░]","✖ [■░░░░░░░░░░░░░░]","✖ [■■░░░░░░░░░░░░░]",
    "✖ [■■■░░░░░░░░░░░░]","✖ [■■■■░░░░░░░░░░░]","✖ [■■■■■░░░░░░░░░░]",
    "✖ [■■■■■■░░░░░░░░░]","✖ [■■■■■■■░░░░░░░░]","✖ [■■■■■■■■░░░░░░░]",
    "✖ [■■■■■■■■■░░░░░░]","✖ [■■■■■■■■■■░░░░░]","✖ [■■■■■■■■■■■░░░░]",
    "✖ [■■■■■■■■■■■■░░░]","✖ [■■■■■■■■■■■■■░░]","✖ [■■■■■■■■■■■■■■░]",
    "✖ [■■■■■■■■■■■■■■■]",
  ],
};

let globalSpinner;
const getGlobalSpinner = (disableSpins = false) => {
  if (!globalSpinner) {
    globalSpinner = new spin({
      color: "blue",
      succeedColor: "green",
      spinner,
      disableSpins,
    });
  }
  return globalSpinner;
};

let spins = getGlobalSpinner(false);
const start = (id, text) => {
  try {
    spins.add(id, { text });
  } catch {}
};
const success = (id, text) => {
  try {
    spins.succeed(id, { text });
  } catch {}
};

// === CLEAR CONSOLE === //
async function clearConsole() {
  const isWindows = process.platform === "win32";
  const isLinuxOrMac =
    process.platform === "linux" || process.platform === "darwin";

  return new Promise((resolve) => {
    const command = isWindows ? "cls" : isLinuxOrMac ? "clear" : "";
    if (command) {
      require("child_process").exec(command, () => resolve());
    } else {
      resolve();
    }
  });
}

// === CONNECTION UPDATE === //
const connectionUpdate = async (connectToWhatsApp, conn, update) => {
  try {
    const { connection, lastDisconnect, qr } = update;

    const statusCode = lastDisconnect?.error
      ? new Boom(lastDisconnect.error)?.output?.statusCode
      : null;
      
    if (qr && !global.system?.pairingCode) {
      console.log(chalk.blueBright("[!] Silakan scan QR berikut:\n"));
      qrcode.generate(qr, { small: true });
    }

    if (connection === "connecting") {
      start("1", "Connecting...");
    }

    if (connection === "open") {
      success("1", "Connected ✅");
      console.log(chalk.green("[✓] Terhubung ke WhatsApp!"));

      const ownerJid = `${owner.contact}@s.whatsapp.net`;
      try {
        await conn.sendMessage(ownerJid, { text: "Bot aktif kembali ✅" });
      } catch {}

      const bot = global.db?.data?.others?.["restart"];
      if (bot) {
        try {
          const m = bot.m;
          const from = bot.from;
          await conn.sendMessage(from, { text: "Bot is connected" }, { quoted: m });
          delete global.db.data.others["restart"];
        } catch (e) {
          console.error("❌ Gagal kirim pesan restart:", e.message);
        }
      }
    }

    if (connection === "close") {
      console.log(chalk.red("✖ Koneksi terputus."));

      if (
        statusCode === DisconnectReason.badSession ||
        statusCode === DisconnectReason.loggedOut
      ) {
        console.log(
          chalk.yellow("⚠️ Session rusak / logout. Hapus folder session lalu login ulang.")
        );
      } else {
        console.log(chalk.yellow("🔄 Mencoba reconnect..."));
        connectToWhatsApp();
      }
    }
  } catch (err) {
    console.error("❌ Error di connectionUpdate:", err.message);
  }
};

module.exports = { connectionUpdate, clearConsole };