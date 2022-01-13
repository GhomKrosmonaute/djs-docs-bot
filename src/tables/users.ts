import * as app from "../app.js"
import * as docs from "ghom-djs-docs"

const table = new app.Table<{
  id: string
  sourceName: docs.SourceName
}>({
  name: "users",
  description: "Represent user current source name",
  setup: (table) => {
    table.string("id", 64).unique()
    table.string("sourceName", 64)
  },
})

export default table
