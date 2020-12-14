#!/usr/bin/env node

import { printWelcomeScreen } from './util/text';
import { promptServerType } from './questions/standard';
import { loadServerData } from './util/discovery';
import chalk from 'chalk';
import { spawn } from 'child_process';
import Config from './type/config';

printWelcomeScreen();

loadServerData(
  (data) => {
    const { scriptName } = data as Config;

    const serverProcess = spawn('bash', [`${scriptName}`]);

    serverProcess.stdout.pipe(process.stdout);
    serverProcess.on('exit', () => {
      console.log('The server has stopped.');
    });

    process.stdin.pipe(serverProcess.stdin);

    process.on('exit', () => {
      serverProcess.kill();
    });
  },
  () => {
    console.log(chalk.blueBright('No server was detected in this directory, starting the TUI...'));
    setTimeout(() => {
      promptServerType();
    }, 100);
  },
);
