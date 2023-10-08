import type { BunPlugin } from 'bun';
import { copyDirectory, copyFile } from './copy';
export { copyDirectory, copyFile }

export type CopyPlugin = (from: string, to: string) => BunPlugin

export const copyFilePlugin: CopyPlugin = (from, to) => ({
  name: 'copyFilePlugin',
  async setup(): Promise<void> {
    return copyFile(from, to)
  },
} as const)

export const copyDirectoryPlugin: CopyPlugin = (from, to) => ({
  name: 'copyDirectoryPlugin',
  async setup(): Promise<void> {
    return copyDirectory(from, to)
  }
} as const)

export const copyPlugin: CopyPlugin = (from, to) =>
  from.endsWith('/')
   ? copyDirectoryPlugin(from, to)
   : copyFilePlugin(from, to)

export default copyPlugin
