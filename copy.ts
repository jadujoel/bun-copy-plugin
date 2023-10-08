import type { Dirent } from 'node:fs';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

export type CopyType = (from: string, to: string) => Promise<void>

export const copyFile: CopyType = async (from: string, to: string): Promise<void> => {
  await Bun.write(to, Bun.file(from))
}

export const copyDirectory: CopyType = async (from, to): Promise<void> => {
  await mkdir(to, { recursive: true })
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
