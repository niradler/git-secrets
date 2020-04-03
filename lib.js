const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const encryption = require("./encryption");

const createKey = secret => {
  return crypto
    .createHash("md5")
    .update(secret)
    .digest("hex");
};

const addSecretFile = lp => {
  fs.appendFileSync(path.join(process.cwd(), ".git-secret"), "\n" + lp);
};

const getSecretFiles = () => {
  const secret_files = fs.readFileSync(
    path.join(process.cwd(), ".git-secret"),
    "utf-8"
  );
  const files = secret_files.split("\n");

  return files;
};

const hide = (files, code) => {
  files.forEach(p => {
    const filePath = path.join(process.cwd(), p);
    const file = fs.readFileSync(filePath, "utf-8");
    fs.writeFileSync(filePath, encryption.encrypt(file, code));
  });
};

const reveal = (files, code) => {
  files.forEach(p => {
    const filePath = path.join(process.cwd(), p);
    const file = fs.readFileSync(filePath, "utf-8");
    const data = encryption.decrypt(file, code);

    fs.writeFileSync(filePath, data);
  });
};

const exitWith = (code = 0, message) => {
  if (message && code == 0) console.log(message);
  if (message && code != 0) console.error(message);
  process.exit(code);
};

module.exports = {
  createKey,
  hide,
  getSecretFiles,
  addSecretFile,
  reveal,
  exitWith
};
