"use strict";
const chalk = require("chalk");

function addSpammer(jid, _db) {
  let pos = _db.findIndex(u => u.id === jid);
  if (pos !== -1) _db[pos].spam += 1;
  else _db.push({ id: jid, spam: 1 });
}

function FinisHim(jid, _db, sender, senderNumber, isOwner, db, mess, calender) {
  let pos = _db.findIndex(u => u.id === jid);
  if (pos !== -1) {
    if (_db[pos].spam > 7) {
      if (db.data.users[sender].banned?.status || !isOwner) return;
      db.data.users[sender].banned = {
        id: senderNumber,
        status: true,
        date: calender,
        reason: "Spam Bot"
      };
      console.log(`${jid} ❌ Terdeteksi spam lebih dari ${_db[pos].spam} kali`);
      mess.baned?.();
    } else {
      console.log(`⚠️ Spam ke ${_db[pos].spam}`);
    }
  }
}

function SpamExpired(senderNumber, nama, _db) {
  let found = _db.findIndex(u => u.name === nama && u.id === senderNumber);
  if (found === -1) return false;

  const expired = _db[found].expired;
  if (expired === "PERMANENT") return false;
  if (Date.now() >= expired) {
    _db.splice(found, 1);
    console.log(chalk.bgGreen.black("[ REMOVE ]"), `${senderNumber} spam expired`);
    return true;
  }
  return false;
}

function cekSpam(nama, userId, _db) {
  return _db.some(u => u.name === nama && u.id === userId);
}

function removeExpiredSpam(senderNumber, spammer, AntiSpam) {
  SpamExpired(senderNumber, "Case", AntiSpam);
  SpamExpired(senderNumber, "NotCase", AntiSpam);

  let idx = spammer.findIndex(i => i.id === senderNumber);
  if (idx !== -1) {
    spammer.splice(idx, 1);
    console.log(chalk.bgGreen.black("[ REMOVE ]"), "Sukses remove spammer");
  }
}

const msgFilter = {
  _filters: [],

  isFiltered: (chatId) => {
    return msgFilter._filters.some(f => f === chatId);
  },

  addFilter: (chatId, time = 15000) => {
    if (!msgFilter.isFiltered(chatId)) {
      msgFilter._filters.push(chatId);
      setTimeout(() => {
        msgFilter._filters = msgFilter._filters.filter(f => f !== chatId);
        console.log(chalk.bgBlue.black("[ FILTER ]"), `Cooldown selesai: ${chatId}`);
      }, time);
    }
  }
};

function addSpam(name, senderId, time, _db) {
  const expired = Date.now() + parseTime(time);
  let found = _db.findIndex(u => u.name === name && u.id === senderId);
  if (found !== -1) {
    _db[found].expired = expired;
  } else {
    _db.push({ name, id: senderId, expired });
  }
}

function parseTime(timeStr) {
  let match = timeStr.match(/^(\d+)(s|m|h)$/i);
  if (!match) return 15000; 
  let value = parseInt(match[1]);
  let unit = match[2].toLowerCase();
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 3600 * 1000;
    default: return 15000;
  }
}

module.exports = {
  addSpammer,
  FinisHim,
  removeExpiredSpam,
  SpamExpired,
  cekSpam,
  msgFilter,
  addSpam
};