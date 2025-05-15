import { defineComponent, h, Teleport, PropType, ref, inject, watch, computed, provide, onUnmounted, reactive, nextTick, onMounted } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, createEvent, useSize, GLOBAL_EVENT_KEYS, renderEmptyElement } from '../../ui'
import { getEventTargetNode, getAbsolutePos } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, getFuncText } from '../../ui/src/utils'

import type { VxeIconPickerPropTypes, VxeIconPickerConstructor, IconPickerInternalData, ValueOf, IconPickerReactData, VxeIconPickerEmits, IconPickerMethods, IconPickerPrivateRef, VxeIconPickerMethods, VxeIconPickerDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

export default defineComponent({
  name: 'VxeIconPicker',
  props: {
    modelValue: String as PropType<VxeIconPickerPropTypes.ModelValue>,
    placeholder: String as PropType<VxeIconPickerPropTypes.Placeholder>,
    clearable: Boolean as PropType<VxeIconPickerPropTypes.Clearable>,
    size: {
      type: String as PropType<VxeIconPickerPropTypes.Size>,
      default: () => getConfig().iconPicker.size || getConfig().size
    },
    className: [String, Function] as PropType<VxeIconPickerPropTypes.ClassName>,
    popupClassName: [String, Function] as PropType<VxeIconPickerPropTypes.PopupClassName>,
    showIconTitle: {
      type: Boolean as PropType<VxeIconPickerPropTypes.ShowIconTitle>,
      default: () => getConfig().iconPicker.showIconTitle
    },
    readonly: {
      type: Boolean as PropType<VxeIconPickerPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeIconPickerPropTypes.Disabled>,
      default: null
    },
    icons: Array as PropType<VxeIconPickerPropTypes.Icons>,
    placement: String as PropType<VxeIconPickerPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeIconPickerPropTypes.Transfer>,
      default: null
    }
  },
  emits: [
    'update:modelValue',
    'change',
    'clear',
    'click'
  ] as VxeIconPickerEmits,
  setup (props, context) {
    const { emit } = context

    const $xeModal = inject<(VxeModalConstructor & VxeModalMethods) | null>('$xeModal', null)
    const $xeDrawer = inject<(VxeDrawerConstructor & VxeDrawerMethods) | null>('$xeDrawer', null)
    const $xeTable = inject<(VxeTableConstructor & VxeTablePrivateMethods) | null>('$xeTable', null)
    const $xeForm = inject<(VxeFormConstructor & VxeFormPrivateMethods) | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive<IconPickerReactData>({
      initialized: false,
      selectIcon: `${props.modelValue || ''}`,
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    })

    const internalData: IconPickerInternalData = {
      // hpTimeout: undefined
    }

    const refElem = ref<HTMLDivElement>()
    const refInput = ref<HTMLInputElement>()
    const refOptionPanel = ref<HTMLDivElement>()

    const refMaps: IconPickerPrivateRef = {
      refElem
    }

    const $xeIconPicker = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps
    } as unknown as VxeIconPickerConstructor & VxeIconPickerMethods

    let iconPickerMethods = {} as IconPickerMethods

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

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().select.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseSelect')
    })

    const computeIconList = computed<VxeIconPickerDefines.IconItemObj[]>(() => {
      let { icons } = props
      if (!icons || !icons.length) {
        icons = getConfig().iconPicker.icons || []
      }
      return icons.map(item => {
        if (XEUtils.isString(item)) {
          return {
            title: item,
            icon: `vxe-icon-${`${item || ''}`.replace(/^vxe-icon-/, '')}`
          }
        }
        return {
          title: `${item.title || ''}`,
          icon: item.icon || ''
        }
      })
    })

    const computeIconGroupList = computed(() => {
      const iconList = computeIconList.value
      return XEUtils.chunk(iconList, 4)
    })

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
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    }

    const changeEvent = (evnt: Event, selectValue: any) => {
      reactData.selectIcon = selectValue
      if (selectValue !== props.modelValue) {
        emit('update:modelValue', selectValue)
        dispatchEvent('change', { value: selectValue }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, selectValue)
        }
      }
    }

    const focusEvent = () => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          showOptionPanel()
        }
      }
    }

    const blurEvent = () => {
      reactData.isActivated = false
    }

    const clearValueEvent = (evnt: Event, selectValue: any) => {
      changeEvent(evnt, selectValue)
      dispatchEvent('clear', { value: selectValue }, evnt)
    }

    const clearEvent = (params: any, evnt: Event) => {
      clearValueEvent(evnt, null)
      hideOptionPanel()
    }

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

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const { clearable } = props
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const isTab = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.TAB)
        const isEnter = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ENTER)
        const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
        const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
        const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
        const isDel = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.DELETE)
        const isSpacebar = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.SPACEBAR)
        if (isTab) {
          reactData.isActivated = false
        }
        if (visiblePanel) {
          if (isEsc || isTab) {
            hideOptionPanel()
          } else if (isEnter) {
            evnt.preventDefault()
            evnt.stopPropagation()
            // changeOptionEvent(evnt, currentValue, currentOption)
          } else if (isUpArrow || isDwArrow) {
            evnt.preventDefault()
            // let { firstOption, offsetOption } = findOffsetOption(currentValue, isUpArrow)
            // if (!offsetOption && !findVisibleOption(currentValue)) {
            //   offsetOption = firstOption
            // }
            // setCurrentOption(offsetOption)
            // scrollToOption(offsetOption, isDwArrow)
          } else if (isSpacebar) {
            evnt.preventDefault()
          }
        } else if ((isUpArrow || isDwArrow || isEnter || isSpacebar) && reactData.isActivated) {
          evnt.preventDefault()
          showOptionPanel()
        }
        if (reactData.isActivated) {
          if (isDel && clearable) {
            clearValueEvent(evnt, null)
          }
        }
      }
    }

    const handleGlobalBlurEvent = () => {
      hideOptionPanel()
    }

    const dispatchEvent = (type: ValueOf<VxeIconPickerEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $iconPicker: $xeIconPicker }, params))
    }

    iconPickerMethods = {
      dispatchEvent,
      isPanelVisible () {
        return reactData.visiblePanel
      },
      togglePanel () {
        if (reactData.visiblePanel) {
          hideOptionPanel()
        } else {
          showOptionPanel()
        }
        return nextTick()
      },
      hidePanel () {
        if (reactData.visiblePanel) {
          hideOptionPanel()
        }
        return nextTick()
      },
      showPanel () {
        if (!reactData.visiblePanel) {
          showOptionPanel()
        }
        return nextTick()
      },
      focus () {
        const $input = refInput.value
        reactData.isActivated = true
        if ($input) {
          $input.blur()
        }
        return nextTick()
      },
      blur () {
        const $input = refInput.value
        if ($input) {
          $input.blur()
        }
        reactData.isActivated = false
        return nextTick()
      }
    }

    const handleClickIconEvent = (evnt: MouseEvent, item: VxeIconPickerDefines.IconItemObj) => {
      const value = item.icon
      changeEvent(evnt, value)
      hideOptionPanel()
    }

    Object.assign($xeIconPicker, iconPickerMethods)

    const renderIconWrapper = () => {
      const { showIconTitle } = props
      const iconGroupList = computeIconGroupList.value
      const isDisabled = computeIsDisabled.value

      return h('div', {
        class: 'vxe-ico-picker--list-wrapper'
      }, iconGroupList.map(list => {
        return h('div', {
          class: 'vxe-ico-picker--list'
        }, list.map(item => {
          return h('div', {
            class: 'vxe-ico-picker--item',
            onClick (evnt) {
              if (!isDisabled) {
                handleClickIconEvent(evnt, item)
              }
            }
          }, [
            h('div', {
              class: 'vxe-ico-picker--item-icon'
            }, [
              h('i', {
                class: item.icon || ''
              })
            ]),
            showIconTitle
              ? h('div', {
                class: 'vxe-ico-picker--item-title'
              }, `${item.title || ''}`)
              : renderEmptyElement($xeIconPicker)
          ])
        }))
      }))
    }

    const renderVN = () => {
      const { className, popupClassName, clearable } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, selectIcon } = reactData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const btnTransfer = computeBtnTransfer.value
      const formReadonly = computeFormReadonly.value
      const inpPlaceholder = computeInpPlaceholder.value

      if (formReadonly) {
        return h('div', {
          ref: refElem,
          class: ['vxe-ico-picker--readonly', className]
        }, [
          h('i', {
            class: selectIcon
          })
        ])
      }
      return h('div', {
        ref: refElem,
        class: ['vxe-ico-picker', className ? (XEUtils.isFunction(className) ? className({ $iconPicker: $xeIconPicker }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'show--clear': clearable && !isDisabled && !!selectIcon,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--active': isActivated
        }]
      }, [
        h('div', {
          class: 'vxe-ico-picker--inner',
          onClick: clickEvent
        }, [
          h('input', {
            ref: refInput,
            class: 'vxe-ico-picker--input',
            onFocus: focusEvent,
            onBlur: blurEvent
          }),
          selectIcon
            ? h('div', {
              class: 'vxe-ico-picker--icon'
            }, [
              h('i', {
                class: selectIcon
              })
            ])
            : h('div', {
              class: 'vxe-ico-picker--placeholder'
            }, inpPlaceholder),
          h('div', {
            class: 'vxe-ico-picker--suffix'
          }, [
            h('div', {
              class: 'vxe-ico-picker--clear-icon',
              onClick: clearEvent
            }, [
              h('i', {
                class: getIcon().INPUT_CLEAR
              })
            ]),
            h('div', {
              class: 'vxe-ico-picker--suffix-icon'
            }, [
              h('i', {
                class: visiblePanel ? getIcon().ICON_PICKER_OPEN : getIcon().ICON_PICKER_CLOSE
              })
            ])
          ])
        ]),
        h(Teleport, {
          to: 'body',
          disabled: btnTransfer ? !initialized : true
        }, [
          h('div', {
            ref: refOptionPanel,
            class: ['vxe-table--ignore-clear vxe-ico-picker--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $iconPicker: $xeIconPicker }) : popupClassName) : '', {
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
                class: 'vxe-ico-picker--panel-wrapper'
              }, [
                renderIconWrapper()
              ])
              : renderEmptyElement($xeIconPicker)
          ])
        ])
      ])
    }

    watch(() => props.modelValue, (val) => {
      reactData.selectIcon = `${val || ''}`
    })

    onMounted(() => {
      globalEvents.on($xeIconPicker, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeIconPicker, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeIconPicker, 'keydown', handleGlobalKeydownEvent)
      globalEvents.on($xeIconPicker, 'blur', handleGlobalBlurEvent)
    })

    onUnmounted(() => {
      globalEvents.off($xeIconPicker, 'mousewheel')
      globalEvents.off($xeIconPicker, 'mousedown')
      globalEvents.off($xeIconPicker, 'keydown')
      globalEvents.off($xeIconPicker, 'blur')
    })

    provide('$xeIconPicker', $xeIconPicker)

    $xeIconPicker.renderVN = renderVN

    return $xeIconPicker
  },
  render () {
    return this.renderVN()
  }
})
