import * as app from "../app"
import * as docs from "ghom-djs-docs"

import users from "../tables/users"

const command: app.Command = {
  name: "version",
  aliases: ["versions", "v"],
  description: "Manage versions",
  async run(message) {
    const prefix = await app.prefix(message.guild ?? undefined)

    return app.sendCommandDetails(message, this, prefix)
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
                    return `${lib.displayName}:\n  ${lib.versions.join("\n  ")}`
                  })
                  .join("\n\n"),
              })
            )
        )
      },
    },
    {
      name: "set",
      description: "Set default version",
      positional: [
        {
          name: "version",
          description: "Your new default version",
          checkValue: (value) => docs.sources.hasOwnProperty(value),
          required: true,
        },
      ],
      async run(message) {
        const lib = app.lib(message.args.version)

        await users.query
          .insert({
            id: message.author.id,
            version: message.args.version,
          })
          .onConflict("id")
          .merge()

        return message.channel.send(
          new app.MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`New default version setup`)
            .setDescription(`Your new default version is \`${lib.name}\``)
        )
      },
    },
  ],
}

module.exports = command
