import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getIcon, getConfig, getI18n, globalEvents, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getEventTargetNode, toCssUnit, updatePanelPlacement } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { parseColor, updateColorAlpha, hexToHsv, rgbToHsv, rgbToHex, hexToRgb, hsvToRgb, toRgb } from './util'
import VxeButtonComponent from '../../button/src/button'
import VxeInputComponent from '../../input/src/input'
import VxeNumberInputComponent from '../../number-input/src/number-input'

import type { ColorPickerReactData, VxeColorPickerPropTypes, VxeColorPickerEmits, VxeComponentSizeType, ColorPickerInternalData, ValueOf, VxeModalConstructor, VxeModalMethods, VxeDrawerConstructor, VxeDrawerMethods, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

const WinEyeDropper = typeof window !== 'undefined' ? (window as any).EyeDropper : null

const typeList = [
  { label: 'HEX', value: 'hex' },
  { label: 'RGB', value: 'rgb' }
]

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeColorPicker',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: String as PropType<VxeColorPickerPropTypes.ModelValue>,
    placeholder: String as PropType<VxeColorPickerPropTypes.Placeholder>,
    clearable: {
      type: Boolean as PropType<VxeColorPickerPropTypes.Clearable>,
      default: () => getConfig().colorPicker.clearable
    },
    type: {
      type: String as PropType<VxeColorPickerPropTypes.Type>,
      default: () => getConfig().colorPicker.type
    },
    size: {
      type: String as PropType<VxeColorPickerPropTypes.Size>,
      default: () => getConfig().colorPicker.size || getConfig().size
    },
    className: [String, Function] as PropType<VxeColorPickerPropTypes.ClassName>,
    popupClassName: [String, Function] as PropType<VxeColorPickerPropTypes.PopupClassName>,
    colors: {
      type: Array as PropType<VxeColorPickerPropTypes.Colors>,
      default: () => XEUtils.clone(getConfig().colorPicker.colors, true) || []
    },
    showAlpha: {
      type: Boolean as PropType<VxeColorPickerPropTypes.ShowAlpha>,
      default: () => getConfig().colorPicker.showAlpha
    },
    showEyeDropper: {
      type: Boolean as PropType<VxeColorPickerPropTypes.ShowEyeDropper>,
      default: () => getConfig().colorPicker.showEyeDropper
    },
    showColorExtractor: {
      type: Boolean as PropType<VxeColorPickerPropTypes.ShowColorExtractor>,
      default: () => getConfig().colorPicker.showColorExtractor
    },
    showQuick: {
      type: Boolean as PropType<VxeColorPickerPropTypes.ShowQuick>,
      default: () => getConfig().colorPicker.showQuick
    },
    readonly: {
      type: Boolean as PropType<VxeColorPickerPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeColorPickerPropTypes.Disabled>,
      default: null
    },
    clickToCopy: {
      type: Boolean as PropType<VxeColorPickerPropTypes.ClickToCopy>,
      default: () => getConfig().colorPicker.clickToCopy
    },
    placement: String as PropType<VxeColorPickerPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeColorPickerPropTypes.Transfer>,
      default: null
    }
  },
  inject: {
    $xeModal: {
      default: null
    },
    $xeDrawer: {
      default: null
    },
    $xeTable: {
      default: null
    },
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    }
  },
  provide () {
    const $xeColorPicker = this
    return {
      $xeColorPicker
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: ColorPickerReactData = {
      initialized: false,
      selectTyle: 'hex',
      selectColor: '',
      showTypePopup: false,
      panelColor: '',
      hexValue: '',
      rValue: 0,
      gValue: 0,
      bValue: 0,
      aValue: 0,
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    }
    const internalData: ColorPickerInternalData = {
      hpTimeout: undefined
    }
    return {
      xID,
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeModal(): (VxeModalConstructor & VxeModalMethods) | null
      $xeDrawer(): (VxeDrawerConstructor & VxeDrawerMethods) | null
      $xeTable(): (VxeTableConstructor & VxeTablePrivateMethods) | null
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeFormReadonly () {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const $xeForm = $xeColorPicker.$xeForm

      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.readonly
        }
        return false
      }
      return readonly
    },
    computeIsDisabled () {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const $xeForm = $xeColorPicker.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeBtnTransfer () {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const $xeTable = $xeColorPicker.$xeTable
      const $xeModal = $xeColorPicker.$xeModal
      const $xeDrawer = $xeColorPicker.$xeDrawer
      const $xeForm = $xeColorPicker.$xeForm

      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().colorPicker.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    },
    computeColorList () {
      const $xeColorPicker = this
      const props = $xeColorPicker

      const { colors } = props
      if (colors) {
        return colors.map(item => {
          if (XEUtils.isString(item)) {
            return {
              label: item,
              value: item
            }
          }
          return {
            label: XEUtils.eqNull(item.label) ? item.value : item.label,
            value: item.value
          }
        })
      }
      return []
    },
    computeIsRgb () {
      const $xeColorPicker = this
      const reactData = ($xeColorPicker as any).reactData

      const { selectTyle } = reactData
      return selectTyle === 'rgb'
    },
    computeSelectTypeItem () {
      const $xeColorPicker = this
      const reactData = ($xeColorPicker as any).reactData

      const { selectTyle } = reactData
      return typeList.find(item => item.value === selectTyle)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeColorPickerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeColorPicker = this
      $xeColorPicker.$emit(type, createEvent(evnt, { $colorPicker: $xeColorPicker }, params))
    },
    emitModel (value: any) {
      const $xeColorPicker = this

      const { _events } = $xeColorPicker as any
      if (_events && _events.modelValue) {
        $xeColorPicker.$emit('modelValue', value)
      } else {
        $xeColorPicker.$emit('model-value', value)
      }
    },
    updateMode () {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const reactData = $xeColorPicker.reactData

      const { value } = props
      reactData.selectColor = XEUtils.toValueString(value)
      $xeColorPicker.updateModelColor()
    },
    updateType () {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const reactData = $xeColorPicker.reactData

      const { type } = props
      let selectTyle: VxeColorPickerPropTypes.Type = 'hex'
      if (type === 'rgb' || (type as string) === 'rgba') {
        selectTyle = 'rgb'
      }
      reactData.selectTyle = selectTyle
      $xeColorPicker.updateMode()
    },
    updateModelColor () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { selectColor, isAniVisible } = reactData
      const isRgb = $xeColorPicker.computeIsRgb
      const hueSliderEl = $xeColorPicker.$refs.refHueSliderElem as HTMLDivElement
      const alphaSliderEl = $xeColorPicker.$refs.refAlphaSliderElem as HTMLDivElement
      const colorRest = parseColor(selectColor)
      reactData.hexValue = colorRest.hex
      reactData.rValue = colorRest.r
      reactData.gValue = colorRest.g
      reactData.bValue = colorRest.b
      reactData.aValue = colorRest.a
      if (colorRest.value) {
        if (isRgb) {
          if (colorRest.type === 'hex') {
            const rgbRest = hexToRgb(colorRest.hex)
            if (rgbRest) {
              reactData.rValue = rgbRest.r
              reactData.gValue = rgbRest.g
              reactData.bValue = rgbRest.b
              reactData.aValue = rgbRest.a
            }
          }
        } else {
          if (colorRest.type !== 'hex') {
            reactData.hexValue = rgbToHex(colorRest)
          }
        }
      }
      if (isAniVisible) {
        const hsvRest = colorRest.type === 'hex' ? hexToHsv(colorRest.hex) : rgbToHsv(colorRest)
        const colorPanelEl = $xeColorPicker.$refs.refColorPanelElem as HTMLDivElement
        if (hsvRest) {
          if (colorPanelEl) {
            const offsetTop = colorPanelEl.clientHeight * (1 - hsvRest.v)
            const offsetLeft = colorPanelEl.clientWidth * hsvRest.s
            $xeColorPicker.handlePanelColor(offsetLeft, offsetTop)
          }
          if (hueSliderEl) {
            $xeColorPicker.handleHueColor(XEUtils.ceil((1 - hsvRest.h / 360) * hueSliderEl.clientWidth))
          }
        }
        if (alphaSliderEl) {
          $xeColorPicker.handleAlphaColor(alphaSliderEl.clientWidth * colorRest.a)
        }
      }
    },
    updateZindex () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement () {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const reactData = $xeColorPicker.reactData

      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = $xeColorPicker.$refs.refElem as HTMLElement
      const panelElem = $xeColorPicker.$refs.refOptionPanel as HTMLDivElement
      const btnTransfer = $xeColorPicker.computeBtnTransfer
      const handleStyle = () => {
        const ppObj = updatePanelPlacement(targetElem, panelElem, {
          placement,
          teleportTo: btnTransfer
        })
        const panelStyle: { [key: string]: string | number } = Object.assign(ppObj.style, {
          zIndex: panelIndex
        })
        reactData.panelStyle = panelStyle
        reactData.panelPlacement = ppObj.placement
      }
      handleStyle()
      return $xeColorPicker.$nextTick().then(handleStyle)
    },
    showOptionPanel () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData
      const internalData = $xeColorPicker.internalData

      const { hpTimeout } = internalData
      const isDisabled = $xeColorPicker.computeIsDisabled
      if (!isDisabled) {
        if (hpTimeout) {
          clearTimeout(hpTimeout)
          internalData.hpTimeout = undefined
        }
        const btnTransfer = $xeColorPicker.computeBtnTransfer
        const panelElem = $xeColorPicker.$refs.refOptionPanel as HTMLElement
        if (!reactData.initialized) {
          reactData.initialized = true
          if (btnTransfer) {
            if (panelElem) {
              document.body.appendChild(panelElem)
            }
          }
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        setTimeout(() => {
          $xeColorPicker.updateModelColor()
          reactData.visiblePanel = true
        }, 10)
        $xeColorPicker.updateZindex()
        $xeColorPicker.updatePlacement()
      }
    },
    hideOptionPanel () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData
      const internalData = $xeColorPicker.internalData

      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    },
    changeEvent (evnt: Event, value: any) {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const reactData = $xeColorPicker.reactData
      const $xeForm = $xeColorPicker.$xeForm
      const formItemInfo = $xeColorPicker.formItemInfo

      reactData.selectColor = value
      if (value !== props.value) {
        $xeColorPicker.emitModel(value)
        $xeColorPicker.dispatchEvent('change', { value }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    clearValueEvent (evnt: Event, selectValue: any) {
      const $xeColorPicker = this

      $xeColorPicker.changeEvent(evnt, selectValue)
      $xeColorPicker.dispatchEvent('clear', { value: selectValue }, evnt)
    },
    focusEvent () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const isDisabled = $xeColorPicker.computeIsDisabled
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          $xeColorPicker.showOptionPanel()
        }
      }
    },
    blurEvent () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      reactData.isActivated = false
    },
    clearEvent (evnt: Event) {
      const $xeColorPicker = this

      $xeColorPicker.clearValueEvent(evnt, null)
      $xeColorPicker.hideOptionPanel()
    },
    confirmEvent (evnt: MouseEvent) {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { selectColor } = reactData
      $xeColorPicker.changeEvent(evnt, selectColor)
      $xeColorPicker.hideOptionPanel()
    },
    togglePanelEvent (evnt: MouseEvent) {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      evnt.preventDefault()
      if (reactData.visiblePanel) {
        $xeColorPicker.hideOptionPanel()
      } else {
        $xeColorPicker.showOptionPanel()
      }
    },
    clickEvent (evnt: MouseEvent) {
      const $xeColorPicker = this

      $xeColorPicker.togglePanelEvent(evnt)
      $xeColorPicker.dispatchEvent('click', {}, evnt)
    },
    handlePanelClickEvent () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      reactData.showTypePopup = false
    },
    toggleTypeVisibleEvent (evnt: MouseEvent) {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      evnt.stopPropagation()
      reactData.showTypePopup = !reactData.showTypePopup
    },
    handleChangeType (type: VxeColorPickerPropTypes.Type) {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { selectTyle } = reactData
      if (type !== selectTyle) {
        reactData.selectTyle = type
        $xeColorPicker.updateModelColor()
      }
      reactData.showTypePopup = false
    },
    handleHueColor (offsetLeft: number) {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const hueSliderEl = $xeColorPicker.$refs.refHueSliderElem as HTMLDivElement
      const hueSliderBtnEl = $xeColorPicker.$refs.refHueSliderBtnElem as HTMLDivElement
      if (hueSliderEl && hueSliderBtnEl) {
        if (offsetLeft < 0) {
          offsetLeft = 0
        }
        const barWidth = XEUtils.toInteger(hueSliderEl.clientWidth)
        const itemNum = 255
        const countNum = itemNum * 6
        const offsetX = XEUtils.ceil(countNum / barWidth * offsetLeft)
        const offsetNum = offsetX % itemNum
        let rNum = 0
        let gNum = 0
        let bNum = 0
        switch (Math.ceil(offsetX / itemNum)) {
          case 1:
            rNum = itemNum
            bNum = offsetNum
            break
          case 2:
            rNum = itemNum - offsetNum
            bNum = itemNum
            break
          case 3:
            gNum = offsetNum
            bNum = itemNum
            break
          case 4:
            gNum = itemNum
            bNum = itemNum - offsetNum
            break
          case 5:
            rNum = offsetNum
            gNum = itemNum
            break
          case 6:
            rNum = itemNum
            gNum = itemNum - offsetNum
            break
        }
        reactData.panelColor = toRgb(rNum, gNum, bNum)
        hueSliderBtnEl.style.left = toCssUnit(offsetLeft)
      }
    },
    handleHueBarEvent (evnt: MouseEvent) {
      const $xeColorPicker = this

      const hueSliderEl = $xeColorPicker.$refs.refHueSliderElem as HTMLDivElement
      const hueSliderBtnEl = $xeColorPicker.$refs.refHueSliderBtnElem as HTMLDivElement
      if (hueSliderEl && hueSliderBtnEl) {
        const hueSliderRect = hueSliderEl.getBoundingClientRect()
        const barWidth = XEUtils.toInteger(hueSliderEl.clientWidth)
        const offsetLeft = XEUtils.ceil(Math.min(barWidth - 1, Math.max(1, evnt.clientX - hueSliderRect.x)))
        $xeColorPicker.handleHueColor(offsetLeft)
      }
    },
    handleHueSliderMousedownEvent (evnt: MouseEvent) {
      const $xeColorPicker = this

      evnt.preventDefault()
      document.onmousemove = evnt => {
        evnt.preventDefault()
        $xeColorPicker.handleHueBarEvent(evnt)
      }
      document.onmouseup = (evnt: MouseEvent) => {
        document.onmousemove = null
        document.onmouseup = null
        $xeColorPicker.handleHueBarEvent(evnt)
      }
    },
    handleAlphaColor (offsetLeft: number) {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { selectColor } = reactData
      const alphaSliderEl = $xeColorPicker.$refs.refAlphaSliderElem as HTMLDivElement
      const alphaSliderBtnEl = $xeColorPicker.$refs.refAlphaSliderBtnElem as HTMLDivElement
      if (alphaSliderEl && alphaSliderBtnEl) {
        const alphaSliderRect = alphaSliderEl.getBoundingClientRect()
        const barWidth = alphaSliderRect.width
        if (offsetLeft < 0) {
          offsetLeft = 0
        }
        if (offsetLeft > barWidth) {
          offsetLeft = barWidth
        }
        const alpha = XEUtils.ceil(100 / barWidth * offsetLeft / 100, 2)
        reactData.aValue = alpha
        alphaSliderBtnEl.style.left = toCssUnit(offsetLeft)
        reactData.selectColor = updateColorAlpha(selectColor, alpha)
      }
    },
    handleAlphaBarEvent (evnt: MouseEvent) {
      const $xeColorPicker = this

      const alphaSliderEl = $xeColorPicker.$refs.refAlphaSliderElem as HTMLDivElement
      const alphaSliderBtnEl = $xeColorPicker.$refs.refAlphaSliderBtnElem as HTMLDivElement
      if (alphaSliderEl && alphaSliderBtnEl) {
        const alphaSliderRect = alphaSliderEl.getBoundingClientRect()
        const barWidth = alphaSliderRect.width
        const offsetLeft = Math.min(barWidth, Math.max(0, evnt.clientX - alphaSliderRect.x))
        $xeColorPicker.handleAlphaColor(offsetLeft)
        $xeColorPicker.updateModelColor()
      }
    },
    handleAlphaSliderMousedownEvent (evnt: MouseEvent) {
      const $xeColorPicker = this

      evnt.preventDefault()
      document.onmousemove = evnt => {
        evnt.preventDefault()
        $xeColorPicker.handleAlphaBarEvent(evnt)
      }
      document.onmouseup = (evnt: MouseEvent) => {
        document.onmousemove = null
        document.onmouseup = null
        $xeColorPicker.handleAlphaBarEvent(evnt)
      }
    },
    handleInputRgbEvent () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { rValue, gValue, bValue, aValue } = reactData
      reactData.selectColor = toRgb(rValue, gValue, bValue, aValue)
      $xeColorPicker.updateModelColor()
    },
    handleInputAlphaEvent () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { aValue } = reactData
      const alphaSliderEl = $xeColorPicker.$refs.refAlphaSliderElem as HTMLDivElement
      const alphaSliderBtnEl = $xeColorPicker.$refs.refAlphaSliderBtnElem as HTMLDivElement
      if (alphaSliderEl && alphaSliderBtnEl) {
        const alphaSliderRect = alphaSliderEl.getBoundingClientRect()
        const barWidth = alphaSliderRect.width
        const offsetLeft = barWidth * aValue
        $xeColorPicker.handleAlphaColor(offsetLeft)
      }
    },
    handleQuickEvent (evnt: MouseEvent, item: any) {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const value = item.value
      reactData.selectColor = value
      $xeColorPicker.updateModelColor()
    },
    handlePanelColor (offsetLeft: number, offsetTop: number) {
      const $xeColorPicker = this

      const colorActiveEl = $xeColorPicker.$refs.refColorActiveElem as HTMLDivElement
      if (colorActiveEl) {
        colorActiveEl.style.top = toCssUnit(offsetTop)
        colorActiveEl.style.left = toCssUnit(offsetLeft)
      }
    },
    handleEyeDropperEvent () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      if (WinEyeDropper) {
        try {
          const eyeDropper = new WinEyeDropper()
          eyeDropper.open().then((rest: any) => {
            if (rest && rest.sRGBHex) {
              reactData.selectColor = rest.sRGBHex
              $xeColorPicker.updateModelColor()
            }
          }).catch(() => {
          })
        } catch (e) {}
      }
    },
    handleSelectColorByXY (clientX: number, clientY: number) {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const reactData = $xeColorPicker.reactData

      const { showAlpha } = props
      const { panelColor, aValue } = reactData
      const colorPanelEl = $xeColorPicker.$refs.refColorPanelElem as HTMLDivElement
      const colorActiveEl = $xeColorPicker.$refs.refColorActiveElem as HTMLDivElement
      if (colorPanelEl && colorActiveEl) {
        const { clientWidth, clientHeight } = colorPanelEl
        const colorPanelRect = colorPanelEl.getBoundingClientRect()
        const offsetTop = Math.min(clientHeight, Math.max(0, clientY - colorPanelRect.y))
        const offsetLeft = Math.min(clientWidth, Math.max(0, clientX - colorPanelRect.x))
        const colorRest = parseColor(panelColor)
        if (colorRest) {
          const hsvRest = colorRest.type === 'hex' ? hexToHsv(colorRest.hex) : rgbToHsv(colorRest)
          if (hsvRest) {
            const ragRest = hsvToRgb(hsvRest.h, offsetLeft / clientWidth, (1 - offsetTop / clientHeight))
            reactData.selectColor = toRgb(ragRest.r, ragRest.g, ragRest.b, showAlpha ? aValue : null)
            $xeColorPicker.handlePanelColor(offsetLeft, offsetTop)
          }
        }
        $xeColorPicker.updateModelColor()
      }
    },
    handleSelectColorMousedownEvent (evnt: MouseEvent) {
      const $xeColorPicker = this

      evnt.stopPropagation()
      evnt.preventDefault()
      $xeColorPicker.handleSelectColorByXY(evnt.clientX, evnt.clientY)
      document.onmousemove = evnt => {
        $xeColorPicker.handleSelectColorByXY(evnt.clientX, evnt.clientY)
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    handleCopyColorEvent () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { selectColor } = reactData
      if (selectColor) {
        if (VxeUI.clipboard.copy(selectColor)) {
          if (VxeUI.modal) {
            VxeUI.modal.message({
              content: getI18n('vxe.colorPicker.copySuccess', [selectColor]),
              status: 'success'
            })
          }
        }
      }
    },
    handleGlobalMousewheelEvent (evnt: MouseEvent) {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeColorPicker.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = $xeColorPicker.$refs.refOptionPanel as HTMLDivElement
          if (getEventTargetNode(evnt, panelElem).flag) {
            $xeColorPicker.updatePlacement()
          } else {
            $xeColorPicker.hideOptionPanel()
          }
        }
      }
    },
    handleGlobalMousedownEvent (evnt: MouseEvent) {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeColorPicker.computeIsDisabled
      if (!isDisabled) {
        const el = $xeColorPicker.$refs.refElem as HTMLDivElement
        const panelElem = $xeColorPicker.$refs.refOptionPanel as HTMLDivElement
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          $xeColorPicker.hideOptionPanel()
        }
      }
    },
    handleGlobalBlurEvent () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        $xeColorPicker.hideOptionPanel()
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const targetElem = $xeColorPicker.$refs.refInputTarget as HTMLInputElement
        if (targetElem) {
          targetElem.blur()
        }
      }
    },
    handleGlobalResizeEvent () {
      const $xeColorPicker = this
      const reactData = $xeColorPicker.reactData

      const { visiblePanel } = reactData
      if (visiblePanel) {
        $xeColorPicker.updatePlacement()
      }
    },

    //
    // Render
    //
    renderColorWrapper (h: CreateElement) {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const reactData = $xeColorPicker.reactData

      const { showColorExtractor } = props
      const { panelColor } = reactData
      if (showColorExtractor) {
        return h('div', {
          ref: 'refColorPanelElem',
          class: 'vxe-color-picker--color-wrapper',
          on: {
            mousedown: $xeColorPicker.handleSelectColorMousedownEvent
          }
        }, [
          h('div', {
            class: 'vxe-color-picker--color-bg',
            style: {
              backgroundColor: panelColor
            }
          }),
          h('div', {
            class: 'vxe-color-picker--white-bg'
          }),
          h('div', {
            class: 'vxe-color-picker--black-bg'
          }),
          h('div', {
            ref: 'refColorActiveElem',
            class: 'vxe-color-picker--color-active'
          })
        ])
      }
      return renderEmptyElement($xeColorPicker)
    },
    renderColorBar (h: CreateElement) {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const reactData = $xeColorPicker.reactData

      const { showAlpha, clickToCopy, showEyeDropper } = props
      const { selectTyle, showTypePopup, hexValue, rValue, gValue, bValue, aValue, selectColor, panelColor } = reactData
      const isRgb = $xeColorPicker.computeIsRgb
      const selectTypeItem = $xeColorPicker.computeSelectTypeItem
      return h('div', {
        class: 'vxe-color-picker--bar-wrapper'
      }, [
        h('div', {
          class: 'vxe-color-picker--slider-wrapper'
        }, [
          showEyeDropper && WinEyeDropper
            ? h('div', {
              class: 'vxe-color-picker--color-dropper'
            }, [
              h('span', {
                class: 'vxe-color-picker--color-dropper-btn',
                on: {
                  click: $xeColorPicker.handleEyeDropperEvent
                }
              }, [
                h('i', {
                  class: getIcon().COLOR_PICKER_EYE_DROPPER
                })
              ])
            ])
            : renderEmptyElement($xeColorPicker),
          h('div', {
            class: 'vxe-color-picker--slider-preview'
          }, [
            h('div', {
              class: 'vxe-color-picker--preview-btn'
            }, [
              h('div', {
                class: 'vxe-color-picker--preview-color',
                style: {
                  backgroundColor: selectColor
                }
              }, clickToCopy
                ? [
                    h('span', {
                      class: 'vxe-color-picker--preview-copy-btn',
                      on: {
                        click: $xeColorPicker.handleCopyColorEvent
                      }
                    }, [
                      h('i', {
                        class: getIcon().COLOR_PICKER_COLOR_COPY
                      })
                    ])
                  ]
                : [])
            ])
          ]),
          h('div', {
            class: 'vxe-color-picker--slider-handle'
          }, [
            h('div', {
              ref: 'refHueSliderElem',
              class: 'vxe-color-picker--bar-hue-slider',
              on: {
                click: $xeColorPicker.handleHueBarEvent
              }
            }, [
              h('div', {
                ref: 'refHueSliderBtnElem',
                class: 'vxe-color-picker--bar-hue-btn',
                on: {
                  mousedown: $xeColorPicker.handleHueSliderMousedownEvent
                }
              })
            ]),
            showAlpha
              ? h('div', {
                ref: 'refAlphaSliderElem',
                class: 'vxe-color-picker--bar-alpha-slider',
                on: {
                  click: $xeColorPicker.handleAlphaBarEvent
                }
              }, [
                h('div', {
                  class: 'vxe-color-picker--bar-alpha-bg',
                  style: {
                    background: `linear-gradient(to right, rgba(0, 0, 0, 0), ${panelColor})`
                  }
                }),
                h('div', {
                  ref: 'refAlphaSliderBtnElem',
                  class: 'vxe-color-picker--bar-alpha-btn',
                  on: {
                    mousedown: $xeColorPicker.handleAlphaSliderMousedownEvent
                  }
                })
              ])
              : renderEmptyElement($xeColorPicker)
          ])
        ]),
        h('div', {
          class: 'vxe-color-picker--custom-wrapper'
        }, [
          h('div', {
            class: 'vxe-color-picker--type-switch'
          }, [
            h('div', {
              class: 'vxe-color-picker--type-label',
              on: {
                click: $xeColorPicker.toggleTypeVisibleEvent
              }
            }, [
              h('span', `${selectTypeItem ? selectTypeItem.label : selectTyle}`),
              h('span', {
                class: 'vxe-color-picker--type-icon'
              }, [
                h('i', {
                  class: showTypePopup ? getIcon().COLOR_PICKER_TPTY_OPEN : getIcon().COLOR_PICKER_TPTY_CLOSE
                })
              ])
            ]),
            h('div', {
              class: ['vxe-color-picker--type-popup', {
                'is--visible': showTypePopup
              }]
            }, typeList.map(item => {
              return h('div', {
                class: 'vxe-color-picker--type-item',
                on: {
                  click (evnt: KeyboardEvent) {
                    evnt.stopPropagation()
                    $xeColorPicker.handleChangeType(item.value as VxeColorPickerPropTypes.Type)
                  }
                }
              }, item.label)
            }))
          ]),
          h('div', {
            class: `vxe-color-picker--${selectTyle}-wrapper`
          }, isRgb
            ? [
                h('div', {
                  class: 'vxe-color-picker--input-wrapper'
                }, [
                  h(VxeNumberInputComponent, {
                    props: {
                      type: 'integer',
                      size: 'mini',
                      align: 'center',
                      min: 0,
                      max: 255,
                      maxLength: 3,
                      placeholder: '',
                      value: rValue,
                      controlConfig: {
                        showButton: false
                      }
                    },
                    on: {
                      'modelValue' (val: any) {
                        reactData.rValue = val
                      },
                      change: $xeColorPicker.handleInputRgbEvent
                    }
                  }),
                  h(VxeNumberInputComponent, {
                    props: {
                      type: 'integer',
                      size: 'mini',
                      align: 'center',
                      min: 0,
                      max: 255,
                      maxLength: 3,
                      placeholder: '',
                      value: gValue,
                      controlConfig: {
                        showButton: false
                      }
                    },
                    on: {
                      'modelValue' (val: any) {
                        reactData.gValue = val
                      },
                      change: $xeColorPicker.handleInputRgbEvent
                    }
                  }),
                  h(VxeNumberInputComponent, {
                    props: {
                      type: 'integer',
                      size: 'mini',
                      align: 'center',
                      min: 0,
                      max: 255,
                      maxLength: 3,
                      placeholder: '',
                      value: bValue,
                      controlConfig: {
                        showButton: false
                      }
                    },
                    on: {
                      'modelValue' (val: any) {
                        reactData.bValue = val
                      },
                      change: $xeColorPicker.handleInputRgbEvent
                    }
                  }),
                  h(VxeNumberInputComponent, {
                    props: {
                      type: 'number',
                      size: 'mini',
                      align: 'center',
                      min: 0,
                      max: 1,
                      step: 0.01,
                      maxLength: 4,
                      placeholder: '',
                      value: aValue,
                      controlConfig: {
                        showButton: false
                      }
                    },
                    on: {
                      'modelValue' (val: any) {
                        reactData.aValue = val
                      },
                      change: $xeColorPicker.handleInputAlphaEvent
                    }
                  })
                ]),
                h('div', {
                  class: 'vxe-color-picker--input-title'
                }, [
                  h('span', 'R'),
                  h('span', 'G'),
                  h('span', 'B'),
                  h('span', 'A')
                ])]
            : [
                h('div', {
                  class: 'vxe-color-picker--input-wrapper'
                }, [
                  h(VxeInputComponent, {
                    props: {
                      type: 'text',
                      size: 'mini',
                      align: 'center',
                      maxLength: 9,
                      placeholder: '',
                      value: hexValue
                    },
                    on: {
                      'modelValue' (val: any) {
                        reactData.hexValue = val
                      },
                      change () {
                        const colorRest = parseColor(reactData.hexValue)
                        if (colorRest) {
                          if (colorRest.value) {
                            reactData.selectColor = colorRest.value
                            $xeColorPicker.updateModelColor()
                          }
                        }
                      }
                    }
                  })
                ]),
                h('div', {
                  class: 'vxe-color-picker--input-title'
                }, getI18n('vxe.colorPicker.hex'))
              ])
        ])
      ])
    },
    renderQuickWrapper (h: CreateElement) {
      const $xeColorPicker = this
      const props = $xeColorPicker

      const { showQuick } = props
      const colorList = $xeColorPicker.computeColorList
      if (showQuick && colorList.length) {
        return h('div', {
          class: 'vxe-color-picker--quick-wrapper'
        }, colorList.map((item, i) => {
          return h('div', {
            key: i,
            class: 'vxe-color-picker--quick-item',
            attrs: {
              title: item.label || ''
            },
            style: {
              backgroundColor: item.value
            },
            on: {
              click (evnt: MouseEvent) {
                $xeColorPicker.handleQuickEvent(evnt, item)
              }
            }
          })
        }))
      }
      return renderEmptyElement($xeColorPicker)
    },
    renderVN (h: CreateElement): VNode {
      const $xeColorPicker = this
      const props = $xeColorPicker
      const reactData = $xeColorPicker.reactData

      const { className, popupClassName, clearable, value } = props
      const { initialized, isActivated, isAniVisible, visiblePanel } = reactData
      const vSize = $xeColorPicker.computeSize
      const isDisabled = $xeColorPicker.computeIsDisabled
      const btnTransfer = $xeColorPicker.computeBtnTransfer
      const formReadonly = $xeColorPicker.computeFormReadonly

      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-color-picker--readonly', className]
        }, [
          h('div', {
            class: 'vxe-color-picker--readonly-color',
            style: {
              backgroundColor: value
            }
          })
        ])
      }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-color-picker', className ? (XEUtils.isFunction(className) ? className({ $colorPicker: $xeColorPicker }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--selected': !!value,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--active': isActivated
        }]
      }, [
        h('input', {
          ref: 'refInputTarget',
          class: 'vxe-color-picker--input',
          on: {
            focus: $xeColorPicker.focusEvent,
            blur: $xeColorPicker.blurEvent
          }
        }),
        h('div', {
          class: 'vxe-color-picker--inner',
          on: {
            click: $xeColorPicker.clickEvent
          }
        }, [
          h('div', {
            class: 'vxe-color-picker--inner-color',
            style: {
              backgroundColor: value
            }
          })
        ]),
        h('div', {
          ref: 'refOptionPanel',
          class: ['vxe-table--ignore-clear vxe-color-picker--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $colorPicker: $xeColorPicker }) : popupClassName) : '', {
            [`size--${vSize}`]: vSize,
            'is--transfer': btnTransfer,
            'ani--leave': isAniVisible,
            'ani--enter': visiblePanel
          }],
          attrs: {
            placement: reactData.panelPlacement
          },
          style: reactData.panelStyle
        }, [
          initialized && (visiblePanel || isAniVisible)
            ? h('div', {
              class: 'vxe-color-picker--panel-wrapper',
              on: {
                click: $xeColorPicker.handlePanelClickEvent
              }
            }, [
              $xeColorPicker.renderColorWrapper(h),
              $xeColorPicker.renderColorBar(h),
              $xeColorPicker.renderQuickWrapper(h),
              h('div', {
                class: 'vxe-color-picker--footer-wrapper'
              }, [
                clearable
                  ? h(VxeButtonComponent, {
                    props: {
                      content: getI18n('vxe.colorPicker.clear'),
                      size: 'mini'
                    },
                    on: {
                      click: $xeColorPicker.clearEvent
                    }
                  })
                  : renderEmptyElement($xeColorPicker),
                h(VxeButtonComponent, {
                  props: {
                    content: getI18n('vxe.colorPicker.confirm'),
                    size: 'mini',
                    status: 'primary'
                  },
                  on: {
                    click: $xeColorPicker.confirmEvent
                  }
                })
              ])
            ])
            : renderEmptyElement($xeColorPicker)
        ])
      ])
    }
  },
  watch: {
    value () {
      const $xeColorPicker = this

      $xeColorPicker.updateMode()
    },
    type () {
      const $xeColorPicker = this

      $xeColorPicker.updateType()
    }
  },
  created () {
    const $xeColorPicker = this
    const props = $xeColorPicker
    const reactData = $xeColorPicker.reactData

    reactData.selectColor = `${props.value || ''}`
    $xeColorPicker.updateType()

    globalEvents.on($xeColorPicker, 'mousewheel', $xeColorPicker.handleGlobalMousewheelEvent)
    globalEvents.on($xeColorPicker, 'mousedown', $xeColorPicker.handleGlobalMousedownEvent)
    globalEvents.on($xeColorPicker, 'blur', $xeColorPicker.handleGlobalBlurEvent)
    globalEvents.on($xeColorPicker, 'resize', $xeColorPicker.handleGlobalResizeEvent)
  },
  beforeDestroy () {
    const $xeColorPicker = this

    const panelElem = $xeColorPicker.$refs.refOptionPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeColorPicker, 'mousewheel')
    globalEvents.off($xeColorPicker, 'mousedown')
    globalEvents.off($xeColorPicker, 'blur')
    globalEvents.off($xeColorPicker, 'resize')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
