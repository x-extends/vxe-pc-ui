import XEUtils from 'xe-utils'

export class TimelineItemInfo {
  id = XEUtils.uniqueId('timeline_item_')
  constructor($xeTimeline: any, _vm: any) {
    Object.assign(this, {
      title: _vm.title,
      content: _vm.content
    })
  }

  update(name: any, value: any) {
    this[name] = value
  }

  [key: string]: any
}
