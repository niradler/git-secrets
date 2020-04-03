#!/usr/bin/env node
const main = require("./main");
const Yargs = require("yargs"); // eslint-disable-line

Yargs.usage("git-secrets [command]");

Yargs.command(
  "init",
  "init git secrets files.",
  yargs => {},
  argv => {
    if (argv.v) console.log(argv);
    main("INIT", argv);
  }
)
  .command(
    "add",
    "add secret file.",
    yargs => {
      yargs.positional("ignore", {
        describe: "ignore file not exists.",
        default: false
      });
      yargs.positional("path", {
        describe: "path to add.",
        require: true
      });
    },
    argv => {
      if (argv.v) console.log(argv);
      main("ADD_SECRET_FILE", argv);
    }
  )
  .command(
    "reveal",
    "reveal all secrets file.",
    yargs => {
      yargs.positional("ignore", {
        describe: "ignore file not exists.",
        default: false
      });
      yargs.positional("key", {
        describe: "decryption key.",
        require: true
      });
    },
    argv => {
      if (argv.v) console.log(argv);
      main("REVEAL", argv);
    }
  )
  .command(
    "hide",
    "hide all secrets file.",
    yargs => {
      yargs.positional("ignore", {
        describe: "ignore file not exists.",
        default: false
      });
      yargs.positional("key", {
        describe: "encryption key.",
        require: true
      });
    },
    argv => {
      if (argv.v) console.log(argv);
      main("HIDE", argv);
    }
  )
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging"
  }).argv;

if (Yargs.argv["_"].length == 0) {
  Yargs.showHelp();
}
