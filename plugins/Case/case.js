"use strict";

const fs = require("fs");
const path = require("path");
const filePath = __filename; 
const fetch = require('node-fetch');

module.exports = {
  name: "case",
  alias: ["susunkata","upper", "lower", "capitalize", "listcase", "getcase"],
  description: "Ubah teks atau kelola case text formatter",
  access: { owner: false },
// ini biar pas di menu nampil di folder yang di sesuaikan case nya
  subCategories: {
    upper: "Settings",
    lower: "Info",
    capitalize: "Owner",
    listcase: "Owner",
    susunkata: "Game"
  },
// ini deskripsi case nya yah
  subDescriptions: {
    upper: "Mengubah teks menjadi huruf BESAR semua",
    lower: "Mengubah teks menjadi huruf kecil semua",
    capitalize: "Mengubah teks menjadi Kapital di awal kata",
    listcase: "melihat isi case",
    susunkata: "Permain susunkata"
  },

  run: async (m, { conn,command, q, setReply }) => {
      //  FUNCTION CASE
// NOTE : kalo Function Nya Pemanggilan Sebelum Command Di Pake Kayak Yang Game Tuh Nah itu buat function Nya pake hook contoh nya ada di path Function Dan path Game_hook
      
const { budy,body } = m
const user = global.db.data.users[m.sender]

    try {
      switch (command) {


case 'susunkata': {
    
    if (!m.isGroup) return; 
    let poin = 1000; 
    let timeout = 120000; 
    let id = m.chat;
    if (id in  conn.susunkata) {
        return setReply('Masih ada soal belum terjawab di chat ini.');
    }
    try {
        let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json')).json();
        let json = src[Math.floor(Math.random() * src.length)]; 
        let caption = 
            `*🎮 GAME SUSUN KATA 🎮*\n\n` +
            `*Soal :* ${json.soal}\n` +
            `*Tipe :* ${json.tipe}\n\n` +
            `⏱ *Timeout:* ${(timeout / 1000).toFixed(2)} detik\n` +
            `🎁 *Exp:* +999\n` +
            `💸 *Bonus:* +${poin} Balance\n`.trim()
        ;
         conn.susunkata[id] = [
            await setReply(caption), 
            json, 
            poin, 
            setTimeout(async () => {
              //  conn.sendSticker(m.chat,'https://pomf2.lain.la/f/wjw7ptlr.webp',m);
                await m.reply(
                    `⏱ *Waktu habis!*\n` +
                    `Jawaban yang benar adalah: *${json.jawaban}*`
                );
                delete  conn.susunkata[id]; 
            }, timeout),
        ];
  
        m.reply('1 limit game Anda telah terpakai.');
    } catch (err) {
        console.error(err); 
    }
}
break;          
        case "upper": {
         if (m.isGroup) return m.reply('di tolak husus private misal')
          if (!q) {
            setReply("❌ Masukkan teks.");
            break;
          }
          setReply(q.toUpperCase());
          break;
        }

        case "lower": {
          if (!q) {
            setReply("❌ Masukkan teks.");
            break;
          }
          setReply(q.toLowerCase());
          break;
        }

        case "capitalize": {
          if (!q) {
            setReply("❌ Masukkan teks.");
            break;
          }
          const cap = q
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
          setReply(cap);
          break;
        }

        case "listcase": {
          const names = Object.keys(module.exports.subCategories);
          if (names.length === 0) {
            setReply("📂 Belum ada case.");
            break;
          }

          let teks = "📋 *Daftar Case:*\n\n";
          names.forEach((n, i) => {
            teks += `${i + 1}. ${n} [${module.exports.subCategories[n]}]\n`;
          });
          setReply(teks);
          break;
        }

        case "getcase": {
          if (!q) {
            setReply("❌ Format: .getcase <nama>");
            break;
          }

          const cat = module.exports.subCategories[q];
          const desc = module.exports.subDescriptions[q];

          if (!cat || !desc) {
            setReply(`❌ Case '${q}' tidak ditemukan.`);
            break;
          }

          const content = fs.readFileSync(filePath, "utf8");

          const regex = new RegExp(
            `case\\s+"${q}"[\\s\\S]*?break;`,
            "g"
          );
          const match = content.match(regex);

          let kode = match ? match[0] : "// Tidak bisa menemukan kode case.";

          let teks = `📌 *Detail Case: ${q}*\n`;
          teks += `- Kategori : ${cat}\n`;
          teks += `- Deskripsi : ${desc}\n\n`;
          teks += `💻 *Kode Case:*\n\`\`\`js\n${kode}\n\`\`\``;

          setReply(teks);
          break;
        }

        default: {
          setReply("❌ Command tidak dikenal.");
          break;
        }
      }
    } catch (err) {
      console.error("[Case Error]", err);
      await setReply("Terjadi error.");
    }
  }
};