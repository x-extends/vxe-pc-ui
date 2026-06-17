import XEUtils from 'xe-utils'

import type { VxeNumberInputPropTypes } from '../../../types'

export function handleNumber (val: string | number | null | undefined) {
  return XEUtils.isString(val) ? val.replace(/[^0-9e.-]/g, '') : val
}

export function toFloatValueFixed (inputValue: string | number, type: VxeNumberInputPropTypes.Type, digitsValue: number, roundingMode: VxeNumberInputPropTypes.RoundingMode) {
  if (type !== 'integer' && (!roundingMode || roundingMode === 'default')) {
    // 默认截取忽略
    if (/^-/.test('' + inputValue)) {
      return XEUtils.toFixed(XEUtils.ceil(inputValue, digitsValue), digitsValue)
    }
    return XEUtils.toFixed(XEUtils.floor(inputValue, digitsValue), digitsValue)
  } else {
    if (roundingMode === 'ceil') {
      return XEUtils.toFixed(XEUtils.ceil(inputValue, digitsValue), digitsValue)
    }
    if (roundingMode === 'floor') {
      return XEUtils.toFixed(XEUtils.floor(inputValue, digitsValue), digitsValue)
    }
    return XEUtils.toFixed(XEUtils.round(inputValue, digitsValue), digitsValue)
  }
}
