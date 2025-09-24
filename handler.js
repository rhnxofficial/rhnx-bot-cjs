"use strict";

require("./settings.js");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const chalk = require("chalk");
const stringSimilarity = require("string-similarity");

const { isNumber } = require("./lib/myfunc");
const { register } = require("./middleware/register.js");
const { settings } = require("./middleware/settings.js");
const checkAccess = require("./middleware/access.js");
const { Logmessage, Logcommands } = require("./middleware/logger");
const { addSpammer, removeExpiredSpam, msgFilter, addSpam, cekSpam, FinisHim } = require("./middleware/antispam");
const { translateLang } = require("./media/text/langue");

const prefix = ".";
const pluginsDir = path.join(__dirname, "plugins");
let plugins = {};

function loadPlugins(dir = pluginsDir) {
  plugins = {};
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.readdirSync(dir).forEach((folder) => {
    const folderPath = path.join(dir, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      fs.readdirSync(folderPath)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => loadPlugin(path.join(folderPath, file)));
    } else if (folder.endsWith(".js")) {
      loadPlugin(folderPath);
    }
  });

  console.log(chalk.green(`[✓] Plugins loaded: ${Object.keys(plugins).length}`));
}

function loadPlugin(filePath) {
  try {
    delete require.cache[require.resolve(filePath)];
    const plugin = require(filePath);
    if (plugin && plugin.name) {
      plugin.__file = filePath;
      plugins[plugin.name] = plugin;
      return true;
    }
  } catch (err) {
    console.error(chalk.red(`❌ Gagal load plugin: ${path.basename(filePath)}\n`), err);
  }
  return false;
}

function watchPlugins(dir = pluginsDir) {
  if (!fs.existsSync(dir)) return;

  const watcher = chokidar.watch(dir, {
    ignored: /(^|[\/\\])\../, 
    persistent: true,
    ignoreInitial: true,
  });

  watcher
    .on("add", (file) => {
      if (file.endsWith(".js") && loadPlugin(file))
        console.log(chalk.blue(`[NEW] Plugin ditambahkan: ${path.relative(dir, file)}`));
    })
    .on("change", (file) => {
      if (file.endsWith(".js") && loadPlugin(file))
        console.log(chalk.yellow(`[UPDATE] Plugin diupdate: ${path.relative(dir, file)}`));
    })
    .on("unlink", (file) => {
      if (!file.endsWith(".js")) return;
      const pluginName = Object.keys(plugins).find((k) => plugins[k].__file === file);
      if (pluginName) {
        delete plugins[pluginName];
        console.log(chalk.red(`[DELETE] Plugin dihapus: ${path.relative(dir, file)}`));
      }
    });
}

loadPlugins();
watchPlugins();

