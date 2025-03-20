import inquirer from 'inquirer';
import getUserInfo from './core/getUserInfo.js';
import 'dotenv/config';
import chalk from 'chalk';
import boxen from 'boxen';
import getMedia from './core/getMedia.js';
import downloadMedia from './core/downloadMedia.js';
const choices = [
  {
    name: 'obtain twitter user info',
    value: 1,
  },
  {
    name: 'obtain twitter user media',
    value: 2,
  },
  {
    name: 'download media',
    value: 3,
  },
];
const obtainUsername = async () => {
  const { usernameInput } = await inquirer.prompt({
    type: 'input',
    name: 'usernameInput',
    message: 'Insert username without @ or url of x profile',
  });
  let username;
  if (usernameInput.startsWith('https://x.com/')) {
    const url = usernameInput;
    const parts = url.split('/');
    username = parts[3];
  } else {
    username = usernameInput;
  }
  return username;
};
(async () => {
  try {
    process.stdout.write('\x1Bc');

    if (!process.env.TWITTER_TOKEN || !process.env.TWITTER_COOKIE) {
      return console.log(
        chalk.red(`ERROR`) +
          chalk.white(` please set TWITTER_TOKEN & TWITTER_COOKIE FIRST`)
      );
    }
    console.log(boxen(chalk.green('Welcome twitterorx'), { padding: 1 }));

    const { input } = await inquirer.prompt({
      type: 'list',
      message: 'select service',
      name: 'input',
      choices,
    });

    if (input == 1) {
      const screen_name = await obtainUsername();
      await getUserInfo(screen_name);
    }
    if (input == 2) {
      const screen_name = await obtainUsername();
      await getMedia(screen_name);
    }
    if (input == 3) {
      const screen_name = await obtainUsername();
      await downloadMedia(screen_name);
    }
  } catch (error) {
    console.log(error);
  }
})();
