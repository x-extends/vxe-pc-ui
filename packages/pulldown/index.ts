import { App } from 'vue'
import VxePulldownComponent from './src/pulldown'
import { dynamicApp } from '../dynamics'

export const VxePulldown = Object.assign(VxePulldownComponent, {
  install: function (app: App) {
    app.component(VxePulldownComponent.name as string, VxePulldownComponent)
  }
})

dynamicApp.component(VxePulldownComponent.name as string, VxePulldownComponent)

export const Pulldown = VxePulldown
export default VxePulldown
