import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeFormDesignComponent from './src/form-design'
import { useWidgetView, useWidgetName, useWidgetPropDataSource } from './src/use'
import { dynamicApp } from '../dynamics'
import './render'

import { FormDesignExport } from '../../types'

export const VxeFormDesign = Object.assign({}, VxeFormDesignComponent, {
  install (app: App) {
    app.component(VxeFormDesignComponent.name as string, VxeFormDesignComponent)
  }
})

const formDesign: FormDesignExport = {
  useWidgetName,
  useWidgetView,
  useWidgetPropDataSource
}

dynamicApp.component(VxeFormDesignComponent.name as string, VxeFormDesignComponent)
VxeUI.component(VxeFormDesignComponent)
VxeUI.formDesign = formDesign

export const FormDesign = VxeFormDesign
export default VxeFormDesign
