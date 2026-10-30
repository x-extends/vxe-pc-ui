import XEUtils from 'xe-utils'
import { StepItemInfo } from './step-info'

import type { VxeStepsConstructor, VxeStepItemConstructor } from '../../../types'

export function isStepItem(item: any) {
  return item instanceof StepItemInfo
}

export function createStepItem($xeSteps: VxeStepsConstructor, _vm: any) {
  return isStepItem(_vm) ? _vm : new StepItemInfo($xeSteps, _vm)
}

export function watchStepItem(_vm: VxeStepItemConstructor, itemInfo: StepItemInfo) {
  const optionPropKeys = ['title', 'content', 'status']
  optionPropKeys.forEach((name) => {
    _vm.$watch(name, (val) => {
      itemInfo.update(name, val)
    })
  })
}

export function assembleStepItem($xeSteps: VxeStepsConstructor, el: HTMLDivElement, itemInfo: StepItemInfo) {
  const reactData = $xeSteps.reactData
  const { staticItems } = reactData
  const parentElem = el.parentNode
  if (parentElem && staticItems) {
    staticItems.splice(XEUtils.arrayIndexOf(parentElem.children, el), 0, itemInfo)
    reactData.staticItems = staticItems.slice(0)
  }
}

export function destroyStepItem($xeSteps: VxeStepsConstructor, itemInfo: StepItemInfo) {
  const { reactData } = $xeSteps
  const { staticItems } = reactData
  const index = XEUtils.findIndexOf(staticItems, (item: any) => item.id === itemInfo.id)
  if (index > -1) {
    staticItems.splice(index, 1)
  }
  reactData.staticItems = staticItems.slice(0)
}
