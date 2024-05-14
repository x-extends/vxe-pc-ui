import { VxeFormDefines } from '../component/form'

/* eslint-disable no-use-before-define */

export namespace VxeGlobalValidatorsHandles {
  export interface ValidatorsOptions<D = any> {
    itemValidatorMethod?: ItemValidatorMethod
  }

  export type ItemValidatorMethod = (params: ItemValidatorParams, ...args: any[]) => void | Error | Promise<any>
  export interface ItemValidatorParams extends VxeFormDefines.RuleValidatorParams {}
}

/**
 * 全局快捷菜单
 */
export interface VxeGlobalValidators {
  mixin(options: {
    [code: string]: VxeGlobalValidatorsHandles.ValidatorsOptions<any>
  }): VxeGlobalValidators
  has(code: string): boolean
  get(code: string): VxeGlobalValidatorsHandles.ValidatorsOptions<any>
  add(code: string, callback: VxeGlobalValidatorsHandles.ValidatorsOptions<any>): VxeGlobalValidators
  delete(code: string): void
  forEach(callback: (options: VxeGlobalValidatorsHandles.ValidatorsOptions<any>, code: string) => void): void
}
