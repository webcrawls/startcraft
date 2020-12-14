import axios from 'axios';

export const promptServerVersion = (): void => {
  axios.get('https://papermc.io/api/v2/project/paper').then((resp) => {
    console.log(resp.data);
    console.log('POop');
  });
};
