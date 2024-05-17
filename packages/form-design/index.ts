import { App } from 'vue'
import VxeFormDesignComponent from './src/form-design'
import renderMaps from './widget-form/render'
import { dynamicApp } from '../dynamics'
import VxeCore from '../ui/src/core'

const VxeFormDesign = Object.assign({}, VxeFormDesignComponent, {
  install (app: App) {
    app.component(VxeFormDesignComponent.name as string, VxeFormDesignComponent)
  }
})

VxeCore.renderer.mixin(renderMaps)

dynamicApp.component(VxeFormDesignComponent.name as string, VxeFormDesignComponent)

export const FormDesign = VxeFormDesign
export default VxeFormDesign
