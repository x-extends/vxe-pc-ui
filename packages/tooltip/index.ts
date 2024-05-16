import { App } from 'vue'
import VxeTooltipComponent from './src/tooltip'
import { dynamicApp } from '../dynamics'

const VxeTooltip = Object.assign({}, VxeTooltipComponent, {
  install (app: App) {
    app.component(VxeTooltipComponent.name as string, VxeTooltipComponent)
  }
})

dynamicApp.component(VxeTooltipComponent.name as string, VxeTooltipComponent)

export const Tooltip = VxeTooltip
export default VxeTooltip
