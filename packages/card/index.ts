import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeCardComponent from './src/card'
import { dynamicApp } from '../dynamics'

export const VxeCard = Object.assign({}, VxeCardComponent, {
  install (app: App) {
    app.component(VxeCardComponent.name as string, VxeCardComponent)
    VxeUI.component(VxeCardComponent)
  }
})

dynamicApp.component(VxeCardComponent.name as string, VxeCardComponent)

export const Card = VxeCard
export default VxeCard
