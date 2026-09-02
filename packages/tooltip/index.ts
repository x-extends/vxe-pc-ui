import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeTooltipComponent from './src/tooltip'
import { dynamicApp, dynamicStore, checkDynamic } from '../dynamics'

import type{ VxeTooltipProps, VxeTooltipInstance, TooltipPrivateMethods } from '../../types'

export const VxeTooltip = Object.assign({}, VxeTooltipComponent, {
  install (app: VueConstructor) {
    app.component(VxeTooltipComponent.name as string, VxeTooltipComponent)
  }
})

export const TooltipController = {
  open (target: EventTarget | HTMLElement | null, options?: VxeTooltipProps) {
    const opts: VxeTooltipProps = Object.assign({}, options, {
      key: 'tip',
      value: true,
      trigger: 'hover',
      selector: target,
      appendTo: null
    })
    const $tooltip = dynamicStore.$refs.refTooltip as VxeTooltipInstance & TooltipPrivateMethods
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
    if (!globalTooltip || !globalTooltip.value) {
      return Promise.resolve()
    }
    const $tooltip = dynamicStore.$refs.refTooltip as VxeTooltipInstance & TooltipPrivateMethods
    if ($tooltip) {
      $tooltip.handleCloseEvent()
    } else {
      if (globalTooltip) {
        globalTooltip.value = false
      }
    }
    return Promise.resolve()
  },
  destroy () {
    const { globalTooltip } = dynamicStore
    if (!globalTooltip || !globalTooltip.value) {
      return Promise.resolve()
    }
    const $tooltip = dynamicStore.$refs.refTooltip as VxeTooltipInstance & TooltipPrivateMethods
    if ($tooltip) {
      return $tooltip.close().then(() => {
        dynamicStore.globalTooltip = null
        dynamicStore.isTipInit = false
      })
    }
    dynamicStore.globalTooltip = null
    dynamicStore.isTipInit = false
    return Promise.resolve()
  }
}

dynamicApp.use(VxeTooltip)
VxeUI.component(VxeTooltipComponent)
VxeUI.tooltip = TooltipController

export const Tooltip = VxeTooltip
export default VxeTooltip
