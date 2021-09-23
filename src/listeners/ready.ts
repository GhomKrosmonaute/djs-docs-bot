import fs from "fs"
import figlet from "figlet"
import path from "path"
import boxen from "boxen"
import chalk from "chalk"
import * as docs from "ghom-djs-docs"

import * as app from "../app.js"

const listener: app.Listener<"ready"> = {
  event: "ready",
  once: true,
  async run() {
    app.log("Ok i'm ready!", "system")

    await docs.fetchAll({ force: true })

    figlet(
      JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
      ).name,
      (err, value) => {
        if (err) return

        console.log(
          boxen(chalk.blueBright(value), {
            float: "center",
            borderStyle: {
              topLeft: " ",
              topRight: " ",
              bottomLeft: " ",
              bottomRight: " ",
              horizontal: " ",
              vertical: " ",
            },
          })
        )
      }
    )
  },
}

export default listener
