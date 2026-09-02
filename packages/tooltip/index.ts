import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeTooltipComponent from './src/tooltip'
import { dynamicApp, dynamicStore, checkDynamic, refTooltip } from '../dynamics'

import type{ VxeTooltipProps } from '../../types'

export const VxeTooltip = Object.assign({}, VxeTooltipComponent, {
  install (app: App) {
    app.component(VxeTooltipComponent.name as string, VxeTooltipComponent)
  }
})

export const TooltipController = {
  open (target: EventTarget | HTMLElement | null, options?: VxeTooltipProps) {
    const opts: VxeTooltipProps = Object.assign({}, options, {
      key: 'tip',
      modelValue: true,
      trigger: 'hover',
      selector: target,
      appendTo: null
    })
    const $tooltip = refTooltip.value
    dynamicStore.globalTooltip = opts
    if ($tooltip) {
      $tooltip.open(target, opts.content)
    } else {
      dynamicStore.isTipInit = true
      checkDynamic()
    }
    return Promise.resolve()
  },
  close () {
    const { globalTooltip } = dynamicStore
    if (!globalTooltip || !globalTooltip.modelValue) {
      return Promise.resolve()
    }
    const $tooltip = refTooltip.value
    if ($tooltip) {
      $tooltip.handleCloseEvent()
    } else {
      if (globalTooltip) {
        globalTooltip.modelValue = false
      }
    }
    return Promise.resolve()
  },
  destroy () {
    const { globalTooltip } = dynamicStore
    if (!globalTooltip || !globalTooltip.modelValue) {
      return Promise.resolve()
    }
    const $tooltip = refTooltip.value
    if ($tooltip) {
      return $tooltip.close().then(() => {
        dynamicStore.globalTooltip = null
        dynamicStore.isTipInit = false
      })
    }
    if (globalTooltip) {
      globalTooltip.modelValue = false
    }
    return Promise.resolve()
  }
}

dynamicApp.use(VxeTooltip)
VxeUI.component(VxeTooltipComponent)
VxeUI.tooltip = TooltipController

export const Tooltip = VxeTooltip
export default VxeTooltip
