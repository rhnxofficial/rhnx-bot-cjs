"use strict";
require("./settings.js");

const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
 makeCacheableSignalKeyStore,
  DisconnectReason
} = require("baileys");

const fs = require("fs");
const pino = require("pino");
const CFonts = require("cfonts");
const { connectionUpdate, clearConsole } = require("./lib/connection.js");
const simple = require("./lib/simple");
const handler = require("./handler.js");



CFonts.say('RHNX', {
  font: 'block',  
  align: 'center',
  colors: ['cyan'],
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
})

CFonts.say('Follow & Subscribe', {
  font: 'console',
  align: 'center',
  colors: ['white']
})

CFonts.say('youtube.com/@rhnxofficial', {
  font: 'console',
  align: 'center',
  colors: ['yellow']
})


const connectToWhatsApp = async () => {

const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const dbFolder = "./database";
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });

const dbFile = `${dbFolder}/database.json`;
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, "{}");

const defaultData = {
  blockcmd: [],
  dashboard: [],
  antispam: [],
  banned: [],
  data: [],
  users: {},
  chats: {},
  settings: {},
  toxic: [],
  others: {}
};

const adapter = new JSONFile(dbFile);
global.db = new Low(adapter, defaultData);

global.safeWriteDB = async () => {
  try {
    const tmpFile = `${dbFolder}/.database.json.tmp`;

    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
      console.log("🧹 File tmp dihapus:", tmpFile);
    }

    if (!global.db?.data) {
      global.db.data = { ...defaultData };
    }

    await global.db.write();
  } catch (err) {
    console.warn("⚠️ Gagal menulis database:", err.message);
  }
};


(async () => {
  try {
    await global.db.read();
    if (!global.db.data || Object.keys(global.db.data).length === 0) {
      global.db.data = { ...defaultData };
      await global.safeWriteDB();
    }

    console.log("✅ Database siap dipakai");
  } catch (err) {
    console.error("❌ Gagal load database:", err.message);
    global.db.data = { ...defaultData };
  }
})();
 
setInterval(() => {
let data = global.db.data.others['runtime']

if(data){
if((new Date - data.lastTime) > (60000*60)){
data.runtime = + new Date
data.lastTime = + new Date
console.log("Runtime di perbarui")
} else data.lastTime = + new Date
} else{ global.db.data.others['runtime'] = {
runtime: + new Date,
lastTime: + new Date
}
console.log("New update runtime")
}

},60000)

  const { state, saveCreds } = await useMultiFileAuthState(system.sessionName);
  
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    printQRInTerminal: !system.pairingCode,
		syncFullHistory: true,
		markOnlineOnConnect: true,
		connectTimeoutMs: 60000,
		defaultQueryTimeoutMs: 0,
		keepAliveIntervalMs: 10000,
      generateHighQualityLinkPreview: true,
		version,
			browser: ["Ubuntu", "Chrome", "20.0.04"],
		logger: pino({
			level: 'fatal'
		}),
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, pino().child({
				level: 'silent',
				stream: 'store'
			})),
		}
	});

  global.conn = simple.Func(sock);

  if (system.pairingCode && !sock.authState.creds.registered) {
    await clearConsole();
    console.log(`🔗 Sedang proses pairing ke nomor ${system.pairingNumber}`);
    setTimeout(async () => {
      let code = await sock.requestPairingCode(system.pairingNumber);
      
      console.log(`🔑 Pairing Code: ${code.toUpperCase()}`);
    }, 2000);
  }

  global.processedMessages = global.processedMessages || new Set();
  sock.ev.on("connection.update", async (update) => {
    connectionUpdate(connectToWhatsApp, sock, update);
  });
  

// simpen sesi
  sock.ev.on("creds.update", saveCreds);
    
  sock.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      if (!chatUpdate.messages) return;

      for (let msg of chatUpdate.messages) {
        if (!msg.message || !msg.key.remoteJid) continue;
        if (global.processedMessages.has(msg.key.id)) continue; // filter duplikat
        global.processedMessages.add(msg.key.id);

        if (msg.message?.viewOnceMessageV2) msg.message = msg.message.viewOnceMessageV2.message;
        if (msg.message?.viewOnceMessageV2Extension) msg.message = msg.message.viewOnceMessageV2Extension.message;
        if (msg.message?.documentWithCaptionMessage) msg.message = msg.message.documentWithCaptionMessage.message;

        if (msg.isBaileys) continue;
        if (msg.key.fromMe) continue;
        if (msg.key?.id?.startsWith("3EB0") && msg.key.id.length === 22) continue;

        let m = await simple.smsg(sock, msg);
        if (!m) continue;
        if (typeof handler === "function") {
          await handler(sock, m, chatUpdate);
        }
      }
    } catch (err) {
      console.error("❌ Error di messages.upsert:", err);
    }
  });
  
  

function clockString(ms) {
let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
var dDisplay = d > 0 ? d + (d == 1 ? " hari, " : " hari, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " jam, " : " jam, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " menit, " : " menit, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " detik" : " detik") : "";
let time = d > 0 ? dDisplay + hDisplay + mDisplay + sDisplay : hDisplay + mDisplay + sDisplay
return time
}
global.clockString = clockString 
  
  return sock;
};

connectToWhatsApp();