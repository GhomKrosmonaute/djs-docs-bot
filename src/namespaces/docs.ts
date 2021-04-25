import * as core from "../app/core"
import * as docs from "ghom-djs-docs"
import discord from "discord.js"

export interface Lib {
  name: string
  displayName: string
  color: string
  image: string
  github: string
  docs: string
  sourceNames: docs.SourceName[]
}

export const libs: Lib[] = [
  {
    color: "BLURPLE",
    name: "discord.js",
    image: "https://discord.js.org/static/logo-square.png",
    displayName: "Discord JS",
    github: "https://github.com/discordjs/discord.js",
    docs: "https://discord.js.org/#/docs/main/stable/general/welcome",
    sourceNames: ["stable", "master"],
  },
  {
    color: "BLURPLE",
    name: "discord.js-commando",
    image: "https://discord.js.org/static/logo-square.png",
    displayName: "Discord JS Commando",
    github: "https://github.com/discordjs/Commando",
    docs: "https://discord.js.org/#/docs/commando/master/general/welcome",
    sourceNames: ["commando"],
  },
  {
    color: "BLURPLE",
    name: "discord-rpc",
    image: "https://discord.js.org/static/logo-square.png",
    displayName: "Discord RPC",
    github: "https://github.com/discordjs/RPC",
    docs: "https://discord.js.org/#/docs/rpc/master/general/welcome",
    sourceNames: ["rpc"],
  },
  {
    color: "#87202F",
    name: "discord-akairo",
    image: "https://avatars3.githubusercontent.com/u/48862924",
    displayName: "Discord Akairo",
    github: "https://github.com/discord-akairo/discord-akairo",
    docs:
      "https://discord-akairo.github.io/#/docs/main/master/class/AkairoClient",
    sourceNames: ["akairo"],
  },
  {
    color: "BLURPLE",
    name: "@discordjs/collection",
    image: "https://discord.js.org/static/logo-square.png",
    displayName: "Discord Collections",
    github: "https://github.com/discordjs/collection",
    docs: "https://discord.js.org/#/docs/collection/master/general/welcome",
    sourceNames: ["collection"],
  },
]

export function docEmbed(
  sourceName: docs.SourceName,
  e: docs.SearchResult
): discord.MessageEmbed {
  const deprecated = "<:deprecated:835820600068800553>"
  const embed = new discord.MessageEmbed()
  const lib = getLib(sourceName)

  if (!e)
    return embed
      .setColor("RED")
      .setAuthor("Unknown element", lib.image)
      .setDescription("Maybe try different path")

  const url = docs.buildURL(sourceName, e)

  let description = e.description ?? "No description."
  let authorName = e.name

  embed.setColor(lib.color)

  const raw = docs.cache.get(sourceName) as docs.Raw

  if (docs.isProp(raw, e)) {
    authorName += " [property]"
  } else if (docs.isClass(raw, e)) {
    authorName += " [class]"
  } else if (docs.isEvent(raw, e)) {
    authorName += " [event]"
    description = `${core.code.stringify({
      lang: "js",
      content: core.code.format(
        `emitter.on("${e.name}", (${
          e.params
            ? e.params
                .map((param) => {
                  return `${param.name}${param.optional ? "?" : ""}`
                })
                .join(", ")
            : ""
        }) => unknown)`,
        "js",
        {
          printWidth: 60,
        }
      ),
    })}\n${e.description}`
  } else if (docs.isExternal(raw, e)) {
    authorName += " [external]"
  } else if (docs.isMethod(raw, e)) {
    authorName = `${e.abstract ? "abstract" : ""} ${e.access ?? ""} ${
      e.async ? "async " : ""
    }${e.name}(${
      e.params
        ? e.params
            .map((param) => {
              return `${param.name}${param.optional ? "?" : ""}`
            })
            .join(", ")
        : ""
    })`
  } else if (docs.isInterface(raw, e)) {
    authorName += " [interface]"
  } else if (docs.isTypedef(raw, e)) {
    authorName += " [typedef]"
  } else {
    authorName += " [param]"
  }

  if ("type" in e && e.type) {
    authorName += ` (${docs.flatTypeDescription(e.type)})`
  }

  if ("deprecated" in e && e.deprecated) {
    description += `\n\n${deprecated} **Deprecated!**`
  }

  for (const key of ["props", "methods", "events"]) {
    // @ts-ignore
    if (key in e && e[key]) {
      embed.addField(
        key,
        // @ts-ignore
        e[key]
          .map((item: docs.Prop | docs.Method | docs.Event) => {
            return `${item.deprecated ? "~~" : ""}${item.name}${
              item.deprecated ? "~~" : ""
            } ${item.deprecated ? deprecated : ""}`
          })
          .join("\n"),
        true
      )
    }
  }

  if ("meta" in e && e.meta)
    embed.setFooter(`${e.meta.path}/${e.meta.file} | line: ${e.meta.line}`)

  return embed
    .setAuthor(authorName, lib.image, url ?? undefined)
    .setDescription(description)
}

export function getLib(sourceName: docs.SourceName): Lib {
  return libs.find((lib) => lib.sourceNames.includes(sourceName)) as Lib
}
