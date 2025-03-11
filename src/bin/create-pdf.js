#!/usr/bin/env node

require("ts-node").register();
require("@dotenvx/dotenvx").config({ quiet: true }); // required to configure environment
const { createPdf } = require("../commands/create-pdf.ts");
const { program } = require("commander");

program.action((options) => {
  createPdf();
});

program.parse(process.argv);
