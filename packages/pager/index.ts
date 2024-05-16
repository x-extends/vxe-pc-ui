import { App } from 'vue'
import VxePagerComponent from './src/pager'
import { dynamicApp } from '../dynamics'

export const VxePager = Object.assign(VxePagerComponent, {
  install: function (app: App) {
    app.component(VxePagerComponent.name as string, VxePagerComponent)
  }
})

dynamicApp.component(VxePagerComponent.name as string, VxePagerComponent)

export const Pager = VxePager
export default VxePager
