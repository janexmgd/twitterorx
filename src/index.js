import inquirer from 'inquirer';
import getUserInfo from './core/getUserInfo.js';
import 'dotenv/config';
import chalk from 'chalk';
const choices = [
  {
    name: 'obtain twitter user info',
    value: 1,
  },
];

(async () => {
  try {
    process.stdout.write('\x1Bc');

    if (!process.env.TWITTER_TOKEN || !process.env.TWITTER_COOKIE) {
      return console.log(
        chalk.red(`ERROR`) +
          chalk.white(` please set TWITTER_TOKEN & TWITTER_COOKIE FIRST`)
      );
    }
    const { input } = await inquirer.prompt({
      type: 'list',
      message: 'select service',
      name: 'input',
      choices,
    });
    if (input == 1) {
      await getUserInfo();
    }
  } catch (error) {
    console.log(error);
  }
})();
