const TelegramBot = require('node-telegram-bot-api');
const {token, amirTelegramUrl} = require("./config");
const bot = new TelegramBot(token, { polling: true });
const createInlineButtons = buttons => buttons.map(button =>({
    text: button.text,
    callback_data: button.callback_data
}));
const createBackButton = () => [{text:"بازگشت", callback_data:"back"}];
const sendMessageWithOptions = (chatId, text, options) => {
    const defaultOptions = {parse_mode:"markdown"};
    bot.sendMessage(chatId, text, {...defaultOptions, ...options});
};
const editMessageWithOptions = (chatId, messageId, text, options) =>{
    const defaultOptions= {parse_mode:"markdown"};
    bot.editMessageText(text, {chat_id: chatId, message_id: messageId, ...defaultOptions, ...options});
};
bot.onText(/\/start/, msg=>{
    const chatId = msg.chat.id;
    const userName = msg.from.first_name;
    const userLastname = msg.from.last_name || "";
    const welcomeMessage = `${userName} ${userLastname} \n عزیز به کانال من خوش آمدید`;
    const startOptions = {
        reply_markup: {
            inline_keyboard:[
                createInlineButtons([{text:"About me", callback_data:"about_me"}, {text:"Channels", callback_data:"channels"}])
            ]
        }
    };
    sendMessageWithOptions(chatId, welcomeMessage, startOptions);
});
bot.on("callback_query", callbackQuery => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;
    switch (data) {
        case "about_me":
            const amirInfo = `I am not the founder`;
            const inlineKeyboard = [
                [
                    {text: "AmirNobari Telegram", url: amirTelegramUrl}
                ],
                createBackButton()
            ];
            const aboutMeOptions = {reply_markup:{inline_keyboard:inlineKeyboard}};
            editMessageWithOptions(chatId, messageId, amirInfo, aboutMeOptions);
            break;
        case "channels":
            const channelsOptions = {
                reply_markup:{
                    inline_keyboard:[
                        createInlineButtons([{text:"کانال اصلی", callback_data:"main_channel"}, { text: 'گروه متصل به کانال', callback_data: 'related_group' }])
                    ]
                }
            };
            editMessageWithOptions(chatId, messageId, 'Choose a channel:', channelsOptions);
            break;
        
        case 'main_channel':
            const mainChannelOptions = {
                reply_markup: { inline_keyboard: [createBackButton()] }
            };
            editMessageWithOptions(chatId, messageId, 'کانال اصلی: [js_challenges](https://t.me/js_challenges)', mainChannelOptions);
            break;

        case 'related_group':
            const relatedGroupOptions = {
                reply_markup: { inline_keyboard: [createBackButton()] }
            }
            editMessageWithOptions(chatId, messageId, 'گروه متصل به کانال اصلی: [js_masters_gp](https://t.me/js_masters_gp)', relatedGroupOptions);
            break;

        case 'back':
            const startOptions = {
                reply_markup: {
                    inline_keyboard: [
                        createInlineButtons([{ text: 'About Me', callback_data: 'about_me' }, { text: 'Channels', callback_data: 'channels' }])
                    ]
                }
            }
            editMessageWithOptions(chatId, messageId, 'به ربات من خوش آمدید 😍', startOptions);
            break;
    }
    bot.answerCallbackQuery(callbackQuery.id);
})