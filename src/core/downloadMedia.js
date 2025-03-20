import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { checkIsExist } from '../utils/fileUtils.js'; // Pastikan path ini benar

const downloadMedia = async (screen_name) => {
  try {
    console.log(screen_name);

    const jsonFilePath = path.join(
      'downloads',
      screen_name,
      `${screen_name}_media.json`
    );
    const isExist = await checkIsExist(jsonFilePath);
    if (!isExist) {
      console.log(`${chalk.red('Error:')} File not found`);
      return;
    }
    console.log(`${chalk.green('Success:')} File found`);

    const jsonFile = fs.readFileSync(jsonFilePath);
    const JSONdata = JSON.parse(jsonFile);
    console.log(JSONdata[0]);

    return;
  } catch (error) {
    console.error(`${chalk.red('Error:')} ${error.message}`);
  }
};

export default downloadMedia;
