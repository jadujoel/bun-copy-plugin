/// <reference path="./node_modules/bun-types/types.d.ts" />
import type { BunPlugin } from 'bun';
import type { Dirent } from 'node:fs';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

export type CopyType = (from: string, to: string) => Promise<void>
export type CopyPlugin = (from: string, to: string) => BunPlugin

export const copyDirectory: CopyType = async (from, to) => {
  const files: readonly Dirent[] = await readdir(from, { withFileTypes: true})
  const promises: readonly Promise<void>[] = files.map(async file => {
    const infile = join(from, file.name)
    const outfile = join(to, file.name)
    if (file.isDirectory()) {
      await mkdir(outfile, { recursive: true })
      await copyDirectory(infile, outfile)
    } else {
      await copyFile(infile, outfile)
    }
  })
  await Promise.all(promises)
}

export const copyFile: CopyType = async (from: string, to: string): Promise<void> => {
  await Bun.write(to, Bun.file(from))
}

export const copyFilePlugin: CopyPlugin = (from, to) => ({
  name: 'copyFilePlugin',
  async setup(): Promise<void> {
    return copyFile(from, to)
  },
} as const)

export const copyDirectoryPlugin: CopyPlugin = (from, to) => ({
  name: 'copyDirectoryPlugin',
  async setup(): Promise<void> {
    await mkdir(to, { recursive: true })
    return copyDirectory(from, to)
  }
} as const)

export const copyPlugin: CopyPlugin = (from, to) =>
  from.endsWith('/')
   ? copyDirectoryPlugin(from, to)
   : copyFilePlugin(from, to)

export default copyPlugin
