import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeFormDesignComponent from './src/form-design'
import { dynamicApp } from '../dynamics'
import './render'

export const VxeFormDesign = Object.assign({}, VxeFormDesignComponent, {
  install (app: App) {
    app.component(VxeFormDesignComponent.name as string, VxeFormDesignComponent)
  }
})

dynamicApp.component(VxeFormDesignComponent.name as string, VxeFormDesignComponent)
VxeUI.component(VxeFormDesignComponent)

export const FormDesign = VxeFormDesign
export default VxeFormDesign
