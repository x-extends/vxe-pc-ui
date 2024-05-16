/* eslint-disable no-use-before-define */

export namespace VxeGlobalCommandsHandles {
  export interface CommandsOptions<D = any> {
    commandMethod?: (params: CommandMethodParams<D>, ...args: any[]) => void
  }
  export interface CommandMethodParams<D = any> {
    $grid: any
    $table: any
    code: string
    button?: any
  }
}

/**
 * 全局格式化
 */
export interface VxeGlobalCommands {
  mixin(opts: {
    [name: string]: VxeGlobalCommandsHandles.CommandsOptions<any> | ((params: VxeGlobalCommandsHandles.CommandMethodParams<any>, ...args: any[]) => void)
  }): VxeGlobalCommands
  has(name: string): boolean
  get(name: string): VxeGlobalCommandsHandles.CommandsOptions<any>
  add(name: string, options: VxeGlobalCommandsHandles.CommandsOptions<any> | ((params: VxeGlobalCommandsHandles.CommandMethodParams<any>, ...args: any[]) => void)): VxeGlobalCommands
  delete(name: string): void
  forEach(callback: (options: VxeGlobalCommandsHandles.CommandsOptions<any>, name: string) => void): void
}
