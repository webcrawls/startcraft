#!/usr/bin/env node

import { printWelcomeScreen } from './util/text';
import { promptServerType, promptEmptyDir } from './questions/standard';
import { loadServerData } from './util/discovery';
import chalk from 'chalk';
import { spawn } from 'child_process';
import Config from './type/config';
import fs from 'fs';

printWelcomeScreen();

loadServerData(
  (data) => {
    const { scriptName } = data as Config;

    const serverProcess = spawn('bash', [`${scriptName}`]);

    serverProcess.stdout.pipe(process.stdout);
    serverProcess.stderr.pipe(process.stderr);

    serverProcess.on('exit', () => {
      console.log('The server has stopped.');
    });

    process.stdin.pipe(serverProcess.stdin);

    process.on('exit', () => {
      serverProcess.kill();
    });
  },
  () => {
    fs.readdir('.', (err, files) => {
      console.log(chalk.blueBright('No server was detected in this directory, starting the TUI...'));
      setTimeout(() => {
        if (files.length) {
          promptEmptyDir();
        } else {
          promptServerType();
        }
      }, 100);
    });
  },
);
