// Importing rss feed
// It's a library, converts XML file to json file
import Parser from "rss-parser";

// importing bot variable from bot.js file
import { bot } from "./bot.js";

// importing fs from fs
import fs from 'fs';

// importing InlineKeyboard class from grammy
import { InlineKeyboard } from "grammy";

// importing updatePosts and  getPosts function from db.js file
import { updatePosts, getPosts } from "./db.js";

// importing addchat function from db.js file
import { getChat } from "./db.js";



let parser = new Parser();


export async function getWebPost() {
    let feed = await parser.parseURL('https://idronline.org/feed');


    let allpost = feed.items.length
    let latestpost = allpost
    console.log("latest" + latestpost);


    let data = await getPosts()
    let lastPost = data.totalpost;
    let updatepost = 0
    data.totalpost = latestpost;


    if (latestpost != lastPost) {
        updatepost = latestpost - lastPost
        console.log("update" + updatepost)
        data.totalpost = latestpost;
        await updatePosts(latestpost)

    }


    // getChat function calling 
    let allChats = await getChat()

    for (let i = 0; i < updatepost; i++) {
        for (let chatid of allChats) {
            await bot.api.sendMessage(chatid._id, ` <b><a href="${feed.items[i].link}">${feed.items[i].title}</a></b>,\n Author: <i>${feed.items[i].creator}</i>,\n <i>${feed.items[1].content.replace(/<[^>]*>?/gm, '').slice(0, 300)} ...<a href="${feed.items[i].link}">Read more...</a></i>`, {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                reply_markup: new InlineKeyboard().url(
                    "Open Post",
                    feed.items[i].link
                )
            })
        }


    }
}

// getPost()