// importing mongoClient from mongodb, its a computer helper tool to communicate with Mongo db
import { MongoClient } from 'mongodb';

// all of the exports from the dotenv module are being assigned to a variable called "dotenv" through "*".
import * as dotenv from "dotenv"

// The dotenv.config() function helps you keep this information safe and organized.
dotenv.config()


async function main() {
    // taking URL from Mongo DB
    const mongo_url = process.env.MONGO_URL
    const client = new MongoClient(mongo_url)

    try {
        await client.connect()
        console.log("connected to database");

        const database = client.db("idronline_english")
        return database
    } catch (error) {
        console.error(`error in connecting to mongoDB:${error}`)
    }
}
const db = await main()


// posts collection (table of posts)method
const posts = db.collection("posts")
export async function updatePosts(id) {
    await posts.updateOne(
        {
            _id: "postData"
        },
        {
            $set: {
                guidIndex: id
            }
        }
    ).then(() => {
        return true;
    }).catch((er) => {
        console.log(`Unable to add posts number in DB: ${er}`);
        return false;
    });
}


export async function getPosts() {
    const postdata = await posts.findOne(
        { _id: "postData" }
    )
    return postdata;
}


// chats collection (table of chats)method
const chat = db.collection("chat")
export async function addChat(chatId, chatName, chatType) {
    const item = await chat.findOne({ _id: chatId });
    if (item) return false;

    await chat.insertOne(
        {
            _id: chatId,
            Name: chatName,
            Type: chatType
        }
    )
        .then(() => {
            //console.log(`Inserted user to DB`);
            return true;
        }).catch((er) => {
            console.log(`Unable to add chatid in DB: ${er}`);
            return false;
        });
}



export async function getChat() {
    const allChatIdArray = await chat.find({ _id: { $ne: null } }).toArray();
    return allChatIdArray

}



// Remove function 
export async function removeChat(chatId) {
    // check if same User already exists.
    const item = await chat.findOne({ _id: chatId });
    if (!item) return false;

    // if yes, remove from db.
    await chat.deleteOne({
        _id: chatId
    }).catch((err) => {
        console.log(`Unable to remove chat frm DB: ${err}`);
    })

}

// await updatePosts(11)