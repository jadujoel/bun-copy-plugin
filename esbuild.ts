import { copyDirectory, copyFile } from './copy'
export { copyDirectory, copyFile }

export type When = 'start' | 'end'

export interface Build {
  readonly onStart: (callback: () => void) => void
  readonly onEnd: (callback: () => void) => void
}

export interface Plugin {
  readonly name: string
  readonly setup: (build: Build) => void
}

export function copyPlugin (from: string, to: string, when: When = 'end'): Plugin {
  return from.endsWith('/')
    ? copyDirectoryPlugin(from, to, when)
    : copyFilePlugin(from, to, when)
}

export function copyFilePlugin (from: string, to: string, when: When = 'end'): Plugin {
  const copy: () => void = (): void => { void copyFile(from, to) }
  return {
    name: 'copyFile',
    setup: (build: Build): void => {
      if (when === 'start') {
        build.onStart(copy)
      } else {
        build.onEnd(copy)
      }
    }
  } as const
}

export function copyDirectoryPlugin (from: string, to: string, when: 'start' | 'end' = 'end'): Plugin {
  const copy: () => void = (): void => { void copyDirectory(from, to) }
  return {
    name: 'copyDirectory',
    setup: (build: Build) => {
      if (when === 'start') {
        build.onStart(copy)
      } else {
        build.onEnd(copy)
      }
    }
  } as const
}

export default copyPlugin
