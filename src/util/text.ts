import figlet, { Fonts } from 'figlet';
import chalk from 'chalk';

const fonts = [
  'Wet Letter',
  'Varsity',
  'Twisted',
  'Univers',
  'Trek',
  'Thin',
  'Sweet',
  'Sub-Zero',
  'Stronger Than All',
  'Star Wars',
  'Small Poison',
  'Small Keyboard',
  'Small Caps',
  'Slant',
  'S Blood',
  'Roman',
  'Poison',
  'Pagga',
  'Nancyj',
  'Marquee',
  'Larry 3D',
];

export const printWelcomeScreen = (): void => {
  const font = fonts[Math.floor(Math.random() * fonts.length)];

  figlet('startcraft', font as Fonts, (err, data) => {
    if (err) {
      console.log(err.stack);
      return;
    }

    console.log(chalk.green(data));
  });
};
