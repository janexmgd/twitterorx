import chalk from 'chalk';
import path from 'path';
const downloadMedia = async (screen_name) => {
  try {
    const jsonFilePath = path.join('downloads', `${screen_name}_media.json`);
    const isExist = await checkIsExist(jsonFilePath);
    if (!isExist) {
      console.log(`${chalk.red('Error:')}File not found`);
      return;
    }
    const jsonFile = fs.readFileSync(jsonFilePath);
    const JSONdata = JSON.parse(jsonFile);
    return;
  } catch (error) {}
};
