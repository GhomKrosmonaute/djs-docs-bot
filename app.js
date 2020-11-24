import discord from "discord.js"

const client = new discord.Client()

client.login(process.env.TOKEN).catch(console.error)
