import { VxeFormDefines } from '../components/form'
import { VxeTableDefines } from '../components/table'

/* eslint-disable no-use-before-define */

declare module '@vxe-ui/core' {
  export namespace VxeGlobalValidatorsHandles {
    export interface ValidatorsOptions {
      formItemValidatorMethod?: ItemValidatorMethod
      cellValidatorMethod?: CellValidatorMethod

      /**
       * 已废弃，请使用 formItemValidatorMethod
       * @deprecated
       */
      itemValidatorMethod?: ItemValidatorMethod
    }

    export type ItemValidatorMethod = (params: ItemValidatorParams, ...args: any[]) => void | Error | Promise<any>
    export interface ItemValidatorParams extends VxeFormDefines.RuleValidatorParams {}

    export type CellValidatorMethod<D = any> = (params: CellValidatorParams<D>, ...args: any[]) => void | Error | Promise<any>
    export interface CellValidatorParams<D = any> extends VxeTableDefines.RuleValidatorParams<D> {}
  }
}
