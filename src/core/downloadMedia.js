import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { checkIsExist } from '../utils/fileUtils.js'; // Pastikan path ini benar
import twitterApi from '../processor/twitter.js';
import { downloadProcess } from '../utils/downloadProcess.js';

const downloadMedia = async (screen_name) => {
  try {
    const jsonFileName = `${screen_name}_media.json`;
    const jsonFilePath = path.join('downloads', screen_name, jsonFileName);
    const isExist = await checkIsExist(jsonFilePath);
    if (!isExist) {
      console.log(`${chalk.red('Error:')} ${jsonFileName} not found`);
      return;
    }
    const jsonFile = fs.readFileSync(jsonFilePath);
    const tweets = JSON.parse(jsonFile);
    let i = 1;
    for (const tweet of tweets) {
      //   console.log(tweet);

      const { rest_id, media } = tweet;
      console.log(`Processing tweet: ${rest_id}`);

      for (const [index, item] of media.entries()) {
        let url = '';
        let filename;
        if (item.type == 'photo') {
          if (media.length == 1) {
            filename = `${rest_id}.jpg`;
          } else {
            filename = `${rest_id}_${index}.jpg`;
          }
          url = item.media_url_https;
        }
        if (item.type == 'video' || item.type == 'animated_gif') {
          const variants = item.video_info.variants;
          const mp4Variants = variants.filter(
            (variant) => variant.content_type === 'video/mp4'
          );
          const bestQuality = mp4Variants.reduce((prev, current) =>
            prev.bitrate > current.bitrate ? prev : current
          );
          url = bestQuality.url;
          if (media.length == 1) {
            filename = `${rest_id}.mp4`;
          } else {
            filename = `${rest_id}_${index}.mp4`;
          }
        }
        const folderPath = path.join('downloads', screen_name, 'media');
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
          console.log(`Folder created:${chalk.green(` ${folderPath}`)}`);
        }
        const filePath = path.join(folderPath, filename);
        await downloadProcess(
          url,
          media.length,
          index + 1,
          3,
          filePath,
          i,
          tweets.length
        );
      }
      i++;
    }

    return;
  } catch (error) {
    console.log(error);

    console.error(`${chalk.red('Error:')} ${error.message}`);
  }
};

export default downloadMedia;
