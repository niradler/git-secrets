const lib = require("./lib");
const path = require("path");
const fs = require("fs");
const util = require("util");
const fileExists = util.promisify(fs.exists);

const code = lib.createKey("nir");

const main = async () => {
  try {
    let files = lib.getSecretFiles();
    const promises = files.map(p =>
      fileExists(path.join(process.cwd(), p)).then(e => ({
        exists: e,
        path: p
      }))
    );
    const exists = await Promise.all(promises);
    const hasNotExists = exists.some(e => !e.exists);
    files = exists.filter(e => e.exists).map(e => e.path);
    lib.hide(files, code);
    lib.reveal(files, code);
    lib.exitWith(0, "Complete!");
  } catch (error) {
    lib.exitWith(1, error.message);
  }
};

main();
