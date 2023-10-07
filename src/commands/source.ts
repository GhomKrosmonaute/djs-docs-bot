import * as app from "../app.js"
import * as docs from "ghom-djs-docs"

import users from "../tables/users.js"

export default new app.Command({
  name: "source",
  aliases: ["versions", "version", "src", "v"],
  channelType: "all",
  description: "Manage discord.js versions",
  async run(message) {
    const currentSourceName = await app.getUserSourceName(message.author)
    const lib = app.getLib(currentSourceName)

    return message.channel.send({
      embeds: [
        new app.MessageEmbed()
          .setTitle("Your current version: " + currentSourceName)
          .setColor(lib.color)
          .setThumbnail(lib.image)
          .setDescription(
            `- [Docs](${lib.docs})\n- [Github](${lib.github})\n- [NPM](https://www.npmjs.com/package/${lib.name})`
          ),
      ],
    })
  },
  subs: [
    new app.Command({
      name: "list",
      description: "List versions",
      channelType: "all",
      async run(message) {
        const currentSourceName = await app.getUserSourceName(message.author)

        return message.channel.send({
          embeds: [
            new app.MessageEmbed()
              .setTitle("List of versions")
              .setColor("BLURPLE")
              .setDescription(
                app.code.stringify({
                  lang: "yml",
                  content: app.libs
                    .map((lib) =>
                      lib.sourceNames
                        .map(
                          (name) =>
                            `\n${
                              currentSourceName === name ? "*" : " "
                            } ${name}`
                        )
                        .join("")
                    )
                    .join(""),
                })
              ),
          ],
        })
      },
    }),
    new app.Command({
      name: "set",
      description: "Set your default version",
      channelType: "all",
      positional: [
        {
          name: "sourceName",
          description: "Your new current version",
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

        return message.channel.send({
          embeds: [
            new app.MessageEmbed()
              .setColor(lib.color)
              .setAuthor({
                name: `New default version setup`,
                iconURL: lib.image,
              })
              .setDescription(`Your new current version is \`${lib.name}\``),
          ],
        })
      },
    }),
  ],
})
