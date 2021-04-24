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
      .select("version")
      .where("id", message.author.id)
      .first()

    const version: docs.SourceName = data?.version ?? "master"
    const raw = docs.cache.get(version) as docs.Raw
    const result = docs.search(raw, message.args.path)

    if (message.args.raw)
      return message.channel.send(
        core.code.stringify({
          lang: "json",
          content: JSON.stringify(result, null, 2).slice(0, 2000),
        })
      )

    return message.channel.send(app.docEmbed(raw, result))
  },
}

module.exports = command
