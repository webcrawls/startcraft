import enquirer from 'enquirer'
import ora from 'ora'
import axios from 'axios'
import { downloadImage } from '../util/file.mjs'
import stripAnsi from 'strip-ansi'
import path from 'path'
import chalk from 'chalk'
import server from '../data/server.mjs'
import * as script from './script.mjs'

const { Select, AutoComplete } = enquirer

const promptServerVersion = () => {
    axios.get("https://papermc.io/api/v2/project/paper")
        .then(resp => {
            console.log(resp.data)
            console.log("POop")
        })
}

export { promptServerVersion }