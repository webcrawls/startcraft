import enquirer from 'enquirer'
import ora from 'ora'
import axios from 'axios'
import { downloadImage } from '../util/file.mjs'
import stripAnsi from 'strip-ansi'
import path from 'path'
import chalk from 'chalk'
import * as script from './script.mjs'

const { Select, AutoComplete } = enquirer

let knownVersions = []

// Prompts for the server's version type (i.e. release, snapshot, etc)
const promptServerVersionType = () => {
    new Select({
        name: 'serverVersionType',
        message: 'What version category would you like to run?',
        choices: [
            { name: 'Release', hint: '(1.16.4)' },
            { name: 'Snapshot', hint: '(20w45a)' }
        ]
    }).run().then(answer => {
        promptServerVersion(answer)
    })
}

const promptServerVersion = (versionType) => {
    console.log(versionType)
    versionType = versionType.toLowerCase()

    let spinner = ora('Loading ' + versionType + ' versions...')

    spinner.start()

    axios.get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
        .then((resp) => {
            spinner.stop()
            let manifest = resp.data
            let unfilteredVersions = manifest['versions']

            knownVersions = unfilteredVersions

            let unformattedVersions = unfilteredVersions.filter(version => {
                if (version['type'] == versionType) {
                    return true;
                } else {
                    return false;
                }
            })

            let versions = []

            for (let i = 0; i < unformattedVersions.length; i++) {
                versions.push(unformattedVersions[i].id)
            }

            let choices = [...versions]
            choices[0] = chalk.green(choices[0])

            new AutoComplete({
                name: 'serverVersion',
                message: 'What version would you like to run?',
                limit: 5,
                initial: 0,
                choices: choices,
                footer: chalk.blue('Arrow keys to view more options')
            }).run().then((answer) => {

                let version = unformattedVersions.find(obj => {
                    return obj.id === stripAnsi(answer)
                })

                if (version.id !== versions[0]) {
                    console.log(chalk.red("You are using an old, unsupported version. Please run startcraft with the '--is-dinosaur' flag to enable the usage of unsupported versions."))
                    return
                }

                let spinner = ora('Downloading ' + version + ' server...')
                spinner.start()

                axios.get(version.url)
                    .then((resp) => {
                        let manifest = resp.data

                        if (manifest.downloads === undefined || manifest.downloads.server === undefined) {
                            console.log("Unfortunately, there is no server associated with this version.")
                            return
                        }

                        let serverUrl = manifest.downloads.server.url
                        
                        downloadImage(serverUrl, path.resolve(process.cwd(), "server.jar"))
                        spinner.stop()

                        console.log("'server.jar' has been saved to this directory.")

                        script.promptCreateStartScript("server.jar")
                    })
            })
        })
}

export { promptServerVersionType }