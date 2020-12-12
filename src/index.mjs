#!/usr/bin/env node

import {printWelcomeScreen} from './util/text.mjs'
import {promptServerType} from './questions/standard.mjs'
import {loadServerData} from './util/discovery.mjs'

printWelcomeScreen()

loadServerData((data) => {
    console.log(data)
}, () => {
    console.log(chalk.blueBright("No server was detected in this directory, starting the TUI..."))
    setTimeout(() => {
        promptServerType()  
    }, 100)
})