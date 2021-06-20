const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const bot = require('bot-commander');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), listenMessages);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// only listen to messages starting with given prefix
bot.prefix('!c');
bot
  .command('list')
  .action(meta => {
  	meta.classroom.courses.list({pageSize: 10}, (err, res) => {
  	let replyMessage = "";
  	if (err) replyMessage = 'The API returned an error. ' + err;
  	else {
		const courses = res.data.courses;
		if (courses && courses.length) {
		 replyMessage += "Courses:\n";
		 courses.forEach((course) => {
		   replyMessage += course.name + '\n';
		 });
		} else {
		 replyMessage = 'No courses found.';
		}
	}
	meta.reply(replyMessage);
	});
  });
bot
  .command('help')
  .action(meta => {
  	console.log(bot.help());
  })
function listenMessages(auth) {
  const classroom = google.classroom({version: 'v1', auth});
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('> ', (message) => {
  	rl.close();
  	// when a new message arrives, check if bot should reply to it
  	// if yes, parse it and return reply
  	const data = {
  	  name: "Amey",
  	  reply: msg => {
  	  	console.log(msg);
  	  },
  	  classroom
  	}
  	bot.parse(message, data);
  	// parseMessage(classroom, message);
  });
}
