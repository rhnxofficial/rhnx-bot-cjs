
---

# 🔥 RhnxBot — WhatsApp Bot Base

Base WhatsApp Bot menggunakan [Baileys](https://github.com/WhiskeySockets/Baileys).  
Cocok untuk developer yang ingin membuat bot sendiri dengan sistem **plugin**, **command**, dan **hook**.

> ⚡ **Catatan Penting:**  
> Semua file plugin menggunakan **CommonJS (CJS)** → ditandai dengan `module.exports = { ... }`.  
> Jadi **tidak menggunakan ESM** (`export default`). Pastikan file JS kamu sesuai format ini agar bot dapat membaca plugin dengan benar.

---

## ✨ Fitur Utama
- ✅ **Command system** — mudah menambah perintah baru.
- ✅ **Hook system** — bisa menjalankan kode sebelum & sesudah setiap pesan / command.
- ✅ **Kategori & subkategori** — memudahkan pengelompokan menu.
- ✅ Menggunakan **CommonJS module system** (CJS) → kompatibel dengan Node.js default.
- ✅ Open-source & dapat dikembangkan sesuai kebutuhan.

---

## 📦 Instalasi

> **Disarankan** memakai [Termux](https://termux.dev/) di Android atau terminal Linux.

```bash
# Clone repo
git clone https://github.com/USERNAME/NAMA-REPO.git
cd NAMA-REPO

# Install dependency
npm install


---

🚀 Menjalankan Bot

node main.js

Bot akan menampilkan QR code atau pairing code di terminal (tergantung setting).
Scan atau masukkan kodenya lewat aplikasi WhatsApp untuk menghubungkan bot.


---

⚙️ Struktur Plugin

Semua fitur bot dibuat dalam bentuk plugin (file .js di folder tertentu).
Ada 3 tipe dasar:

1. Command → Perintah yang dipanggil user (misal .mode, .case).


2. Hook → Fungsi yang berjalan otomatis sebelum/ sesudah setiap pesan.


3. Case → Command dengan subkategori & subdeskripsi (untuk menu yang rapi).



> ⚠️ Format Plugin:
Karena bot ini memakai CommonJS (CJS), setiap plugin harus memakai pola:

"use strict";
module.exports = { /* ... */ }




---

1️⃣ Contoh Hook

/plugins/hook/hookExample.js

"use strict";

module.exports = {
  name: "hookExample",
  description: "Contoh plugin hook dengan before & after",
  type: "hook",

  before: async (m, { conn }) => {
    if (m.text && m.text.toLowerCase() === "tess") {
      await conn.sendMessage(
        m.chat,
        { text: "✅ Before hook: tes function berhasil" },
        { quoted: m }
      );
    }
  },

  after: async (m, { conn, command }) => {
    if (command) {
      await conn.sendMessage(
        m.chat,
        { text: `✅ After hook aktif (command *${command}* sudah diproses)` },
        { quoted: m }
      );
    } else if (m.text) {
      await conn.sendMessage(
        m.chat,
        { text: "ℹ️ After hook aktif. Pesan biasa diterima." },
        { quoted: m }
      );
    }
  },
};


---

2️⃣ Contoh Command Sederhana

/plugins/command/mode.js

"use strict";

module.exports = {
  name: "mode",
  alias: ["public", "self"],
  description: "Ubah mode bot (public/self)",
  run: async (m, { conn, command, isOwner }) => {
    if (!isOwner) return m.reply("⚠️ Khusus owner!");
    // Tambahkan logic ubah mode bot di sini
  },
};


---

3️⃣ Contoh Command Tipe Case

/plugins/case/case.js

"use strict";

module.exports = {
  name: "case",
  alias: ["susunkata", "upper", "lower", "capitalize", "listcase", "getcase"],
  description: "Ubah teks atau kelola case text formatter",
  access: { owner: false },

  // Kategori menu
  subCategories: {
    upper: "Settings",
    lower: "Info",
    capitalize: "Owner",
    listcase: "Owner",
    susunkata: "Game"
  },

  // Deskripsi untuk setiap sub command
  subDescriptions: {
    upper: "Mengubah teks menjadi huruf BESAR semua",
    lower: "Mengubah teks menjadi huruf kecil semua",
    capitalize: "Mengubah teks menjadi Kapital di awal kata",
    listcase: "Melihat daftar case",
    susunkata: "Permainan susun kata"
  },

  run: async (m, { conn, command, q, setReply }) => {
    const { budy, body } = m
    const user = global.db.data.users[m.sender]

    try {
      switch (command) {

        case 'susunkata':
          // Tambahkan logic game susun kata di sini
          break;

        case 'upper':
          if (!q) return setReply("Masukkan teks yang ingin diubah ke huruf besar");
          setReply(q.toUpperCase());
          break;

        // Tambahkan case lainnya sesuai kebutuhan

      }
    } catch (e) {
      console.error(e)
      setReply("Terjadi error.")
    }
  },
};


---

🛠️ Cara Menambah Command Baru

1. Buat file baru di folder plugins/command/.


2. Gunakan template dasar CJS:



"use strict";

module.exports = {
  name: "namaCommand",
  alias: ["alias1", "alias2"],
  description: "Deskripsi singkat",
  run: async (m, { conn, command, q }) => {
    // kode perintah di sini
  },
};

3. Restart bot agar perintah baru dikenali.




---

🔐 Mode Bot

Public → Semua orang bisa pakai command.

Self → Hanya owner yang bisa pakai command.


> Ubah dengan perintah:



.mode public
.mode self


---

🤝 Kontribusi

1. Fork repo ini.


2. Tambahkan fitur / perbaikan.


3. Buat pull request.




---

⚡ Tips Penting

Jika muncul error dubious ownership, jalankan:

git config --global --add safe.directory /storage/emulated/0/BOT-WA/rhnxbot

Gunakan Personal Access Token saat push via HTTPS dari Termux.

Jika ingin memakai SSH, buat key dengan ssh-keygen lalu daftarkan di GitHub.



---

👨‍💻 Dibuat dengan ❤️ untuk developer yang ingin belajar membuat WhatsApp Bot Base sendiri.

---

> Kamu bisa langsung salin teks ini ke file `README.md` di root project lalu commit dan push:
```bash
git add README.md
git commit -m "Add README.md"
git push
