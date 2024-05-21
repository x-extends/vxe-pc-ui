import { App } from 'vue'
import { ModalController } from '../components/modal'
import { DrawerController } from '../components/drawer'

export const uiVersion: string
export const modal: ModalController
export const drawer: DrawerController
export const dynamicApp: App<Element>

declare module '@vxe-ui/core' {
  export interface VxeUIExport {
    uiVersion: string
    modal: ModalController
    drawer: DrawerController
    dynamicApp: App<Element>
  }
}

export * from './global-config'
export * from './global-icon'
export * from './renderer'

export * from '@vxe-ui/core'
export default VxeUI
