import XEUtils from 'xe-utils'

import type { VxeSplitConstructor, VxeSplitPrivateMethods, VxeSplitDefines } from '../../../types'

export function assembleSplitItem ($xeSplit: VxeSplitConstructor & VxeSplitPrivateMethods, elem: HTMLElement, itemConfig: VxeSplitDefines.ItemConfig) {
  const staticItems = $xeSplit.reactData.staticItems
  const parentElem = elem.parentNode
  if (parentElem) {
    staticItems.splice(XEUtils.arrayIndexOf(parentElem.children, elem), 0, itemConfig)
    $xeSplit.reactData.staticItems = staticItems.slice(0)
  }
}

export function destroySplitItem ($xeSplit: VxeSplitConstructor & VxeSplitPrivateMethods, itemConfig: VxeSplitDefines.ItemConfig) {
  const staticItems = $xeSplit.reactData.staticItems
  const index = XEUtils.findIndexOf(staticItems, item => item.id === itemConfig.id)
  if (index > -1) {
    staticItems.splice(index, 1)
  }
  $xeSplit.reactData.staticItems = staticItems.slice(0)
}
