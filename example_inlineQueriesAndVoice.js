/**
 * https://github.com/cojad/cf-telegram-bot
 */
import { TelegramBot } from './telegramBot.js';

const TOKEN = ENV_BOT_TOKEN // Get it from @BotFather https://core.telegram.org/bots#6-botfather
const WEBHOOK = '/endpoint'
const SECRET = ENV_BOT_SECRET // A-Z, a-z, 0-9, _ and -

const bot = new TelegramBot(TOKEN, WEBHOOK, SECRET);

bot.onUpdate = async (update) => {
  if ('message' in update) {
    await onMessage(update.message)
  } else if ('inline_query' in update) {
    await onInlineQuery(update.inline_query)
  }
};

function onMessage (message) {
  return bot.sendPlainText(message.chat.id, 'This is an inline bot')
}

async function onInlineQuery (inlineQuery) {
  const results = []
  const search = inlineQuery.query
  const jsonInputFiles = await NAMESPACE.get('input_files')
  const parsedInputFiles = JSON.parse(jsonInputFiles)
  const number = Object.keys(parsedInputFiles).length
  for (let i = 0; i < number; i++) {
    const caption = parsedInputFiles[i][3]
    const title = parsedInputFiles[i][0]
    if ((caption.toLowerCase().includes(search.toLowerCase())) || title.toLowerCase().includes(search.toLowerCase())) {
      results.push({
        type: 'voice',
        id: crypto.randomUUID(),
        voice_url: parsedInputFiles[i][1],
        title: parsedInputFiles[i][0],
        voice_duration: parsedInputFiles[i][2],
        caption: parsedInputFiles[i][3],
        parse_mode: 'HTML'
      })
    }
  }
  const res = JSON.stringify(results)
  return bot.sendInlineQuery(inlineQuery.id, res)
}
