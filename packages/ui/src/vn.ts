import XEUtils from 'xe-utils'

import { VxeComponentSlot } from '../../../types'

export function getOnName (type: string) {
  return 'on' + type.substring(0, 1).toLocaleUpperCase() + type.substring(1)
}

export function getSlotVNs (vns: VxeComponentSlot | VxeComponentSlot[]) {
  if (XEUtils.isArray(vns)) {
    return vns
  }
  return [vns]
}
