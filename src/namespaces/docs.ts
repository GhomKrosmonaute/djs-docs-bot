import * as data from "./data"

const Doc = require("discord.js-docs")

export function buildEmbedFrom(doc: data.Doc) {}

async function fetchDocs() {
  for (const lib of data.libs) {
    for (const version in lib.versions) {
      lib.versions[version] = await Doc.fetch(version)
    }
  }
}
