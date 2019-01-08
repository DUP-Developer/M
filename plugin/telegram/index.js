const TelegramBot = require(`node-telegram-bot-api`)
const TOKEN = `763642610:AAFEI1yCrYsLNcXmJgxTWsZ3K2Ud3A1dfAY`
const bot = new TelegramBot(TOKEN, { polling: true })
const { TELEGRAM } = require('../../kernel/constants')

let chatId
let ctx

module.exports = {
  m: {},
  start(m) {
    this.m = m
    
    bot.on('message', function (msg) {
      chatId = msg.chat.id
      
      m.context.message = msg.text
      m.context.drive = TELEGRAM
    
      m.listen(m.context, null)
    })

    bot.on('polling_error', (error) => {
      console.log(error); // => 'EFATAL'
    });
  },

  send(data) {
    bot.sendMessage(chatId, data.context.message)
  }
}