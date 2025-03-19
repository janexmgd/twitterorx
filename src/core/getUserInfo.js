import inquirer from 'inquirer';
import twitterApi from '../processor/twitter.js';

const getUserInfo = async () => {
  try {
    const { screen_name } = await inquirer.prompt({
      type: 'input',
      name: 'screen_name',
      message: 'Insert twitter username without @',
    });
    const data = await twitterApi.userInfo(screen_name);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export default getUserInfo;
