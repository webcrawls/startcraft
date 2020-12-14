import fs, { PathLike } from 'fs';
import axios from 'axios';

export const downloadFile = async (url: string, path: PathLike): Promise<string> => {
  const writer = fs.createWriteStream(path);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};
