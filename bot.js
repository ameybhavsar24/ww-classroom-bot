const bot = require('bot-commander');
// only listen to messages starting with given prefix
bot.prefix('!c');
bot.action( meta => {
  meta.msg.reply('Invalid command.\n' + bot.help());
});
bot
  .command('list')
  .alias('courselist')
  .description('Returns list of all courses in Classroom.')
  .action((meta) => {
  meta.classroom.courses.list({ pageSize: 10 }, (err, res) => {
    let replyMessage = '';
    if (err) replyMessage = 'The API returned an error. ' + err;
    else {
      const courses = res.data.courses;
      if (courses && courses.length) {
        replyMessage += 'Courses:\n';
        courses.forEach((course) => {
          replyMessage += course.name + '\n';
        });
      } else {
        replyMessage = 'No courses found.';
      }
    }
    meta.msg.reply(replyMessage + '—🤖 classroom bot');
  });
});
bot.command('help').action((meta) => {
  meta.msg.reply(bot.help());
});
module.exports = {
  bot,
};
