"use strict";
const axios = require("axios");

module.exports = {
  name: "get",
  alias: ['get'],
  description: "Ambil konten dari URL apapun (image, video, audio, pdf, zip, JSON, text, webp)",
  run: async (m, { conn,args }) => {
    const q = args.join(" ");
    if (!q) return m.reply("❌ Awali *URL* dengan http:// atau https://");

    try {
      const res = await axios.get(q, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Referer": "https://www.google.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        },
        responseType: "arraybuffer",
      });

      const contentType = res.headers["content-type"] || "";
      console.log(`Content-Type: ${contentType}`);

      // JSON
      if (/json/i.test(contentType)) {
        const jsonData = JSON.parse(Buffer.from(res.data, "binary").toString("utf8"));
        return conn.sendMessage(m.chat, { text: JSON.stringify(jsonData, null, 2) }, { quoted: m });
      }

      // Text
      if (/text/i.test(contentType)) {
        const textData = Buffer.from(res.data, "binary").toString("utf8");
        return m.reply(textData);
      }

      // WebP → sticker
      if (q.endsWith(".webp")) {
        return conn.sendSticker(m.chat, q, m);
      }

      // Image
      if (/image/i.test(contentType)) {
        return conn.sendMessage(m.chat, { image: { url: q } }, { quoted: m });
      }

      // Video
      if (/video/i.test(contentType)) {
        return conn.sendMessage(m.chat, { video: { url: q } }, { quoted: m });
      }

      // Audio / mp3
      if (/audio/i.test(contentType) || q.endsWith(".mp3")) {
        return conn.sendMessage(m.chat, { audio: { url: q } }, { quoted: m });
      }

      // Zip
      if (/application\/zip/i.test(contentType) || /application\/x-zip-compressed/i.test(contentType)) {
        return conn.sendFile(m.chat, q, "", q, m);
      }

      // PDF
      if (/application\/pdf/i.test(contentType)) {
        return conn.sendFile(m.chat, q, "", q, m);
      }

      // Fallback
      return m.reply(`MIME: ${contentType}\n\nData tidak bisa ditampilkan secara langsung.`);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      return m.reply(`⚠️ Terjadi kesalahan saat mengakses URL: ${error.message}`);
    }
  },
};