#!/usr/bin/env node

import {printWelcomeScreen} from './util/text.mjs'
import {promptServerType} from './questions/standard.mjs'
import {loadServerData} from './util/discovery.mjs'
import chalk from 'chalk'
import { spawn } from 'child_process'

printWelcomeScreen()

loadServerData((data) => {
    let scriptName = data.scriptName

    let serverProcess = spawn('bash', [`${scriptName}`])
    serverProcess.stdout.on('data', data => console.log(data.toString()))
    serverProcess.stderr.on('data', data => console.log(data.toString()))
    serverProcess.on('exit', () => {console.log("The server has stopped.")})
}, () => {
    console.log(chalk.blueBright("No server was detected in this directory, starting the TUI..."))
    setTimeout(() => {
        promptServerType()  
    }, 100)
})