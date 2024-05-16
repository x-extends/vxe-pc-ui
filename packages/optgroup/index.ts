import { App } from 'vue'
import VxeOptgroupComponent from '../select/src/optgroup'
import { dynamicApp } from '../dynamics'

export const VxeOptgroup = Object.assign(VxeOptgroupComponent, {
  install: function (app: App) {
    app.component(VxeOptgroupComponent.name as string, VxeOptgroupComponent)
  }
})

dynamicApp.component(VxeOptgroupComponent.name as string, VxeOptgroupComponent)

export const Optgroup = VxeOptgroup
export default VxeOptgroup
