// importing Bot class and InlineKeyboard class from grammy liabrary
import { Bot, InlineKeyboard,GrammyError,HttpError } from 'grammy';

//  Creating an instance of the `Bot` class and passing token to it. 
export const bot = new Bot(process.env.BOT_TOKEN); //using token here

//importing cron liabrary from node cron
import cron from "node-cron"

//importing getPost function from methods.js
import { getWebPost, sleep } from './methods.js';

//importing removeChat,getChat and addChat function from db.js
import { removeChat, getChat,addChat } from './db.js';

import * as dotenv from "dotenv"
dotenv.config()


// .command is a listener for all commands
bot.command('start', async ctx => {

    bot.api.sendMessage(ctx.message.from.id, "No turning back now 🤭Hope you're as excited as us🥳. Now you can get the updates in the idr directly in your DM's.",
        {
            reply_to_message_id: ctx.message.message_id,
            allow_sending_without_reply: true,
            reply_markup: new InlineKeyboard().url(
                "Open link",
                `https://idronline.org`
            )
        })
    if (ctx.message.chat.type == 'private') {
        await addChat(ctx.message.from.id, ctx.message.from.first_name, ctx.message.chat.type)
    }

});



bot.command("jrbc").filter(
    async (ctx) => {
        // check if the command is from admin & is a reply.
        return ctx.message.reply_to_message && ctx.message.from.id === 1004813228;
    },
    async (ctx) => {
        // Get all subcribers from database.
        const allChats = await getChat();
        // store the success and failed data in broadcast
        const failedChats = [];
        const successChats = [];
        for (let chat of allChats) {
            // Broadcast to chats
            try {
                await bot.api.copyMessage(chat._id, ctx.message.chat.id, ctx.message.reply_to_message.message_id);
                successChats.push(chat._id);
                await sleep(3000);
            } catch (e) {
                failedChats.push(chat._id);
                console.log(e);
            }
        }
        // after broadcast show the statistics to admin.
        await bot.api.sendMessage(1004813228, `Broadcast completed with ${successChats.length} users. Failed count ${failedChats.length}`);
        await bot.api.sendMessage(1004813228, `Success: ${successChats.toString()} \n Fail: ${failedChats.toString()}`);
    }
);






// donation section
bot.command('donate', async ctx => {

    bot.api.sendMessage(ctx.message.from.id, "Now you can donate to idr through this link: https://idronline.org/donate/",
        {
            reply_to_message_id: ctx.message.message_id,
            disable_web_page_preview: true,
            reply_markup: new InlineKeyboard().url(
                "Donate",
                `https://idronline.org/donate/`
            )
        })



});


// bot.on listener for all types of messages
bot.on("my_chat_member", async ctx => {
    if (ctx.myChatMember.chat.type == 'private') {

        if (ctx.myChatMember.new_chat_member.status == "member" && ctx.myChatMember.old_chat_member.status == "kicked") {
            // remove user from database
            await removeChat(ctx.myChatMember.from.id)
        }
    }

    else if (bot.botInfo.id == ctx.myChatMember.old_chat_member.user.id) {
        // bot added in group                                       // bot added in channel 
        if (ctx.myChatMember.new_chat_member.status == "member" || ctx.myChatMember.new_chat_member.status == "administrator") {

            await bot.api.sendMessage(ctx.myChatMember.chat.id, "Thanks for adding me to this group🙏. Now you can get the new updates here 🙂.")
            await addChat(ctx.myChatMember.chat.id, ctx.myChatMember.chat.title, ctx.myChatMember.chat.type)
        }
        // remove the bot from group                                                //remove bot from channel
        else if (ctx.myChatMember.new_chat_member.status == "kicked" || ctx.myChatMember.new_chat_member.status == "left") {
            await removeChat(ctx.myChatMember.chat.id)
        }

    }
}

);



// scheduled time through cron job
cron.schedule("*/10 * * * *", async () => {
    await getWebPost()

});




// error handler
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});



bot.start()

