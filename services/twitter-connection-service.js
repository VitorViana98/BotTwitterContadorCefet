const { TwitterApi } = require('twitter-api-v2');

module.exports = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET_KEY,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET_TOKEN,
  //   timeout_ms: 60 * 1000,
});
