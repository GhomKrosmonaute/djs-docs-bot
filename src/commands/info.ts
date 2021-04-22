import * as app from "../app"

const command: app.Command = {
  name: "info",
  description: "",
  async run(message) {
    return message.channel.send(
      new app.MessageEmbed()
        .setColor(app.toLib(doc).color)
        .setAuthor(
          message.client.user?.username,
          message.client.user?.avatarURL({ dynamic: true }) ?? undefined
        )
        .setDescription(
          `I help members of **${message.client.guilds.cache.size}** guilds.\n` +
            `My owner is \`Ghom#9700\`.\n[Link to DiscordBots page](https://discordbots.org/bot/554108430298775564)`
        )
        .setThumbnail(message.client.user.avatarURL({ dynamic: true }))
    )
  },
}

module.exports = command
