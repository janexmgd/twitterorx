import urlModule from 'url';
import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import axios from 'axios';
const client = axios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  },
});
const shortenFileName = (filename) => {
  if (filename.length > 5) {
    return filename.substring(0, 5) + '***';
  }
  return filename;
};
export const readJsonFile = async (username, filename) => {
  try {
    const currentDir = process.cwd();
    const filePath = path.join(currentDir, 'download', username);
    const data = await fsPromise.readFile(`${filePath}/${filename}`, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    console.error(err);
  }
};

const checkIsDownloaded = (filePath) => {
  try {
    const checkFile = fs.existsSync(filePath);
    return checkFile;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const downloadProcess = async (
  url,
  lengthOfMedia,
  current,
  retries = 3,
  folderPath,
  currentProggres,
  total
) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const parsedUrl = urlModule.parse(url);
      const pathnameSegments = parsedUrl.pathname.split('/');
      const filenameQuery = pathnameSegments[pathnameSegments.length - 1];
      const originalFilename = filenameQuery.split('?')[0];
      const shortenedFilename = shortenFileName(originalFilename);
      const filePath = path.join(folderPath, originalFilename);
      const isAlready = checkIsDownloaded(filePath);

      if (isAlready) {
        console.log(
          `${chalk.italic(shortenedFilename)} already ${chalk.green(
            `exist`
          )} ${current}/${lengthOfMedia}`
        );
        return;
      } else {
        const response = await client({
          url: url,
          method: 'GET',
          responseType: 'stream',
        });

        const totalLength = response.headers['content-length'];
        const writer = fs.createWriteStream(filePath);
        let downloadedBytes = 0;
        let startTime = Date.now();

        response.data.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          const progress = ((downloadedBytes / totalLength) * 100).toFixed(2);
          const elapsedTime = (Date.now() - startTime) / 1000;
          const downloadSpeed = (downloadedBytes / elapsedTime / 1024).toFixed(
            2
          );
          process.stdout.write(
            `[${currentProggres} / ${total}]Downloading ${shortenedFilename}: ${progress}% | Speed: ${downloadSpeed} KB/s\r`
          );
        });

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', () => {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            resolve();
          });
          writer.on('error', (error) => {
            console.error(`Error writing file: ${error.message}`);
            fs.unlink(filePath, () => {});
            reject(error);
          });

          response.data.on('error', (error) => {
            console.error(`Error downloading file: ${error.message}`);
            reject(error);
          });

          response.data.setTimeout(30000, () => {
            console.error('Download timeout');
            response.data.destroy();
            reject(new Error('Download timeout'));
          });
        });

        console.log(
          `[${currentProggres} / ${total}]${chalk.italic(
            shortenedFilename
          )} ${chalk.green(`success`)} ${current}/${lengthOfMedia}`
        );
        return;
      }
    } catch (error) {
      console.log(
        `${chalk.italic(url)} ${chalk.red(
          `failed`
        )} download attempt ${attempt}/${retries}: ${error.message}`
      );
      if (attempt === retries) {
        throw new Error(
          `Failed to download after ${retries} attempts: ${error.message}`
        );
      }
    }
  }
};
