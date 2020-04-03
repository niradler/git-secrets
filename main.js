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
          const { path, ignore } = args;
          if (!ignore) {
            const found = await fileExists(Path.join(process.cwd(), path));
            if (!found) throw new Error("File not found.");
          }
          lib.addSecretFile(args.path);
        }
        break;

      case "REVEAL":
        {
          const { ignore, key } = args;
          const code = lib.createKey(key);
          let files = lib.getSecretFiles();
          if (ignore) {
            const promises = files.map(p =>
              fileExists(Path.join(process.cwd(), p)).then(e => ({
                exists: e,
                path: p
              }))
            );
            const exists = await Promise.all(promises);
            files = exists.filter(e => e.exists).map(e => e.path);
          }
          lib.reveal(files, code);
        }
        break;

      case "HIDE":
        {
          const { ignore, key } = args;
          const code = lib.createKey(key);
          let files = lib.getSecretFiles();
          if (ignore) {
            const promises = files.map(p =>
              fileExists(Path.join(process.cwd(), p)).then(e => ({
                exists: e,
                path: p
              }))
            );
            const exists = await Promise.all(promises);
            files = exists.filter(e => e.exists).map(e => e.path);
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
    lib.exitWith(1, error.message);
  }
};

module.exports = main;
