const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MEMBERS
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const schedule = require('node-schedule');

client.on('ready', () => {
  console.log(`BotName: ${client.user.tag}`);
  client.user.setActivity(`Abj`, { type: "PLAYING" });
});

client.setMaxListeners(0);

let channels = ["", "", "", "", "", ""];// ايدي الرومات  الي تسكر  وتفتح
let doneroom = "";// ايدي الروم الي تنرسل فيه الرساله

// لغلق الرومات الساعة 6 مساءً
const ruleClose = new schedule.RecurrenceRule();
ruleClose.hour = 19; // 7:00 مساءً
ruleClose.minute = 30;
ruleClose.tz = 'Asia/Riyadh';

const jobClose = schedule.scheduleJob(ruleClose, function() {
  channels.forEach(channel => {
    let ch = client.channels.cache.get(channel);

    const guild = ch.guild;
    const everyoneRole = guild.roles.everyone;

    if (ch) {
      ch.permissionOverwrites.edit(everyoneRole, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
      });
    }
  });

  let log = client.channels.cache.get(doneroom);

  if (log) log.send({
    content: `@here`, embeds: [
      new Discord.MessageEmbed()
        .setTitle("Test")
        .setDescription(`** الرومات مغلقة الآن **`)
        .setColor("RED")
    ]
  });
});

// لفتح الرومات الساعة 7 صباحًا
const ruleOpen = new schedule.RecurrenceRule();
ruleOpen.hour = 7; // 7:00 صباحًا
ruleOpen.minute = 0;
ruleOpen.tz = 'Asia/Riyadh';

const jobOpen = schedule.scheduleJob(ruleOpen, function() {
  channels.forEach(channel => {
    let ch = client.channels.cache.get(channel);

    const guild = ch.guild;
    const everyoneRole = guild.roles.everyone;

    if (ch) {
      ch.permissionOverwrites.edit(everyoneRole, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: false,
      }).then(async x => {
        const messages = await ch.messages.fetch();

        if (messages) await ch.bulkDelete(messages);
      });
    }
  });

  let log = client.channels.cache.get(doneroom);

  if (log) log.send({
    content: `@here`, embeds: [
      new Discord.MessageEmbed()
        .setTitle("Test")
        .setDescription(`** الرومات مفتوحة الآن **`)
        .setColor("GREEN")
    ]
  });
});

client.login(process.env.token);