module.exports = async (conn, m, chatUpdate) => {
  try {
    const { budy, body } = m;
    const sender = m.sender;
    const senderNumber = sender.split("@")[0];
    const from = m.chat;
    const isGroup = m.isGroup;
    const itsMe = sender === conn.user.jid;

    await settings(m, isNumber);
    await register(m, isNumber);

    // Ambil data DB
const AntiSpam = db.data.antispam;
const spammer = [];
const isAntiSpam = m.isGroup ? db.data.chats[m.chat]?.antispam : false;
const isBanned = db.data.users[sender]?.banned?.status || false;

var ownerNumber = [ `${owner.contact}@s.whatsapp.net`, `6281316643491@s.whatsapp.net`,
 `${conn.user.jid}`,
    ];
    const isOwner = ownerNumber.includes(m.sender);
const botRun = global.db.data.others['runtime']
const botTime = botRun? (new Date - botRun.runtime) :  "Tidak terdeteksi"
const runTime = clockString(botTime)
global.runTime = runTime
    const Tnow = Math.floor(Date.now() / 1000);
    if (Tnow - m.messageTimestamp.low > global.system.Intervalmsg)
      return console.log(chalk.gray(`Pesan lama diabaikan`));

// =========================== //
    const prefixes = [".", "!", "#"];
    const usedPrefix = prefixes.find((p) => body.startsWith(p)) || null;
    const isCmd = usedPrefix !== null;
    const command = isCmd
      ? m.body.slice(usedPrefix.length).trim().split(/\s+/)[0].toLowerCase()
      : isOwner
      ? (m.body || "").trim().split(/\s+/)[0].toLowerCase()
      : "";
    const args = isCmd
      ? m.body.slice(usedPrefix.length).trim().split(/\s+/).slice(1)
      : isOwner
      ? (m.body || "").trim().split(/\s+/).slice(1)
      : [];
    const q = args.join(" ");
      
// === GLOBAL LANGUAGE ===
global.language = db.data.settings.language;
global.t = async (text) => await translateLang(text, global.language);
      
    if (!isCmd && body.length < 8000 && m.type !== "protocolMessage") Logmessage(conn, m, body);
    if (isCmd) Logcommands(m, command);
      
if (isCmd) {   conn.sendPresenceUpdate("recording", m.chat);
  } else {   conn.sendPresenceUpdate("available", m.chat);
  }
  
  conn.readMessages([m.key]);
  
if (m.key.remoteJid == "status@broadcast") return conn.sendMessage(m.key.remoteJid, { react: { text: '🥰', key:  m.key } }, { statusJidList: [m.key.participant, m.sender] }).catch(() => {
        false
        });
        
if (!db.data.settings?.public && !isOwner) return;

// setReply
const setReply = async (text) => {
  const gambar = [
    "https://c.top4top.io/p_3523cv0wt1.jpg",
    "https://c.top4top.io/p_3523cv0wt1.jpg"
  ];

  const photo = gambar[Math.floor(Math.random() * gambar.length)];

  await conn.sendMessageModify(m.chat, text, m, {
    title: bot.name,
    body: styleSans(`Runtime ${runTime}`),
    largeThumb: false,
    thumbnail: photo,
    url: '', 
    mentions: [m.sender],
    businessOwnerJid: m.botNumber
  });
};
 // =========================== //
    removeExpiredSpam(senderNumber, [], AntiSpam);

    if (isBanned && !isOwner) return;

    if (isCmd && cekSpam(command, senderNumber, AntiSpam)) {
      addSpammer(senderNumber, []);
      FinisHim(senderNumber, [], sender, isOwner, Date.now());
      return console.log(chalk.bgYellowBright.black("[ SPAM ]"), `Antispam ${command} aktif`);
    }
    
    if (isCmd && !isOwner) msgFilter.addFilter(sender);

  // 1️⃣  "before"
  for (let p of Object.values(plugins)) {
    if (typeof p.before === "function") {
      try {
        await p.before(m, { conn, prefix, command, args, isOwner });
      } catch (e) {
        console.error(chalk.red(`[BEFORE ERROR] ${p.name}`), e);
      }
    }
  }

  let pluginExecuted = false;

  // 2️⃣  command
  const plugin = Object.values(plugins).find(
    (p) =>
      (!p.type || p.type === "command") &&
      (p.name === command || (p.alias && p.alias.includes(command)))
  );

  if (plugin) {
    const extras = {
      conn,
      command,
      prefix: usedPrefix || prefix,
      q,
      args,
      setReply,
      isOwner,
    };

    try {
      const allowed = await checkAccess(m, plugin, { ...extras, m });
      if (!allowed) return;

      await plugin.run?.(m, extras);
      pluginExecuted = true;

      if (typeof plugin.after === "function") {
  try {
    await plugin.after(m, { conn, ...extras });
  } catch (e) {
    console.error(chalk.red(`[AFTER ERROR] ${plugin.name}`), e);
  }
}
} catch (e) {
  console.error(chalk.red(`[PLUGIN ERROR] ${plugin.name}`), e);
  m.reply(`⚠️ Terjadi kesalahan di plugin *${plugin.name}*:\n${e.message}`);

  let errorMsg = `
⚠️ *PLUGIN ERROR*
📂 Plugin: *${plugin.name}*
👤 User: ${m.sender}
💬 Chat: ${m.chat}
🏷️ Nama Group: ${m.isGroup ? (await conn.groupMetadata(m.chat)).subject : 'Private Chat'}
⏰ Waktu: ${new Date().toLocaleString('id-ID')}
❌ Error: ${e.message}
  `.trim();

  let target = global.owner.contact + '@s.whatsapp.net';
  await conn.sendMessage(target, { text: styleSans(`${errorMsg}`) }, { quoted: m }).catch(() => {});
}
      } else if (isCmd) {
    const allCommands = Object.values(plugins)
      .filter((p) => !p.type || p.type === "command")
      .flatMap((p) => [p.name, ...(p.alias || [])])
      .filter(Boolean);

    const { bestMatch } = stringSimilarity.findBestMatch(command, allCommands);
    if (bestMatch.rating >= 0.4) {
      await setReply(
        `❌ Command *${usedPrefix + command}* tidak dikenal.\n` +
        `🤔 Mungkin maksud kamu: *${usedPrefix + bestMatch.target}*`
      );
    }
  }

  // 3️⃣ after
    for (let p of Object.values(plugins)) {
    if (typeof p.globalAfter === "function") {
      try {
        await p.globalAfter(m, { conn, pluginExecuted });
      } catch (e) {
        console.error(chalk.red(`[GLOBAL AFTER ERROR] ${p.name}`), e);
      }
    }
  }
} catch (err) {
  console.error(err);
  m.reply(`⚠️ Terjadi kesalahan di handler. ${err}`);
}}


const file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.bgBlue.black(` UPDATE HANDLER ${__filename} `));
  delete require.cache[file];
  require(file);
});