import * as app from "../app"
import * as docs from "ghom-djs-docs"

const table = new app.Table<{
  id: string
  version: docs.SourceName
}>({
  name: "users",
  setup: (table) => {
    table.string("id", 64).unique()
    table.string("version", 64)
  },
})

export default table
