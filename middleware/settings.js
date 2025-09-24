module.exports.settings = async function (m, isNumber) {
  try {  
    if (!global.db.data.settings) {
      global.db.data.settings = {
        status: Date.now(),
        multi: true,
        prefix: "!",
        sarancmd: false,
        public: true,
        style: "sans",
        language: " id",
      };
    }

    let settings = global.db.data.settings;
    if (!isNumber(settings.status)) settings.status = Date.now();
    if (typeof settings.multi !== "boolean") settings.multi = true;
    if (typeof settings.prefix !== "string") settings.prefix = "!";
    if (typeof settings.sarancmd !== "boolean") settings.sarancmd = false;
    if (typeof settings.public !== "boolean") settings.public = true;
    
    await global.safeWriteDB();
  } catch (e) {
    console.error("❌ Error settings:", e);
  }
};