import * as app from "../app"

const table = new app.Table<{
  id: string
  version: string
}>({
  name: "user",
  setup: (table) => {
    table.string("id", 64).unique()
    table.string("version", 64)
  },
})

export default table
