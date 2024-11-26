import axios from 'axios';
import chalk from 'chalk';
import AutoComplete from 'enquirer/lib/prompts/autocomplete';
import { downloadFile } from '../util/file';
import { promptCreateStartScript } from './script';
import ora from 'ora';
import server from '../type/server';

export const promptServerVersion = (): void => {
  axios.get('https://papermc.io/api/v2/projects/paper').then((resp) => {
    const versions = resp.data.versions;

    versions.reverse();

    new AutoComplete({
      name: 'serverVersion',
      message: 'What version would you like to run?',
      limit: 5,
      initial: 0,
      choices: versions,
      footer: chalk.blue('Arrow keys to view more options'),
    })
      .run()
      .then((answer: string) => {
        console.log(
          chalk.red('Note: ') +
            chalk.white(
              'this will download the latest build of ' +
                answer +
                '. ' +
                chalk.white.bold('Ensure that this build is safe to use by checking the Paper GitHub/Discord for potential issues.'),
            ),
        );
        const spinner = ora().start('Downloading ' + answer + ' server...');

        axios.get('https://papermc.io/api/v2/projects/paper/versions/' + answer).then((resp) => {
          const builds = resp.data.builds;

          const latest = builds[builds.length - 1];

          axios.get('https://papermc.io/api/v2/projects/paper/versions/' + answer + '/builds/' + latest).then((resp) => {
            const file = resp.data.downloads.application.name;

            downloadFile(
              'https://papermc.io/api/v2/projects/paper/versions/' + answer + '/builds/' + latest + '/downloads/' + file,
              'server.jar',
            ).then(() => {
              server.jarName = 'server.jar';
              spinner.stop();
              promptCreateStartScript();
            });
          });
        });
      });
  });
};
