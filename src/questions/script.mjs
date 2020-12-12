import enquirer from 'enquirer'
import fs from 'fs'

const { Confirm, Input } = enquirer

const promptCreateStartScript = (jarName) => {
    new Confirm({
        name: 'createStartScript',
        message: 'Would you like to create a start script?',
        initial: true
    }).run().then(answer => {
        if (!answer) {
            // bruh
        }

        promptServerRam(jarName)

    })
}

const promptServerRam = (jarName) => {
    new Input({
        name: 'serverRam',
        message: 'How much RAM would you like to run the server with? (i.e. 10G, 900M)',
        initial: '10G'
    }).run().then(answer => {
        createServerScript(jarName, answer)
    })
}

const createServerScript = (jarName, serverRam) => {
    let script = `java -Xms${serverRam} -XmX${serverRam} -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Daikars.new.flags=true -Dusing.aikars.flags=https://mcflags.emc.gs -jar ${jarName} nogui`
    fs.writeFile("start.sh", script, (err) => {
        if (err) {
            console.log("Error creating start.sh script.")
        }
    })
}

export { promptCreateStartScript }