import XEUtils from 'xe-utils'
import { TimelineItemInfo } from './timeline-info'

import type { VxeTimelineConstructor, VxeTimelineItemConstructor } from '../../../types'

export function isTimelineItem(item: any) {
  return item instanceof TimelineItemInfo
}

export function createTimelineItem($xeTimeline: VxeTimelineConstructor, _vm: any) {
  return isTimelineItem(_vm) ? _vm : new TimelineItemInfo($xeTimeline, _vm)
}

export function watchTimelineItem(_vm: VxeTimelineItemConstructor, itemInfo: TimelineItemInfo) {
  const optionPropKeys = ['title', 'content']
  optionPropKeys.forEach((name) => {
    _vm.$watch(name, (val) => {
      itemInfo.update(name, val)
    })
  })
}

export function assembleTimelineItem($xeTimeline: VxeTimelineConstructor, el: HTMLDivElement, itemInfo: TimelineItemInfo) {
  const reactData = $xeTimeline.reactData
  const { staticItems } = reactData
  const parentElem = el.parentNode
  if (parentElem && staticItems) {
    staticItems.splice(XEUtils.arrayIndexOf(parentElem.children, el), 0, itemInfo)
    reactData.staticItems = staticItems.slice(0)
  }
}

export function destroyTimelineItem($xeTimeline: VxeTimelineConstructor, itemInfo: TimelineItemInfo) {
  const { reactData } = $xeTimeline
  const { staticItems } = reactData
  const index = XEUtils.findIndexOf(staticItems, (item: any) => item.id === itemInfo.id)
  if (index > -1) {
    staticItems.splice(index, 1)
  }
  reactData.staticItems = staticItems.slice(0)
}
