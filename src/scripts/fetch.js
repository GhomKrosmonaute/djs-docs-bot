const { exec } = require("child_process")
const config = require("../config.json")

Promise.all(config.documentations.map(fetch))
  .then(() => console.log("successfully fetched"))
  .catch(console.error)

async function fetch(doc) {
  return new Promise((resolve, reject) => {
    exec(
      `git clone -b ${doc.branch} --single-branch ${doc.repository} docs/${doc.name}`,
      (error) => {
        if (error) {
          exec(
            "git reset --hard && git pull origin docs",
            { cwd: `docs/${doc.name}` },
            (error) => {
              if (error) {
                reject(error)
              } else {
                resolve()
              }
            }
          )
        } else {
          resolve()
        }
      }
    )
  })
}
