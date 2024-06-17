import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeRadioComponent from './src/radio'
import { dynamicApp } from '../dynamics'

export const VxeRadio = Object.assign(VxeRadioComponent, {
  install: function (app: App) {
    app.component(VxeRadioComponent.name as string, VxeRadioComponent)
    VxeUI.component(VxeRadioComponent)
  }
})

dynamicApp.component(VxeRadioComponent.name as string, VxeRadioComponent)

export const Radio = VxeRadio
export default VxeRadio
