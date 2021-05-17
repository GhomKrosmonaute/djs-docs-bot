import * as app from "../app"
import * as docs from "ghom-djs-docs"

import users from "../tables/users"

const command: app.Command = {
  name: "source",
  aliases: ["versions", "version", "src", "v"],
  description: "Manage discord.js versions",
  async run(message) {
    return app.sendCommandDetails(message, this)
  },
  subs: [
    {
      name: "list",
      description: "List versions",
      async run(message) {
        return message.channel.send(
          new app.MessageEmbed()
            .setTitle("List of versions")
            .setColor("BLURPLE")
            .setDescription(
              app.code.stringify({
                lang: "yml",
                content: app.libs
                  .map((lib) => {
                    return `${lib.displayName}:\n  ${lib.sourceNames.join(
                      "\n  "
                    )}`
                  })
                  .join("\n\n"),
              })
            )
        )
      },
    },
    {
      name: "set",
      description: "Set your default version",
      positional: [
        {
          name: "sourceName",
          description: "Your new default version",
          checkValue: (value) => docs.sources.hasOwnProperty(value),
          required: true,
        },
      ],
      async run(message) {
        const lib = app.getLib(message.args.sourceName)

        await users.query
          .insert({
            id: message.author.id,
            sourceName: message.args.sourceName,
          })
          .onConflict("id")
          .merge()

        return message.channel.send(
          new app.MessageEmbed()
            .setColor(lib.color)
            .setAuthor(`New default version setup`, lib.image)
            .setDescription(`Your new default version is \`${lib.name}\``)
        )
      },
    },
  ],
}

module.exports = command
