// Importing rss feed
// It's a library, converts XML file to json file
import Parser from "rss-parser";

// importing bot variable from bot.js file
import { bot } from "./bot.js";

// import fs from 'fs';

// importing InlineKeyboard class from grammy
import { InlineKeyboard } from "grammy";

// importing updatePosts and  getPosts function from db.js file
import { updatePosts, getPosts } from "./db.js";

// importing addchat function from db.js file
import { getChat } from "./db.js";


// make a new parser
let parser = new Parser();


export async function getWebPost() {
    // get all the items in the RSS feed
    let feed = await parser.parseURL('https://idronline.org/feed');

    // GUID **************************
    console.log(feed.items[3].guid)
    console.log(feed.items)
    let firstGuid = feed.items[0].guid
    // console.log("firstGUID" + firstGuid)
    let result = await getPosts()


    let dbGuid = result.guidIndex
    if (firstGuid != dbGuid) {
        const dbpostIndex = feed.items.map(items => items.guid).indexOf(dbGuid);
        await updatePosts(firstGuid)

        // getChat function calling 
        let allChats = await getChat()

        for (let i = dbpostIndex - 1; i >= 0; i--) {

            for (let chatid of allChats) {
                console.log(chatid._id)
                // taking all chat ids here 
                try {
                    await bot.api.sendMessage(chatid._id, ` <b><a href="${feed.items[i].link}">${feed.items[i].title}</a></b> \n Author:- <i>${feed.items[i].creator}</i> \n\n <i>${feed.items[i].content.replace(/<[^>]*>?/gm, '').slice(0, 300)} ...<a href="${feed.items[i].link}">Read more...</a></i>`,
                        {
                            parse_mode: "HTML",
                            disable_web_page_preview: true,
                            reply_markup: new InlineKeyboard().url(
                                "Read Post",
                                feed.items[i].link
                            )
                        }
                    )
                } catch (e) {
                    console.log(e)
                }
            }
        }

    }
}

// getPost()

