const dotenv = require("dotenv")
const discord = require("discord.js")

dotenv.config()

const client = new discord.Client()

client.login(process.env.TOKEN).catch(console.error)
