// Created By Raihan Fadillah

"use strict";
const fs = require("fs");
const axios = require("axios");
const { generatePrompt } = require("../../media/text/aiprompt");

const dataSimiPath = "./database/group/simi/text.json";
let dataSimi = fs.existsSync(dataSimiPath)
  ? JSON.parse(fs.readFileSync(dataSimiPath))
  : {};

module.exports = {
  name: "simiReplyHook",
  description: "Hook untuk reply AI / sticker / audio saat user reply ke bot",
  type: "hook",

  before: async (m, { conn, prefix }) => {
    const isSimi = m.isGroup ? db.data.chats[m.chat]?.simi : false;
    if (!isSimi) return;
    if (!m.mentionByReply) return;

    const isCmd = m.body?.startsWith(prefix);
    if (isCmd) return; 

    const botJid = conn.decodeJid(conn.user.id);
    const isReplyToBot = m.mentionByReply.sender === botJid;
    if (!isReplyToBot) return;

    const quotedMsg = m.mentionByReply.message;
      
    const mType = Object.keys(m.message || {})[0]; 
      
    const isText = mType === "conversation" || mType === "extendedTextMessage";
    const isSticker = mType === "stickerMessage";
    const isAudio = mType === "audioMessage";

    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const systemPrompt = generatePrompt(m);

    const kirimPesan = async (teks) => {
      try {
        const res = await axios.post(
          "https://ai.siputzx.my.id/",
          { content: teks, user: m.sender, prompt: systemPrompt },
          { headers: { "Content-Type": "application/json" } }
        );
        return res.data?.result || res.data;
      } catch (e) {
        console.error("Gagal kirim pesan:", e.message);
        return null;
      }
    };

    const replyAI = async (text) => {
      const lowerText = text.toLowerCase();
      if (dataSimi[lowerText]) {
        await conn.sendMessage(m.chat, { text: pickRandom(dataSimi[lowerText]) }, { quoted: m });
      } else {
        const aiReply = await kirimPesan(text);
        if (aiReply) {
          await conn.sendMessage(m.chat, { text: styleSans(`${aiReply}`) }, { quoted: m });
        } else {
          await conn.sendMessage(m.chat, { text: "Hmm, gw nggak ngerti maksud lu nih 😅" }, { quoted: m });
        }
      }
    };

    const replySticker = async () => {
      const stickerPath = "./database/storage/sticker.json";
      if (!fs.existsSync(stickerPath)) return;
      const stickerData = JSON.parse(fs.readFileSync(stickerPath));
      if (!stickerData.length) return;
      const randomSticker = pickRandom(stickerData);
      if (randomSticker?.urlSticker) {
        await conn.sendMessage(
          m.chat,
          { sticker: { url: randomSticker.urlSticker } },
          { quoted: m }
        );
      }
    };

    const replyAudio = async () => {
      const audioPath = "./database/group/simi/vn.json";
      if (!fs.existsSync(audioPath)) return;
      const audioData = JSON.parse(fs.readFileSync(audioPath));
      if (!audioData.length) return;
      const randomAudio = pickRandom(audioData);
      if (randomAudio?.urlAudio) {
        await conn.sendMessage(
          m.chat,
          { audio: { url: randomAudio.urlAudio }, mimetype: "audio/mpeg" },
          { quoted: m }
        );
      }
    };

    try {
      if (isSticker) {
        await sleep(500);
        await replySticker();
      } else if (isText) {
        const userText = m.text || quotedMsg?.extendedTextMessage?.text;
        conn.sendPresenceUpdate("composing", m.chat);
        await sleep(800);
        await replyAI(userText);
      } else if (isAudio) {
        await sleep(500);
        await replyAudio();
      }
    } catch (err) {
      console.error("Hook Error:", err);
    }
  },
};