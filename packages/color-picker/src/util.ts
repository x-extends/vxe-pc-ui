import XEUtils from 'xe-utils'

import type { VxeColorPickerDefines } from '../../../types'

const hexAlphaKeyMaps: Record<string, number> = {}
const hexAlphaNumMaps: Record<string, string> = {}
'FF,FC,FA,F7,F5,F2,F0,ED,EB,E8,E6,E3,E0,DE,DB,D9,D6,D4,D1,CF,CC,C9,C7,C4,C2,BF,BD,BA,B8,B5,B3,B0,AD,AB,A8,A6,A3,A1,9E,9C,99,96,94,91,8F,8C,8A,87,85,82,80,7D,7A,78,75,73,70,6E,6B,69,66,63,61,5E,5C,59,57,54,52,4F,4D,4A,47,45,42,40,3D,3B,38,36,33,30,2E,2B,29,26,24,21,1F,1C,1A,17,14,12,0F,0D,0A,08,05,03,00'.split(',').forEach((key, i) => {
  const num = (100 - i) / 100
  hexAlphaKeyMaps[key] = num
  hexAlphaNumMaps[num] = key
})

const rgbRE = /^rgb(a?)\((\d{1,3})[,\s]+(\d{1,3})[,\s]+(\d{1,3})([,//\s]+([0-9.]{1,4})(%?))?\)$/
export function hasRgb (value: string) {
  return !!(value && rgbRE.test(value))
}

const hexRE = /^(#?)([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?$/
export function hasHex (value: string) {
  return !!(value && hexRE.test(value))
}

export function toRgb (value: string) {
  if (value) {
    if (hexRE.test(value)) {
      return hexToRgb(value)
    }
    return parseRgbVal(value)
  }
  return null
}

export function toRgbString (value: string) {
  const rgbRest = toRgb(value)
  if (rgbRest) {
    return rgbRest.label
  }
  return ''
}

export function toHex (value: string) {
  if (value) {
    if (rgbRE.test(value)) {
      return rgbValToHex(value)
    }
    return parseHexVal(value)
  }
  return null
}

export function toHexString (value: string) {
  const hexRest = toHex(value)
  if (hexRest) {
    return hexRest.label
  }
  return ''
}

export function toHsl (value: string) {
  const rgbRest = toRgb(value)
  if (rgbRest) {
    const hslRest = rgbToHsl(rgbRest)
    if (hslRest) {
      const rest: VxeColorPickerDefines.HslObj = { value, type: 'hsl', ...hslRest }
      return rest
    }
  }
  return null
}

export function toHsv (value: string) {
  const rgbRest = toRgb(value)
  if (rgbRest) {
    const hslRest = rgbToHsv(rgbRest)
    if (hslRest) {
      const rest: VxeColorPickerDefines.HsvObj = { value, type: 'hsv', ...hslRest }
      return rest
    }
  }
  return null
}

export function parseColor<T extends keyof VxeColorPickerDefines.ParseResultMap> (val: string, format?: T): VxeColorPickerDefines.ParseResultMap[T] | null {
  if (val) {
    if (format === 'hex') {
      return toHex(val) as any
    }
    if (format === 'hsl') {
      return toHsl(val) as any
    }
    if (format === 'hsv') {
      return toHsv(val) as any
    }
    return toRgb(val) as any
  }
  return null
}

function handleNumClamp (val: number) {
  return Math.min(1, Math.max(0, val))
}

function createLightenDarken (isAdd: number) {
  return function (val: string, ratio?: number) {
    const colorRest = parseColor(val)
    const hslRest = toHsl(val)
    if (colorRest && hslRest) {
      ratio = ratio === 0 ? 0 : ratio || 10
      hslRest.l += (isAdd ? ratio : -ratio) / 100
      hslRest.l = handleNumClamp(hslRest.l)
      const rgbRest = hslToRgb(hslRest)
      if (rgbRest) {
        if (colorRest?.type === 'hex') {
          return rgbToHexVal(rgbRest.r, rgbRest.g, rgbRest.b, hslRest.a)
        }
        return toValRgb(rgbRest.r, rgbRest.g, rgbRest.b, hslRest.a)
      }
    }
    return val
  }
}

export const lighten = createLightenDarken(1)
export const darken = createLightenDarken(0)

function parseHexVal (value: string) {
  if (value) {
    const hexRest = value.match(hexRE)
    if (hexRest) {
      const rest:VxeColorPickerDefines.HexObj = {
        value,
        label: value,
        type: 'hex',
        hex: value,
        hexV: hexRest[2],
        hexA: hexRest[3] || '',
        a: (hexRest[3] ? hexAlphaKeyMaps[hexRest[3].toUpperCase()] : 1) || 1
      }
      return rest
    }
  }
  return null
}

function parseRgbVal (value: string) {
  if (value) {
    const rgbRest = value.match(rgbRE)
    if (rgbRest) {
      const rest: VxeColorPickerDefines.RgbObj = {
        value,
        label: value,
        type: (rgbRest[6] ? 'rgba' : 'rgb') as 'rgba' | 'rgb',
        r: parseInt(rgbRest[2]),
        g: parseInt(rgbRest[3]),
        b: parseInt(rgbRest[4]),
        a: rgbRest[7] ? parseInt(rgbRest[6]) / 100 : (rgbRest[6] ? parseFloat(rgbRest[6]) : 1)
      }
      return rest
    }
  }
  return null
}

export function parseValColor (value: string) {
  const rest = {
    value: '',
    type: '',
    hex: '',
    hexV: '',
    hexA: '',
    r: 0,
    g: 0,
    b: 0,
    a: 1
  }
  if (value) {
    if (hexRE.test(value)) {
      return Object.assign(rest, parseHexVal(value))
    } else if (rgbRE.test(value)) {
      return Object.assign(rest, parseRgbVal(value))
    }
  }
  return rest
}

export function updateColorAlpha (value: string, alpha: number = 1) {
  const colorRest = parseValColor(value)
  if (colorRest) {
    const { type } = colorRest
    if (type === 'hex') {
      return `#${colorRest.hexV}${alpha === 1 ? '' : (hexAlphaNumMaps[alpha] || '')}`
    }
    return toValRgb(colorRest.r, colorRest.g, colorRest.b, alpha)
  }
  return ''
}

export function toValRgb (r: number, g: number, b: number, a?: number | null) {
  if (XEUtils.eqNull(a) || a === 1) {
    return `rgb(${r},${g},${b})`
  }
  return `rgba(${r},${g},${b},${a})`
}

function rgbValToHex (value: string) {
  const rgbRest = parseRgbVal(value)
  if (rgbRest) {
    const hexVal = rgbToHexVal(rgbRest.r, rgbRest.g, rgbRest.b, rgbRest.a)
    if (hexVal) {
      return parseHexVal(hexVal)
    }
  }
  return null
}

export function rgbToHexVal (r: number, g: number, b: number, a?: number) {
  a = XEUtils.isNumber(a) ? a : 1
  const hexR = r.toString(16).padStart(2, '0')
  const hexG = g.toString(16).padStart(2, '0')
  const hexB = b.toString(16).padStart(2, '0')
  const hexA = a === 1 ? '' : (hexAlphaNumMaps[a] || '')

  // 返回十六进制颜色代码
  return `#${hexR}${hexG}${hexB}${hexA}`.toUpperCase()
}

export function rgbToHsv (rgbRest: {
  r: number
  g: number
  b: number
}) {
  if (!rgbRest) {
    return null
  }
  const { r, g, b } = rgbRest
  const rAbs = r / 255
  const gAbs = g / 255
  const bAbs = b / 255
  let h = 0
  let s = 0
  const val = Math.max(rAbs, gAbs, bAbs)
  const num = val - Math.min(rAbs, gAbs, bAbs)
  const handleDiff = (c: number) => (val - c) / 6 / num + 1 / 2
  if (num === 0) {
    h = s = 0
  } else {
    s = num / val
    const rr = handleDiff(rAbs)
    const gg = handleDiff(gAbs)
    const bb = handleDiff(bAbs)

    if (rAbs === val) {
      h = bb - gg
    } else if (gAbs === val) {
      h = (1 / 3) + rr - bb
    } else if (bAbs === val) {
      h = (2 / 3) + gg - rr
    }
    if (h < 0) {
      h += 1
    } else if (h > 1) {
      h -= 1
    }
  }
  return {
    h: Math.round(h * 360),
    s: XEUtils.round(s, 2),
    v: XEUtils.round(val, 2)
  }
}

function rgbToHsl (rgbRest: {
  r: number
  g: number
  b: number
  a?: number
}) {
  if (!rgbRest) {
    return null
  }
  const { r, g, b, a } = rgbRest
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255

  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2
    } else {
      h = (rNorm - gNorm) / delta + 4
    }
    h *= 60
    if (h < 0) {
      h += 360
    }
  }

  return {
    h,
    s,
    l,
    a: XEUtils.isNumber(a) ? a : 1
  }
}

function hslToRgb (slRest: {
  h: number
  s: number
  l: number
}) {
  if (!slRest) {
    return null
  }
  let { h, s, l } = slRest
  const sNorm = s
  const lNorm = l

  h = ((h % 360) + 360) % 360

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = lNorm - c / 2

  let r: number, g: number, b: number
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c
  } else {
    r = c; g = 0; b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  }
}

export function hsvToRgb (h: number, s: number, v: number) {
  let r = 0
  let g = 0
  let b = 0
  const i = Math.floor(h / 60)
  const f = h / 60 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i) {
    case 0:
      r = v; g = t; b = p
      break
    case 1:
      r = q; g = v; b = p
      break
    case 2:
      r = p; g = v; b = t
      break
    case 3:
      r = p; g = q; b = v
      break
    case 4:
      r = t; g = p; b = v
      break
    case 5:
      r = v; g = p; b = q
      break
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

export function hexToHsv (str: string) {
  const rgbRest = hexToRgb(str)
  if (rgbRest) {
    return rgbToHsv(rgbRest)
  }
  return null
}

export function hexToRgb (str: string) {
  if (str) {
    const rests = str.match(/^(#?)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})?$/)
    if (rests) {
      const r = parseInt(rests[2], 16)
      const g = parseInt(rests[3], 16)
      const b = parseInt(rests[4], 16)
      const a = (rests[5] ? hexAlphaKeyMaps[rests[5].toUpperCase()] : 1) || 1
      return {
        value: str,
        label: toValRgb(r, g, b, rests[5] ? a : null),
        type: (rests[5] ? 'rgba' : 'rgb') as 'rgba' | 'rgb',
        r,
        g,
        b,
        a
      }
    }
  }
  return null
}
