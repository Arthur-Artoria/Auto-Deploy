import { ipcRenderer } from 'electron';
import { IPC_MESSAGES } from '../constants/common';

export const ipcPromise = <T = void>(
  message: IPC_MESSAGES,
  ...args: unknown[]
) =>
  new Promise<T>((resolve) => {
    ipcRenderer.send(message, ...args);
    ipcRenderer.once(message, (_event, data) => resolve(data));
  });
