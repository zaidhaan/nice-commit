#!/usr/bin/env node

const c = require("chalk");
const chalk = new c.constructor({enabled: true});
const shell = require("shelljs");
const inquirer = require("inquirer");
const fs = require("fs");
const clear = require("clear");
const argv = require("minimist")(process.argv.slice(2));
const { join } = require("path");

let data = {};

if (process.argv.slice(2).length == 0) {
  if (fs.existsSync(join(__dirname, "config.json"))) {
    let config = JSON.parse(fs.readFileSync(join(__dirname, "config.json")));
    let tag = "";
    let cmsg = "";
    let desc = "";
    let emojis = "";
    if (config.type === "tag") {
      inquirer.prompt([
        {
          type: "list",
          name: "tag",
          message: "What tag do you want to label on your commit?",
          choices: config.tags
        },
        {
          type: "input",
          name: "cmsg",
          message: "Enter your commit message"
        }
      ]).then((answers) => {
        tag = answers.tag;
        cmsg = answers.cmsg;
        if (config.needsDesc == true) {
          inquirer.prompt([{
            type: "input",
            name: "desc",
            message: "Enter the description of your commit",
            validate: function(v) {
              if (v === "" || v == null) {
                if (config.descRequired) {
                  return "A description is required! (as stated in the config)";
                } else { return true; }
              } else { return true; }
            }
          }]).then((answers) => {
            desc = (answers.desc == "" || answers.desc == null) ? null : answers.desc;
            execute(tag, cmsg, desc);
          });
        } else {
          execute(tag, cmsg, desc);
        }
      });
    } else {
      emojis = [];
      for (const e in config.emojis) {
	      emojis.push(config.emojis[e]);
      }
      inquirer.prompt([
        {
          type: "list",
          name: "ej",
          message: "What emoji do you want to label on your commit?",
          choices: emojis
        },
        {
          type: "input",
          name: "cmsg",
          message: "Enter your commit message"
        }
      ]).then((answers) => {
        for (const e in config.emojis) {
  	      if (config.emojis[e] === answers.ej) {
            tag = e;
          }
        }
        cmsg = answers.cmsg;
        if (config.needsDesc == true) {
          inquirer.prompt([{
            type: "input",
            name: "desc",
            message: "Enter the description of your commit",
            validate: function(v) {
              if (v === "" || v == null) {
                if (config.descRequired) {
                  return "A description is required! (as stated in the config)";
                } else { return true; }
              } else {
                return true;
              }
            }
          }]).then((answers) => {
            desc = (answers.desc == "" || answers.desc == null) ? null : answers.desc;
            execute(tag, cmsg, desc);
          });
        } else {
          execute(tag, cmsg, desc);
        }
      });
    }
  } else {
    console.log(chalk.yellow("You must initialize a 'config.json' file to run this! Run 'nice-commit --init' to do this"));
    process.exit(0);
  }
}

if (argv._.includes("init") || argv._.includes("i") || argv.i || argv.init) {
  inquirer.prompt(
    [{
        type: "list",
        name: "type",
        message: "What type of commit style?",
        choices: ["tag", "emoji"],
        default: "tag"
      }] ).then((answers) => {
        if (answers.type === "tag") {
          let n = 1;
          data.type = answers.type;
          data.tags = [];
          function f1() {
            promptTag(n).then((answers) => {
              if (answers.tagname.toLowerCase() == "fin") {
                promptDesc().then((answers) => {
                  data.needsDesc = answers.tdesc;
                  if (data.needsDesc == true) {
                    confirmRequired().then((answers) => {
                      data.descRequired = answers.rq;
                      writeConfig();
                      console.log(chalk.green("Done initializing! config has been saved in ") + chalk.cyan(join(__dirname, "config.json")));
                    });
                  } else {
                    writeConfig();
                    console.log(chalk.green("Done initializing! config has been saved in ") + chalk.cyan(join(__dirname, "config.json")));
                  }
                });
              } else {
                data.tags.push(answers.tagname);
                n++;
                f1();
              }
            });
          }
          f1();
        } else {
          let n = 1;
          data.type = answers.type;
          data.emojis = {};
          function f2() {
            promptEmoji(n).then((answers) => {
              if (answers.etagname.toLowerCase() === "fin") {
                promptDesc().then((answers) => {
                  data.needsDesc = answers.tdesc;
                  if (data.needsDesc == true) {
                    confirmRequired().then((answers) => {
                      data.descRequired = answers.rq;
                      writeConfig();
                      console.log(chalk.green("Done initializing! config has been saved in ") + chalk.cyan(join(__dirname, "config.json")));
                    });
                  } else {
                    data.descRequired = answers.rq;
                    writeConfig();
                    console.log(chalk.green("Done initializing! config has been saved in ") + chalk.cyan(join(__dirname, "config.json")));
                  }
                });
              } else {
                data.emojis[answers.etagname.split("=")[0].trim()] = answers.etagname.split("=")[1].trim();
                n++;
                f2();
              }
            });
          }
          f2();
        }
      });
}

