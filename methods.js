// Importing rss feed
import Parser from "rss-parser";


import { bot } from "./bot.js";
import fs from 'fs';
import { InlineKeyboard } from "grammy";


let parser = new Parser();

export async function getPost() {
    let feed = await parser.parseURL('https://idronline.org/feed');
    // console.log(feed);
    // //console.log(feed.items[0].title)


    let allpost = feed.items.length
    let latestpost = allpost
    console.log("latest" + latestpost);


    let data = fs.readFileSync("./file.json")
    let jsondata = JSON.parse(data)
    let lastPost = jsondata.totalpost;
    let updatepost = 0
    jsondata.totalpost = latestpost;


    if (latestpost != lastPost) {
        updatepost = latestpost - lastPost
        console.log("update" + updatepost)
        jsondata.totalpost = latestpost;
        fs.writeFileSync("./file.json", JSON.stringify(jsondata))

    }


    for (let i = 0; i < updatepost; i++) {

        await bot.api.sendMessage(2090813076, `<b>${feed.items[i].creator}</b>, \n <b><a href="${feed.items[i].link}">${feed.items[i].title}</a></b>,\n <i>${feed.items[1].content.replace(/<[^>]*>?/gm, '').slice(0, 300)} ...<a href="${feed.items[i].link}">Read more...</a></i>`, {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_markup: new InlineKeyboard().url(
                "Open Post", 
                feed.items[i].link
            )
        })

    }
}

// getPost()