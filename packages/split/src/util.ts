import XEUtils from 'xe-utils'

import type { VxeSplitConstructor, VxeSplitPrivateMethods, VxeSplitDefines } from '../../../types'

export function assembleSplitItem ($xeSplit: VxeSplitConstructor & VxeSplitPrivateMethods, elem: HTMLElement, chunkConfig: VxeSplitDefines.ChunkConfig) {
  const staticItems = $xeSplit.reactData.staticItems
  const parentElem = elem.parentNode
  if (parentElem) {
    staticItems.splice(XEUtils.arrayIndexOf(parentElem.children, elem), 0, chunkConfig)
    $xeSplit.reactData.staticItems = staticItems.slice(0)
  }
}

export function destroySplitItem ($xeSplit: VxeSplitConstructor & VxeSplitPrivateMethods, chunkConfig: VxeSplitDefines.ChunkConfig) {
  const staticItems = $xeSplit.reactData.staticItems
  const index = XEUtils.findIndexOf(staticItems, item => item.id === chunkConfig.id)
  if (index > -1) {
    staticItems.splice(index, 1)
  }
  $xeSplit.reactData.staticItems = staticItems.slice(0)
}
