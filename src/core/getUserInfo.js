import inquirer from 'inquirer';
import twitterApi from '../processor/twitter.js';
import chalk from 'chalk';
import path from 'path';
import { savingFileToJson } from '../utils/fileUtils.js';
const getUserInfo = async (screen_name) => {
  try {
    const data = await twitterApi.userInfo(screen_name);
    const { save } = await inquirer.prompt({
      type: 'confirm',
      name: 'save',
      message: 'Save to file? (y/n)',
    });
    if (save) {
      let folderPath = path.join('downloads', screen_name);
      let filename = `${screen_name}_info.json`;
      savingFileToJson;
      savingFileToJson(folderPath, filename, data);
    } else {
      console.log(chalk.italic(`File not saved`));
    }
  } catch (error) {
    console.log(error);
  }
};

export default getUserInfo;
