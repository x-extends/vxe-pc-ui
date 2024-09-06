import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeRadioComponent from './src/radio'

export const VxeRadio = Object.assign(VxeRadioComponent, {
  install: function (app: VueConstructor) {
    app.component(VxeRadioComponent.name as string, VxeRadioComponent)
  }
})

dynamicApp.use(VxeRadio)
VxeUI.component(VxeRadioComponent)

export const Radio = VxeRadio
export default VxeRadio
