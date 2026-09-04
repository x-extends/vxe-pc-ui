import { ref, h, reactive, PropType, watch, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, createEvent, renderEmptyElement, useSize } from '../../ui'
import { getText } from '../../ui/src/utils'

import type { SliderReactData, SliderInternalData, VxeSliderEmits, VxeSliderPropTypes, SliderMethods, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, SliderPrivateMethods, ValueOf, SliderPrivateRef, VxeSliderPrivateComputed, VxeSliderConstructor, VxeSliderPrivateMethods } from '../../../types'

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

export default defineVxeComponent({
  name: 'VxeSlider',
  props: {
    modelValue: [String, Number, Array] as PropType<VxeSliderPropTypes.ModelValue>,
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
  emits: [
    'update:modelValue',
    'update:startValue',
    'update:endValue',
    'change',
    'track-dragstart',
    'track-dragover',
    'track-dragend'
  ] as VxeSliderEmits,
  setup (props, context) {
    const { emit } = context

    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()
    const refBarElem = ref<HTMLDivElement>()
    const refTrackElem = ref<HTMLDivElement>()
    const refStartBtnElem = ref<HTMLDivElement>()
    const refEndBtnElem = ref<HTMLDivElement>()

    const reactData = reactive(createReactData())
    const internalData = createInternalData()

    const refMaps: SliderPrivateRef = {
      refElem
    }

    const computeFormReadonly = computed(() => {
      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.props.readonly
        }
        return false
      }
      return readonly
    })

    const computeIsDisabled = computed(() => {
      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.props.disabled
        }
        return false
      }
      return disabled
    })

    const computeMaxNum = computed(() => {
      return XEUtils.toNumber(props.max || 0)
    })

    const computeMinNum = computed(() => {
      return XEUtils.toNumber(props.min || 0)
    })

    const computeMVal = computed(() => {
      const { range, startValue, endValue } = props
      return range ? `${startValue || ''}${endValue || ''}` : ''
    })

    const computeTooltipOpts = computed(() => {
      return Object.assign({}, getConfig().slider.tooltipConfig, props.tooltipConfig)
    })

    const computeMaps: VxeSliderPrivateComputed = {
    }

    const $xeSlider = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeSliderConstructor & VxeSliderPrivateMethods

    const emitModel = (value: any) => {
      internalData._isUp = true
      emit('update:modelValue', value)
    }

    const dispatchEvent = (type: ValueOf<VxeSliderEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $slider: $xeSlider }, params))
    }

    const collapsePaneMethods: SliderMethods = {
      dispatchEvent
    }

    const getBarPercent = (currValue: number) => {
      const maxNum = computeMaxNum.value
      const minNum = computeMinNum.value
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
    }

    const parseFields = (startValue?: VxeSliderPropTypes.StartValue, endValue?: VxeSliderPropTypes.EndValue) => {
      const [sVal, eVal] = XEUtils.orderBy([XEUtils.toNumber(startValue), XEUtils.toNumber(endValue)])
      const currValue = XEUtils.floor(XEUtils.toNumber(sVal || 0))
      internalData.currValue = currValue
      internalData.startValue = currValue
      internalData.endValue = XEUtils.floor(XEUtils.toNumber(eVal || 0))
    }

    const parseArrs = (arrVals: number[]) => {
      const [sVal, eVal] = XEUtils.orderBy(arrVals)
      const currValue = XEUtils.floor(XEUtils.toNumber(sVal || 0))
      internalData.currValue = currValue
      internalData.startValue = currValue
      internalData.endValue = XEUtils.floor(XEUtils.toNumber(eVal || 0))
    }

    const parseNum = (val: VxeSliderPropTypes.ModelValue | undefined) => {
      const currValue = XEUtils.floor(XEUtils.toNumber(val || 0))
      internalData.currValue = currValue
      internalData.startValue = 0
      internalData.endValue = currValue
    }

    const updateModelValue = (umType?: 1 | 2) => {
      const { range, modelValue, startValue, endValue } = props
      if (!umType) {
        if (range) {
          if (XEUtils.eqNull(modelValue)) {
            if (startValue || endValue) {
              parseFields(startValue, endValue)
            }
          } else {
            if (XEUtils.isArray(modelValue)) {
              parseArrs(modelValue.map(num => XEUtils.toNumber(num)))
            } else {
              parseNum(modelValue)
            }
          }
        } else {
          parseNum(modelValue)
        }
      } else if (range && umType === 2) {
        parseFields(startValue, endValue)
      } else {
        if (XEUtils.isArray(modelValue)) {
          parseArrs(modelValue.map(num => XEUtils.toNumber(num)))
        } else {
          parseNum(modelValue)
        }
      }
      updateBarStyle()
      updateTrackStyle()
    }

    const updateBarStyle = () => {
      const { range } = props
      const { currValue, startValue, endValue } = internalData
      const startBtnElem = refStartBtnElem.value
      const endBtnElem = refEndBtnElem.value
      if (range) {
        const [sVal, eVal] = XEUtils.orderBy([startValue, endValue])
        if (startBtnElem) {
          startBtnElem.style.left = getBarPercent(sVal) + '%'
        }
        if (endBtnElem) {
          endBtnElem.style.left = getBarPercent(eVal) + '%'
        }
      } else {
        if (endBtnElem) {
          endBtnElem.style.left = getBarPercent(currValue) + '%'
        }
      }
    }

    const updateTrackStyle = () => {
      const { range } = props
      const { currValue, startValue, endValue } = internalData
      const trackElem = refTrackElem.value
      if (trackElem) {
        if (range) {
          const [sVal, eVal] = XEUtils.orderBy([startValue, endValue])
          trackElem.style.left = getBarPercent(sVal) + '%'
          trackElem.style.width = getBarPercent(eVal - sVal) + '%'
        } else {
          trackElem.style.left = '0'
          trackElem.style.width = getBarPercent(currValue) + '%'
        }
      }
    }

    const changeEvent = (evnt: MouseEvent) => {
      const { range } = props
      const { currValue, startValue, endValue } = internalData
      const vals = range ? XEUtils.orderBy([startValue, endValue]) : []
      const value = range ? vals : currValue
      emitModel(value)
      if (range) {
        emit('update:startValue', vals[0] || 0)
        emit('update:endValue', vals[1] || 0)
      }
      dispatchEvent('change', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    }

    const getValueByLeft = (offsetLeft: number, barWidth: number) => {
      const maxNum = computeMaxNum.value
      const minNum = computeMinNum.value
      if (barWidth === 0) {
        return minNum
      }
      const clamped = Math.max(0, Math.min(barWidth, offsetLeft))
      const ratio = clamped / barWidth
      const raw = minNum + ratio * (maxNum - minNum)
      return Math.floor(raw)
    }

    const handleShowTip = (btnElem: HTMLDivElement) => {
      const { showTooltip } = props
      if (showTooltip) {
        if (VxeUI.tooltip) {
          const { currValue } = internalData
          const tooltipOpts = computeTooltipOpts.value
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
    }

    const handleHideTip = () => {
      const { showTooltip } = props
      if (showTooltip) {
        if (VxeUI.tooltip) {
          VxeUI.tooltip.close()
        }
      }
    }

    const handleBtnMousedownEvent = (evnt: MouseEvent) => {
      const { range, immediate } = props
      const btnElem = evnt.currentTarget as HTMLDivElement
      const formReadonly = computeFormReadonly.value
      const isDisabled = computeIsDisabled.value
      if (!(formReadonly || isDisabled)) {
        evnt.preventDefault()
        document.onmousemove = evnt => {
          evnt.preventDefault()
          const el = refElem.value
          const barElem = refBarElem.value
          internalData.isDragStatus = true
          if (el && barElem) {
            const btnType = btnElem.getAttribute('data-type')
            const barRect = barElem.getBoundingClientRect()
            const barWidth = barRect.width
            const offsetLeft = Math.min(barWidth, Math.max(0, evnt.clientX - barRect.left))
            const currValue = getValueByLeft(offsetLeft, barWidth)
            if (range) {
              if (btnType === '1') {
                internalData.startValue = currValue
              } else {
                internalData.endValue = currValue
              }
            }
            internalData.currValue = currValue
            btnElem.style.left = getBarPercent(currValue) + '%'
            dispatchEvent('track-dragover', {
              currentValue: internalData.currValue,
              startValue: internalData.startValue,
              endValue: internalData.endValue
            }, evnt)
          }
          if (immediate) {
            changeEvent(evnt)
          }
          updateTrackStyle()
          handleShowTip(btnElem)
        }
        document.onmouseup = (evnt: MouseEvent) => {
          document.onmousemove = null
          document.onmouseup = null
          internalData.isDragStatus = false
          dispatchEvent('track-dragend', {
            currentValue: internalData.currValue,
            startValue: internalData.startValue,
            endValue: internalData.endValue
          }, evnt)
          changeEvent(evnt)
          updateTrackStyle()
          if (!internalData.isBtnActive) {
            handleHideTip()
          }
        }
        dispatchEvent('track-dragstart', {
          currentValue: internalData.currValue,
          startValue: internalData.startValue,
          endValue: internalData.endValue
        }, evnt)
        internalData.isDragStatus = false
      }
    }

    const handleBtnMouseenterEvent = (evnt: MouseEvent) => {
      const { startValue, endValue } = internalData
      const btnElem = evnt.currentTarget as HTMLDivElement
      const btnType = btnElem.getAttribute('data-type')
      internalData.currValue = btnType === '1' ? startValue : endValue
      internalData.isBtnActive = true
      handleShowTip(btnElem)
    }

    const handleBtnMouseleaveEvent = () => {
      const { isDragStatus } = internalData
      internalData.isBtnActive = false
      if (!isDragStatus) {
        handleHideTip()
      }
    }

    const collapsePanePrivateMethods: SliderPrivateMethods = {
    }

    Object.assign($xeSlider, collapsePaneMethods, collapsePanePrivateMethods)

    const renderVN = () => {
      const { status, vertical, range } = props
      const vSize = computeSize.value
      const formReadonly = computeFormReadonly.value
      const isDisabled = computeIsDisabled.value
      return h('div', {
        ref: refElem,
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
            ref: refBarElem,
            class: 'vxe-slider--bar-wrapper'
          }),
          h('div', {
            ref: refTrackElem,
            class: 'vxe-slider--bar-track'
          }),
          formReadonly || !range
            ? renderEmptyElement($xeSlider)
            : h('div', {
              ref: refStartBtnElem,
              class: 'vxe-slider--bar-btn',
              'data-type': '1',
              onMouseenter: handleBtnMouseenterEvent,
              onMouseleave: handleBtnMouseleaveEvent,
              onMousedown: handleBtnMousedownEvent
            }),
          formReadonly
            ? renderEmptyElement($xeSlider)
            : h('div', {
              ref: refEndBtnElem,
              class: 'vxe-slider--bar-btn',
              'data-type': '2',
              onMouseenter: handleBtnMouseenterEvent,
              onMouseleave: handleBtnMouseleaveEvent,
              onMousedown: handleBtnMousedownEvent
            })
        ])
      ])
    }

    watch(() => props.modelValue, () => {
      if (!internalData._isUp) {
        updateModelValue(1)
      }
      internalData._isUp = false
    })

    watch(computeMVal, () => {
      if (!internalData._isUp) {
        updateModelValue(2)
      }
      internalData._isUp = false
    })

    onMounted(() => {
      updateModelValue()
    })

    onBeforeUnmount(() => {
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    $xeSlider.renderVN = renderVN

    return $xeSlider
  },
  render () {
    return this.renderVN()
  }
})
