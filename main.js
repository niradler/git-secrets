const lib = require("./lib");
const Path = require("path");
const fs = require("fs");
const util = require("util");
const fileExists = util.promisify(fs.exists);

const main = async (cmd, args = {}) => {
  try {
    switch (cmd) {
      case "ADD_SECRET_FILE":
        const { path, ignore } = args;
        if (!ignore) {
          const found = await fileExists(Path.join(process.cwd(), path));
          if (!found) throw new Error("File not found.");
        }

        lib.addSecretFile(args.path);
        break;

      case "REVEAL":
        const { ignore, code } = args;
        const key = lib.createKey(code);
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
        lib.reveal(files, key);
        break;

      case "HIDE":
        const { ignore, code } = args;
        const key = lib.createKey(code);
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
        lib.hide(files, key);
        break;

      case "ADD_SECRET_FILE":
        const { path } = args;
        lib.addSecretFile(path);
        break;

      case "INIT":
        const { path } = args;
        lib.init(filename);
        break;

      default:
        throw new Error("cmd not found");
    }

    lib.exitWith(0, "Complete!");
  } catch (error) {
    lib.exitWith(1, error.message);
  }
};

module.exports = main;
