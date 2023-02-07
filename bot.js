// importing Bot class and InlineKeyboard class from grammy liabrary
import { Bot, InlineKeyboard } from 'grammy';

//  Creating an instance of the `Bot` class and passing token to it. 
export const bot = new Bot(process.env.BOT_TOKEN); //using token here

//importing cron liabrary from node cron
import cron from "node-cron"

//importing getPost function from methods.js
import { getWebPost } from './methods.js';

// importing addChat function from db.js file
import { addChat } from './db.js';


//importing removeChat function from db.js
import { removeChat } from './db.js';


cron.schedule("*/3 * * * *", async () => {
    await getWebPost()

})

getWebPost()

// .command is a listener for all commands
bot.command('start', async ctx => {
    // sendMessage is listener for all messages
    bot.api.sendMessage(ctx.message.from.id, "No turning back now 🤭Hope you're as excited as us🥳. Now you can get the updates in the idr directly in your DM's.",
        {
            reply_to_message_id: ctx.message.message_id,
            reply_markup: new InlineKeyboard().url(
                "Open Post",
                `https://idronline.org`
            )
        })
    if (ctx.message.chat.type == 'private') {
        await addChat(ctx.message.from.id, ctx.message.from.first_name, ctx.message.chat.type)
    }

});



// donation 
bot.command('donate', async ctx => {
    // sendMessage is listener for all messages
    bot.api.sendMessage(ctx.message.from.id, "Now you can donate to idr through this link: https://idronline.org/donate/",
        {
            reply_to_message_id: ctx.message.message_id,
            disable_web_page_preview: true,
            reply_markup: new InlineKeyboard().url(
                "Open link",
                `https://idronline.org/donate/`
            )
        })

});


// Remove function calling based on condition
bot.on("my_chat_member", async ctx => {
    if (ctx.myChatMember.chat.type == 'private') {
        if (ctx.myChatMember.new_chat_member.status == "member" && ctx.myChatMember.old_chat_member.status == "kicked") {
            await removeChat(ctx.myChatMember.from.id)
        }
    }

    else if (bot.botInfo.id == ctx.myChatMember.old_chat_member.user.id) {

        if (ctx.myChatMember.new_chat_member.status == "member" || ctx.myChatMember.new_chat_member.status == "administrator") {
            await bot.api.sendMessage(ctx.myChatMember.chat.id, "Thanks for adding me to this group🙏. Now you can get the new updates here 🙂.")
            await addChat(ctx.myChatMember.chat.id, ctx.myChatMember.chat.title, ctx.myChatMember.chat.type)
        }

        else if (ctx.myChatMember.new_chat_member.status == "kicked" || ctx.myChatMember.new_chat_member.status == "left") {
            await removeChat(ctx.myChatMember.chat.id)
        }

    }
}

);

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

