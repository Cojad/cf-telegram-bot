/**
 * https://github.com/cojad/cf-telegram-bot
 */
import { TelegramBot } from './telegramBot.js';

const TOKEN = ENV_BOT_TOKEN // Get it from @BotFather https://core.telegram.org/bots#6-botfather
const WEBHOOK = '/endpoint'
const SECRET = ENV_BOT_SECRET // A-Z, a-z, 0-9, _ and -

const bot = new TelegramBot(TOKEN, WEBHOOK, SECRET);
const reactions_ = ['👍', '👎', '❤', '🔥', '🥰', '👏', '😁', '🤔', '🤯', '😱', '🤬', '😢', '🎉', '🤩', '🤮', '💩', '🙏', '👌', '🕊', '🤡', '🥱', '🥴', '😍', '🐳', '❤‍🔥', '🌚', '🌭', '💯', '🤣', '⚡', '🍌', '🏆', '💔', '🤨', '😐', '🍓', '🍾', '💋', '🖕', '😈', '😴', '😭', '🤓', '👻', '👨‍💻', '👀', '🎃', '🙈', '😇', '😨', '🤝', '✍', '🤗', '🫡', '🎅', '🎄', '☃', '💅', '🤪', '🗿', '🆒', '💘', '🙉', '🦄', '😘', '💊', '🙊', '😎', '👾', '🤷‍♂', '🤷', '🤷‍♀', '😡']

bot.onUpdate = async (update) => {
  if ('message' in update) {
    await onMessage(update.message);
  }
};

function onMessage (message) {
  return setMessageReaction(message);
}

/**
 * Set Message Reaction
 * https://core.telegram.org/bots/api#setmessagereaction
 */
async function setMessageReaction (message) {
  const reaction_ = []
  const min = 0
  const max = reactions_.length
  const re = Math.floor(Math.random() * (max - min) + min)
  const emoji = reactions_[re]
  let big = false
  if (emoji === '🎉') {
    big = true
  }

  reaction_.push({
    type: 'emoji',
    emoji
  })
  return bot.api('setMessageReaction', {
    chat_id: message.chat.id,
    message_id: message.message_id,
    reaction: JSON.stringify(reaction_),
    is_big: big
  });
}
