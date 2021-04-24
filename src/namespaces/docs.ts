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
  versions: docs.SourceName[]
}

export const libs: Lib[] = [
  {
    color: "BLURPLE",
    name: "discord.js",
    image: "https://discord.js.org/static/logo-square.png",
    displayName: "Discord JS",
    github: "https://github.com/discordjs/discord.js",
    docs: "https://discord.js.org/#/docs/main/stable/general/welcome",
    versions: ["stable", "master"],
  },
  {
    color: "BLURPLE",
    name: "discord.js-commando",
    image: "https://discord.js.org/static/logo-square.png",
    displayName: "Discord JS Commando",
    github: "https://github.com/discordjs/Commando",
    docs: "https://discord.js.org/#/docs/commando/master/general/welcome",
    versions: ["commando"],
  },
  {
    color: "BLURPLE",
    name: "discord-rpc",
    image: "https://discord.js.org/static/logo-square.png",
    displayName: "Discord RPC",
    github: "https://github.com/discordjs/RPC",
    docs: "https://discord.js.org/#/docs/rpc/master/general/welcome",
    versions: ["rpc"],
  },
  {
    color: "#87202F",
    name: "discord-akairo",
    image: "https://avatars3.githubusercontent.com/u/48862924",
    displayName: "Discord Akairo",
    github: "https://github.com/discord-akairo/discord-akairo",
    docs:
      "https://discord-akairo.github.io/#/docs/main/master/class/AkairoClient",
    versions: ["akairo"],
  },
  {
    color: "BLURPLE",
    name: "@discordjs/collection",
    image: "https://discord.js.org/static/logo-square.png",
    displayName: "Discord Collections",
    github: "https://github.com/discordjs/collection",
    docs: "https://discord.js.org/#/docs/collection/master/general/welcome",
    versions: ["collection"],
  },
]

export function docEmbed(
  raw: docs.Raw,
  e: docs.SearchResult
): discord.MessageEmbed {
  const embed = new discord.MessageEmbed()

  if (docs.isClass(raw, e)) {
  }

  return embed
}

export function lib(version: docs.SourceName): Lib {
  return libs.find((lib) => lib.versions.includes(version)) as Lib
}
