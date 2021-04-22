import * as app from "../app"

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
      async run(message) {},
    },
    {
      name: "set",
      description: "Set default version",
      positional: [
        {
          name: "version",
          description: "Your new default version",
          checkValue: (value) =>
            app.libs.some((lib) => lib.versions.hasOwnProperty(value)),
          required: true,
        },
      ],
      async run(message) {},
    },
  ],
}

module.exports = command
