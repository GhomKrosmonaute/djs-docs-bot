import { exec } from "child_process"

console.log("fetch docs by clone")
exec(
  "git clone -b docs --single-branch https://github.com/discordjs/discord.js.git docs",
  (error) => {
    if (error) {
      console.error("docs already cloned")
      console.log("fetch docs by pull")
      exec("git pull origin docs", { cwd: "docs" }, (error) => {
        if (error) {
          throw error
        } else {
          console.log("docs successfully fetched by pull")
        }
      })
    } else {
      console.log("docs successfully fetched by clone")
    }
  }
)
