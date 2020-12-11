#!/usr/bin/env node

import {printWelcomeScreen} from './util/text.mjs'
import {promptServerType} from './questions/standard.mjs'

printWelcomeScreen()

setTimeout(() => {
    promptServerType()  
}, 100)