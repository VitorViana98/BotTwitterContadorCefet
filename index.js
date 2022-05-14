require('dotenv').config();
const Bot = require('./services/twitter-connection-service');
const schedule = require('node-schedule');
const express = require('express');
const app = express();

const serverPort = 9100

app.listen(process.env.PORT || serverPort, () => { });

app.get('/', (req, res) => {
  return res.json('Server Online 😈😈 Go To https://twitter.com/calendariocefet');
});

console.log(`Servidor Rodando Na Porta ${serverPort}`)

function countDate() {
  const todayDate = new Date();
  const finalDate = new Date(2022, 07, 19);   //Por algum motivo esta gerando com um mes acima
  const firstDate = new Date(2022, 03, 18);   //Por algum motivo esta gerando com um mes acima

  console.log('todayDate', todayDate, 'finalDate', finalDate, 'firstDate', firstDate)

  const miliSecondsToEnd = finalDate.getTime() - todayDate.getTime()
  const daysToEnd = Math.ceil(miliSecondsToEnd / (1000 * 3600 * 24));

  const totalMiliSeconds = finalDate.getTime() - firstDate.getTime()
  const totalDays = Math.ceil(totalMiliSeconds / (1000 * 3600 * 24));


  const progressPercentage = (100 - (daysToEnd / totalDays) * 100).toFixed(2);
  console.log('daysToEnd', daysToEnd, 'totalDays', totalDays)
  return {
    daysToEnd,
    totalDays,
    progressPercentage,
  };
}

function renderProgress(progressPercentage) {
  const string = Array(15).fill('░');
  const totalProgress = Math.floor(progressPercentage * 15 / 100);
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
    } ${daysToEnd} dia(s) para o fim do período.\nJa passamos por ${renderProgress(
      progressPercentage
    )} ${progressPercentage}%  ${daysToEnd > 10 ? '😑' : '😍'} \n`;

  console.log('tweetText:', tweetText)

  Bot.v1
    .tweet(tweetText)
    .then((res) => {
      console.log('Tweet Realizado.');
      console.log(`Veja Aqui => https://twitter.com/${res.user.screen_name}/status/${res.id_str}`);
      console.log(res);
    })
    .catch((err) => {
      console.log('Erro Ao Postar Tweet!');
      console.log(err);
    });
}

// schedule.scheduleJob('* * * * *', function () {
console.log('Função executando.');
postTweet();
console.log('Função Concluída');
// });
