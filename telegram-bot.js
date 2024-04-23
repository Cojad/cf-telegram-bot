export class TelegramBot {
  constructor(token, webhookPath, secret) {
    this.token = token;
    this.secret = secret;
    this.webhookPath = webhookPath;

    addEventListener('fetch', event => {
      const url = new URL(event.request.url);
      const webhookUrl = `${url.protocol}//${url.hostname}${this.webhookPath}`;

      switch (url.pathname) {
        case this.webhookPath: 
          return event.respondWith(this.handleWebhook(event));
        case '/registerWebhook':
          return event.respondWith(this.registerWebhook(webhookUrl, this.secret));
        case '/unRegisterWebhook':
          return event.respondWith(this.registerWebhook(''));
        default:
          return event.respondWith(new Response('No handler for this request'));
      }
    })
  }

  async handleWebhook(event) {
    if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== this.secret) {
      return new Response('Unauthorized', { status: 403 });
    }

    const update = await event.request.json();
    // Deal with response asynchronously
    event.waitUntil(this.onUpdate(update));
    return new Response('Ok');
  }

  async onUpdate(update) {
    if ('message' in update) {
      await this.onMessage(update.message);
    }
  };

  async onMessage(message) {
    return this.sendPlainText(message.chat.id, `Echo:\n${message.text}`);
  }

  async sendPlainText(chat_id, text) {
    return (await fetch(this.apiUrl('sendMessage', {chat_id, text}))).json();
  }

  async sendMarkdownV2Text (chat_id, text) {
    return (await fetch(this.apiUrl('sendMessage', {chat_id, text, parse_mode: 'MarkdownV2'}))).json();
  }

  async registerWebhook (webhookUrl) {
    const r = await (await fetch(this.apiUrl('setWebhook', { url: webhookUrl, secret_token: this.secret }))).json()
    console.log(r);
    return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
  }

  async sendInlineQuery (inline_query_id, results) {
    return (await fetch(this.apiUrl('answerInlineQuery', {inline_query_id, results}))).json()
  }

  async sendInlineButton (chat_id, text, button) {
    return sendInlineButtonRow(chat_id, text, [button]);
  }
  
  async sendInlineButtonRow (chat_id, text, buttonRow) {
    return sendInlineButtons(chat_id, text, [buttonRow]);
  }
  
  async sendInlineButtons (chat_id, text, buttons) {
    return (await fetch(this.apiUrl('sendMessage', {
      chat_id,
      reply_markup: JSON.stringify({
        inline_keyboard: buttons
      }),
      text
    }))).json();
  }

  async answerCallbackQuery (callback_query_id, text = null) {
    const data = {callback_query_id};
    if (text) {
      data.text = text;
    }
    return (await fetch(this.apiUrl('answerCallbackQuery', data))).json();
  }

  escapeMarkdown (str, except = '') {
    const all = '_*[]()~`>#+-=|{}.!\\'.split('').filter(c => !except.includes(c))
    const regExSpecial = '^$*+?.()|{}[]\\'
    const regEx = new RegExp('[' + all.map(c => (regExSpecial.includes(c) ? '\\' + c : c)).join('') + ']', 'gim')
    return str.replace(regEx, '\\$&')
  }
  
  apiUrl(methodName, params = {}) {
    const url = new URL(`https://api.telegram.org/bot${this.token}/${methodName}`);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    return url.toString();
  }
}
