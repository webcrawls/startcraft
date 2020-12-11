import enquirer from 'enquirer'
import ora from 'ora'
import axios from 'axios'
import { downloadImage } from '../util/file.mjs'
import path from 'path'
import chalk from 'chalk'

const { Select, AutoComplete } = enquirer

let knownVersions = [];
let latestVersion  = null;

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
    versionType = versionType.toLowerCase()

    let spinner = ora('Loading ' + versionType + ' versions...')

    spinner.start()

    axios.get("https://launchermeta.mojang.com/mc/game/version_manifest.json")
        .then((resp) => {
            spinner.stop()
            let manifest = resp.data
            let unfilteredVersions = manifest['versions']

            knownVersions = unfilteredVersions
            latestVersion = unfilteredVersions[0]

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

            new AutoComplete({
                name: 'serverVersion',
                message: 'What version would you like to run?',
                limit: 5,
                initial: 0,              
                choices: versions,
                footer: chalk.blue('Arrow keys to view more options')
            }).run().then((answer) => {
                let version = knownVersions.find(obj => {
                    return obj.id === answer
                })

                let majorRev = parseInt(version.id.split(".")[0])
                let latestMajorRev = parseInt(latestVersion.id.split(".")[0])

                if (latestMajorRev-2 > majorRev) {
                    console.log(chalk.red("You are using an old, unsupported version. Please run startcraft with the '--is-dinosaur' flag to enable the usage of unsupported versions."))
                    return
                }

                console.log(version.url)

                axios.get(version.url)
                    .then((resp) => {
                        let manifest = resp.data
                        
                        if (manifest.downloads === undefined || manifest.downloads.server === undefined) {
                            console.log("Unfortunately, there is no server associated with this version.")
                            return
                        }

                        let serverUrl = manifest.downloads.server.url

                        let spinner = ora('Downloading '+version+' server...')
                        spinner.start()

                        downloadImage(serverUrl, path.resolve(process.cwd(), "server.jar"))
                        spinner.stop()
                    })
            })
        })
}

export { promptServerVersionType }