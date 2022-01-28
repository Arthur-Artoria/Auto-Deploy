import { ipcMain } from 'electron';
import jsonFile from 'jsonfile';
import { IPC_MESSAGES } from '../../preload/src/constants/common';
import { PROJECTS_CONFIG_PATH } from './constants';

export const startListen = () => {
  ipcMain.on(
    IPC_MESSAGES.SAVE_PROJECTS_CONFIG,
    async (event, projects: Project[]) => {
      await jsonFile.writeFile(PROJECTS_CONFIG_PATH, projects);
      event.sender.send(IPC_MESSAGES.SAVE_PROJECTS_CONFIG);
    }
  );

  ipcMain.on(IPC_MESSAGES.GET_PROJECTS, async (event) => {
    console.log(PROJECTS_CONFIG_PATH);
    const projects = await jsonFile.readFile(PROJECTS_CONFIG_PATH);

    event.sender.send(IPC_MESSAGES.GET_PROJECTS, projects);
  });
};
