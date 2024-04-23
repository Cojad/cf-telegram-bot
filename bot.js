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
};

function onMessage(message) {
	return bot.sendPlainText(message.chat.id, `Echo:\n${message.text}`);
}
