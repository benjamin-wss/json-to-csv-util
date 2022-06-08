const fs = require("fs-extra");
const path = require("path");
const json2Csv = require("json-2-csv");

const CONSTANTS = {
  PATHS: {
    INPUT: "./input",
    OUTPUT: "./output",
  },
};

async function processFile(filePath, fileName) {
  const fileContents = await fs.readJSON(filePath);
  const csvData = await json2Csv.json2csvAsync(fileContents, {});

  const outputPath = path.join(
    CONSTANTS.PATHS.OUTPUT,
    `${fileName}-${new Date().toString().split(":").join(".")}.csv`
  );

  await fs.outputFile(outputPath, csvData);
}

async function main() {
  await Promise.all([
    fs.ensureDir(CONSTANTS.PATHS.INPUT),
    fs.ensureDir(CONSTANTS.PATHS.OUTPUT),
  ]);

  const inputFiles = fs
    .readdirSync(CONSTANTS.PATHS.INPUT)
    .filter((x) => x.toLowerCase().indexOf(".json") > -1);

  for (let i = 0; i < inputFiles.length; i += 1) {
    const fileName = inputFiles[i];
    const filePath = path.join(CONSTANTS.PATHS.INPUT, fileName);

    await processFile(filePath, fileName);
  }
}

const jobName = require("./package.json").name;

console.time(jobName);

main()
  .then(() => {
    console.log("Done.");
    console.timeEnd(jobName);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error", error);
    console.timeEnd(jobName);
    process.exit(1);
  });