function promptTag(n){
  return new Promise((resolve) => {
    inquirer.prompt(
      [{
        type: "input",
        name: "tagname",
        message: `Enter Tag #${n}${n == 1 ? " (type \"fin\" to finish)" : ""}`,
        validate: function (v) {
          if (data.tags.includes(v)) {
            return `Tag "${v}" aleready exists!`;
          }
          if (v.toLowerCase() === "fin") {
            return data.tags.length === 0 ? "Please specify atleast one emoji!" : true;
          }
          if (/^[a-z0-9 ]+$/i.test(v) == false) {
            return "Your tag can only include letters and numbers";
          } else if (v === "") {
            return "You cannot add an empty tag";
          } else { return true; }
        }
      }]).then((answers) => { resolve(answers) });
  });
}

function promptEmoji(n){
  return new Promise((resolve) => {
    inquirer.prompt(
      [{
        type: "input",
        name: "etagname",
        message: `Enter Emoji #${n}${n == 1 ? " (type \"fin\" to finish)" : ""}`,
        validate: function (v) {
          if (v.toLowerCase() === "fin") {
            return Object.keys(data.emojis).length === 0 ? "Please specify atleast one emoji!" : true;
          }
          if (v.split("=").length !== 2) {
            return "Please use the syntax: '[emoji] = [emojiTag]' example: ':star: = Update'";
          }
          if (/^[a-z0-9 ]+$/i.test(v.split(":")[1].trim()) == false) {
            return "Your emoji tag can only include letters and numbers";
          } else if (v === "") {
            return "You cannot add an empty emoji";
          } else { return true; }
        }
      }]).then((answers) => { resolve(answers); });
  });
}

function promptDesc() {
  return new Promise((resolve) => {
    inquirer.prompt([{
      type: "confirm",
      name: "tdesc",
      message: "Do you want commit descriptions?"
    }]).then((answers) => { resolve(answers); });
  });
}

function confirmRequired() {
  return new Promise((resolve) => {
    inquirer.prompt([{
      type: "confirm",
      name: "rq",
      message: "Should descriptions be required on every commit?"
    }]).then((answers) => { resolve(answers); })
  });
}

function writeConfig() {
  new Promise((resolve, reject) => {
    fs.writeFile(join(__dirname, "config.json"), JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function execute(tag, commitMessage, description) {
  shell.exec(description ? `git commit -m "[${tag}] ${commitMessage}" -m "${description}"` : `git commit -m "[${tag}] ${commitMessage}"`, (code, stdout, stderr) => {
    let msg = [];
    let success = false;
    if (code !== 0) msg.push(`Exit Code: ${code}`);
    if (stderr !== "") msg.push(`Got an Error: ${stderr}`);
    if (stdout !== "") success = true;

    if(msg.length !== 0) console.log(msg.join("\n"));
    console.log(success ? chalk.green("Committed!\n")+chalk.blue("To confirm that it has been committed, do 'git log'") : chalk.red("Attempted to commit but no output!"));
  });
}
