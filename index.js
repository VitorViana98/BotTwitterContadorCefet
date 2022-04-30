require('dotenv').config();
const Bot = require('./services/twitter-connection-service');
const schedule = require('node-schedule');
const express = require('express');
const app = express();

app.listen(process.env.PORT || 9000, () => { });

app.get('/', (req, res) => {
  return res.json({ message: 'Servidor Rodando' });
});

function countDate() {
  const todayDate = new Date();
  const finalDate = new Date(2022, 07, 19);   //Por algum motivo esta gerando com um mes acima
  const firstDate = new Date(2022, 03, 18);   //Por algum motivo esta gerando com um mes acima

  console.log('todayDate', todayDate, 'finalDate', finalDate, 'firstDate', firstDate)

  const miliSecondsToEnd = finalDate.getTime() - todayDate.getTime()
  const daysToEnd = Math.ceil(miliSecondsToEnd / (1000 * 3600 * 24));

  const totalMiliSeconds = finalDate.getTime() - firstDate.getTime()
  const totalDays = Math.ceil(totalMiliSeconds / (1000 * 3600 * 24));


  const progressPercentage = (100 - (daysToEnd / totalDays) * 100).toFixed(3);
  console.log('daysToEnd', daysToEnd, 'totalDays', totalDays)
  return {
    daysToEnd,
    totalDays,
    progressPercentage,
  };
}

function renderProgress(progressPercentage) {
  const string = Array(15).fill('░');
  const totalProgress = (progressPercentage / 15).toFixed(0);
  console.log('totalProgress:', totalProgress, progressPercentage)

  for (let i = 0; i < totalProgress; i++) {
    string[i] = '▓';
  }
  return string.join('');
}

function postTweet() {
  const { daysToEnd, progressPercentage } = countDate();
  console.log('progressPercentage:', progressPercentage)

  const tweetText = `${daysToEnd > 1 ? 'Faltam' : 'Falta'
    } ${daysToEnd} dia(s) para o fim do período.\nJa passmos por ${renderProgress(
      progressPercentage
    )} ${progressPercentage}%  ${daysToEnd > 10 ? '😑' : '😍'} \n`;

  console.log('tweetText:', tweetText)

  Bot.v1
    .tweet(tweetText)
    .then(() => {
      console.log('Tweet Realizado.');
    })
    .catch((err) => {
      console.log(err);
    });
}

schedule.scheduleJob('0 10 * * *', function () {
  console.log('Função executando.');
  postTweet();
  console.log('Função Concluída');
});
