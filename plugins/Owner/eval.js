const util = require("util");

module.exports = {
  name: ">",
  alias: [">"],
  description: "Menjalankan kode JavaScript (khusus owner)",

  run: async (m, { conn, args, isOwner }) => {
    if (!isOwner) return m.reply("⚠️ Khusus owner!");

    const code = args.join(" ");
    if (!code) return m.reply("❌ Masukkan kode JavaScript!");

    try {
      const start = process.hrtime.bigint();
      let result = await eval(code);
      if (typeof result !== "string") {
        result = util.inspect(result, { depth: 1 });
      }
      const end = process.hrtime.bigint();
      const execTime = Number(end - start) / 1e6; 

      await m.reply(
        `✅ *Eval sukses!*\n\n📥 Input:\n\`\`\`\n${code}\n\`\`\`\n\n📤 Output:\n\`\`\`\n${result}\n\`\`\`\n⏱ ${execTime.toFixed(2)} ms`
      );
    } catch (err) {
      await m.reply(`❌ *Eval error:*\n\`\`\`\n${err}\n\`\`\``);
    }
  },
};