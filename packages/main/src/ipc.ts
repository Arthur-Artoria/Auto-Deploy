import { dialog, ipcMain, OpenDialogOptions } from 'electron';
import jsonFile from 'jsonfile';
import { IPC_MESSAGES } from '../../preload/src/constants/common';
import { PROJECTS_CONFIG_PATH } from './constants';
import { buildProject } from './deploy/build';

export const startListen = () => {
  ipcMain.on(
    IPC_MESSAGES.OPEN_FILE_EXPLORER,
    async (
      event,
      options: OpenDialogOptions = { properties: ['openDirectory'] }
    ) => {
      const res = await dialog.showOpenDialog(options);

      event.sender.send(IPC_MESSAGES.OPEN_FILE_EXPLORER, res);
    }
  );

  ipcMain.on(
    IPC_MESSAGES.SAVE_PROJECTS_CONFIG,
    async (event, projects: Project[]) => {
      await jsonFile.writeFile(PROJECTS_CONFIG_PATH, projects);
      event.sender.send(IPC_MESSAGES.SAVE_PROJECTS_CONFIG);
    }
  );

  ipcMain.on(IPC_MESSAGES.GET_PROJECTS, async (event) => {
    try {
      const projects = await jsonFile.readFile(PROJECTS_CONFIG_PATH);

      event.sender.send(IPC_MESSAGES.GET_PROJECTS, projects);
    } catch (error) {
      return Promise.reject(null);
    }
  });

  ipcMain.on(IPC_MESSAGES.BUILD_PROJECT, (event, projectID: Project['id']) => {
    buildProject(projectID)
      .then(() => event.sender.send(IPC_MESSAGES.BUILD_PROJECT, true))
      .catch((error) => event.sender.send(IPC_MESSAGES.BUILD_PROJECT, error));
  });
};
