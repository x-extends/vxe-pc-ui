import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, renderEmptyElement } from '../../ui'

import type { SliderReactData, VxeSliderEmits, ValueOf, VxeSliderPropTypes, VxeFormDefines, VxeComponentSizeType, VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeSlider',
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Array] as PropType<VxeSliderPropTypes.ModelValue>,
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
    }
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
    const reactData: SliderReactData = {
      startValue: 0,
      endValue: 0
    }
    return {
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

      const { _events } = $xeSlider as any
      if (_events && _events.modelValue) {
        $xeSlider.$emit('modelValue', value)
      } else {
        $xeSlider.$emit('model-value', value)
      }
    },
    getStartPercent (startValue: number) {
      const $xeSlider = this
      const props = $xeSlider

      const { range } = props
      const maxNum = $xeSlider.computeMaxNum
      const minNum = $xeSlider.computeMinNum
      return range ? XEUtils.floor((startValue - minNum) / XEUtils.toNumber(maxNum - minNum) * 100) : 0
    },
    getEndPercent (startValue: number, endValue: number) {
      const $xeSlider = this
      const props = $xeSlider

      const { range } = props
      const maxNum = $xeSlider.computeMaxNum
      const minNum = $xeSlider.computeMinNum
      return XEUtils.floor((endValue - (range ? startValue : 0) - minNum) / XEUtils.toNumber(maxNum - minNum) * 100)
    },
    updateModel () {
      const $xeSlider = this
      const props = $xeSlider
      const reactData = $xeSlider.reactData

      const { value } = props
      if (XEUtils.isArray(value)) {
        const [sVal, eVal] = XEUtils.clone(value, true).sort()
        reactData.startValue = XEUtils.floor(XEUtils.toNumber(sVal || 0))
        reactData.endValue = XEUtils.floor(XEUtils.toNumber(eVal || 0))
      } else {
        reactData.startValue = 0
        reactData.endValue = XEUtils.floor(XEUtils.toNumber(value || 0))
      }
    },
    updateBarStyle () {
      const $xeSlider = this
      const reactData = $xeSlider.reactData

      const { startValue, endValue } = reactData
      const trackElem = $xeSlider.$refs.refTrackElem as HTMLDivElement
      const startBtnElem = $xeSlider.$refs.refStartBtnElem as HTMLDivElement
      const endBtnElem = $xeSlider.$refs.refEndBtnElem as HTMLDivElement
      let startPercent = 0
      let endPercent = 0
      if (startValue > endValue) {
        startPercent = $xeSlider.getStartPercent(endValue)
        endPercent = $xeSlider.getEndPercent(endValue, startValue)
      } else {
        startPercent = $xeSlider.getStartPercent(startValue)
        endPercent = $xeSlider.getEndPercent(startValue, endValue)
      }
      if (trackElem) {
        trackElem.style.left = `${startPercent}%`
        trackElem.style.width = `${endPercent}%`
      }
      if (startBtnElem) {
        startBtnElem.style.left = `${startPercent}%`
      }
      if (endBtnElem) {
        endBtnElem.style.left = `${XEUtils.floor(startPercent + endPercent)}%`
      }
    },
    changeEvent (evnt: MouseEvent) {
      const $xeSlider = this
      const props = $xeSlider
      const reactData = $xeSlider.reactData
      const $xeForm = $xeSlider.$xeForm
      const formItemInfo = $xeSlider.formItemInfo

      const { range } = props
      const { startValue, endValue } = reactData
      const value = range ? [startValue, endValue].sort() : endValue
      $xeSlider.emitModel(value)
      $xeSlider.dispatchEvent('change', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    },
    handleMousedownEvent (evnt: MouseEvent, isEnd: boolean) {
      const $xeSlider = this
      const reactData = $xeSlider.reactData

      const formReadonly = $xeSlider.computeFormReadonly
      const isDisabled = $xeSlider.computeIsDisabled
      const maxNum = $xeSlider.computeMaxNum
      const minNum = $xeSlider.computeMinNum
      if (!(formReadonly || isDisabled)) {
        evnt.preventDefault()
        document.onmousemove = evnt => {
          evnt.preventDefault()
          const barElem = $xeSlider.$refs.refBarElem as HTMLDivElement
          if (barElem) {
            const barRect = barElem.getBoundingClientRect()
            const trackWidth = (evnt.clientX - barRect.left) / barRect.width
            if (isEnd) {
              reactData.endValue = XEUtils.floor(Math.max(minNum, Math.min(maxNum, trackWidth * (maxNum - minNum) + minNum)))
            } else {
              reactData.startValue = XEUtils.floor(Math.max(minNum, Math.min(maxNum, trackWidth * (maxNum - minNum))))
            }
            $xeSlider.dispatchEvent('track-dragover', { startValue: reactData.startValue, endValue: reactData.endValue }, evnt)
          }
          $xeSlider.updateBarStyle()
        }
        document.onmouseup = (evnt: MouseEvent) => {
          document.onmousemove = null
          document.onmouseup = null
          $xeSlider.dispatchEvent('track-dragend', { startValue: reactData.startValue, endValue: reactData.endValue }, evnt)
          $xeSlider.changeEvent(evnt)
          $xeSlider.updateBarStyle()
        }
        $xeSlider.dispatchEvent('track-dragstart', { startValue: reactData.startValue, endValue: reactData.endValue }, evnt)
      }
    },
    handleStartMousedownEvent (evnt: MouseEvent) {
      const $xeSlider = this

      const endBtnElem = $xeSlider.$refs.refEndBtnElem as HTMLDivElement
      const startBtnElem = evnt.currentTarget as HTMLDivElement
      $xeSlider.handleMousedownEvent(evnt, endBtnElem ? endBtnElem.offsetLeft < startBtnElem.offsetLeft : false)
    },
    handleEndMousedownEvent (evnt: MouseEvent) {
      const $xeSlider = this

      const startBtnElem = $xeSlider.$refs.refStartBtnElem as HTMLDivElement
      const endBtnElem = evnt.currentTarget as HTMLDivElement
      $xeSlider.handleMousedownEvent(evnt, startBtnElem ? endBtnElem.offsetLeft > startBtnElem.offsetLeft : true)
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeSlider = this
      const props = $xeSlider

      const { vertical, range } = props
      const vSize = $xeSlider.computeSize
      const formReadonly = $xeSlider.computeFormReadonly
      const isDisabled = $xeSlider.computeIsDisabled
      return h('div', {
        ref: 'refElem',
        class: ['vxe-slider', {
          [`size--${vSize}`]: vSize,
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
              class: 'vxe-slider--bar-btn vxe-slider--start-btn',
              on: {
                mousedown: $xeSlider.handleStartMousedownEvent
              }
            }),
          formReadonly
            ? renderEmptyElement($xeSlider)
            : h('div', {
              ref: 'refEndBtnElem',
              class: 'vxe-slider--bar-btn vxe-slider--end-btn',
              on: {
                mousedown: $xeSlider.handleEndMousedownEvent
              }
            })
        ])
      ])
    }
  },
  watch: {
    value () {
      const $xeSlider = this

      $xeSlider.updateModel()
    }
  },
  created () {
    const $xeSlider = this

    $xeSlider.updateModel()
  },
  mounted () {
    const $xeSlider = this

    $xeSlider.updateBarStyle()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
