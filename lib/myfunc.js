const axios = require("axios");
const fs = require("fs");

const isNumber = x => typeof x === "number" && !isNaN(x);

async function getBuffer(url, options = {}) {
  try {
    const res = await axios({
      method: "get",
      url,
      headers: {
        DNT: 1,
        "Upgrade-Insecure-Requests": 1,
      },
      responseType: "arraybuffer",
      ...options,
    });
    return res.data;
  } catch (err) {
    console.error("getBuffer error:", err);
    return Buffer.alloc(0); 
  }
}

const getGroupAdmins = function(lala){
    let admins = []
	for (let i of lala) {
		i.admin !== null ? admins.push(i.id) : ''
	}
	return admins
}

module.exports = { 
 isNumber,
 getBuffer,
 getGroupAdmins 
};

const chalk = require("chalk");
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.bgCyan(`UPDATE ${__filename}`));
  delete require.cache[file];
  require(file);
});