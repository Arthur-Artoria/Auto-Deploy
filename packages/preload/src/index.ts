import type { BinaryLike } from 'crypto';
import { createHash } from 'crypto';
import { contextBridge, ipcRenderer } from 'electron';

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */

/**
 * After analyzing the `exposeInMainWorld` calls,
 * `packages/preload/exposedInMainWorld.d.ts` file will be generated.
 * It contains all interfaces.
 * `packages/preload/exposedInMainWorld.d.ts` file is required for TS is `renderer`
 *
 * @see https://github.com/cawa-93/dts-for-context-bridge
 */

/**
 * Expose Environment versions.
 * @example
 * console.log( window.versions )
 */
contextBridge.exposeInMainWorld('versions', process.versions);

export const nodeCrypto = {
  sha256sum(data: BinaryLike) {
    console.log(data);
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  },

  openFileExplorer() {
    return new Promise((resolve) => {
      ipcRenderer.send('OPEN_FILE_EXPLORER');
      ipcRenderer.once('OPEN_FILE_EXPLORER', (event, data) => {
        console.log(event);
        resolve(data);
      });
    });
  }
};

/**
 * Safe expose node.js API
 * @example
 * window.nodeCrypto('data')
 */
contextBridge.exposeInMainWorld('nodeCrypto', nodeCrypto);
