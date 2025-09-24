const {isNumber } = require("../lib/myfunc.js");

function makeid(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const calender = new Date().toISOString().split("T")[0];

module.exports.register = async function (m) {
  try {

    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.chats) global.db.data.chats = {};
let user = global.db.data.users[m.sender];
    let chat = global.db.data.chats[m.chat];
    
    if (user) {
      if (!("id" in user)) user.id = m.senderNumber;
      if (!("serial" in user)) user.serial = makeid(4).toUpperCase();
      if (!isNumber(user.hit)) user.hit = 1;
      if (!("date" in user)) user.date = calender;
      if (!isNumber(user.pc)) user.pc = 0;
      if (!("registered" in user)) user.registered = false;
      if (!("name" in user)) user.name = m.pushName || "Guest";
      if (!("email" in user)) user.email = "";
    } else {
      global.db.data.users[m.sender] = {
        id: m.senderNumber,
        name: m.pushName || "Guest",
        email: "",
        date: calender,
        hit: 0,
        serial: makeid(4).toUpperCase(),
        registered: false,
        role: "Beginner",
        premium: false,
        limit: 50,
      };
    }
    if (m.isGroup) {
      if (chat) {
        if (!("name" in chat)) chat.name = m.groupName || "";
        if (!isNumber(chat.hit)) chat.hit = 0;
        if (!("welcome" in chat)) chat.welcome = false;
      } else {
        global.db.data.chats[m.chat] = {
          name:  m.groupName || "",
          id: m.chat,
          hit: 0,
          add: 0,
          welcome: false,
          antispam: true,
          simi: true,
        };
      }
    }
    await global.db.write();
  } catch (e) {
    console.error("❌ Error register:", e);
  }
};