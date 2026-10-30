import XEUtils from 'xe-utils'

export class StepItemInfo {
  id = XEUtils.uniqueId('step_item_')
  constructor($xeSteps: any, _vm: any) {
    Object.assign(this, {
      title: _vm.title,
      content: _vm.content,
      status: _vm.status
    })
  }

  update(name: any, value: any) {
    this[name] = value
  }

  [key: string]: any
}
