import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeColorPickerComponent from './src/color-picker'
import { dynamicApp } from '../dynamics'
import { parseColor, hasRgb, hasHex, toRgb, toHex, toHsl, toHsv, toRgbString, toHexString, lighten, darken } from './src/util'

export const VxeColorPicker = Object.assign({}, VxeColorPickerComponent, {
  install (app: App) {
    app.component(VxeColorPickerComponent.name as string, VxeColorPickerComponent)
  }
})

dynamicApp.use(VxeColorPicker)
VxeUI.component(VxeColorPickerComponent)

VxeUI.color = {
  parseColor,
  hasRgb,
  hasHex,
  toRgb,
  toRgbString,
  toHex,
  toHexString,
  toHsl,
  toHsv,
  lighten,
  darken
}

export const ColorPicker = VxeColorPicker
export default VxeColorPicker
