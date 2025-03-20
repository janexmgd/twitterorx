import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const checkIsExist = async (filePath) => {
  try {
    const checkFile = fs.existsSync(filePath);
    return checkFile;
  } catch (error) {
    return false;
  }
};

export const savingFileToJson = (folderPath, filename, data) => {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Folder created:${chalk.green(` ${folderPath}`)}`);
    }
    fs.writeFileSync(
      path.join(folderPath, filename),
      JSON.stringify(data, null, 2)
    );
    console.log(`File saved: ${chalk.green(filename)}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};
