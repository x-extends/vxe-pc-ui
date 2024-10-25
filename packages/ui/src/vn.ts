import XEUtils from 'xe-utils'
import { VxeComponentSlotType } from '@vxe-ui/core'

export function getOnName (type: string) {
  return XEUtils.kebabCase(type)
}

export function getModelEvent (name: string) {
  switch (name) {
    case 'VxeInput':
    case 'VxeTextarea':
      return 'modelValue'
    case 'select':
      return 'change'
  }
  return 'input'
}

export function getChangeEvent (name: string) {
  switch (name) {
    case 'input':
    case 'textarea':
    case 'VxeInput':
    case 'VxeTextarea':
    case '$input':// 已废弃
    case '$textarea':// 已废弃
      return 'input'
  }
  return 'change'
}

export function getSlotVNs (vns: VxeComponentSlotType | VxeComponentSlotType[] | undefined) {
  if (XEUtils.isArray(vns)) {
    return vns
  }
  return vns ? [vns] : []
}
