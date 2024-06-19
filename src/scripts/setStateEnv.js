// scripts/setEnv.js
const { execSync } = require("child_process");
const fs = require("fs");

const branchName = execSync("git rev-parse --abbrev-ref HEAD")
  .toString()
  .trim();
const isStaging = branchName === "staging";

const envConfig = `IS_STAGING=${isStaging}\n`;
fs.writeFileSync("./.env", envConfig);
