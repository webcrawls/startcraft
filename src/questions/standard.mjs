import enquirer from 'enquirer'
import * as vanilla from './vanilla.mjs'
import * as paper from './paper.mjs'
import chalk from 'chalk'
import server from '../data/server.mjs'
import fs from 'fs'

const { Select, Confirm } = enquirer

const promptServerType = () => {
    new Select({
        name: 'serverType',
        message: 'What server type would you like to create?',
        choices: [
            { name: 'Paper', hint: 'RECOMMENDED'},
            { name: 'Vanilla'}
        ]
    }).run().then(answer => {
        if (answer === 'Vanilla') {
            server.serverType = 'vanilla'
            vanilla.promptServerVersionType()
        }
    })
}

const promptSaveSettings = () => {
    new Confirm({
        name: 'saveSettings',
        message: 'Would you like to save these settings? This will tell startcraft more about your server, for features such as '+chalk.cyanBright("auto-updating")+chalk.white("."),
        initial: true
    }).run().then((answer) => {
        if (answer) {
            server.createdDate = new Date()
            let data = JSON.stringify(server, null, 2)
            fs.writeFile("startcraft.json", data, (err) => {
                if (err) {
                    console.log(chalk.red("Error saving startcraft.json."))
                    return
                }

                promptAgreeToEula((answer) => {
                    if (answer) {
                        fs.writeFileSync("eula.txt", "eula=true")
                    }
                })
            })
        }
    })
}

const promptAgreeToEula = (acceptCallback) => {
    new Confirm({
        name: 'acceptEula',
        message: 'Would you like to accept the Mojang EULA? Read more: ' + chalk.cyanBright("https://account.mojang.com/documents/minecraft_eula"),
        initial: true
    }).run().then((answer => {
        acceptCallback(answer)
    }))
}

export { promptServerType, promptSaveSettings }