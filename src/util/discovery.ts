import fs from 'fs';

export const loadServerData = (dataCallback: (data: unknown) => void, noDataCallback: () => void): void => {
  if (!fs.existsSync('startcraft.json')) {
    noDataCallback();
    return;
  }

  fs.readFile('startcraft.json', (err, data) => {
    if (err) {
      console.log('Error reading startcraft.json');
      return;
    }

    const config = JSON.parse(data.toString());

    dataCallback(config);
  });
};
