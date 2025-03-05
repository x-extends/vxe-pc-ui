import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, createEvent, globalMixins, GLOBAL_EVENT_KEYS, renderEmptyElement } from '../../ui'
import { getEventTargetNode, getAbsolutePos } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, getFuncText } from '../../ui/src/utils'

import type { VxeIconPickerPropTypes, IconPickerInternalData, ValueOf, IconPickerReactData, VxeComponentSizeType, VxeIconPickerEmits, VxeIconPickerDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeIconPicker',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: String as PropType<VxeIconPickerPropTypes.ModelValue>,
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
    const $xeIconPicker = this
    return {
      $xeIconPicker
    }
  },
  data () {
    const reactData: IconPickerReactData = {
      initialized: false,
      selectIcon: '',
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    }
    const internalData: IconPickerInternalData = {
      hpTimeout: undefined
    }
    return {
      xID: XEUtils.uniqueId(),
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
      const $xeIconPicker = this
      const props = $xeIconPicker
      const $xeForm = $xeIconPicker.$xeForm

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
      const $xeIconPicker = this
      const props = $xeIconPicker
      const $xeForm = $xeIconPicker.$xeForm

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
      const $xeIconPicker = this
      const props = $xeIconPicker
      const $xeTable = $xeIconPicker.$xeTable
      const $xeModal = $xeIconPicker.$xeModal
      const $xeDrawer = $xeIconPicker.$xeDrawer
      const $xeForm = $xeIconPicker.$xeForm

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
    },
    computeInpPlaceholder () {
      const $xeIconPicker = this
      const props = $xeIconPicker

      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().select.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseSelect')
    },
    computeIconList () {
      const $xeIconPicker = this
      const props = $xeIconPicker

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
    },
    computeIconGroupList () {
      const $xeIconPicker = this

      const iconList = $xeIconPicker.computeIconList as {
        title: string
        icon: string
    }[]
      return XEUtils.chunk(iconList, 4)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeIconPickerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeIconPicker = this
      $xeIconPicker.$emit(type, createEvent(evnt, { $iconPicker: $xeIconPicker }, params))
    },
    emitModel (value: any) {
      const $xeIconPicker = this

      const { _events } = $xeIconPicker as any
      if (_events && _events.modelValue) {
        $xeIconPicker.$emit('modelValue', value)
      } else {
        $xeIconPicker.$emit('model-value', value)
      }
    },
    isPanelVisible () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      return reactData.visiblePanel
    },
    togglePanel () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      if (reactData.visiblePanel) {
        $xeIconPicker.hideOptionPanel()
      } else {
        $xeIconPicker.showOptionPanel()
      }
      return $xeIconPicker.$nextTick()
    },
    hidePanel () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      if (reactData.visiblePanel) {
        $xeIconPicker.hideOptionPanel()
      }
      return $xeIconPicker.$nextTick()
    },
    showPanel () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      if (!reactData.visiblePanel) {
        $xeIconPicker.showOptionPanel()
      }
      return $xeIconPicker.$nextTick()
    },
    focus () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      const $input = $xeIconPicker.$refs.refInput as HTMLInputElement
      reactData.isActivated = true
      $input.blur()
      return $xeIconPicker.$nextTick()
    },
    blur () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      const $input = $xeIconPicker.$refs.refInput as HTMLInputElement
      $input.blur()
      reactData.isActivated = false
      return $xeIconPicker.$nextTick()
    },
    updateZindex  () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement () {
      const $xeIconPicker = this
      const props = $xeIconPicker
      const reactData = $xeIconPicker.reactData

      return $xeIconPicker.$nextTick().then(() => {
        const { placement } = props
        const { panelIndex } = reactData
        const el = $xeIconPicker.$refs.refElem as HTMLElement
        const panelElem = $xeIconPicker.$refs.refOptionPanel as HTMLElement
        const btnTransfer = $xeIconPicker.computeBtnTransfer
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
          return $xeIconPicker.$nextTick()
        }
      })
    },
    showOptionPanel () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData
      const internalData = $xeIconPicker.internalData

      const { hpTimeout } = internalData
      const isDisabled = $xeIconPicker.computeIsDisabled
      if (!isDisabled) {
        if (hpTimeout) {
          clearTimeout(hpTimeout)
          internalData.hpTimeout = undefined
        }
        const btnTransfer = $xeIconPicker.computeBtnTransfer
        const panelElem = $xeIconPicker.$refs.refOptionPanel as HTMLElement
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
          reactData.visiblePanel = true
        }, 10)
        $xeIconPicker.updateZindex()
        $xeIconPicker.updatePlacement()
      }
    },
    hideOptionPanel () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData
      const internalData = $xeIconPicker.internalData

      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    },
    changeEvent  (evnt: Event, selectValue: any) {
      const $xeIconPicker = this
      const props = $xeIconPicker
      const reactData = $xeIconPicker.reactData
      const $xeForm = $xeIconPicker.$xeForm
      const formItemInfo = $xeIconPicker.formItemInfo

      reactData.selectIcon = selectValue
      if (selectValue !== props.value) {
        $xeIconPicker.emitModel(selectValue)
        $xeIconPicker.dispatchEvent('change', { value: selectValue }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, selectValue)
        }
      }
    },
    focusEvent () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      const isDisabled = $xeIconPicker.computeIsDisabled
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          $xeIconPicker.showOptionPanel()
        }
      }
    },
    blurEvent  () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      reactData.isActivated = false
    },
    clearValueEvent  (evnt: Event, selectValue: any) {
      const $xeIconPicker = this

      $xeIconPicker.changeEvent(evnt, selectValue)
      $xeIconPicker.dispatchEvent('clear', { value: selectValue }, evnt)
    },
    clearEvent  (params: any, evnt: Event) {
      const $xeIconPicker = this

      $xeIconPicker.clearValueEvent(evnt, null)
      $xeIconPicker.hideOptionPanel()
    },
    togglePanelEvent (evnt: MouseEvent) {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      evnt.preventDefault()
      if (reactData.visiblePanel) {
        $xeIconPicker.hideOptionPanel()
      } else {
        $xeIconPicker.showOptionPanel()
      }
    },
    clickEvent  (evnt: MouseEvent) {
      const $xeIconPicker = this

      $xeIconPicker.togglePanelEvent(evnt)
      $xeIconPicker.dispatchEvent('click', {}, evnt)
    },
    handleGlobalMousewheelEvent  (evnt: MouseEvent) {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeIconPicker.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = $xeIconPicker.$refs.refOptionPanel as HTMLElement
          if (getEventTargetNode(evnt, panelElem).flag) {
            $xeIconPicker.updatePlacement()
          } else {
            $xeIconPicker.hideOptionPanel()
          }
        }
      }
    },
    handleGlobalMousedownEvent (evnt: MouseEvent) {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeIconPicker.computeIsDisabled
      if (!isDisabled) {
        const el = $xeIconPicker.$refs.refElem as HTMLElement
        const panelElem = $xeIconPicker.$refs.refOptionPanel as HTMLElement
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          $xeIconPicker.hideOptionPanel()
        }
      }
    },
    handleGlobalKeydownEvent (evnt: KeyboardEvent) {
      const $xeIconPicker = this
      const props = $xeIconPicker
      const reactData = $xeIconPicker.reactData

      const { clearable } = props
      const { visiblePanel } = reactData
      const isDisabled = $xeIconPicker.computeIsDisabled
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
            $xeIconPicker.hideOptionPanel()
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
          $xeIconPicker.showOptionPanel()
        }
        if (reactData.isActivated) {
          if (isDel && clearable) {
            $xeIconPicker.clearValueEvent(evnt, null)
          }
        }
      }
    },
    handleGlobalBlurEvent  () {
      const $xeIconPicker = this

      $xeIconPicker.hideOptionPanel()
    },
    handleClickIconEvent  (evnt: MouseEvent, item: VxeIconPickerDefines.IconItemObj) {
      const $xeIconPicker = this

      const value = item.icon
      $xeIconPicker.changeEvent(evnt, value)
      $xeIconPicker.hideOptionPanel()
    },

    //
    // Render
    //
    renderIconWrapper (h: CreateElement) {
      const $xeIconPicker = this
      const props = $xeIconPicker

      const { showIconTitle } = props
      const iconGroupList = $xeIconPicker.computeIconGroupList
      const isDisabled = $xeIconPicker.computeIsDisabled

      return h('div', {
        class: 'vxe-ico-picker--list-wrapper'
      }, iconGroupList.map(list => {
        return h('div', {
          class: 'vxe-ico-picker--list'
        }, list.map(item => {
          return h('div', {
            class: 'vxe-ico-picker--item',
            on: {
              click (evnt: MouseEvent) {
                if (!isDisabled) {
                  $xeIconPicker.handleClickIconEvent(evnt, item)
                }
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
    },
    renderVN (h: CreateElement): VNode {
      const $xeIconPicker = this
      const props = $xeIconPicker
      const reactData = $xeIconPicker.reactData

      const { className, popupClassName, clearable } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, selectIcon } = reactData
      const vSize = $xeIconPicker.computeSize
      const isDisabled = $xeIconPicker.computeIsDisabled
      const btnTransfer = $xeIconPicker.computeBtnTransfer
      const formReadonly = $xeIconPicker.computeFormReadonly
      const inpPlaceholder = $xeIconPicker.computeInpPlaceholder

      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-ico-picker--readonly', className]
        }, [
          h('i', {
            class: selectIcon
          })
        ])
      }
      return h('div', {
        ref: 'refElem',
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
          on: {
            click: $xeIconPicker.clickEvent
          }
        }, [
          h('input', {
            ref: 'refInput',
            class: 'vxe-ico-picker--input',
            on: {
              focus: $xeIconPicker.focusEvent,
              blur: $xeIconPicker.blurEvent
            }
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
              on: {
                click: $xeIconPicker.clearEvent
              }
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
        h('div', {
          ref: 'refOptionPanel',
          class: ['vxe-table--ignore-clear vxe-ico-picker--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $iconPicker: $xeIconPicker }) : popupClassName) : '', {
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
              class: 'vxe-ico-picker--panel-wrapper'
            }, [
              $xeIconPicker.renderIconWrapper(h)
            ])
            : renderEmptyElement($xeIconPicker)
        ])
      ])
    }
  },
  watch: {
    value (val) {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      reactData.selectIcon = `${val || ''}`
    }
  },
  created () {
    const $xeIconPicker = this
    const props = $xeIconPicker
    const reactData = $xeIconPicker.reactData

    reactData.selectIcon = `${props.value || ''}`
    globalEvents.on($xeIconPicker, 'mousewheel', $xeIconPicker.handleGlobalMousewheelEvent)
    globalEvents.on($xeIconPicker, 'mousedown', $xeIconPicker.handleGlobalMousedownEvent)
    globalEvents.on($xeIconPicker, 'keydown', $xeIconPicker.handleGlobalKeydownEvent)
    globalEvents.on($xeIconPicker, 'blur', $xeIconPicker.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeIconPicker = this

    const panelElem = $xeIconPicker.$refs.refOptionPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeIconPicker, 'mousewheel')
    globalEvents.off($xeIconPicker, 'mousedown')
    globalEvents.off($xeIconPicker, 'keydown')
    globalEvents.off($xeIconPicker, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
