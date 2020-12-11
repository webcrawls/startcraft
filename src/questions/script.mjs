import enquirer from 'enquirer'

const { Confirm } = enquirer

const promptCreateStartScript = (jarName) => {
    new Confirm({
        name: 'createStartScript',
        message: 'Would you like to create a start script?',
        initial: true
    }).run().then(answer => {
        if (!answer) {
            // bruh
        }


    })
}

export { promptCreateStartScript }