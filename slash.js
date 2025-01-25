const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
{
    name : 'send-ticket', 
    description : 'لارسال بانل تذكرة الشراء',  
    required : true, 
}, 
  {
  name : "set-price",
  description : "لتغيير سعر العضو",
  options : [{
    name : "price",
    description : "السعر الجديد",
    type : 3,
    required : true,
  }]
  },
  {
    name : 'send-stock',
   description : 'لارسال بانل مخزون الاعضاء',
   required : true
   }, 
  {
    name : 'ping',
   description : 'لرؤية سرعة استجابة البوت',
   required : true
   }, 
  {
    name : 'stock',
   description : 'لرؤية كمية الاعضاء',
   required : true
   }, 
  {
    name : 'help',
   description : 'لرؤية قائمة الهيلب',
   required : true
   }, 
];


const clientID = ""; // ايدي البوت

const rest = new REST({ version: '9' }).setToken(""); // توكن البوت

(async () => {
  try {
    await rest.put(Routes.applicationCommands(clientID), { body: commands });
    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error('Error registering application commands:', error);
  }
})();