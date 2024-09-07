import XEUtils from 'xe-utils'
import { OptionInfo } from './option-info'

import type { VxeOptionInstance, VxeOptgroupInstance, VxeSelectConstructor } from '../../../types'

export interface XEOptionProvide {
  optionConfig: OptionInfo;
}

export function isOption (option: any) {
  return option instanceof OptionInfo
}

export function createOption ($xeSelect: VxeSelectConstructor, _vm: any) {
  return isOption(_vm) ? _vm : new OptionInfo($xeSelect, _vm)
}

export function watchOption (_vm: VxeOptionInstance | VxeOptgroupInstance, option: OptionInfo) {
  ['value', 'label', 'visible', 'className', 'disabled'].forEach(name => {
    _vm.$watch(name, (val) => {
      option.update(name, val)
    })
  })
}

export function assembleOption ($xeSelect: VxeSelectConstructor, el: HTMLDivElement, option: OptionInfo, xeOptgroup?: XEOptionProvide | null) {
  const { reactData } = $xeSelect
  const { staticOptions } = reactData
  const parentElem = el.parentNode
  const parentOption = xeOptgroup ? xeOptgroup.optionConfig : null
  const parentCols = parentOption ? parentOption.options : staticOptions
  if (parentElem && parentCols) {
    parentCols.splice(XEUtils.arrayIndexOf(parentElem.children, el), 0, option)
    reactData.staticOptions = staticOptions.slice(0)
  }
}

export function destroyOption ($xeSelect: VxeSelectConstructor, option: OptionInfo) {
  const { reactData } = $xeSelect
  const { staticOptions } = reactData
  const matchObj = XEUtils.findTree(staticOptions, (item) => item.id === option.id, { children: 'options' })
  if (matchObj) {
    matchObj.items.splice(matchObj.index, 1)
  }
  reactData.staticOptions = staticOptions.slice(0)
}
