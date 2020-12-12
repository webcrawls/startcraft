import fs from 'fs'

const loadServerData = (dataCallback, noDataCallback) => {
    if (fs.existsSync("startcraft.json")) {
        fs.readFile("startcraft.json", (err, data) => {
            if (err) {
                console.log("Error reading startcraft.json")
                return
            }

            let config = JSON.parse(data)

            dataCallback(config)
        })
        return
    }
    
    noDataCallback()
}

export { loadServerData }