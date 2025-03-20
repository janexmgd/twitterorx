import axios from 'axios';
import 'dotenv/config';

const { TWITTER_TOKEN, TWITTER_COOKIE } = process.env;

const getValueByKey = (cookieString, key) => {
  const regex = new RegExp(`${key}=([^;]+)`);
  const match = cookieString.match(regex);
  return match ? decodeURIComponent(match[1]) : null;
};
const headers = {
  accept: '*/*',
  'accept-language': 'en-US,en;q=0.8',
  authorization: TWITTER_TOKEN,
  'cache-control': 'no-cache',
  'content-type': 'application/json',
  pragma: 'no-cache',
  priority: 'u=1, i',
  referer: 'https://x.com/Moreen_JKT48',
  'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'sec-gpc': '1',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'x-csrf-token': getValueByKey(TWITTER_COOKIE, 'ct0'),
  'x-twitter-active-user': 'yes',
  'x-twitter-auth-type': 'OAuth2Session',
  'x-twitter-client-language': 'en',
  cookie: TWITTER_COOKIE,
};

const twitterApi = {
  userInfo: async (screen_name) => {
    try {
      const variables = JSON.stringify({
        screen_name: screen_name,
      });
      const { data } = await axios.get(
        'https://x.com/i/api/graphql/32pL5BWe9WKeSK1MoPvFQQ/UserByScreenName',
        {
          params: {
            variables: variables,
            features:
              '{"hidden_profile_subscriptions_enabled":true,"profile_label_improvements_pcf_label_in_post_enabled":true,"rweb_tipjar_consumption_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"subscriptions_verification_info_is_identity_verified_enabled":true,"subscriptions_verification_info_verified_since_enabled":true,"highlights_tweets_tab_ui_enabled":true,"responsive_web_twitter_article_notes_tab_enabled":true,"subscriptions_feature_can_gift_premium":true,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true}',
            fieldToggles: '{"withAuxiliaryUserLabels":false}',
          },
          headers,
        }
      );
      if (data.data.user) {
        return data.data.user.result;
      }
      console.log(`fail get user ${JSON.stringify(data.data)}`);
    } catch (error) {
      console.log(`Fail get user info`);
      console.log(error);
    }
  },
  userMedia: async (userId, cursor = '') => {
    try {
      const cursorValue = cursor ? `"cursor":"${cursor}",` : '';
      const variables = `{"userId":"${userId}",${cursorValue}"count":100,"includePromotedContent":false,"withClientEventToken":false,"withBirdwatchNotes":false,"withVoice":true,"withV2Timeline":true}`;

      const { data } = await axios.get(
        'https://x.com/i/api/graphql/0j5qf4xg1BY6ImWCPiaZxg/UserMedia',
        {
          params: {
            variables,
            features:
              '{"rweb_video_screen_enabled":false,"profile_label_improvements_pcf_label_in_post_enabled":true,"rweb_tipjar_consumption_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"creator_subscriptions_tweet_preview_api_enabled":true,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"premium_content_api_read_enabled":false,"communities_web_enable_tweet_community_results_fetch":true,"c9s_tweet_anatomy_moderator_badge_enabled":true,"responsive_web_grok_analyze_button_fetch_trends_enabled":false,"responsive_web_grok_analyze_post_followups_enabled":true,"responsive_web_jetfuel_frame":false,"responsive_web_grok_share_attachment_enabled":true,"articles_preview_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":true,"tweet_awards_web_tipping_enabled":false,"responsive_web_grok_analysis_button_from_backend":true,"creator_subscriptions_quote_tweet_preview_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"rweb_video_timestamps_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_grok_image_annotation_enabled":false,"responsive_web_enhance_cards_enabled":false}',
            fieldToggles: '{"withArticlePlainText":false}',
          },
          headers,
        }
      );

      if (data.data) {
        return data.data.user.result;
      }
      console.log(`fail get media ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.log('Error when fetching user media');
      console.log(error.response ? error.response.data : error.message);
    }
  },
  tweetDetail: async (tweetId) => {
    try {
      const variables = JSON.stringify({
        tweetId: tweetId,
        includePromotedContent: true,
        withBirdwatchNotes: true,
        withVoice: true,
        withCommunity: true,
      });
      const { data } = await axios.get(
        'https://x.com/i/api/graphql/_y7SZqeOFfgEivILXIy3tQ/TweetResultByRestId',
        {
          params: {
            variables,
            features:
              '{"creator_subscriptions_tweet_preview_api_enabled":true,"premium_content_api_read_enabled":false,"communities_web_enable_tweet_community_results_fetch":true,"c9s_tweet_anatomy_moderator_badge_enabled":true,"responsive_web_grok_analyze_button_fetch_trends_enabled":false,"responsive_web_grok_analyze_post_followups_enabled":true,"responsive_web_jetfuel_frame":false,"responsive_web_grok_share_attachment_enabled":true,"articles_preview_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":true,"tweet_awards_web_tipping_enabled":false,"responsive_web_grok_analysis_button_from_backend":true,"creator_subscriptions_quote_tweet_preview_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"rweb_video_timestamps_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"profile_label_improvements_pcf_label_in_post_enabled":true,"rweb_tipjar_consumption_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"responsive_web_grok_image_annotation_enabled":false,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_enhance_cards_enabled":false}',
            fieldToggles:
              '{"withArticleRichContentState":true,"withArticlePlainText":false}',
          },
          headers,
        }
      );
      return data.data;
    } catch (error) {
      console.log('Error when fetching tweet detail');
      console.log(error);
    }
  },
};
export default twitterApi;
