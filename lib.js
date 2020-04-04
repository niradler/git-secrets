const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const encryption = require("./encryption");

const createKey = (secret) => {
  return crypto.createHash("md5").update(secret).digest("hex");
};

const getConfigFileName = (defaultName = ".git-secrets") => {
  const customConfig = process.env.GIT_SECRETS_CONFIG;
  return customConfig ? customConfig : defaultName;
};

const addSecretFile = (lp) => {
  fs.appendFileSync(path.join(process.cwd(), getConfigFileName()), "\n" + lp);
};

const init = () => {
  fs.writeFileSync(
    path.join(process.cwd(), getConfigFileName()),
    "secrets.json"
  );
  fs.writeFileSync(
    path.join(process.cwd(), "secrets.json"),
    JSON.stringify({})
  );
};

const getSecretFiles = () => {
  const secret_files = fs.readFileSync(
    path.join(process.cwd(), getConfigFileName()),
    "utf-8"
  );
  const files = secret_files.split("\n");

  return files;
};

const hide = (files, code) => {
  files.forEach((p) => {
    const filePath = path.join(process.cwd(), p);
    const file = fs.readFileSync(filePath, "utf-8");
    fs.writeFileSync(filePath, encryption.encrypt(file, code));
  });
};

const reveal = (files, code) => {
  files.forEach((p) => {
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

const getKey = (key) => {
  const steps = ["env", "file"];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    switch (step) {
      case "env":
        if (!key) key = process.env.GIT_SECRETS_KEY;
        break;
      case "file":
        try {
          if (!key)
            key = fs
              .readFileSync(path.join(process.cwd(), ".git-secrets.key"))
              .toString();
        } catch (error) {}
        break;
    }
  }
  if (!key) {
    throw new Error(
      "key must be provided, as a param or as an env variable (GIT_SECRETS_KEY) or as a file (.git-secrets.key)"
    );
  }

  return key;
};
module.exports = {
  getKey,
  createKey,
  hide,
  getSecretFiles,
  addSecretFile,
  reveal,
  exitWith,
  init,
};
