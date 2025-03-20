import chalk from 'chalk';
import twitterApi from '../processor/twitter.js';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { savingFileToJson } from '../utils/fileUtils.js';

export function parseTimelineTweetsV2(timeline) {
  let bottomCursor = null;
  let topCursor = null;
  const tweets = [];

  const instructions = timeline.timeline?.instructions ?? [];

  for (const instruction of instructions) {
    if (instruction.type === 'TimelineAddToModule') {
      const moduleItems = instruction.moduleItems ?? [];
      if (moduleItems.length === 0) {
        console.log('not found timeliAddToModule');
      }
      for (const moduleItem of moduleItems) {
        const itemContent = moduleItem.item?.itemContent;
        if (itemContent?.tweet_results?.result) {
          parseAndPush(tweets, itemContent, moduleItem.entryId);
        }
      }
    }
    if (instruction.type === 'TimelineAddEntries') {
      const entries = instruction.entries ?? [];
      for (const entry of entries) {
        const entryContent = entry.content;
        if (!entryContent) continue;
        if (entryContent.cursorType === 'Bottom') {
          bottomCursor = entryContent.value;
          continue;
        } else if (entryContent.cursorType === 'Top') {
          topCursor = entryContent.value;
          continue;
        }
        const idStr = entry.entryId;
        if (idStr.startsWith('profile-grid-')) {
          const items = entryContent.items;
          for (const a of items) {
            parseAndPush(tweets, a.item.itemContent, idStr);
          }
        }
      }
    }
  }

  return { tweets, bottomCursor, topCursor };
}
function parseAndPush(tweets, itemContent) {
  const tweetData = itemContent.tweet_results?.result;
  if (tweetData) {
    tweets.push({
      rest_id: tweetData.rest_id,
      tweet_url: `https://twitter.com/${tweetData.core?.user_results?.result?.legacy?.screen_name}/status/${tweetData.rest_id}`,
      id: tweetData.id,
      text: tweetData.legacy?.full_text,
      user: {
        rest_id: tweetData.core?.user_results?.result?.rest_id,
        name: tweetData.core?.user_results?.result?.legacy?.name,
        screen_name: tweetData.core?.user_results?.result?.legacy?.screen_name,
      },
      // media: tweetData.legacy?.extended_entities?.media ?? [],
      created_at: tweetData.legacy?.created_at,
      favorite_count: tweetData.legacy?.favorite_count,
      retweet_count: tweetData.legacy?.retweet_count,
      comment_count: tweetData.legacy?.reply_count,
      reply_count: tweetData.legacy?.reply_count,
    });
  }
}
/*
thx to
https://github.com/elizaOS/agent-twitter-client/blob/d9b253385c0b6c07c44c692f5cc02d5fa2825a2b/src/tweets.ts#L886
for pagination inspiration
*/
const getMedia = async (screen_name) => {
  try {
    let timelineItems = [];
    while (true) {
      timelineItems = [];
      let cursor = '';
      let previousCursor = null;
      const userInfo = await twitterApi.userInfo(screen_name);
      const { rest_id } = userInfo;
      let i = 1;
      console.log(`\nFetching media for ${screen_name}`);
      while (true) {
        const data = await twitterApi.userMedia(rest_id, cursor);
        const { timeline_v2 } = data;
        const parsedData = parseTimelineTweetsV2(timeline_v2);
        cursor == ''
          ? null
          : console.log(`${chalk.italic(`using cursor ${cursor}`)}`);

        timelineItems = [...timelineItems, ...parsedData.tweets];
        if (parsedData.tweets.length === 0) {
          console.log('No more tweets found. Stopping pagination.');
          break;
        }
        cursor = parsedData.bottomCursor;
        if (cursor === previousCursor) {
          console.log('Cursor did not change. Stopping pagination.');
          break;
        }
        previousCursor = cursor;
        i++;
      }
      console.log(`Total tweets fetched: ${timelineItems.length}\n`);
      const { isApproited } = await inquirer.prompt({
        type: 'confirm',
        name: 'isApproited',
        message: 'Is the number of tweets appropriate?',
      });
      if (isApproited) {
        break;
      }
    }
    const { save } = await inquirer.prompt({
      type: 'confirm',
      name: 'save',
      message: 'Save to file? (y/n)',
    });

    if (save) {
      let folderPath = path.join('downloads', screen_name);
      let filename = `${screen_name}_media.json`;
      savingFileToJson(folderPath, filename, timelineItems);
    } else {
      console.log(chalk.italic(`File not saved`));
    }

    return timelineItems;
  } catch (error) {
    console.error('Error in getMedia:', error);
  }
};

export default getMedia;
