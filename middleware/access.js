"use strict";
const fs = require("fs");

const dataGcStore = "./database/store/groupstore.json";
const getGroupStoreIds = () => {
  if (!fs.existsSync(dataGcStore)) return [];
  let dataStoreId = JSON.parse(fs.readFileSync(dataGcStore));
  return dataStoreId.map((group) => group.jid);
};
let groupStoreIds = getGroupStoreIds();

module.exports = async function checkAccess(m, commandConfig, extras) {
  const { isOwner, isPremium } = extras;
  const access = commandConfig.access || {};

  // OWNER + PRIVATE (kombinasi khusus)
  if (access.owner && access.private) {
    if (!isOwner) {
      m.reply("❌ Maaf, fitur ini khusus Owner.");
      return false;
    }
    if (m.isGroup) {
      m.reply("❌ Fitur ini hanya bisa digunakan di chat Private.");
      return false;
    }
    return true;
  }

  // OWNER ONLY
  if (access.owner && !isOwner) {
    m.reply("❌ Maaf, fitur ini khusus Owner.");
    return false;
  }

  // PREMIUM ONLY
  if (access.premium && !isPremium) {
    m.reply("❌ Maaf, fitur ini khusus Premium.");
    return false;
  }

  // GROUP ONLY
  if (access.group && !m.isGroup) {
    m.reply("❌ Fitur ini hanya bisa digunakan di Group.");
    return false;
  }

  // PRIVATE ONLY
  if (access.private && m.isGroup) {
    m.reply("❌ Fitur ini hanya bisa digunakan di chat Private.");
    return false;
  }

  // GROUP STORE ONLY
  if (access.groupstore) {
    if (!m.isGroup) {
      m.reply("❌ Fitur ini hanya bisa digunakan di Group.");
      return false;
    }
    if (!groupStoreIds.includes(m.chat)) {
      m.reply("❌ Grup ini tidak terdaftar sebagai *Group Store*.");
      return false;
    }
  }

  // GROUP STORE BLOCK
  if (access.nogroupstore && m.isGroup && groupStoreIds.includes(m.chat)) {
    m.reply("❌ Fitur ini tidak bisa digunakan di Group Store.");
    return false;
  }

  // LIMIT HANDLER
  if (access.limit) {
    m.consumeLimit = async () => {
      let user = global.db.data.users[m.sender];
      if (!user) {
        user = { limit: 50 };
        global.db.data.users[m.sender] = user;
      }

      if (!isOwner && !isPremium) {
        if (user.limit <= 0) {
          m.reply("❌ Limit kamu habis, tunggu reset harian.");
          return false;
        }

        user.limit -= 1;
        m.reply(`⚡ Limit kamu sisa *${user.limit}*`);
      } else {
        m.reply(`⚡ Kamu pakai fitur dengan akses *Unlimited Limit*`);
      }
    };
  }

  return true;
};