import * as app from "../app"
import * as docs from "ghom-djs-docs"

import users from "../tables/users"
import * as core from "../app/core"

const command: app.Command = {
  name: "search",
  description: "Search object in documentation",
  rest: {
    name: "path",
    description: "The documentation path",
    default: "welcome",
  },
  flags: [
    {
      name: "raw",
      flag: "r",
      description: "Get raw data",
    },
  ],
  async run(message) {
    const data = await users.query
      .select("sourceName")
      .where("id", message.author.id)
      .first()

    const sourceName: docs.SourceName = data?.sourceName ?? "stable"
    const result = await docs.search(sourceName, message.args.path)

    if (message.args.raw)
      return message.channel.send(
        core.code.stringify({
          lang: "json",
          content: JSON.stringify(result, null, 2).slice(0, 2000),
        })
      )

    return message.channel.send(app.docEmbed(sourceName, result))
  },
}

module.exports = command
