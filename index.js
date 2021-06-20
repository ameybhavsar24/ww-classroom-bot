const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { authorize } = require('./gAuth.js');
const { bot } = require('./bot.js');
const { client } = require('./ww.js');
client.initialize();
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), listenMessages);
});

const listenMessages = (auth) => {
  const classroom = google.classroom({ version: 'v1', auth });
  client.on('message_create', async msg => {
    let data = {
      msg,
      classroom
    };
    bot.parse(msg.body, data);
  });
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('> ', (message) => {
//     rl.close();
//     // when a new message arrives, check if bot should reply to it
//     // if yes, parse it and return reply
//     const data = {
//       name: 'Amey',
//       reply: (msg) => {
//         console.log(msg);
//       },
//       classroom,
//     };
//     // pass a metadata object to bot
//     bot.parse(message, data);
//     // parseMessage(classroom, message);
//   });
};
