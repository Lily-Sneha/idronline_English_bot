// importing Bot class and InlineKeyboard class from grammy liabrary
import { Bot, InlineKeyboard } from 'grammy';

//  Creating an instance of the `Bot` class and passing token to it. 
export const bot = new Bot("6139853250:AAE-9qf62ZZ1HfmGW3cLmpUFrrouTBMpwbk"); //using token here

//importing cron liabrary from node cron
import cron from "node-cron"

//importing getPost function from methods.js
import { getPost } from './methods.js';


// cron.schedule('* * * * *', () => {
//     // console.log('running a task every second');
//     // console.log("hello lily")
//     bot.api.sendMessage(2090813076, "<i>welcome to the chatbot lily</i>", {
//         parse_mode: "HTML"
//     })
// });

getPost()




bot.command('start', ctx => {
    bot.api.sendMessage(ctx.message.from.id, "No turning back now 🤭Hope you're as excited as us🥳. Now you can get the updates in the idr directly in your DM's.",
    {
        reply_to_message_id: ctx.message.message_id,
        reply_markup:new InlineKeyboard().url(
        "Open Post",
        `https://idronline.org`
    )})

});

bot.on("my_chat_member",ctx=>{
    // console.log(ctx.message.new_chat_members)
    console.log(ctx.myChatMember)
});





bot.start()

