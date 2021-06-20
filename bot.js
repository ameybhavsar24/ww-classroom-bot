const bot = require('bot-commander');
// only listen to messages starting with given prefix
bot.prefix('!c');
bot.command('list').action((meta) => {
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
    meta.reply(replyMessage);
  });
});
bot.command('help').action((meta) => {
  console.log(bot.help());
});
module.exports = {
  bot,
};
