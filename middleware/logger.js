const chalk = require("chalk");
const moment = require("moment-timezone");

const typeMediaApa = (type) => {
  const mediaTypes = {
    imageMessage: "🖼️ Gambar",
    videoMessage: "🎥 Video",
    stickerMessage: "🔖 Stiker",
    audioMessage: "🎵 Audio",
    contactMessage: "📞 Kontak",
    locationMessage: "📍 Lokasi",
    documentMessage: "📄 Dokumen",
  };
  return mediaTypes[type] || "💬 Teks";
};

const timeNow = () => moment.tz("Asia/Jakarta").format("HH:mm:ss");

exports.Logmessage = (conn, m) => {
    const body = m.budy
  const isGroup = m.isGroup;
  const type = Object.keys(m.message || {})[0];
  const mediaType = typeMediaApa(type);
  const idConsole = isGroup ? m.chat : m.sender;

  if (m.key.remoteJid === "status@broadcast") return; // skip status WA
  if (isGroup) {
    console.log(chalk.bgMagenta.white.bold(" [ MESSAGE INFO - GROUP ] "));
    console.log(
      `\n${chalk.magenta("╭──────────────────────────────")}`,
      `\n${chalk.magenta("│ Media")}     : ${chalk.yellowBright(mediaType)}`,
      body ? `\n${chalk.magenta("│ Pesan")}     : ${chalk.green.italic(body)}` : "",
      `\n${chalk.magenta("│ Pengirim")}  : ${chalk.cyan(m.pushName || "Tanpa Nama")}`,
      `\n${chalk.magenta("│ SenderId")}  : ${chalk.gray(m.sender)}`,
      `\n${chalk.magenta("│ Group")}     : ${chalk.blueBright(m.groupName)}`,
      `\n${chalk.magenta("│ GroupId")}   : ${chalk.hex("#FFA500")(idConsole)}`,
      `\n${chalk.magenta("└ Time")}      : ${chalk.hex("#FF8800")(timeNow())}\n`
    );
  } else {
    console.log(chalk.bgGray.white.bold(" [ MESSAGE INFO - PRIVATE ] "));
    console.log(
      `\n${chalk.gray("╭──────────────────────────────")}`,
      `\n${chalk.gray("│ Media")}    : ${chalk.yellowBright(mediaType)}`,
      body ? `\n${chalk.gray("│ Pesan")}    : ${chalk.green.italic(body)}` : "",
      `\n${chalk.gray("│ Pengirim")} : ${chalk.cyan(m.pushName || "Tanpa Nama")}`,
      `\n${chalk.gray("│ SenderId")} : ${chalk.hex("#FFA500")(idConsole)}`,
      `\n${chalk.gray("└ Time")}     : ${chalk.hex("#FF8800")(timeNow())}\n`
    );
  }
};

exports.Logcommands = (m, command) => {
  const isGroup = m.isGroup;
  const idConsole = isGroup ? m.chat : m.sender;

  if (isGroup) {
    console.log(chalk.bgCyan.white.bold(" [ COMMAND INFO - GROUP ] "));
    console.log(
      `\n${chalk.cyan("╭──────────────────────────────")}`,
      `\n${chalk.cyan("│ Command")}   : ${chalk.white.italic(command)}`,
      `\n${chalk.cyan("│ Pengirim")}  : ${chalk.cyan(m.pushName || "Tanpa Nama")}`,
      `\n${chalk.cyan("│ SenderId")}  : ${chalk.gray(m.sender)}`,
      `\n${chalk.cyan("│ Group")}     : ${chalk.blueBright(m.groupName)}`,
      `\n${chalk.cyan("│ GroupId")}   : ${chalk.hex("#FFA500")(idConsole)}`,
      `\n${chalk.cyan("└ Time")}      : ${chalk.hex("#FF8800")(timeNow())}\n`
    );
  } else {
    console.log(chalk.bgHex("#FF69B4").white.bold(" [ COMMAND INFO - PRIVATE ] "));
    console.log(
      `\n${chalk.hex("#FF69B4")("╭──────────────────────────────")}`,
      `\n${chalk.hex("#FF69B4")("│ Command")}   : ${chalk.white.italic(command)}`,
      `\n${chalk.hex("#FF69B4")("│ Pengirim")}  : ${chalk.cyan(m.pushName || "Tanpa Nama")}`,
      `\n${chalk.hex("#FF69B4")("│ SenderId")}  : ${chalk.hex("#FFA500")(idConsole)}`,
      `\n${chalk.hex("#FF69B4")("└ Time")}      : ${chalk.hex("#FF8800")(timeNow())}\n`
    );
  }
};

exports.Logerror = (m, error) => {
  const isGroup = m?.isGroup;
  const idConsole = isGroup ? m?.chat || "Unknown" : m?.sender || "Unknown";
  const senderName = m?.pushName || "Tanpa Nama";
  const errText = error?.stack || error?.message || String(error);

  const groupName = isGroup ? m?.groupName || "Unknown" : "";

  const header = isGroup
    ? chalk.bgRed.white.bold(" [ ERROR INFO - GROUP ] ")
    : chalk.bgRed.white.bold(" [ ERROR INFO - PRIVATE ] ");

  console.log(header);
  console.log(
    `\n${chalk.red("╭──────────────────────────────")}`,
    `\n${chalk.red("│ Error")}     : ${chalk.white.italic(errText)}`,
    `\n${chalk.red("│ Pengirim")}  : ${chalk.cyan(senderName)}`,
    `\n${chalk.red("│ SenderId")}  : ${chalk.gray(idConsole)}`,
    isGroup ? `\n${chalk.red("│ Group")}     : ${chalk.blueBright(groupName)}` : "",
    isGroup ? `\n${chalk.red("│ GroupId")}   : ${chalk.hex("#FFA500")(idConsole)}` : "",
    `\n${chalk.red("└ Time")}      : ${chalk.hex("#FF8800")(timeNow())}\n`
  );
};
