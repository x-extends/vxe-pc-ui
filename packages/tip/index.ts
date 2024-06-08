import { App } from 'vue'
import VxeTipComponent from './src/tip'
import { dynamicApp } from '../dynamics'

export const VxeTip = Object.assign({}, VxeTipComponent, {
  install (app: App) {
    app.component(VxeTipComponent.name as string, VxeTipComponent)
    app.component('VxeTipsComponent' as string, VxeTipComponent)
  }
})

dynamicApp.component(VxeTipComponent.name as string, VxeTipComponent)

export const Tips = VxeTip
export const Tip = VxeTip

export default VxeTip
