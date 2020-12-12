import figlet from 'figlet'
import chalk from 'chalk'

let fonts = ['Wet Letter', 'Varsity', 'Twisted', 'Univers', 'Trek', 'Thin', 'Sweet', 'Sub-Zero', 'Stronger Than All', 'Star Wars', 'Small Poison', 'Small Keyboard', 'Small Caps', 'Slant', 'S Blood', 'Roman', 'Poison', 'Pagga', 'Nancyj', 'Marquee', 'Larry 3D']

let printWelcomeScreen = () => {
    let font = fonts[Math.floor(Math.random() * fonts.length)]

    figlet('startcraft', {font: font}, (err, data) => {
        if (err) {
            console.log(err.stack)
            return
        }

        console.log(chalk.green(data))
        console.log(chalk.blueBright("No server was detected in this directory, starting the TUI..."))
    })
}

export {printWelcomeScreen}