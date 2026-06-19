import { log } from '@vxe-ui/core'

const version = `ui v${process.env.VUE_APP_VXE_VERSION}`

export function createComponentLog (name: string) {
  return {
    warnLog: log.create('warn', `${version} ${name}`),
    errLog: log.create('error', `${version} ${name}`)
  }
}

export const warnLog = log.create('warn', version)
export const errLog = log.create('error', version)
