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
		await onMessage(update.message);
	}
  if ('callback_query' in update) {
    await onCallbackQuery(update.callback_query)
  }
};

function onMessage (message) {
  if (message.text.startsWith('/start') || message.text.startsWith('/help')) {
    return bot.sendMarkdownV2Text(message.chat.id, '*Functions:*\n' +
      bot.escapeMarkdown(
        '`/help` - This message\n' +
        '/button2 - Sends a message with two button\n' +
        '/button4 - Sends a message with four buttons\n' +
        '/markdown - Sends some MarkdownV2 examples\n',
        '`'))
  } else if (message.text.startsWith('/button2')) {
    return sendTwoButtons(message.chat.id)
  } else if (message.text.startsWith('/button4')) {
    return sendFourButtons(message.chat.id)
  } else if (message.text.startsWith('/markdown')) {
    return sendMarkdownExample(message.chat.id)
  } else {
    return bot.sendMarkdownV2Text(message.chat.id, bot.escapeMarkdown('*Unknown command:* `' + message.text + '`\n' +
      'Use /help to see available commands.', '*`'))
  }
}

function sendTwoButtons (chatId) {
  return bot.sendInlineButtonRow(chatId, 'Press one of the two button', [{
    text: 'Button One',
    callback_data: 'data_1'
  }, {
    text: 'Button Two',
    callback_data: 'data_2'
  }])
}

function sendFourButtons (chat_id) {
  return bot.sendInlineButtons(chat_id, 'Press a button', [
    [
      {
        text: 'Button top left',
        callback_data: 'Utah'
      }, {
        text: 'Button top right',
        callback_data: 'Colorado'
      }
    ],
    [
      {
        text: 'Button bottom left',
        callback_data: 'Arizona'
      }, {
        text: 'Button bottom right',
        callback_data: 'New Mexico'
      }
    ]
  ])
}

async function sendMarkdownExample (chat_id) {
  await bot.sendMarkdownV2Text(chat_id, 'This is *bold* and this is _italic_')
  await bot.sendMarkdownV2Text(chat_id, bot.escapeMarkdown('You can write it like this: *bold* and _italic_'))
  return bot.sendMarkdownV2Text(chat_id, bot.escapeMarkdown('...but users may write ** and __ e.g. `**bold**` and `__italic__`', '`'))
}

async function onCallbackQuery (callbackQuery) {
  await bot.sendMarkdownV2Text(callbackQuery.message.chat.id, bot.escapeMarkdown(`You pressed the button with data=\`${callbackQuery.data}\``, '`'))
  return bot.answerCallbackQuery(callbackQuery.id, 'Button press acknowledged!')
}
