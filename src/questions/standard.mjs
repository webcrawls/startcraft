import enquirer from 'enquirer'
import * as vanilla from './vanilla.mjs'
import * as paper from './paper.mjs'

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
            vanilla.promptServerVersionType()
        }
    })
}

export { promptServerTypes }