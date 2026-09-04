import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, createEvent, renderEmptyElement } from '../../ui'
import { getText } from '../../ui/src/utils'

import type { SliderReactData, SliderInternalData, VxeSliderEmits, ValueOf, VxeSliderPropTypes, VxeFormDefines, VxeComponentSizeType, VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'

function createInternalData (): SliderInternalData {
  return {
    // _isUp: false,
    isDragStatus: false,
    isBtnActive: false,
    currValue: 0,
    startValue: 0,
    endValue: 0
  }
}

function createReactData (): SliderReactData {
  return {
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeSlider',
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Array] as PropType<VxeSliderPropTypes.ModelValue>,
    startValue: [String, Number] as PropType<VxeSliderPropTypes.StartValue>,
    endValue: [String, Number] as PropType<VxeSliderPropTypes.EndValue>,
    vertical: Boolean as PropType<VxeSliderPropTypes.Vertical>,
    max: {
      type: [String, Number] as PropType<VxeSliderPropTypes.Max>,
      default: () => getConfig().slider.max
    },
    min: {
      type: [String, Number] as PropType<VxeSliderPropTypes.Min>,
      default: () => getConfig().slider.min
    },
    step: {
      type: [String, Number] as PropType<VxeSliderPropTypes.Step>,
      default: () => getConfig().slider.step
    },
    size: {
      type: String as PropType<VxeSliderPropTypes.Size>,
      default: () => getConfig().slider.size || getConfig().size
    },
    range: {
      type: Boolean as PropType<VxeSliderPropTypes.Range>,
      default: () => getConfig().slider.range
    },
    readonly: {
      type: Boolean as PropType<VxeSliderPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeSliderPropTypes.Disabled>,
      default: null
    },
    status: {
      type: String as PropType<VxeSliderPropTypes.Status>,
      default: () => getConfig().slider.status
    },
    immediate: {
      type: Boolean as PropType<VxeSliderPropTypes.Immediate>,
      default: () => getConfig().slider.immediate
    },
    showTooltip: {
      type: Boolean as PropType<VxeSliderPropTypes.ShowTooltip>,
      default: () => getConfig().slider.showTooltip
    },
    tooltipConfig: Object as PropType<VxeSliderPropTypes.TooltipConfig>
  },
  inject: {
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: SliderInternalData,
      }),
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeFormReadonly () {
      const $xeSlider = this
      const props = $xeSlider
      const $xeForm = $xeSlider.$xeForm

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
      const $xeSlider = this
      const props = $xeSlider
      const $xeForm = $xeSlider.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeMaxNum () {
      const $xeSlider = this
      const props = $xeSlider

      return XEUtils.toNumber(props.max || 0)
    },
    computeMinNum () {
      const $xeSlider = this
      const props = $xeSlider

      return XEUtils.toNumber(props.min || 0)
    },
    computeMVal () {
      const $xeSlider = this
      const props = $xeSlider

      const { range, startValue, endValue } = props
      return range ? `${startValue || ''}${endValue || ''}` : ''
    },
    computeTooltipOpts () {
      const $xeSlider = this
      const props = $xeSlider

      return Object.assign({}, getConfig().slider.tooltipConfig, props.tooltipConfig)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeSliderEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSlider = this
      $xeSlider.$emit(type, createEvent(evnt, { $watermark: $xeSlider }, params))
    },
    emitModel (value: any) {
      const $xeSlider = this
      const internalData = $xeSlider.internalData

      const { _events } = $xeSlider as any
      internalData._isUp = true
      if (_events && _events.modelValue) {
        $xeSlider.$emit('modelValue', value)
      } else {
        $xeSlider.$emit('model-value', value)
      }
    },
    getBarPercent (currValue: number) {
      const $xeSlider = this

      const maxNum = $xeSlider.computeMaxNum
      const minNum = $xeSlider.computeMinNum
      if (maxNum === minNum) {
        return 0
      }
      if (currValue < minNum) {
        currValue = minNum
      }
      if (currValue > maxNum) {
        currValue = maxNum
      }
      return ((currValue - minNum) / (maxNum - minNum)) * 100
    },
    parseFields (startValue?: VxeSliderPropTypes.StartValue, endValue?: VxeSliderPropTypes.EndValue) {
      const $xeSlider = this
      const internalData = $xeSlider.internalData

      const [sVal, eVal] = XEUtils.orderBy([XEUtils.toNumber(startValue), XEUtils.toNumber(endValue)])
      const currValue = XEUtils.floor(XEUtils.toNumber(sVal || 0))
      internalData.currValue = currValue
      internalData.startValue = currValue
      internalData.endValue = XEUtils.floor(XEUtils.toNumber(eVal || 0))
    },
    parseArrs (arrVals: number[]) {
      const $xeSlider = this
      const internalData = $xeSlider.internalData

      const [sVal, eVal] = XEUtils.orderBy(arrVals)
      const currValue = XEUtils.floor(XEUtils.toNumber(sVal || 0))
      internalData.currValue = currValue
      internalData.startValue = currValue
      internalData.endValue = XEUtils.floor(XEUtils.toNumber(eVal || 0))
    },
    parseNum (val: VxeSliderPropTypes.ModelValue | undefined) {
      const $xeSlider = this
      const internalData = $xeSlider.internalData

      const currValue = XEUtils.floor(XEUtils.toNumber(val || 0))
      internalData.currValue = currValue
      internalData.startValue = 0
      internalData.endValue = currValue
    },
    updateModelValue (umType?: 1 | 2) {
      const $xeSlider = this
      const props = $xeSlider

      const { range, value: modelValue, startValue, endValue } = props
      if (!umType) {
        if (range) {
          if (XEUtils.eqNull(modelValue)) {
            if (startValue || endValue) {
              $xeSlider.parseFields(startValue, endValue)
            }
          } else {
            if (XEUtils.isArray(modelValue)) {
              $xeSlider.parseArrs(modelValue.map(num => XEUtils.toNumber(num)))
            } else {
              $xeSlider.parseNum(modelValue)
            }
          }
        } else {
          $xeSlider.parseNum(modelValue)
        }
      } else if (range && umType === 2) {
        $xeSlider.parseFields(startValue, endValue)
      } else {
        if (XEUtils.isArray(modelValue)) {
          $xeSlider.parseArrs(modelValue.map(num => XEUtils.toNumber(num)))
        } else {
          $xeSlider.parseNum(modelValue)
        }
      }
      $xeSlider.updateBarStyle()
      $xeSlider.updateTrackStyle()
    },
    updateBarStyle () {
      const $xeSlider = this
      const props = $xeSlider
      const internalData = $xeSlider.internalData

      const { range } = props
      const { currValue, startValue, endValue } = internalData
      const startBtnElem = $xeSlider.$refs.refStartBtnElem as HTMLDivElement
      const endBtnElem = $xeSlider.$refs.refEndBtnElem as HTMLDivElement
      if (range) {
        const [sVal, eVal] = XEUtils.orderBy([startValue, endValue])
        if (startBtnElem) {
          startBtnElem.style.left = $xeSlider.getBarPercent(sVal) + '%'
        }
        if (endBtnElem) {
          endBtnElem.style.left = $xeSlider.getBarPercent(eVal) + '%'
        }
      } else {
        if (endBtnElem) {
          endBtnElem.style.left = $xeSlider.getBarPercent(currValue) + '%'
        }
      }
    },
    updateTrackStyle () {
      const $xeSlider = this
      const props = $xeSlider
      const internalData = $xeSlider.internalData

      const { range } = props
      const { currValue, startValue, endValue } = internalData
      const trackElem = $xeSlider.$refs.refTrackElem as HTMLDivElement
      if (trackElem) {
        if (range) {
          const [sVal, eVal] = XEUtils.orderBy([startValue, endValue])
          trackElem.style.left = $xeSlider.getBarPercent(sVal) + '%'
          trackElem.style.width = $xeSlider.getBarPercent(eVal - sVal) + '%'
        } else {
          trackElem.style.left = '0'
          trackElem.style.width = $xeSlider.getBarPercent(currValue) + '%'
        }
      }
    },
    changeEvent (evnt: MouseEvent) {
      const $xeSlider = this
      const props = $xeSlider
      const internalData = $xeSlider.internalData
      const $xeForm = $xeSlider.$xeForm
      const formItemInfo = $xeSlider.formItemInfo

      const { range } = props
      const { currValue, startValue, endValue } = internalData
      const vals = range ? XEUtils.orderBy([startValue, endValue]) : []
      const value = range ? vals : currValue
      $xeSlider.emitModel(value)
      if (range) {
        $xeSlider.$emit('update:startValue', vals[0] || 0)
        $xeSlider.$emit('update:endValue', vals[1] || 0)
      }
      $xeSlider.dispatchEvent('change', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    },
    getValueByLeft (offsetLeft: number, barWidth: number) {
      const $xeSlider = this

      const maxNum = $xeSlider.computeMaxNum
      const minNum = $xeSlider.computeMinNum
      if (barWidth === 0) {
        return minNum
      }
      const clamped = Math.max(0, Math.min(barWidth, offsetLeft))
      const ratio = clamped / barWidth
      const raw = minNum + ratio * (maxNum - minNum)
      return Math.floor(raw)
    },
    handleShowTip (btnElem: HTMLDivElement) {
      const $xeSlider = this
      const props = $xeSlider
      const internalData = $xeSlider.internalData

      const { showTooltip } = props
      if (showTooltip) {
        if (VxeUI.tooltip) {
          const { currValue } = internalData
          const tooltipOpts = $xeSlider.computeTooltipOpts
          const { contentMethod } = tooltipOpts
          const content = getText(contentMethod
            ? contentMethod({
              $slider: $xeSlider,
              value: currValue
            })
            : '' + currValue)
          if (content) {
            VxeUI.tooltip.open(btnElem, Object.assign({}, {
              ...tooltipOpts,
              content
            }, {
              contentMethod: undefined
            }))
          } else {
            VxeUI.tooltip.close()
          }
        }
      }
    },
    handleHideTip () {
      const $xeSlider = this
      const props = $xeSlider

      const { showTooltip } = props
      if (showTooltip) {
        if (VxeUI.tooltip) {
          VxeUI.tooltip.close()
        }
      }
    },
    handleBtnMousedownEvent (evnt: MouseEvent) {
      const $xeSlider = this
      const props = $xeSlider
      const internalData = $xeSlider.internalData

      const { range, immediate } = props
      const btnElem = evnt.currentTarget as HTMLDivElement
      const formReadonly = $xeSlider.computeFormReadonly
      const isDisabled = $xeSlider.computeIsDisabled
      if (!(formReadonly || isDisabled)) {
        evnt.preventDefault()
        document.onmousemove = evnt => {
          evnt.preventDefault()
          const el = $xeSlider.$refs.refElem as HTMLDivElement
          const barElem = $xeSlider.$refs.refBarElem as HTMLDivElement
          if (el && barElem) {
            const btnType = btnElem.getAttribute('data-type')
            const barRect = barElem.getBoundingClientRect()
            const barWidth = barRect.width
            const offsetLeft = Math.min(barWidth, Math.max(0, evnt.clientX - barRect.left))
            const currValue = $xeSlider.getValueByLeft(offsetLeft, barWidth)
            if (range) {
              if (btnType === '1') {
                internalData.startValue = currValue
              } else {
                internalData.endValue = currValue
              }
            }
            internalData.currValue = currValue
            btnElem.style.left = $xeSlider.getBarPercent(currValue) + '%'
            $xeSlider.dispatchEvent('track-dragover', {
              currentValue: internalData.currValue,
              startValue: internalData.startValue,
              endValue: internalData.endValue
            }, evnt)
          }
          if (immediate) {
            $xeSlider.changeEvent(evnt)
          }
          $xeSlider.updateTrackStyle()
          $xeSlider.handleShowTip(btnElem)
        }
        document.onmouseup = (evnt: MouseEvent) => {
          document.onmousemove = null
          document.onmouseup = null
          internalData.isDragStatus = false
          $xeSlider.dispatchEvent('track-dragend', {
            currentValue: internalData.currValue,
            startValue: internalData.startValue,
            endValue: internalData.endValue
          }, evnt)
          $xeSlider.changeEvent(evnt)
          $xeSlider.updateTrackStyle()
          if (!internalData.isBtnActive) {
            $xeSlider.handleHideTip()
          }
        }
        $xeSlider.dispatchEvent('track-dragstart', {
          currentValue: internalData.currValue,
          startValue: internalData.startValue,
          endValue: internalData.endValue
        }, evnt)
        internalData.isDragStatus = false
      }
    },
    handleBtnMouseenterEvent (evnt: MouseEvent) {
      const $xeSlider = this
      const internalData = $xeSlider.internalData

      const { startValue, endValue } = internalData
      const btnElem = evnt.currentTarget as HTMLDivElement
      const btnType = btnElem.getAttribute('data-type')
      internalData.currValue = btnType === '1' ? startValue : endValue
      internalData.isBtnActive = true
      $xeSlider.handleShowTip(btnElem)
    },
    handleBtnMouseleaveEvent () {
      const $xeSlider = this
      const internalData = $xeSlider.internalData

      const { isDragStatus } = internalData
      internalData.isBtnActive = false
      if (!isDragStatus) {
        $xeSlider.handleHideTip()
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeSlider = this
      const props = $xeSlider

      const { status, vertical, range } = props
      const vSize = $xeSlider.computeSize
      const formReadonly = $xeSlider.computeFormReadonly
      const isDisabled = $xeSlider.computeIsDisabled
      return h('div', {
        ref: 'refElem',
        class: ['vxe-slider', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--vertical': vertical,
          'is--readonly': formReadonly,
          'is--disabled': isDisabled
        }]
      }, [
        h('div', {
          class: 'vxe-slider--inner'
        }, [
          h('div', {
            ref: 'refBarElem',
            class: 'vxe-slider--bar-wrapper'
          }),
          h('div', {
            ref: 'refTrackElem',
            class: 'vxe-slider--bar-track'
          }),
          formReadonly || !range
            ? renderEmptyElement($xeSlider)
            : h('div', {
              ref: 'refStartBtnElem',
              class: 'vxe-slider--bar-btn',
              attrs: {
                'data-type': '1'
              },
              on: {
                mouseenter: $xeSlider.handleBtnMouseenterEvent,
                mouseleave: $xeSlider.handleBtnMouseleaveEvent,
                mousedown: $xeSlider.handleBtnMousedownEvent
              }
            }),
          formReadonly
            ? renderEmptyElement($xeSlider)
            : h('div', {
              ref: 'refEndBtnElem',
              class: 'vxe-slider--bar-btn',
              attrs: {
                'data-type': '2'
              },
              on: {
                mouseenter: $xeSlider.handleBtnMouseenterEvent,
                mouseleave: $xeSlider.handleBtnMouseleaveEvent,
                mousedown: $xeSlider.handleBtnMousedownEvent
              }
            })
        ])
      ])
    }
  },
  watch: {
    value () {
      const $xeSlider = this
      const internalData = $xeSlider.internalData

      if (!internalData._isUp) {
        $xeSlider.updateModelValue(1)
      }
      internalData._isUp = false
    },
    computeMVal () {
      const $xeSlider = this
      const internalData = $xeSlider.internalData

      if (!internalData._isUp) {
        $xeSlider.updateModelValue(2)
      }
      internalData._isUp = false
    }
  },
  created () {
    const $xeSlider = this

    $xeSlider.internalData = createInternalData()

    $xeSlider.updateModelValue()
  },
  mounted () {
    const $xeSlider = this

    $xeSlider.updateBarStyle()
    $xeSlider.updateTrackStyle()
  },
  beforeDestroy () {
    const $xeSlider = this
    const reactData = $xeSlider.reactData
    const internalData = $xeSlider.internalData

    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
