const lib = require("./lib");
const Path = require("path");
const fs = require("fs");
const util = require("util");
const fileExists = util.promisify(fs.exists);

const main = async (cmd, args = {}) => {
  try {
    switch (cmd) {
      case "ADD_SECRET_FILE":
        {
          const { path } = args;
          if (!args.catch) {
            const found = await fileExists(Path.join(process.cwd(), path));
            if (!found) throw new Error("File not found.");
          }
          lib.addSecretFile(path);
        }
        break;

      case "REVEAL":
        {
          const { key, ignore } = args;
          const code = lib.createKey(key);
          let files = lib.getSecretFiles();
          if (ignore) {
            const promises = files.map((p) =>
              fileExists(Path.join(process.cwd(), p)).then((e) => ({
                exists: e,
                path: p,
              }))
            );
            const exists = await Promise.all(promises);
            files = exists.filter((e) => e.exists).map((e) => e.path);
          }
          lib.reveal(files, code);
        }
        break;

      case "HIDE":
        {
          const { key, ignore } = args;
          const code = lib.createKey(key);
          let files = lib.getSecretFiles();
          if (ignore) {
            const promises = files.map((p) =>
              fileExists(Path.join(process.cwd(), p)).then((e) => ({
                exists: e,
                path: p,
              }))
            );
            const exists = await Promise.all(promises);
            files = exists.filter((e) => e.exists).map((e) => e.path);
          }
          lib.hide(files, code);
        }
        break;

      case "INIT":
        {
          lib.init();
        }
        break;

      default: {
        throw new Error("cmd not found");
      }
    }

    lib.exitWith(0, "Complete!");
  } catch (error) {
    const minor = ["Already a secret.", "Not a secret."];
    if (args.catch && minor.includes(error.message)) {
      console.log("catch minor turn on, exiting gracefully.");
      lib.exitWith(0, error.message);
    } else lib.exitWith(1, error.message);
  }
};

module.exports = main;
