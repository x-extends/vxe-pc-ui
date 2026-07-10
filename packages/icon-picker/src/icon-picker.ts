import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, renderer, createEvent, globalMixins, GLOBAL_EVENT_KEYS, renderEmptyElement } from '../../ui'
import { getEventTargetNode, toCssUnit, updatePanelPlacement } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, getFuncText } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import VxeInputComponent from '../../input/src/input'

import type { VxeIconPickerPropTypes, IconPickerInternalData, ValueOf, IconPickerReactData, VxeInputConstructor, VxeComponentSizeType, VxeIconPickerEmits, VxeIconPickerDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods, VxeComponentStyleType } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

function createReactData (): IconPickerReactData {
  return {
    initialized: false,
    selectIcon: '',
    panelIndex: 0,
    panelStyle: {},
    panelPlacement: null,
    visiblePanel: false,
    isAniVisible: false,
    isActivated: false,
    searchValue: '',
    iconList: []
  }
}

function createInternalData (): IconPickerInternalData {
  return {
    fullList: []
    // hpTimeout: undefined
  }
}

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
    /**
     * 已废弃，请使用 popupConfig.className
     * @deprecated
     */
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
    filterable: {
      type: Boolean as PropType<VxeIconPickerPropTypes.Filterable>,
      default: () => getConfig().iconPicker.filterable
    },
    filterConfig: Object as PropType<VxeIconPickerPropTypes.FilterConfig>,
    icons: Array as PropType<VxeIconPickerPropTypes.Icons>,
    placement: String as PropType<VxeIconPickerPropTypes.Placement>,
    popupConfig: Object as PropType<VxeIconPickerPropTypes.PopupConfig>,
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
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: IconPickerInternalData,
      }),
      xID: XEUtils.uniqueId(),
      reactData
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
      const popupOpts = $xeIconPicker.computePopupOpts as VxeIconPickerPropTypes.PopupConfig
      if (XEUtils.isBoolean(popupOpts.transfer)) {
        return popupOpts.transfer
      }
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
    computeWrapperStyle () {
      const $xeIconPicker = this

      const popupOpts = $xeIconPicker.computePopupOpts
      const { chunkSize, height, chunkWidth, maxHeight } = popupOpts
      const stys: VxeComponentStyleType = {
        '--vxe-ui-icon-picker-item-width': chunkWidth ? toCssUnit(chunkWidth) : `${100 / (chunkSize || 4)}%`
      }
      if (height) {
        stys['--vxe-ui-icon-picker-panel-height'] = toCssUnit(height)
      }
      if (maxHeight) {
        stys['--vxe-ui-icon-picker-panel-max-height'] = toCssUnit(maxHeight)
      }
      return stys
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
          icon: item.icon || '',
          iconRender: item.iconRender
        }
      })
    },
    computeFilterOpts () {
      const $xeIconPicker = this
      const props = $xeIconPicker

      return Object.assign({}, getConfig().iconPicker.filterConfig, props.filterConfig)
    },
    computePopupOpts () {
      const $xeIconPicker = this
      const props = $xeIconPicker

      return Object.assign({}, getConfig().iconPicker.popupConfig, props.popupConfig)
    },
    computeIconGroupList () {
      const $xeIconPicker = this

      const iconList = $xeIconPicker.computeIconList as {
        title: string
        icon: string
        iconRender: VxeIconPickerDefines.OptionIconRender
      }[]
      return XEUtils.chunk(iconList, 4)
    },
    computeSelectIconItem () {
      const $xeIconPicker = this
      const reactData = ($xeIconPicker as any).reactData

      const { selectIcon } = reactData
      const iconList = $xeIconPicker.computeIconList as {
        title: string
        icon: string
        iconRender: VxeIconPickerDefines.OptionIconRender
      }[]
      return selectIcon ? iconList.find(item => item.icon === selectIcon) : null
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

      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = $xeIconPicker.$refs.refElem as HTMLElement
      const panelElem = $xeIconPicker.$refs.refOptionPanel as HTMLDivElement
      const btnTransfer = $xeIconPicker.computeBtnTransfer
      const popupOpts = $xeIconPicker.computePopupOpts
      const { width, transfer } = popupOpts
      const handleStyle = () => {
        const ppObj = updatePanelPlacement(targetElem, panelElem, {
          placement: popupOpts.placement || placement,
          defaultPlacement: popupOpts.defaultPlacement,
          teleportTo: btnTransfer
        })
        const panelStyle: { [key: string]: string | number } = Object.assign(ppObj.style, {
          zIndex: panelIndex
        })
        if (width) {
          Object.assign(panelStyle, {
            width: toCssUnit(width),
            minWidth: transfer ? undefined : toCssUnit(width)
          })
        }
        reactData.panelStyle = panelStyle
        reactData.panelPlacement = ppObj.placement
      }
      handleStyle()
      return $xeIconPicker.$nextTick().then(handleStyle)
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
          $xeIconPicker.handleFocusSearch()
          $xeIconPicker.updatePlacement()
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
    handleFocusSearch () {
      const $xeIconPicker = this
      const props = $xeIconPicker

      if (props.filterable) {
        $xeIconPicker.$nextTick(() => {
          const inpSearch = $xeIconPicker.$refs.refInpSearch as VxeInputConstructor
          if (inpSearch) {
            inpSearch.focus()
          }
        })
      }
    },
    handleData () {
      const $xeIconPicker = this
      const props = $xeIconPicker
      const reactData = $xeIconPicker.reactData

      const { value: modelValue } = props
      const { searchValue } = reactData
      const filterOpts = $xeIconPicker.computeFilterOpts
      const { filterMethod } = filterOpts
      const iconList = $xeIconPicker.computeIconList
      let visibleList = iconList
      if (searchValue) {
        const searchTxt = `${searchValue}`.toLowerCase()
        visibleList = iconList.filter(item => {
          if (filterMethod) {
            return filterMethod({ option: item, value: modelValue, searchValue: searchTxt, $iconPicker: $xeIconPicker })
          }
          return (item.title && `${item.title}`.toLowerCase().indexOf(searchTxt) > -1) || (item.icon && `${item.icon}`.indexOf(searchTxt) > -1)
        })
      }
      reactData.iconList = visibleList
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
      const reactData = $xeIconPicker.reactData

      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        $xeIconPicker.hideOptionPanel()
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const $input = $xeIconPicker.$refs.refInput as VxeInputConstructor
        if ($input) {
          $input.blur()
        }
      }
    },
    handleClickIconEvent  (evnt: MouseEvent, item: VxeIconPickerDefines.IconItemObj) {
      const $xeIconPicker = this

      const value = item.icon
      $xeIconPicker.changeEvent(evnt, value)
      $xeIconPicker.hideOptionPanel()
    },
    modelSearchEvent (value: string) {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      reactData.searchValue = value
    },
    focusSearchEvent () {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      reactData.isActivated = true
    },
    handleSearchEvent () {
      const $xeIconPicker = this

      $xeIconPicker.handleData()
    },
    triggerSearchEvent: XEUtils.debounce(function (this: any) {
      const $xeIconPicker = this

      $xeIconPicker.handleSearchEvent()
    }, 350, { trailing: true }),

    //
    // Render
    //
    renderIconWrapper (h: CreateElement) {
      const $xeIconPicker = this
      const props = $xeIconPicker
      const reactData = $xeIconPicker.reactData

      const { showIconTitle } = props
      const { selectIcon, iconList } = reactData

      if (!iconList.length) {
        return h('div', {
          class: 'vxe-ico-picker--empty-placeholder'
        }, getI18n('vxe.iconPicker.emptyText'))
      }
      return h('div', {
        class: 'vxe-ico-picker--list-wrapper'
      }, [
        h('div', {
          class: 'vxe-ico-picker--list'
        }, iconList.map(item => {
          const { iconRender } = item
          const compConf = iconRender ? renderer.get(iconRender.name) : null
          const iconMethod = compConf ? compConf.renderIconPickerOptionIcon : null
          return h('div', {
            class: ['vxe-ico-picker--item', {
              'is--selected': selectIcon === item.icon
            }]
          }, [
            h('div', {
              class: 'vxe-ico-picker--item-inner',
              on: {
                click (evnt: MouseEvent) {
                  const isDisabled = $xeIconPicker.computeIsDisabled
                  if (!isDisabled) {
                    $xeIconPicker.handleClickIconEvent(evnt, item)
                  }
                }
              }
            }, [
              h('div', {
                class: 'vxe-ico-picker--item-icon'
              }, iconMethod && iconRender
                ? getSlotVNs(iconMethod(h, iconRender, { $iconPicker: $xeIconPicker, option: item }))
                : [
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
          ])
        }))
      ])
    },
    renderIconView (h: CreateElement) {
      const $xeIconPicker = this
      const reactData = $xeIconPicker.reactData

      const { selectIcon } = reactData
      const selectIconItem = $xeIconPicker.computeSelectIconItem
      if (selectIconItem) {
        const { iconRender } = selectIconItem
        const compConf = iconRender ? renderer.get(iconRender.name) : null
        const oIconMethod = compConf ? compConf.renderIconPickerOptionIcon : null
        if (oIconMethod && iconRender) {
          return h('div', {
            key: 'inc',
            class: 'vxe-ico-picker--icon'
          }, getSlotVNs(oIconMethod.call($xeIconPicker, h, iconRender, { $iconPicker: $xeIconPicker, option: selectIconItem })))
        }
      }
      return h('div', {
        key: 'ind',
        class: 'vxe-ico-picker--icon'
      }, [
        h('i', {
          class: selectIcon
        })
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeIconPicker = this
      const props = $xeIconPicker
      const reactData = $xeIconPicker.reactData

      const { className, clearable, filterable } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, selectIcon } = reactData
      const vSize = $xeIconPicker.computeSize
      const isDisabled = $xeIconPicker.computeIsDisabled
      const btnTransfer = $xeIconPicker.computeBtnTransfer
      const formReadonly = $xeIconPicker.computeFormReadonly
      const inpPlaceholder = $xeIconPicker.computeInpPlaceholder
      const wrapperStyle = $xeIconPicker.computeWrapperStyle
      const popupOpts = $xeIconPicker.computePopupOpts
      const ppClassName = popupOpts.className || props.popupClassName

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
            ? $xeIconPicker.renderIconView(h)
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
          class: ['vxe-table--ignore-clear vxe-ico-picker--panel', ppClassName ? (XEUtils.isFunction(ppClassName) ? ppClassName({ $iconPicker: $xeIconPicker }) : ppClassName) : '', {
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
              class: 'vxe-ico-picker--panel-wrapper',
              style: wrapperStyle
            }, [
              filterable
                ? h('div', {
                  class: 'vxe-ico-picker--panel-search'
                }, [
                  h(VxeInputComponent, {
                    ref: 'refInpSearch',
                    class: 'vxe-ico-picker-search--input',
                    props: {
                      value: reactData.searchValue,
                      type: 'text',
                      clearable: true,
                      disabled: false,
                      readonly: false,
                      placeholder: getI18n('vxe.iconPicker.search'),
                      prefixIcon: getIcon().INPUT_SEARCH
                    },
                    on: {
                      'model-value': $xeIconPicker.modelSearchEvent,
                      focus: $xeIconPicker.focusSearchEvent,
                      change: $xeIconPicker.triggerSearchEvent,
                      search: $xeIconPicker.triggerSearchEvent
                    }
                  })
                ])
                : renderEmptyElement($xeIconPicker),
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
    },
    computeIconList () {
      const $xeIconPicker = this

      $xeIconPicker.handleData()
    }
  },
  created () {
    const $xeIconPicker = this
    const props = $xeIconPicker
    const reactData = $xeIconPicker.reactData

    $xeIconPicker.internalData = createInternalData()

    reactData.selectIcon = `${props.value || ''}`
    $xeIconPicker.handleData()

    globalEvents.on($xeIconPicker, 'mousewheel', $xeIconPicker.handleGlobalMousewheelEvent)
    globalEvents.on($xeIconPicker, 'mousedown', $xeIconPicker.handleGlobalMousedownEvent)
    globalEvents.on($xeIconPicker, 'keydown', $xeIconPicker.handleGlobalKeydownEvent)
    globalEvents.on($xeIconPicker, 'blur', $xeIconPicker.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeIconPicker = this
    const reactData = $xeIconPicker.reactData
    const internalData = $xeIconPicker.internalData

    const panelElem = $xeIconPicker.$refs.refOptionPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeIconPicker, 'mousewheel')
    globalEvents.off($xeIconPicker, 'mousedown')
    globalEvents.off($xeIconPicker, 'keydown')
    globalEvents.off($xeIconPicker, 'blur')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
