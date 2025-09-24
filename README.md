
<p align="center">
  <img src="https://raw.githubusercontent.com/github/explore/main/topics/whatsapp/whatsapp.png" alt="Logo" width="120">
</p>

<h1 align="center">🔥 RhnxBot — WhatsApp Bot Base</h1>

<p align="center">
  <a href="https://github.com/USERNAME/NAMA-REPO/stargazers"><img src="https://img.shields.io/github/stars/USERNAME/NAMA-REPO?style=social" alt="GitHub stars"></a>
  <a href="https://github.com/USERNAME/NAMA-REPO/blob/main/LICENSE"><img src="https://img.shields.io/github/license/USERNAME/NAMA-REPO?color=blue" alt="License"></a>
  <img src="https://img.shields.io/badge/node-%3E=18.x-brightgreen" alt="Node.js Version">
</p>

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
```

---

## 🚀 Menjalankan Bot

```bash
node main.js
```

Bot akan menampilkan **QR code atau pairing code** di terminal (tergantung setting).  
Scan atau masukkan kodenya lewat aplikasi WhatsApp untuk menghubungkan bot.

---

## ⚙️ Struktur Plugin

Semua fitur bot dibuat dalam bentuk **plugin** (file `.js` di folder tertentu).  
Ada 3 tipe dasar:

1. **Command** → Perintah yang dipanggil user (misal `.mode`, `.case`).
2. **Hook** → Fungsi yang berjalan otomatis sebelum/ sesudah setiap pesan.
3. **Case** → Command dengan subkategori & subdeskripsi (untuk menu yang rapi).

> ⚠️ **Format Plugin:**  
> Karena bot ini memakai **CommonJS (CJS)**, setiap plugin harus memakai pola:
> ```js
> "use strict";
> module.exports = { /* ... */ }
> ```

---

### 1️⃣ Contoh Hook

`/plugins/hook/hookExample.js`
```js
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
```

---

### 2️⃣ Contoh Command

`/plugins/command/mode.js`
```js
"use strict";

module.exports = {
  name: "mode",
  alias: ["public", "self"],
  description: "Ubah mode bot (public/self)",
  run: async (m, { conn, command, isOwner }) => {
    if (!isOwner) return m.reply("⚠️ Khusus owner!");
    // Lanjutkan logika ubah mode
  }
};
```

---

### 3️⃣ Contoh Case

`/plugins/case/case.js`
```js
"use strict";

module.exports = {
  name: "case",
  alias: ["susunkata","upper", "lower", "capitalize", "listcase", "getcase"],
  description: "Ubah teks atau kelola case text formatter",
  access: { owner: false },

  // Folder sub kategori menu
  subCategories: {
    upper: "Settings",
    lower: "Info",
    capitalize: "Owner",
    listcase: "Owner",
    susunkata: "Game"
  },

  // Deskripsi tiap sub case
  subDescriptions: {
    upper: "Mengubah teks menjadi huruf BESAR semua",
    lower: "Mengubah teks menjadi huruf kecil semua",
    capitalize: "Mengubah teks menjadi Kapital di awal kata",
    listcase: "melihat isi case",
    susunkata: "Permain susunkata"
  },

  run: async (m, { conn,command, q, setReply }) => {
    // fungsi logic case
  }
};
```

---

## 🧑‍💻 Kontribusi

1. Fork repository ini
2. Tambahkan fitur baru atau perbaikan bug
3. Commit & push perubahanmu
4. Buat Pull Request

---

## 📜 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
