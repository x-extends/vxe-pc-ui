import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getEventTargetNode, getAbsolutePos } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, getFuncText } from '../../ui/src/utils'
import VxeInputComponent from '../../input/src/input'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeSelectPropTypes, SelectInternalData, ValueOf, VxeComponentSizeType, SelectReactData, VxeSelectEmits, VxeSelectDefines, VxeOptgroupProps, VxeOptionProps, VxeTableConstructor, VxeDrawerConstructor, VxeDrawerMethods, VxeTablePrivateMethods, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods, VxeInputConstructor } from '../../../types'

function isOptionVisible (option: any) {
  return option.visible !== false
}

function getOptUniqueId () {
  return XEUtils.uniqueId('opt_')
}

export default defineVxeComponent({
  name: 'VxeSelect',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Boolean, Array] as PropType<VxeSelectPropTypes.ModelValue>,
    clearable: Boolean as PropType<VxeSelectPropTypes.Clearable>,
    placeholder: String as PropType<VxeSelectPropTypes.Placeholder>,
    readonly: {
      type: Boolean as PropType<VxeSelectPropTypes.Readonly>,
      default: null
    },
    loading: Boolean as PropType<VxeSelectPropTypes.Loading>,
    disabled: {
      type: Boolean as PropType<VxeSelectPropTypes.Disabled>,
      default: null
    },
    multiple: Boolean as PropType<VxeSelectPropTypes.Multiple>,
    multiCharOverflow: {
      type: [Number, String] as PropType<VxeSelectPropTypes.MultiCharOverflow>,
      default: () => getConfig().select.multiCharOverflow
    },
    prefixIcon: String as PropType<VxeSelectPropTypes.PrefixIcon>,
    placement: String as PropType<VxeSelectPropTypes.Placement>,
    options: Array as PropType<VxeSelectPropTypes.Options>,
    optionProps: Object as PropType<VxeSelectPropTypes.OptionProps>,
    optionGroups: Array as PropType<VxeSelectPropTypes.OptionGroups>,
    optionGroupProps: Object as PropType<VxeSelectPropTypes.OptionGroupProps>,
    optionConfig: Object as PropType<VxeSelectPropTypes.OptionConfig>,
    className: [String, Function] as PropType<VxeSelectPropTypes.ClassName>,
    popupClassName: [String, Function] as PropType<VxeSelectPropTypes.PopupClassName>,
    max: {
      type: [String, Number] as PropType<VxeSelectPropTypes.Max>,
      default: null
    },
    size: {
      type: String as PropType<VxeSelectPropTypes.Size>,
      default: () => getConfig().select.size || getConfig().size
    },
    filterable: Boolean as PropType<VxeSelectPropTypes.Filterable>,
    filterMethod: Function as PropType<VxeSelectPropTypes.FilterMethod>,
    remote: Boolean as PropType<VxeSelectPropTypes.Remote>,
    remoteMethod: Function as PropType<VxeSelectPropTypes.RemoteMethod>,
    emptyText: String as PropType<VxeSelectPropTypes.EmptyText>,
    transfer: {
      type: Boolean as PropType<VxeSelectPropTypes.Transfer>,
      default: null
    },

    // 已废弃，被 option-config.keyField 替换
    optionId: {
      type: String as PropType<VxeSelectPropTypes.OptionId>,
      default: () => getConfig().select.optionId
    },
    // 已废弃，被 option-config.useKey 替换
    optionKey: Boolean as PropType<VxeSelectPropTypes.OptionKey>
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
    const $xeSelect = this
    return {
      $xeSelect
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: SelectReactData = {
      initialized: false,
      staticOptions: [],
      fullGroupList: [],
      fullOptionList: [],
      visibleGroupList: [],
      visibleOptionList: [],
      remoteValueList: [],
      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      currentOption: null,
      currentValue: null,
      triggerFocusPanel: false,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false,
      searchValue: '',
      searchLoading: false
    }
    const internalData: SelectInternalData = {
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
      const $xeSelect = this
      const props = $xeSelect
      const $xeForm = $xeSelect.$xeForm

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
      const $xeSelect = this
      const props = $xeSelect
      const $xeForm = $xeSelect.$xeForm

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
      const $xeSelect = this
      const props = $xeSelect
      const $xeTable = $xeSelect.$xeTable
      const $xeModal = $xeSelect.$xeModal
      const $xeDrawer = $xeSelect.$xeDrawer
      const $xeForm = $xeSelect.$xeForm

      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().select.transfer
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
      const $xeSelect = this
      const props = $xeSelect

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
    computePropsOpts () {
      const $xeSelect = this
      const props = $xeSelect

      return Object.assign({}, props.optionProps)
    },
    computeGroupPropsOpts () {
      const $xeSelect = this
      const props = $xeSelect

      return Object.assign({}, props.optionGroupProps)
    },
    computeLabelField () {
      const $xeSelect = this

      const propsOpts = $xeSelect.computePropsOpts as VxeSelectPropTypes.OptionProps
      return propsOpts.label || 'label'
    },
    computeValueField () {
      const $xeSelect = this

      const propsOpts = $xeSelect.computePropsOpts as VxeSelectPropTypes.OptionProps
      return propsOpts.value || 'value'
    },
    computeGroupLabelField () {
      const $xeSelect = this

      const groupPropsOpts = $xeSelect.computeGroupPropsOpts as VxeSelectPropTypes.OptionGroupProps
      return groupPropsOpts.label || 'label'
    },
    computeGroupOptionsField () {
      const $xeSelect = this

      const groupPropsOpts = $xeSelect.computeGroupPropsOpts as VxeSelectPropTypes.OptionGroupProps
      return groupPropsOpts.options || 'options'
    },
    computeIsMaximize () {
      const $xeSelect = this
      const props = $xeSelect

      const { value, multiple, max } = props
      if (multiple && max) {
        return (XEUtils.isArray(value) ? value.length : (XEUtils.eqNull(value) ? 0 : 1)) >= XEUtils.toNumber(max)
      }
      return false
    },
    computeOptionOpts () {
      const $xeSelect = this
      const props = $xeSelect

      return Object.assign({}, getConfig().select.optionConfig, props.optionConfig)
    },
    computeIsGroup (this: any) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      return reactData.fullGroupList.some((item: any) => item.options && item.options.length)
    },
    computeMultiMaxCharNum () {
      const $xeSelect = this
      const props = $xeSelect

      return XEUtils.toNumber(props.multiCharOverflow)
    },
    computeSelectLabel (this: any) {
      const $xeSelect = this
      const props = $xeSelect

      const { value, multiple, remote } = props
      const multiMaxCharNum = $xeSelect.computeMultiMaxCharNum
      if (value && multiple) {
        const vals = XEUtils.isArray(value) ? value : [value]
        if (remote) {
          return vals.map(val => $xeSelect.getRemoteSelectLabel(val)).join(', ')
        }
        return vals.map((val) => {
          const label = $xeSelect.getSelectLabel(val)
          if (multiMaxCharNum > 0 && label.length > multiMaxCharNum) {
            return `${label.substring(0, multiMaxCharNum)}...`
          }
          return label
        }).join(', ')
      }
      if (remote) {
        return $xeSelect.getRemoteSelectLabel(value)
      }
      return $xeSelect.getSelectLabel(value)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeSelectEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSelect = this
      $xeSelect.$emit(type, createEvent(evnt, { $select: $xeSelect }, params))
    },
    emitModel  (value: any) {
      const $xeSelect = this

      $xeSelect.$emit('modelValue', value)
    },
    isPanelVisible () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      return reactData.visiblePanel
    },
    togglePanel () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      if (reactData.visiblePanel) {
        $xeSelect.hideOptionPanel()
      } else {
        $xeSelect.showOptionPanel()
      }
      return $xeSelect.$nextTick()
    },
    hidePanel () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      if (reactData.visiblePanel) {
        $xeSelect.hideOptionPanel()
      }
      return $xeSelect.$nextTick()
    },
    showPanel () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      if (!reactData.visiblePanel) {
        $xeSelect.showOptionPanel()
      }
      return $xeSelect.$nextTick()
    },
    focus () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const $input = $xeSelect.$refs.refInput as VxeInputConstructor
      reactData.isActivated = true
      $input.blur()
      return $xeSelect.$nextTick()
    },
    blur () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const $input = $xeSelect.$refs.refInput as VxeInputConstructor
      $input.blur()
      reactData.isActivated = false
      return $xeSelect.$nextTick()
    },
    callSlot (slotFunc: any, params: any, h: CreateElement) {
      const $xeSelect = this
      const slots = $xeSelect.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc.call($xeSelect, params, h))
        }
      }
      return []
    },
    findOption  (optionValue: any) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const { fullOptionList, fullGroupList } = reactData
      const isGroup = $xeSelect.computeIsGroup
      const valueField = $xeSelect.computeValueField as 'value'
      if (isGroup) {
        for (let gIndex = 0; gIndex < fullGroupList.length; gIndex++) {
          const group = fullGroupList[gIndex]
          if (group.options) {
            for (let index = 0; index < group.options.length; index++) {
              const option = group.options[index]
              if (optionValue === option[valueField]) {
                return option
              }
            }
          }
        }
      }
      return fullOptionList.find((item) => optionValue === item[valueField])
    },
    findVisibleOption (optionValue: any) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const { visibleOptionList, visibleGroupList } = reactData
      const isGroup = $xeSelect.computeIsGroup
      const valueField = $xeSelect.computeValueField as 'value'
      if (isGroup) {
        for (let gIndex = 0; gIndex < visibleGroupList.length; gIndex++) {
          const group = visibleGroupList[gIndex]
          if (group.options) {
            for (let index = 0; index < group.options.length; index++) {
              const option = group.options[index]
              if (optionValue === option[valueField]) {
                return option
              }
            }
          }
        }
      }
      return visibleOptionList.find((item) => optionValue === item[valueField])
    },
    getRemoteSelectLabel  (value: any) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const { remoteValueList } = reactData
      const labelField = $xeSelect.computeLabelField
      const remoteItem = remoteValueList.find(item => value === item.key)
      const item = remoteItem ? remoteItem.result : null
      return XEUtils.toValueString(item ? item[labelField] : value)
    },
    getSelectLabel (value: any) {
      const $xeSelect = this

      const labelField = $xeSelect.computeLabelField
      const item = $xeSelect.findOption(value)
      return XEUtils.toValueString(item ? item[labelField as 'label'] : value)
    },
    getOptkey () {
      const $xeSelect = this
      const props = $xeSelect

      const optionOpts = $xeSelect.computeOptionOpts
      return optionOpts.keyField || props.optionId || '_X_OPTION_KEY'
    },
    getOptid  (option: any) {
      const $xeSelect = this

      const optid = option[$xeSelect.getOptkey()]
      return optid ? encodeURIComponent(optid) : ''
    },
    /**
     * 刷新选项，当选项被动态显示/隐藏时可能会用到
     */
    refreshOption  () {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData

      const { filterable, filterMethod } = props
      const { fullOptionList, fullGroupList, searchValue } = reactData
      const isGroup = $xeSelect.computeIsGroup
      const groupLabelField = $xeSelect.computeGroupLabelField
      const labelField = $xeSelect.computeLabelField
      const searchStr = `${searchValue || ''}`.toLowerCase()
      if (isGroup) {
        if (filterable && filterMethod) {
          reactData.visibleGroupList = fullGroupList.filter(group => isOptionVisible(group) && filterMethod({ group, option: null, searchValue: searchStr }))
        } else if (filterable) {
          reactData.visibleGroupList = fullGroupList.filter(group => isOptionVisible(group) && (!searchStr || `${group[groupLabelField]}`.toLowerCase().indexOf(searchStr) > -1))
        } else {
          reactData.visibleGroupList = fullGroupList.filter(isOptionVisible)
        }
      } else {
        if (filterable && filterMethod) {
          reactData.visibleOptionList = fullOptionList.filter(option => isOptionVisible(option) && filterMethod({ group: null, option, searchValue: searchStr }))
        } else if (filterable) {
          reactData.visibleOptionList = fullOptionList.filter(option => isOptionVisible(option) && (!searchStr || `${option[labelField]}`.toLowerCase().indexOf(searchStr) > -1))
        } else {
          reactData.visibleOptionList = fullOptionList.filter(isOptionVisible)
        }
      }
      return $xeSelect.$nextTick()
    },
    cacheItemMap () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const { fullOptionList, fullGroupList } = reactData
      const groupOptionsField = $xeSelect.computeGroupOptionsField
      const key = $xeSelect.getOptkey()
      const handleOptis = (item: any) => {
        if (!$xeSelect.getOptid(item)) {
          item[key] = getOptUniqueId()
        }
      }
      if (fullGroupList.length) {
        fullGroupList.forEach((group: any) => {
          handleOptis(group)
          if (group[groupOptionsField]) {
            group[groupOptionsField].forEach(handleOptis)
          }
        })
      } else if (fullOptionList.length) {
        fullOptionList.forEach(handleOptis)
      }
      $xeSelect.refreshOption()
    },
    setCurrentOption  (option: any) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const valueField = $xeSelect.computeValueField
      if (option) {
        reactData.currentOption = option
        reactData.currentValue = option[valueField]
      }
    },
    scrollToOption  (option: any, isAlignBottom?: boolean) {
      const $xeSelect = this

      return $xeSelect.$nextTick().then(() => {
        if (option) {
          const optWrapperElem = $xeSelect.$refs.refOptionWrapper as HTMLDivElement
          const panelElem = $xeSelect.$refs.refOptionPanel as HTMLDivElement
          const optElem = panelElem.querySelector(`[optid='${$xeSelect.getOptid(option)}']`) as HTMLElement
          if (optWrapperElem && optElem) {
            const wrapperHeight = optWrapperElem.offsetHeight
            const offsetPadding = 5
            if (isAlignBottom) {
              if (optElem.offsetTop + optElem.offsetHeight - optWrapperElem.scrollTop > wrapperHeight) {
                optWrapperElem.scrollTop = optElem.offsetTop + optElem.offsetHeight - wrapperHeight
              }
            } else {
              if (optElem.offsetTop + offsetPadding < optWrapperElem.scrollTop || optElem.offsetTop + offsetPadding > optWrapperElem.scrollTop + optWrapperElem.clientHeight) {
                optWrapperElem.scrollTop = optElem.offsetTop - offsetPadding
              }
            }
          }
        }
      })
    },
    updateZindex () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement  () {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData

      return $xeSelect.$nextTick().then(() => {
        const { placement } = props
        const { panelIndex } = reactData
        const el = $xeSelect.$refs.refElem as HTMLDivElement
        const panelElem = $xeSelect.$refs.refOptionPanel as HTMLDivElement
        const btnTransfer = $xeSelect.computeBtnTransfer
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
          return $xeSelect.$nextTick()
        }
      })
    },
    showOptionPanel  () {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const { loading, filterable } = props
      const { hpTimeout } = internalData
      const isDisabled = $xeSelect.computeIsDisabled
      if (!loading && !isDisabled) {
        if (hpTimeout) {
          clearTimeout(hpTimeout)
          internalData.hpTimeout = undefined
        }
        if (!reactData.initialized) {
          reactData.initialized = true
          const btnTransfer = $xeSelect.computeBtnTransfer
          const panelElem = $xeSelect.$refs.refOptionPanel as HTMLElement
          if (btnTransfer) {
            if (panelElem) {
              document.body.appendChild(panelElem)
            }
          }
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        if (filterable) {
          $xeSelect.refreshOption()
        }
        setTimeout(() => {
          const { value } = props
          const currOption = $xeSelect.findOption(XEUtils.isArray(value) ? value[0] : value)
          reactData.visiblePanel = true
          if (currOption) {
            $xeSelect.setCurrentOption(currOption)
            $xeSelect.scrollToOption(currOption)
          }
          $xeSelect.handleFocusSearch()
        }, 10)
        $xeSelect.updateZindex()
        $xeSelect.updatePlacement()
      }
    },
    hideOptionPanel () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      reactData.searchValue = ''
      reactData.searchLoading = false
      reactData.visiblePanel = false
      internalData.hpTimeout = window.setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
    },
    changeEvent (evnt: Event, selectValue: any) {
      const $xeSelect = this
      const props = $xeSelect
      const $xeForm = $xeSelect.$xeForm
      const formItemInfo = $xeSelect.formItemInfo

      $xeSelect.emitModel(selectValue)
      if (selectValue !== props.value) {
        $xeSelect.dispatchEvent('change', { value: selectValue }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, selectValue)
        }
      }
    },
    clearValueEvent  (evnt: Event, selectValue: any) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      reactData.remoteValueList = []
      $xeSelect.changeEvent(evnt, selectValue)
      $xeSelect.dispatchEvent('clear', { value: selectValue }, evnt)
    },
    clearEvent (params: any, evnt: Event) {
      const $xeSelect = this

      $xeSelect.clearValueEvent(evnt, null)
      $xeSelect.hideOptionPanel()
    },
    changeOptionEvent (evnt: Event, selectValue: any, option: any) {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData

      const { value, multiple } = props
      const { remoteValueList } = reactData
      if (multiple) {
        let multipleValue: any[] = []
        const selectVals = XEUtils.eqNull(value) ? [] : (XEUtils.isArray(value) ? value : [value])
        const index = XEUtils.findIndexOf(selectVals, val => val === selectValue)
        if (index === -1) {
          multipleValue = selectVals.concat([selectValue])
        } else {
          multipleValue = selectVals.filter((val) => val !== selectValue)
        }
        const remoteItem = remoteValueList.find(item => item.key === selectValue)
        if (remoteItem) {
          remoteItem.result = option
        } else {
          remoteValueList.push({ key: selectValue, result: option })
        }
        $xeSelect.changeEvent(evnt, multipleValue)
      } else {
        reactData.remoteValueList = [{ key: selectValue, result: option }]
        $xeSelect.changeEvent(evnt, selectValue)
        $xeSelect.hideOptionPanel()
      }
    },
    handleGlobalMousewheelEvent (evnt: MouseEvent) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeSelect.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = $xeSelect.$refs.refOptionPanel as HTMLDivElement
          if (getEventTargetNode(evnt, panelElem).flag) {
            $xeSelect.updatePlacement()
          } else {
            $xeSelect.hideOptionPanel()
          }
        }
      }
    },
    handleGlobalMousedownEvent  (evnt: MouseEvent) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeSelect.computeIsDisabled
      if (!isDisabled) {
        const el = $xeSelect.$refs.refElem as HTMLDivElement
        const panelElem = $xeSelect.$refs.refOptionPanel as HTMLDivElement
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          $xeSelect.hideOptionPanel()
        }
      }
    },
    findOffsetOption (optionValue: any, isUpArrow: boolean) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const { visibleOptionList, visibleGroupList } = reactData
      const isGroup = $xeSelect.computeIsGroup
      const valueField = $xeSelect.computeValueField as 'value'
      const groupOptionsField = $xeSelect.computeGroupOptionsField as 'options'
      let firstOption
      let prevOption
      let nextOption
      let currOption
      if (isGroup) {
        for (let gIndex = 0; gIndex < visibleGroupList.length; gIndex++) {
          const group = visibleGroupList[gIndex]
          const groupOptionList = group[groupOptionsField]
          const isGroupDisabled = group.disabled
          if (groupOptionList) {
            for (let index = 0; index < groupOptionList.length; index++) {
              const option = groupOptionList[index]
              const isVisible = isOptionVisible(option)
              const isDisabled = isGroupDisabled || option.disabled
              if (!firstOption && !isDisabled) {
                firstOption = option
              }
              if (currOption) {
                if (isVisible && !isDisabled) {
                  nextOption = option
                  if (!isUpArrow) {
                    return { offsetOption: nextOption }
                  }
                }
              }
              if (optionValue === option[valueField]) {
                currOption = option
                if (isUpArrow) {
                  return { offsetOption: prevOption }
                }
              } else {
                if (isVisible && !isDisabled) {
                  prevOption = option
                }
              }
            }
          }
        }
      } else {
        for (let index = 0; index < visibleOptionList.length; index++) {
          const option = visibleOptionList[index]
          const isDisabled = option.disabled
          if (!firstOption && !isDisabled) {
            firstOption = option
          }
          if (currOption) {
            if (!isDisabled) {
              nextOption = option
              if (!isUpArrow) {
                return { offsetOption: nextOption }
              }
            }
          }
          if (optionValue === option[valueField]) {
            currOption = option
            if (isUpArrow) {
              return { offsetOption: prevOption }
            }
          } else {
            if (!isDisabled) {
              prevOption = option
            }
          }
        }
      }
      return { firstOption }
    },
    handleGlobalKeydownEvent  (evnt: KeyboardEvent) {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData

      const { clearable } = props
      const { visiblePanel, currentValue, currentOption } = reactData
      const isDisabled = $xeSelect.computeIsDisabled
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
            $xeSelect.hideOptionPanel()
          } else if (isEnter) {
            evnt.preventDefault()
            evnt.stopPropagation()
            $xeSelect.changeOptionEvent(evnt, currentValue, currentOption)
          } else if (isUpArrow || isDwArrow) {
            evnt.preventDefault()
            let { firstOption, offsetOption } = $xeSelect.findOffsetOption(currentValue, isUpArrow)
            if (!offsetOption && !$xeSelect.findVisibleOption(currentValue)) {
              offsetOption = firstOption
            }
            $xeSelect.setCurrentOption(offsetOption)
            $xeSelect.scrollToOption(offsetOption, isDwArrow)
          } else if (isSpacebar) {
            evnt.preventDefault()
          }
        } else if ((isUpArrow || isDwArrow || isEnter || isSpacebar) && reactData.isActivated) {
          evnt.preventDefault()
          $xeSelect.showOptionPanel()
        }
        if (reactData.isActivated) {
          if (isDel && clearable) {
            $xeSelect.clearValueEvent(evnt, null)
          }
        }
      }
    },
    handleGlobalBlurEvent () {
      const $xeSelect = this

      $xeSelect.hideOptionPanel()
    },
    handleFocusSearch  () {
      const $xeSelect = this
      const props = $xeSelect

      if (props.filterable) {
        $xeSelect.$nextTick(() => {
          const inpSearch = $xeSelect.$refs.refInpSearch as VxeInputConstructor
          if (inpSearch) {
            inpSearch.focus()
          }
        })
      }
    },
    focusEvent (evnt: FocusEvent) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const isDisabled = $xeSelect.computeIsDisabled
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          reactData.triggerFocusPanel = true
          $xeSelect.showOptionPanel()
          setTimeout(() => {
            reactData.triggerFocusPanel = false
          }, 150)
        }
      }
      $xeSelect.dispatchEvent('focus', {}, evnt)
    },
    clickEvent  (evnt: MouseEvent) {
      const $xeSelect = this

      $xeSelect.togglePanelEvent(evnt)
      $xeSelect.dispatchEvent('click', {}, evnt)
    },
    blurEvent  (evnt: FocusEvent) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      reactData.isActivated = false
      $xeSelect.dispatchEvent('blur', {}, evnt)
    },
    modelSearchEvent  (value: string) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      reactData.searchValue = value
    },
    focusSearchEvent  () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      reactData.isActivated = true
    },
    handleSearchEvent () {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData

      const { remote, remoteMethod } = props
      const { searchValue } = reactData
      if (remote && remoteMethod) {
        reactData.searchLoading = true
        Promise.resolve(
          remoteMethod({ searchValue })
        ).then(() => $xeSelect.$nextTick())
          .catch(() => $xeSelect.$nextTick())
          .finally(() => {
            reactData.searchLoading = false
            $xeSelect.refreshOption()
          })
      } else {
        $xeSelect.refreshOption()
      }
    },
    triggerSearchEvent: XEUtils.debounce(function (this: any) {
      const $xeSelect = this

      $xeSelect.handleSearchEvent()
    }, 350, { trailing: true }),
    togglePanelEvent  (params: any) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const { $event } = params
      $event.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (reactData.visiblePanel) {
          $xeSelect.hideOptionPanel()
        } else {
          $xeSelect.showOptionPanel()
        }
      }
    },
    checkOptionDisabled (isSelected: any, option: VxeOptionProps, group?: VxeOptgroupProps) {
      const $xeSelect = this

      if (option.disabled) {
        return true
      }
      if (group && group.disabled) {
        return true
      }
      const isMaximize = $xeSelect.computeIsMaximize
      if (isMaximize && !isSelected) {
        return true
      }
      return false
    },

    //
    // Render
    //
    renderOption (h: CreateElement, list: VxeOptionProps[], group?: VxeOptgroupProps) {
      const $xeSelect = this
      const props = $xeSelect
      const slots = $xeSelect.$scopedSlots
      const reactData = $xeSelect.reactData

      const { optionKey, value } = props
      const { currentValue } = reactData
      const optionOpts = $xeSelect.computeOptionOpts
      const labelField = $xeSelect.computeLabelField
      const valueField = $xeSelect.computeValueField
      const isGroup = $xeSelect.computeIsGroup
      const { useKey } = optionOpts
      const optionSlot = slots.option
      return list.map((option, cIndex) => {
        const { slots, className } = option
        const optionValue = option[valueField as 'value']
        const isSelected = XEUtils.isArray(value) ? value.indexOf(optionValue) > -1 : value === optionValue
        const isVisible = !isGroup || isOptionVisible(option)
        const isDisabled = $xeSelect.checkOptionDisabled(isSelected, option, group)
        const optid = $xeSelect.getOptid(option)
        const defaultSlot = slots ? slots.default : null
        const optParams = { option, group: null, $select: $xeSelect }
        return isVisible
          ? h('div', {
            key: useKey || optionKey ? optid : cIndex,
            class: ['vxe-select-option', className ? (XEUtils.isFunction(className) ? className(optParams) : className) : '', {
              'is--disabled': isDisabled,
              'is--selected': isSelected,
              'is--hover': currentValue === optionValue
            }],
            attrs: {
              optid: optid
            },
            on: {
              mousedown: (evnt: MouseEvent) => {
                const isLeftBtn = evnt.button === 0
                if (isLeftBtn) {
                  evnt.stopPropagation()
                }
              },
              click: (evnt: MouseEvent) => {
                if (!isDisabled) {
                  $xeSelect.changeOptionEvent(evnt, optionValue, option)
                }
              },
              mouseenter: () => {
                if (!isDisabled) {
                  $xeSelect.setCurrentOption(option)
                }
              }
            }
          }, optionSlot ? $xeSelect.callSlot(optionSlot, optParams, h) : (defaultSlot ? $xeSelect.callSlot(defaultSlot, optParams, h) : getFuncText(option[labelField as 'label'])))
          : renderEmptyElement($xeSelect)
      })
    },
    renderOptgroup  (h: CreateElement) {
      const $xeSelect = this
      const props = $xeSelect
      const slots = $xeSelect.$scopedSlots
      const reactData = $xeSelect.reactData

      const { optionKey } = props
      const { visibleGroupList } = reactData
      const optionOpts = $xeSelect.computeOptionOpts
      const groupLabelField = $xeSelect.computeGroupLabelField
      const groupOptionsField = $xeSelect.computeGroupOptionsField
      const { useKey } = optionOpts
      const optionSlot = slots.option
      return visibleGroupList.map((group, gIndex) => {
        const { slots, className } = group
        const optid = $xeSelect.getOptid(group)
        const isGroupDisabled = group.disabled
        const defaultSlot = slots ? slots.default : null
        const optParams = { option: group, group, $select: $xeSelect }
        return h('div', {
          key: useKey || optionKey ? optid : gIndex,
          class: ['vxe-optgroup', className ? (XEUtils.isFunction(className) ? className(optParams) : className) : '', {
            'is--disabled': isGroupDisabled
          }],
          attrs: {
            optid: optid
          }
        }, [
          h('div', {
            class: 'vxe-optgroup--title'
          }, optionSlot ? $xeSelect.callSlot(optionSlot, optParams, h) : (defaultSlot ? $xeSelect.callSlot(defaultSlot, optParams, h) : getFuncText(group[groupLabelField as 'label']))),
          h('div', {
            class: 'vxe-optgroup--wrapper'
          }, $xeSelect.renderOption(h, group[groupOptionsField as 'options'] || [], group))
        ])
      })
    },
    renderOpts  (h: CreateElement): VNode[] {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData

      const { visibleGroupList, visibleOptionList, searchLoading } = reactData
      const isGroup = $xeSelect.computeIsGroup
      if (searchLoading) {
        return [
          h('div', {
            class: 'vxe-select--search-loading'
          }, [
            h('i', {
              class: ['vxe-select--search-icon', getIcon().SELECT_LOADED]
            }),
            h('span', {
              class: 'vxe-select--search-text'
            }, getI18n('vxe.select.loadingText'))
          ])
        ]
      }
      if (isGroup) {
        if (visibleGroupList.length) {
          return $xeSelect.renderOptgroup(h)
        }
      } else {
        if (visibleOptionList.length) {
          return $xeSelect.renderOption(h, visibleOptionList)
        }
      }
      return [
        h('div', {
          class: 'vxe-select--empty-placeholder'
        }, props.emptyText || getI18n('vxe.select.emptyText'))
      ]
    },
    renderVN (h: CreateElement): VNode {
      const $xeSelect = this
      const props = $xeSelect
      const slots = $xeSelect.$scopedSlots
      const reactData = $xeSelect.reactData

      const { className, popupClassName, loading, filterable } = props
      const { initialized, isActivated, visiblePanel } = reactData
      const vSize = $xeSelect.computeSize
      const isDisabled = $xeSelect.computeIsDisabled
      const selectLabel = $xeSelect.computeSelectLabel
      const btnTransfer = $xeSelect.computeBtnTransfer
      const formReadonly = $xeSelect.computeFormReadonly
      const inpPlaceholder = $xeSelect.computeInpPlaceholder
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-select--readonly', className]
        }, [
          h('div', {
            class: 'vxe-select-slots',
            ref: 'hideOption'
          }, defaultSlot ? $xeSelect.callSlot(defaultSlot, {}, h) : []),
          h('span', {
            class: 'vxe-select-label'
          }, [selectLabel])
        ])
      }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-select', className ? (XEUtils.isFunction(className) ? className({ $select: $xeSelect }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--filter': filterable,
          'is--loading': loading,
          'is--active': isActivated
        }]
      }, [
        h('div', {
          class: 'vxe-select-slots',
          ref: 'hideOption'
        }, defaultSlot ? defaultSlot.call($xeSelect, {}) : []),
        h(VxeInputComponent, {
          ref: 'refInput',
          props: {
            clearable: props.clearable,
            placeholder: inpPlaceholder,
            readonly: true,
            disabled: isDisabled,
            type: 'text',
            prefixIcon: props.prefixIcon,
            suffixIcon: loading ? getIcon().SELECT_LOADED : (visiblePanel ? getIcon().SELECT_OPEN : getIcon().SELECT_CLOSE),
            value: selectLabel
          },
          on: {
            clear: $xeSelect.clearEvent,
            click: $xeSelect.clickEvent,
            focus: $xeSelect.focusEvent,
            blur: $xeSelect.blurEvent,
            suffixClick: $xeSelect.togglePanelEvent
          },
          scopedSlots: prefixSlot
            ? {
                prefix: () => prefixSlot({})
              }
            : {}
        }),
        h('div', {
          ref: 'refOptionPanel',
          class: ['vxe-table--ignore-clear vxe-select--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $select: $xeSelect }) : popupClassName) : '', {
            [`size--${vSize}`]: vSize,
            'is--transfer': btnTransfer,
            'ani--leave': !loading && reactData.isAniVisible,
            'ani--enter': !loading && visiblePanel
          }],
          attrs: {
            placement: reactData.panelPlacement
          },
          style: reactData.panelStyle
        }, initialized
          ? [
              filterable
                ? h('div', {
                  class: 'vxe-select--panel-search'
                }, [
                  h(VxeInputComponent, {
                    ref: 'refInpSearch',
                    class: 'vxe-select-search--input',
                    props: {
                      value: reactData.searchValue,
                      clearable: true,
                      placeholder: getI18n('vxe.select.search'),
                      prefixIcon: getIcon().INPUT_SEARCH
                    },
                    on: {
                      modelValue: $xeSelect.modelSearchEvent,
                      focus: $xeSelect.focusSearchEvent,
                      change: $xeSelect.triggerSearchEvent,
                      search: $xeSelect.triggerSearchEvent
                    }
                  })
                ])
                : renderEmptyElement($xeSelect),
              h('div', {
                class: 'vxe-select--panel-wrapper'
              }, [
                headerSlot
                  ? h('div', {
                    class: 'vxe-select--panel-header'
                  }, $xeSelect.callSlot(headerSlot, {}, h))
                  : renderEmptyElement($xeSelect),
                h('div', {
                  class: 'vxe-select--panel-body'
                }, [
                  h('div', {
                    ref: 'refOptionWrapper',
                    class: 'vxe-select-option--wrapper'
                  }, $xeSelect.renderOpts(h))
                ]),
                footerSlot
                  ? h('div', {
                    class: 'vxe-select--panel-footer'
                  }, $xeSelect.callSlot(footerSlot, {}, h))
                  : renderEmptyElement($xeSelect)
              ])
            ]
          : [])
      ])
    }
  },
  watch: {
    'reactData.staticOptions' (val: VxeSelectDefines.OptionInfo[]) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      if (val.some((item) => item.options && item.options.length)) {
        reactData.fullOptionList = []
        reactData.fullGroupList = val
      } else {
        reactData.fullGroupList = []
        reactData.fullOptionList = val || []
      }
      $xeSelect.cacheItemMap()
    },
    options (val) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      reactData.fullGroupList = []
      reactData.fullOptionList = val || []
      $xeSelect.cacheItemMap()
    },
    optionGroups (val) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      reactData.fullOptionList = []
      reactData.fullGroupList = val || []
      $xeSelect.cacheItemMap()
    }
  },
  mounted () {
    const $xeSelect = this
    const props = $xeSelect
    const reactData = $xeSelect.reactData

    $xeSelect.$nextTick(() => {
      const { options, optionGroups } = props
      if (optionGroups) {
        reactData.fullGroupList = optionGroups
      } else if (options) {
        reactData.fullOptionList = options
      }
      $xeSelect.cacheItemMap()
    })
    globalEvents.on($xeSelect, 'mousewheel', $xeSelect.handleGlobalMousewheelEvent)
    globalEvents.on($xeSelect, 'mousedown', $xeSelect.handleGlobalMousedownEvent)
    globalEvents.on($xeSelect, 'keydown', $xeSelect.handleGlobalKeydownEvent)
    globalEvents.on($xeSelect, 'blur', $xeSelect.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeSelect = this

    const panelElem = $xeSelect.$refs.refOptionPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeSelect, 'mousewheel')
    globalEvents.off($xeSelect, 'mousedown')
    globalEvents.off($xeSelect, 'keydown')
    globalEvents.off($xeSelect, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
