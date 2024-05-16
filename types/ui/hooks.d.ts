export namespace VxeGlobalHooksHandles {
  export type Name = 'VxeGrid' | 'VxeTable'
  export interface HookOptions {
    setupTable?($table: any): void | { [key: string]: any }
    setupGrid?($grid: any): void | { [key: string]: any }
  }
}

export interface VxeGlobalHooks {
  mixin(options: {
    [type: string]: VxeGlobalHooksHandles.HookOptions
  }): VxeGlobalHooks
  has(type: string): boolean
  get(type: string): VxeGlobalHooksHandles.HookOptions
  add(type: string, options: VxeGlobalHooksHandles.HookOptions): VxeGlobalHooks
  delete(type: string): void
  forEach(callback: (options: VxeGlobalHooksHandles.HookOptions, type: string) => void): void
}
