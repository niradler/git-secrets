const crypto = require("crypto");

const decrypt = (data, key) => {
  const [isSecret, ivHex, encoded] = data.split(":");

  if (isSecret != "secret") {
    console.error("Not a secret.");
    process.exit(1);
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    Buffer.from(ivHex, "hex")
  );

  let decryptedString = decipher.update(Buffer.from(encoded, "hex"));
  decryptedString = Buffer.concat([decryptedString, decipher.final()]);

  return decryptedString.toString("utf8");
};

const encrypt = (data, key) => {
  const [isSecret] = data.split(":");
  if (isSecret == "secret") {
    console.error("Already a secret.");
    process.exit(1);
  }

  const IV_LENGTH = 16;

  if (!key)
    if (!key) {
      console.error("Please ensure that an encryption key is provided.");
      process.exit(1);
    }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `secret:${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

module.exports = {
  encrypt,
  decrypt
};
