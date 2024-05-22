import { VxeFormDefines } from '../components/form'

/* eslint-disable no-use-before-define */

declare module '@vxe-ui/core' {
  export namespace VxeGlobalValidatorsHandles {
    export interface ValidatorsOptions {
      formItemValidatorMethod?: ItemValidatorMethod

      /**
       * 已废弃，请使用 formItemValidatorMethod
       * @deprecated
       */
      itemValidatorMethod?: ItemValidatorMethod
    }

    export type ItemValidatorMethod = (params: ItemValidatorParams, ...args: any[]) => void | Error | Promise<any>
    export interface ItemValidatorParams extends VxeFormDefines.RuleValidatorParams {}
  }
}
