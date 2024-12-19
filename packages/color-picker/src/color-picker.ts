import { defineComponent, watch, computed, provide, ref, inject, Teleport, h, nextTick, PropType, reactive, onMounted, onUnmounted } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, globalEvents, createEvent, useSize, renderEmptyElement } from '../../ui'
import { getEventTargetNode, getAbsolutePos } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'

import type { ColorPickerReactData, VxeColorPickerPropTypes, VxeColorPickerEmits, ColorPickerInternalData, ColorPickerMethods, ColorPickerPrivateMethods, ValueOf, ColorPickerPrivateRef, VxeColorPickerPrivateComputed, VxeColorPickerConstructor, VxeColorPickerPrivateMethods, VxeModalConstructor, VxeModalMethods, VxeDrawerConstructor, VxeDrawerMethods, VxeTableConstructor, VxeTablePrivateMethods, VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeColorPicker',
  props: {
    modelValue: String as PropType<VxeColorPickerPropTypes.ModelValue>,
    placeholder: String as PropType<VxeColorPickerPropTypes.Placeholder>,
    clearable: Boolean as PropType<VxeColorPickerPropTypes.Clearable>,
    size: {
      type: String as PropType<VxeColorPickerPropTypes.Size>,
      default: () => getConfig().colorPicker.size || getConfig().size
    },
    className: [String, Function] as PropType<VxeColorPickerPropTypes.ClassName>,
    popupClassName: [String, Function] as PropType<VxeColorPickerPropTypes.PopupClassName>,
    readonly: {
      type: Boolean as PropType<VxeColorPickerPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeColorPickerPropTypes.Disabled>,
      default: null
    },
    placement: String as PropType<VxeColorPickerPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeColorPickerPropTypes.Transfer>,
      default: null
    }
  },
  emits: [
    'update:modelValue',
    'change',
    'clear',
    'click'
  ] as VxeColorPickerEmits,
  setup (props, context) {
    const { emit } = context

    const $xeModal = inject<(VxeModalConstructor & VxeModalMethods) | null>('$xeModal', null)
    const $xeDrawer = inject<(VxeDrawerConstructor & VxeDrawerMethods) | null>('$xeDrawer', null)
    const $xeTable = inject<(VxeTableConstructor & VxeTablePrivateMethods) | null>('$xeTable', null)
    const $xeForm = inject<(VxeFormConstructor & VxeFormPrivateMethods) | null>('$xeForm', null)
    // const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()
    const refOptionPanel = ref<HTMLDivElement>()

    const reactData = reactive<ColorPickerReactData>({
      initialized: false,
      selectColor: `${props.modelValue || ''}`,
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    })

    const internalData: ColorPickerInternalData = {
      // hpTimeout: undefined
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

    const computeBtnTransfer = computed(() => {
      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().iconPicker.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    })

    const refMaps: ColorPickerPrivateRef = {
      refElem
    }

    const computeMaps: VxeColorPickerPrivateComputed = {
    }

    const $xeColorPicker = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeColorPickerConstructor & VxeColorPickerPrivateMethods

    const updateZindex = () => {
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      return nextTick().then(() => {
        const { placement } = props
        const { panelIndex } = reactData
        const el = refElem.value
        const panelElem = refOptionPanel.value
        const btnTransfer = computeBtnTransfer.value
        if (panelElem && el) {
          const targetHeight = el.offsetHeight
          const targetWidth = el.offsetWidth
          const panelHeight = panelElem.offsetHeight
          const panelWidth = panelElem.offsetWidth
          const marginSize = 5
          const panelStyle: { [key: string]: any } = {
            zIndex: panelIndex
          }
          const { boundingTop, boundingLeft, visibleHeight, visibleWidth } = getAbsolutePos(el)
          let panelPlacement = 'bottom'
          if (btnTransfer) {
            let left = boundingLeft
            let top = boundingTop + targetHeight
            if (placement === 'top') {
              panelPlacement = 'top'
              top = boundingTop - panelHeight
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (top + panelHeight + marginSize > visibleHeight) {
                panelPlacement = 'top'
                top = boundingTop - panelHeight
              }
              // 如果上面不够放，则向下（优先）
              if (top < marginSize) {
                panelPlacement = 'bottom'
                top = boundingTop + targetHeight
              }
            }
            // 如果溢出右边
            if (left + panelWidth + marginSize > visibleWidth) {
              left -= left + panelWidth + marginSize - visibleWidth
            }
            // 如果溢出左边
            if (left < marginSize) {
              left = marginSize
            }
            Object.assign(panelStyle, {
              left: `${left}px`,
              top: `${top}px`,
              minWidth: `${targetWidth}px`
            })
          } else {
            if (placement === 'top') {
              panelPlacement = 'top'
              panelStyle.bottom = `${targetHeight}px`
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (boundingTop + targetHeight + panelHeight > visibleHeight) {
                // 如果上面不够放，则向下（优先）
                if (boundingTop - targetHeight - panelHeight > marginSize) {
                  panelPlacement = 'top'
                  panelStyle.bottom = `${targetHeight}px`
                }
              }
            }
          }
          reactData.panelStyle = panelStyle
          reactData.panelPlacement = panelPlacement
          return nextTick()
        }
      })
    }

    const showOptionPanel = () => {
      const { hpTimeout } = internalData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (hpTimeout) {
          clearTimeout(hpTimeout)
          internalData.hpTimeout = undefined
        }
        if (!reactData.initialized) {
          reactData.initialized = true
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        setTimeout(() => {
          reactData.visiblePanel = true
        }, 10)
        updateZindex()
        updatePlacement()
      }
    }

    const hideOptionPanel = () => {
      reactData.visiblePanel = false
      internalData.hpTimeout = window.setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    }

    // const changeEvent = (evnt: Event, selectValue: any) => {
    //   reactData.selectColor = selectValue
    //   if (selectValue !== props.modelValue) {
    //     emit('update:modelValue', selectValue)
    //     dispatchEvent('change', { value: selectValue }, evnt)
    //     // 自动更新校验状态
    //     if ($xeForm && formItemInfo) {
    //       $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, selectValue)
    //     }
    //   }
    // }

    // const focusEvent = () => {
    //   const isDisabled = computeIsDisabled.value
    //   if (!isDisabled) {
    //     if (!reactData.visiblePanel) {
    //       showOptionPanel()
    //     }
    //   }
    // }

    // const blurEvent = () => {
    //   reactData.isActivated = false
    // }

    // const clearValueEvent = (evnt: Event, selectValue: any) => {
    //   changeEvent(evnt, selectValue)
    //   dispatchEvent('clear', { value: selectValue }, evnt)
    // }

    // const clearEvent = (params: any, evnt: Event) => {
    //   clearValueEvent(evnt, null)
    //   hideOptionPanel()
    // }

    const togglePanelEvent = (evnt: MouseEvent) => {
      evnt.preventDefault()
      if (reactData.visiblePanel) {
        hideOptionPanel()
      } else {
        showOptionPanel()
      }
    }

    const clickEvent = (evnt: MouseEvent) => {
      togglePanelEvent(evnt)
      dispatchEvent('click', {}, evnt)
    }

    const handleGlobalMousewheelEvent = (evnt: MouseEvent) => {
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = refOptionPanel.value
          if (getEventTargetNode(evnt, panelElem).flag) {
            updatePlacement()
          } else {
            hideOptionPanel()
          }
        }
      }
    }

    const handleGlobalMousedownEvent = (evnt: MouseEvent) => {
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const el = refElem.value
        const panelElem = refOptionPanel.value
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          hideOptionPanel()
        }
      }
    }

    const handleGlobalBlurEvent = () => {
      hideOptionPanel()
    }

    const dispatchEvent = (type: ValueOf<VxeColorPickerEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $colorPicker: $xeColorPicker }, params))
    }

    const colorPickerMethods: ColorPickerMethods = {
      dispatchEvent
    }

    const colorPickerPrivateMethods: ColorPickerPrivateMethods = {
    }

    Object.assign($xeColorPicker, colorPickerMethods, colorPickerPrivateMethods)

    const renderColorWrapper = () => {
      return h('div', {}, [
        h('div', {
          class: 'vxe-color-picker--view-wrapper'
        }),
        h('div', {
          class: 'vxe-color-picker--convenient-wrapper'
        }),
        h('div', {
          class: ''
        })
      ])
    }

    const renderVN = () => {
      const { className, popupClassName, clearable } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, selectColor } = reactData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const btnTransfer = computeBtnTransfer.value
      const formReadonly = computeFormReadonly.value

      if (formReadonly) {
        return h('div', {
          ref: refElem,
          class: ['vxe-color-picker--readonly', className]
        }, 'x')
      }
      return h('div', {
        ref: refElem,
        class: ['vxe-color-picker', className ? (XEUtils.isFunction(className) ? className({ $colorPicker: $xeColorPicker }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'show--clear': clearable && !isDisabled && !!selectColor,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--active': isActivated
        }]
      }, [
        h('div', {
          class: 'vxe-ico-picker--inner',
          onClick: clickEvent
        }, 'x'),
        h(Teleport, {
          to: 'body',
          disabled: btnTransfer ? !initialized : true
        }, [
          h('div', {
            ref: refOptionPanel,
            class: ['vxe-table--ignore-clear vxe-color-picker--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $colorPicker: $xeColorPicker }) : popupClassName) : '', {
              [`size--${vSize}`]: vSize,
              'is--transfer': btnTransfer,
              'ani--leave': isAniVisible,
              'ani--enter': visiblePanel
            }],
            placement: reactData.panelPlacement,
            style: reactData.panelStyle
          }, [
            initialized && (visiblePanel || isAniVisible)
              ? h('div', {
                class: 'vxe-color-picker--panel-wrapper'
              }, [
                renderColorWrapper()
              ])
              : renderEmptyElement($xeColorPicker)
          ])
        ])
      ])
    }

    watch(() => props.modelValue, (val) => {
      reactData.selectColor = `${val || ''}`
    })

    onMounted(() => {
      globalEvents.on($xeColorPicker, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeColorPicker, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeColorPicker, 'blur', handleGlobalBlurEvent)
    })

    onUnmounted(() => {
      globalEvents.off($xeColorPicker, 'mousewheel')
      globalEvents.off($xeColorPicker, 'mousedown')
      globalEvents.off($xeColorPicker, 'blur')
    })

    provide('$xeColorPicker', $xeColorPicker)

    $xeColorPicker.renderVN = renderVN

    return $xeColorPicker
  },
  render () {
    return this.renderVN()
  }
})
