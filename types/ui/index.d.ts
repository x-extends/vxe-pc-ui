import { ModalController } from '../components/modal'
import { DrawerController } from '../components/drawer'
import { VxeUIGlobalConfig } from './global-config'
import { VxeUIGlobalIcon } from './global-icon'

export const modal: ModalController
export const drawer: DrawerController

declare module '@vxe-ui/core' {
  export interface VxeUIExport {
    uiVersion: string
    modal: ModalController
    drawer: DrawerController
  }
  export interface VxeGlobalConfig extends VxeUIGlobalConfig {}

  export interface VxeGlobalIcon extends VxeUIGlobalIcon {}
}

export * from './global-config'
export * from './global-icon'
export * from './renderer'

export * from '@vxe-ui/core'
export default VxeUI
