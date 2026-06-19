import { VxeUI } from '@vxe-ui/core'

const { log } = VxeUI

const uiVersion = `ui v${process.env.VUE_APP_VXE_VERSION}`

export function createComponentLog (name: string) {
  const tableVersion = VxeUI.tableVersion ? `table v${VxeUI.tableVersion}` : ''
  const ganttVersion = VxeUI.ganttVersion ? `gantt v${VxeUI.ganttVersion}` : ''
  const designVersion = VxeUI.designVersion ? `design v${VxeUI.designVersion}` : ''
  return {
    warnLog: log.create('warn', uiVersion + tableVersion + ganttVersion + designVersion + '] [' + name),
    errLog: log.create('error', uiVersion + tableVersion + ganttVersion + designVersion + '] [' + name)
  }
}

export const warnLog = log.create('warn', uiVersion)
export const errLog = log.create('error', uiVersion)
