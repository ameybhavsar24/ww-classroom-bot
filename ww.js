const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}
const client = new Client({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox'],
  },
  session: sessionCfg
});
client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
});
// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});
client.on('ready', () => {
  console.log('Client is ready');
});

module.exports = {
 client,
};
