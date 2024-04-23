# Another Cloudflare Workers Telegram Bot

Another Cloudflare Workers Telegram Bot is inspired by [cvzi/telegram-bot-cloudflare](/cvzi/telegram-bot-cloudflare).
This is wrapped up as a class to make it easy to to used like any NPM library.
You can handle telegram update the way you wish by override onUpdate method.

Examples are about the same demos from [cvzi/telegram-bot-cloudflare](/cvzi/telegram-bot-cloudflare).

## Setup through Cloudflare GUI:

1. Get your new bot token from [@BotFather](https://t.me/botfather): https://core.telegram.org/bots#6-botfather
2. Sign up to Cloudflare Workers: https://workers.cloudflare.com/
3. In the Cloudflare Dashboard go to "Workers", then click "Create application" and then "Create worker"
4. Choose a name and click "Deploy" to create the worker
5. Click on "Configure worker" -> "Settings" -> "Variables"
6. Add a new variable with the name `ENV_BOT_TOKEN` and the value of your bot token from [@BotFather](https://t.me/botfather)
7. Add a new variable with the name `ENV_BOT_SECRET` and set the value to a random secret. See https://core.telegram.org/bots/api#setwebhook
8. Click on "Quick Edit" to change the source code of your new worker
9. Copy and paste the code from [bot.js](bot.js) into the editor
10. Add new file named telegram-bot.js and copy code from [telegram-bot.js](telegram-bot.js) into the editor again
10. Optional: Change the `WEBHOOK` variable to a different path. See https://core.telegram.org/bots/api#setwebhook
11. Click on "Save and Deploy"
12. In the middle panel append `/registerWebhook` to the url. For example: https://my-worker-123.username.workers.dev/registerWebhook
13. Click "Send". In the right panel should appear `Ok`. If 401 Unauthorized appears, you may have used a wrong bot token.
14. That's it, now you can send a text message to your Telegram bot

## Setup through Cloudflare Wrangler(Recommanded if you know how to use NPM and commandline tools):

1. open any shell and put command: `npm create cloudflare@2.5.0 "YOUR_NEW_PROJECT_FOLDER_PATH"`
2. Choose `"Hello World" Worker` for type of application
3. Choose `No` for not to use TypeScript
4. Choose if you like to use git for version control? `No` if you aren't sure
5. Choose `No` for not to deploy yet
6. Copy content of bot.js to overwrite all content of src/index.js
7. Copy telegramBot.js to src/ folder
8. add env variables to wrangler.toml like below
```
[vars]
ENV_BOT_TOKEN= "1234567890:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" # bot token from [@BotFather](https://t.me/botfather)
ENV_BOT_SECRET= "ANY_RANDOM_WORDS" # See https://core.telegram.org/bots/api#setwebhook
```
8. cd to `YOUR_NEW_PROJECT_FOLDER_PATH` and put command: `npm run deploy`
9. command: `curl "https://my-worker-123.username.workers.dev/registerWebhook"`. You can find your worker url at step 8.
10. You should see `Ok` in step 9. If 401 Unauthorized/404 Not Fount appears, you may have used a wrong bot token.

## Usage

The bot will send the original message back with `Echo:` prepended.
If you want to change it, look at the function `onMessage()`. It receives a [Message](https://core.telegram.org/bots/api#message) object and sends a text back:

```javascript
/**
 * Handle incoming Message
 * https://core.telegram.org/bots/api#message
 */
function onMessage(message) {
	return bot.sendPlainText(message.chat.id, `Echo:\n${message.text}`);
}
```

## example_inlineButtons.js

The file [example_inlineButtons.js](/example_inlineButtons.js) contains an improved bot, that demonstrates how to react to commands,
send and receive [inline buttons](https://core.telegram.org/bots/api#inlinekeyboardbutton),
and create [MarkdownV2](https://core.telegram.org/bots/api#markdownv2-style)-formatted text.

## example_inlineQueriesAndVoice.js

The file [example_inlineQueriesAndVoice.js](example_inlineQueriesAndVoice.js) contains an improved version that replies inline queries with voice messages.
The voice messages should be stored in OPUS format and .ogg in the cloud you most like.
The audio files are listed in a JSON array with the following structure in a KV namespace called `NAMESPACE` and with following content under the key `input_files`.

Go to *Workers & Pages* -> *KV* and create a new namespace. Add a new key `input_files` and store the JSON structure from below with your own audio files.

Now in *Overview* -> your-worker -> *Settings* -> *Variables* -> *KV Namespace Bindings* bind the namespace to a variable called `NAMESPACE`.

```javascript
 [
    [
      "File Name",
      "URL",
      duration,
      "<tg-spoiler> caption </tg-spoiler>"
    ],
    [
      "test",
      "https://example.com/my_file.ogg",
      5,
      "<tg-spoiler>Description in a spoiler</tg-spoiler>"
    ],
  ]
```
## example_reaction.js
The file [example_reaction,js](example_reaction) is a bot that randomly reacts to messages received. It demostrates how to use big reactions when the 🎉 emoji gets chosen.