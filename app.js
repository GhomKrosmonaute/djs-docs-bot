import dotenv from "dotenv"
import discord from "discord.js"

dotenv.config()

const client = new discord.Client()

client.login(process.env.TOKEN).catch(console.error)
