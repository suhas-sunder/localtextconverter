const fs = require("fs-extra");
const path = require("path");

const inputFolder = "./input_files"; // Folder containing input JSON files
const outputFolder = "./output_files"; // Destination folder for modified JSON files

async function processJSONFiles(inputFolder, outputFolder) {
  try {
    // Ensure output folder exists
    await fs.ensureDir(outputFolder);

    // Get list of JSON files in input folder
    const files = await fs.readdir(inputFolder);

    // Process each JSON file
    for (const file of files) {
      const inputFilePath = path.join(inputFolder, file);
      const outputFilePath = path.join(outputFolder, file);

      // Read JSON file
      const jsonData = await fs.readJson(inputFilePath, "utf8");

      const jsonDataFinal =
        typeof jsonData === "string" ? jsonData : jsonData[0];

      // Apply filter to the single string element in the JSON array
      const filteredData = jsonDataFinal
        .replace(
          /[^\w\s.?!':,%+-=()\-/"`!@#$%^&*()_+}\]\"|;:'".>/?~`[{}]/g,
          " "
        )
        .replace(/\s+/g, " ");
      // Save modified JSON back to file
      await fs.writeJson(outputFilePath, [filteredData], { spaces: 2 });

      console.log(`Processed file: ${outputFilePath}`);
    }

    console.log("All files processed successfully.");
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

// Usage: Call the function to process JSON files
processJSONFiles(inputFolder, outputFolder);
