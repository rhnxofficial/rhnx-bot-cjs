"use strict";

module.exports = {
  name: "addinfo",
  alias: ["newinfo"],
  description: "Isi info terbaru",
  access: { owner: true },
  run: async (m, { conn, args, setReply }) => {
    const q = args.join(" ");
    if (!q) return setReply("Masukkan info terbaru");

    let data = global.db.data.others["newinfo"];
    if (data) {
      data.info = q;
      data.lastinfo = +new Date();
      setReply("Berhasil memperbarui info update");
    } else {
      global.db.data.others["newinfo"] = {
        info: q,
        lastinfo: +new Date(),
      };
      setReply("Berhasil memperbarui info update");
    }
  },
};