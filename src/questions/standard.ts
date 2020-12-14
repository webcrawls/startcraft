import Select from 'enquirer/lib/prompts/select';
import Confirm from 'enquirer/lib/prompts/confirm';
import * as vanilla from './vanilla';
import * as paper from './paper';
import chalk from 'chalk';
import server from '../type/server';
import fs from 'fs';

export const promptServerType = (): void => {
  new Select({
    name: 'serverType',
    message: 'What server type would you like to create?',
    choices: [{ name: 'Paper', hint: 'RECOMMENDED' }, { name: 'Vanilla' }],
  })
    .run()
    .then((answer: string) => {
      if (answer === 'Vanilla') {
        server.serverType = 'vanilla';
        vanilla.promptServerVersionType();
      } else if (answer === 'Paper') {
        server.serverType = 'paper';
        paper.promptServerVersion();
      }
    });
};

export const promptEmptyDir = (): void => {
  new Confirm({
    name: 'emptyProceed',
    message: 'This directory is not empty. Would you like to proceed?',
    initial: false,
  })
    .run()
    .then((answer: boolean) => {
      if (answer === true) {
        promptServerType();
      } else {
        process.exit(0);
      }
    });
};

export const promptSaveSettings = (): void => {
  new Confirm({
    name: 'saveSettings',
    message:
      'Would you like to save these settings? This will tell startcraft more about your server, for features such as ' +
      chalk.cyanBright('auto-updating') +
      chalk.white('.'),
    initial: true,
  })
    .run()
    .then((answer: string) => {
      if (answer) {
        server.createdDate = new Date();
        const data = JSON.stringify(server, null, 2);
        fs.writeFile('startcraft.json', data, (err) => {
          if (err) {
            console.log(chalk.red('Error saving startcraft.json.'));
            return;
          }

          promptAgreeToEula((answer) => {
            if (answer) {
              fs.writeFileSync('eula.txt', 'eula=true');
            }
          });
        });
      }
    });
};

export const promptAgreeToEula = (acceptCallback: (answer: string) => void): void => {
  new Confirm({
    name: 'acceptEula',
    message:
      'Would you like to accept the Mojang EULA? Read more: ' + chalk.cyanBright('https://account.mojang.com/documents/minecraft_eula'),
    initial: true,
  })
    .run()
    .then((answer: string) => {
      acceptCallback(answer);
    });
};
