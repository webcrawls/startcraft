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
    const { scriptName, ram, jarName } = data as Config;

    let serverProcess;

    if (scriptName == null) {
      const start: string = `-Xms${ram} -Xmx${ram} -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Daikars.new.flags=true -Dusing.aikars.flags=https://mcflags.emc.gs -jar ${jarName} nogui`;

      console.log(chalk.yellowBright('No start script found! Starting with the follwing command:'));
      console.log(chalk.whiteBright('java ' + start));

      serverProcess = spawn('java', start.split(' '));
    } else {
      serverProcess = spawn('bash', [`${scriptName}`]);
    }

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
