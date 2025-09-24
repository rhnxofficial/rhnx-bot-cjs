module.exports = {
  name: "listuser",
  alias: ["users", "listusr"],
  desc: "Menampilkan daftar user yang tersimpan di database",
  access: { 
    owner: true,    
    premium: false, 
    limit: false    
  },
  run: async (m, { conn, q,extras }) => {
  

    const usersDB = global.db.data.users || {};
    const totalUsers = Object.keys(usersDB).length;

    if (totalUsers === 0) {
      return m.reply("❌ Belum ada user yang tersimpan di database.");
    }

    let text = `📋 Daftar user (${totalUsers}):\n\n`;
    let i = 1;
    for (let jid in usersDB) {
      const user = usersDB[jid];
      const name = user.name || "-";
      const premiumStatus = user.premium ? "🌟 Premium" : "🔹 Regular";
      text += `${i++}. ${name} | ${jid.split("@")[0]} | ${premiumStatus}\n`;
    }

    m.reply(text);
  }
};