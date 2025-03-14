import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getEventTargetNode, getAbsolutePos } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, getFuncText } from '../../ui/src/utils'
import VxeInputComponent from '../../input/src/input'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeSelectPropTypes, SelectInternalData, ValueOf, VxeComponentSizeType, SelectReactData, VxeSelectEmits, VxeInputDefines, VxeSelectDefines, VxeOptgroupProps, VxeOptionProps, VxeDrawerConstructor, VxeDrawerMethods, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods, VxeInputConstructor } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

function isOptionVisible (option: any) {
  return option.visible !== false
}

function getOptUniqueId () {
  return XEUtils.uniqueId('opt_')
}

export default /* define-vxe-component start */ defineVxeComponent({
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
    defaultConfig: Object as PropType<VxeSelectPropTypes.DefaultConfig>,
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
    allowCreate: {
      type: Boolean as PropType<VxeSelectPropTypes.AllowCreate>,
      default: () => getConfig().select.allowCreate
    },
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
    // 已废弃，被 remote-config.queryMethod 替换
    remoteMethod: Function as PropType<VxeSelectPropTypes.RemoteMethod>,
    remoteConfig: Object as PropType<VxeSelectPropTypes.RemoteConfig>,
    emptyText: String as PropType<VxeSelectPropTypes.EmptyText>,
    transfer: {
      type: Boolean as PropType<VxeSelectPropTypes.Transfer>,
      default: null
    },
    virtualYConfig: Object as PropType<VxeSelectPropTypes.VirtualYConfig>,
    scrollY: Object as PropType<VxeSelectPropTypes.ScrollY>,

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
      scrollYLoad: false,
      bodyHeight: 0,
      topSpaceHeight: 0,
      optList: [],
      afterVisibleList: [],
      staticOptions: [],
      reactFlag: 0,

      currentOption: null,
      searchValue: '',
      searchLoading: false,

      panelIndex: 0,
      panelStyle: {},
      panelPlacement: null,
      triggerFocusPanel: false,
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false
    }
    const internalData: SelectInternalData = {
      synchData: [],
      fullData: [],
      optAddMaps: {},
      optGroupKeyMaps: {},
      optFullValMaps: {},
      remoteValMaps: {},

      lastScrollLeft: 0,
      lastScrollTop: 0,
      scrollYStore: {
        startIndex: 0,
        endIndex: 0,
        visibleSize: 0,
        offsetSize: 0,
        rowHeight: 0
      },

      lastScrollTime: 0,
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
    computeDefaultOpts () {
      const $xeSelect = this
      const props = $xeSelect

      return Object.assign({}, props.defaultConfig)
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
    computeSYOpts () {
      const $xeSelect = this
      const props = $xeSelect

      return Object.assign({} as { gt: number }, getConfig().select.virtualYConfig || getConfig().select.scrollY, props.virtualYConfig || props.scrollY)
    },
    computeRemoteOpts () {
      const $xeSelect = this
      const props = $xeSelect

      return Object.assign({}, getConfig().select.remoteConfig, props.remoteConfig)
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

      const { value, remote, multiple } = props
      const multiMaxCharNum = $xeSelect.computeMultiMaxCharNum
      if (XEUtils.eqNull(value)) {
        return ''
      }
      const vals = XEUtils.isArray(value) ? value : [value]
      if (remote) {
        return vals.map(val => $xeSelect.getRemoteSelectLabel(val)).join(', ')
      }
      return vals.map((val) => {
        const label = $xeSelect.getSelectLabel(val)
        if (multiple && multiMaxCharNum > 0 && label.length > multiMaxCharNum) {
          return `${label.substring(0, multiMaxCharNum)}...`
        }
        return label
      }).join(', ')
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

      const { _events } = $xeSelect as any
      if (_events && _events.modelValue) {
        $xeSelect.$emit('modelValue', value)
      } else {
        $xeSelect.$emit('model-value', value)
      }
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
    getOptKey () {
      const $xeSelect = this
      const props = $xeSelect

      const optionOpts = $xeSelect.computeOptionOpts
      return optionOpts.keyField || props.optionId || '_X_OPTION_KEY'
    },
    getOptId (option: any) {
      const $xeSelect = this

      const optid = option[$xeSelect.getOptKey()]
      return optid ? encodeURIComponent(optid) : ''
    },
    getRemoteSelectLabel  (value: any) {
      const $xeSelect = this
      const internalData = $xeSelect.internalData

      const { remoteValMaps } = internalData
      const labelField = $xeSelect.computeLabelField
      const remoteItem = remoteValMaps[value]
      const item = remoteItem ? remoteItem.item : null
      return XEUtils.toValueString(item ? item[labelField] : value)
    },
    getSelectLabel (value: any) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const { optFullValMaps } = internalData
      const labelField = $xeSelect.computeLabelField
      const cacheItem = reactData.reactFlag ? optFullValMaps[value] : null
      return cacheItem ? cacheItem.item[labelField as 'label'] : XEUtils.toValueString(value)
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
     * 处理选项，当选项被动态显示/隐藏时可能会用到
     */
    handleOption  () {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const { value, filterable, filterMethod } = props
      const { searchValue } = reactData
      const { fullData, optFullValMaps } = internalData
      const labelField = $xeSelect.computeLabelField
      const valueField = $xeSelect.computeValueField
      const searchStr = `${searchValue || ''}`.toLowerCase()
      let avList: any[] = []
      if (filterable && filterMethod) {
        avList = fullData.filter(option => isOptionVisible(option) && filterMethod({ $select: $xeSelect, group: null, option, searchValue, value }))
      } else if (filterable) {
        avList = fullData.filter(option => isOptionVisible(option) && (!searchStr || `${option[labelField]}`.toLowerCase().indexOf(searchStr) > -1))
      } else {
        avList = fullData.filter(isOptionVisible)
      }
      avList.forEach((item, index) => {
        const cacheItem = optFullValMaps[item[valueField]]
        if (cacheItem) {
          cacheItem._index = index
        }
      })
      reactData.afterVisibleList = avList
      return $xeSelect.$nextTick()
    },
    refreshOption () {
      const $xeSelect = this

      $xeSelect.handleOption()
      $xeSelect.updateYData()
      return $xeSelect.$nextTick()
    },
    cacheItemMap (datas: any[]) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const groupOptionsField = $xeSelect.computeGroupOptionsField
      const valueField = $xeSelect.computeValueField
      const key = $xeSelect.getOptKey()
      const groupKeyMaps: Record<string, any> = {}
      const fullKeyMaps: Record<string, VxeSelectDefines.OptCacheItem> = {}
      const list: any[] = []
      const handleOptItem = (item: any) => {
        list.push(item)
        let optid = $xeSelect.getOptId(item)
        if (!optid) {
          optid = getOptUniqueId()
          item[key] = optid
        }
        fullKeyMaps[item[valueField]] = {
          key: optid,
          item,
          _index: -1
        }
      }
      datas.forEach((group: any) => {
        handleOptItem(group)
        if (group[groupOptionsField]) {
          groupKeyMaps[group[key]] = group
          group[groupOptionsField].forEach(handleOptItem)
        }
      })
      internalData.fullData = list
      internalData.optGroupKeyMaps = groupKeyMaps
      internalData.optFullValMaps = fullKeyMaps
      reactData.reactFlag++
      $xeSelect.handleOption()
    },
    setCurrentOption  (option: any) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      if (option) {
        reactData.currentOption = option
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
    updateZIndex () {
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

      const { loading, filterable, remote } = props
      const { fullData, hpTimeout } = internalData
      const isDisabled = $xeSelect.computeIsDisabled
      const remoteOpts = $xeSelect.computeRemoteOpts
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
          if (remote && remoteOpts.enabled && remoteOpts.autoLoad && !fullData.length) {
            $xeSelect.triggerSearchEvent()
          } else {
            $xeSelect.handleOption()
            $xeSelect.updateYData()
          }
        }
        setTimeout(() => {
          reactData.visiblePanel = true
          $xeSelect.handleFocusSearch()
          $xeSelect.recalculate().then(() => $xeSelect.refreshScroll())
        }, 10)
        setTimeout(() => {
          $xeSelect.recalculate().then(() => $xeSelect.refreshScroll())
        }, 100)
        $xeSelect.updateZIndex()
        $xeSelect.updatePlacement()
        $xeSelect.dispatchEvent('visible-change', { visible: true }, null)
      }
    },
    hideOptionPanel () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      reactData.searchValue = ''
      reactData.searchLoading = false
      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
      $xeSelect.dispatchEvent('visible-change', { visible: false }, null)
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
      const internalData = $xeSelect.internalData

      internalData.remoteValMaps = {}
      $xeSelect.changeEvent(evnt, selectValue)
      $xeSelect.dispatchEvent('clear', { value: selectValue }, evnt)
    },
    clearEvent (params: VxeInputDefines.ClearEventParams) {
      const $xeSelect = this

      const { $event } = params
      $xeSelect.clearValueEvent($event, null)
      $xeSelect.hideOptionPanel()
    },
    changeOptionEvent (evnt: Event, option: any) {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const { value, multiple } = props
      const { remoteValMaps } = internalData
      const valueField = $xeSelect.computeValueField
      const selectValue = option[valueField]
      const remoteItem = remoteValMaps[selectValue]
      if (remoteItem) {
        remoteItem.item = option
      } else {
        remoteValMaps[selectValue] = {
          key: $xeSelect.getOptId(option),
          item: option,
          _index: -1
        }
      }
      if (multiple) {
        let multipleValue: any[] = []
        const selectVals = XEUtils.eqNull(value) ? [] : (XEUtils.isArray(value) ? value : [value])
        const index = XEUtils.findIndexOf(selectVals, val => val === selectValue)
        if (index === -1) {
          multipleValue = selectVals.concat([selectValue])
        } else {
          multipleValue = selectVals.filter((val) => val !== selectValue)
        }
        $xeSelect.changeEvent(evnt, multipleValue)
      } else {
        $xeSelect.changeEvent(evnt, selectValue)
        $xeSelect.hideOptionPanel()
      }
      reactData.reactFlag++
    },
    handleGlobalMousewheelEvent (evnt: MouseEvent) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeSelect.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = $xeSelect.$refs.refOptionPanel
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
    validOffsetOption (option: any) {
      const $xeSelect = this

      const isDisabled = option.disabled
      const optid = $xeSelect.getOptId(option)
      if (!isDisabled && !$xeSelect.hasOptGroupById(optid)) {
        return true
      }
      return false
    },
    findOffsetOption (option: any, isDwArrow: boolean) {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const { allowCreate } = props
      const { afterVisibleList, optList } = reactData
      const { optFullValMaps, optAddMaps } = internalData
      const valueField = $xeSelect.computeValueField
      let fullList = afterVisibleList
      let offsetAddIndex = 0
      if (allowCreate && optList.length) {
        const firstItem = optList[0]
        const optid = $xeSelect.getOptId(firstItem)
        if (optAddMaps[optid]) {
          offsetAddIndex = 1
          fullList = [optAddMaps[optid]].concat(fullList)
        }
      }
      if (!option) {
        if (isDwArrow) {
          for (let i = 0; i < fullList.length; i++) {
            const item = fullList[i]
            if ($xeSelect.validOffsetOption(item)) {
              return item
            }
          }
        } else {
          for (let len = fullList.length - 1; len >= 0; len--) {
            const item = fullList[len]
            if ($xeSelect.validOffsetOption(item)) {
              return item
            }
          }
        }
      }
      let avIndex = 0
      const cacheItem = option ? optFullValMaps[option[valueField]] : null
      if (cacheItem) {
        avIndex = cacheItem._index + offsetAddIndex
      }
      if (avIndex > -1) {
        if (isDwArrow) {
          for (let i = avIndex + 1; i <= fullList.length - 1; i++) {
            const item = fullList[i]
            if ($xeSelect.validOffsetOption(item)) {
              return item
            }
          }
        } else {
          if (avIndex > 0) {
            for (let len = avIndex - 1; len >= 0; len--) {
              const item = fullList[len]
              if ($xeSelect.validOffsetOption(item)) {
                return item
              }
            }
          }
        }
      }
      return null
    },
    handleGlobalKeydownEvent  (evnt: KeyboardEvent) {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData

      const { clearable } = props
      const { visiblePanel, currentOption } = reactData
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
            $xeSelect.changeOptionEvent(evnt, currentOption)
          } else if (isUpArrow || isDwArrow) {
            evnt.preventDefault()
            let offsetOption = $xeSelect.findOffsetOption(currentOption, isDwArrow)
            // 如果不匹配，默认最接近一个
            if (!offsetOption) {
              offsetOption = $xeSelect.findOffsetOption(null, isDwArrow)
            }
            if (offsetOption) {
              $xeSelect.setCurrentOption(offsetOption)
              $xeSelect.handleScrollToOption(offsetOption, isDwArrow)
            }
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
          }, 500)
        }
      }
      $xeSelect.dispatchEvent('focus', {}, evnt)
    },
    clickEvent  (evnt: MouseEvent) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      $xeSelect.togglePanelEvent(evnt)
      $xeSelect.dispatchEvent('click', { triggerButton: false, visible: reactData.visiblePanel }, evnt)
    },
    blurEvent  (evnt: FocusEvent) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      reactData.isActivated = false
      $xeSelect.dispatchEvent('blur', {}, evnt)
    },
    suffixClickEvent (evnt: MouseEvent) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      $xeSelect.togglePanelEvent(evnt)
      $xeSelect.dispatchEvent('click', { triggerButton: true, visible: reactData.visiblePanel }, evnt)
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

      const { value, remote, remoteMethod } = props
      const { searchValue } = reactData
      const remoteOpts = $xeSelect.computeRemoteOpts
      const queryMethod = remoteOpts.queryMethod || remoteMethod
      if (remote && queryMethod && remoteOpts.enabled) {
        reactData.searchLoading = true
        Promise.resolve(
          queryMethod({ $select: $xeSelect, searchValue, value })
        ).then(() => $xeSelect.$nextTick())
          .catch(() => $xeSelect.$nextTick())
          .finally(() => {
            reactData.searchLoading = false
            $xeSelect.handleOption()
            $xeSelect.updateYData()
          })
      } else {
        $xeSelect.handleOption()
        $xeSelect.updateYData()
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
    updateYSpace () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const { scrollYLoad, afterVisibleList } = reactData
      const { scrollYStore } = internalData
      reactData.bodyHeight = scrollYLoad ? afterVisibleList.length * scrollYStore.rowHeight : 0
      reactData.topSpaceHeight = scrollYLoad ? Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0) : 0
    },
    handleData () {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const { filterable, allowCreate } = props
      const { scrollYLoad, afterVisibleList, searchValue } = reactData
      const { optAddMaps, scrollYStore } = internalData
      const labelField = $xeSelect.computeLabelField
      const valueField = $xeSelect.computeValueField
      const restList = scrollYLoad ? afterVisibleList.slice(scrollYStore.startIndex, scrollYStore.endIndex) : afterVisibleList.slice(0)
      if (filterable && allowCreate && searchValue) {
        if (!restList.some(option => option[labelField] === searchValue)) {
          const addItem = optAddMaps[searchValue] || {
            [$xeSelect.getOptKey()]: searchValue,
            [labelField]: searchValue,
            [valueField]: searchValue
          }
          optAddMaps[searchValue] = addItem
          restList.unshift(addItem)
        }
      }
      reactData.optList = restList
      return $xeSelect.$nextTick()
    },
    updateYData () {
      const $xeSelect = this

      $xeSelect.handleData()
      $xeSelect.updateYSpace()
    },
    computeScrollLoad () {
      const $xeSelect = this
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      return $xeSelect.$nextTick().then(() => {
        const { scrollYLoad } = reactData
        const { scrollYStore } = internalData
        const virtualBodyElem = $xeSelect.$refs.refVirtualBody as HTMLDivElement
        const sYOpts = $xeSelect.computeSYOpts
        let rowHeight = 0
        let firstItemElem: HTMLElement | undefined
        if (virtualBodyElem) {
          if (sYOpts.sItem) {
            firstItemElem = virtualBodyElem.querySelector(sYOpts.sItem) as HTMLElement
          }
          if (!firstItemElem) {
            firstItemElem = virtualBodyElem.children[0] as HTMLElement
          }
        }
        if (firstItemElem) {
          rowHeight = firstItemElem.offsetHeight
        }
        rowHeight = Math.max(20, rowHeight)
        scrollYStore.rowHeight = rowHeight
        // 计算 Y 逻辑
        if (scrollYLoad) {
          const scrollBodyElem = $xeSelect.$refs.refVirtualWrapper as HTMLDivElement
          const visibleYSize = Math.max(8, scrollBodyElem ? Math.ceil(scrollBodyElem.clientHeight / rowHeight) : 0)
          const offsetYSize = Math.max(0, Math.min(2, XEUtils.toNumber(sYOpts.oSize)))
          scrollYStore.offsetSize = offsetYSize
          scrollYStore.visibleSize = visibleYSize
          scrollYStore.endIndex = Math.max(scrollYStore.startIndex, visibleYSize + offsetYSize, scrollYStore.endIndex)
          $xeSelect.updateYData()
        } else {
          $xeSelect.updateYSpace()
        }
      })
    },
    handleScrollToOption (option: any, isDwArrow?: boolean) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const { scrollYLoad } = reactData
      const { optFullValMaps, scrollYStore } = internalData
      const valueField = $xeSelect.computeValueField
      const cacheItem = optFullValMaps[option[valueField]]
      if (cacheItem) {
        const optid = cacheItem.key
        const avIndex = cacheItem._index
        if (avIndex > -1) {
          const optWrapperElem = $xeSelect.$refs.refVirtualWrapper as HTMLDivElement
          const panelElem = $xeSelect.$refs.refOptionPanel as HTMLDivElement
          const optElem = panelElem.querySelector(`[optid='${optid}']`) as HTMLElement
          if (optWrapperElem) {
            if (optElem) {
              const wrapperHeight = optWrapperElem.offsetHeight
              const offsetPadding = 1
              if (isDwArrow) {
                if (optElem.offsetTop + optElem.offsetHeight - optWrapperElem.scrollTop > wrapperHeight) {
                  optWrapperElem.scrollTop = optElem.offsetTop + optElem.offsetHeight - wrapperHeight
                } else if (optElem.offsetTop + offsetPadding < optWrapperElem.scrollTop || optElem.offsetTop + offsetPadding > optWrapperElem.scrollTop + optWrapperElem.clientHeight) {
                  optWrapperElem.scrollTop = optElem.offsetTop - offsetPadding
                }
              } else {
                if (optElem.offsetTop + offsetPadding < optWrapperElem.scrollTop || optElem.offsetTop + offsetPadding > optWrapperElem.scrollTop + optWrapperElem.clientHeight) {
                  optWrapperElem.scrollTop = optElem.offsetTop - offsetPadding
                } else if (optElem.offsetTop + optElem.offsetHeight - optWrapperElem.scrollTop > wrapperHeight) {
                  optWrapperElem.scrollTop = optElem.offsetTop + optElem.offsetHeight - wrapperHeight
                }
              }
            } else if (scrollYLoad) {
              if (isDwArrow) {
                optWrapperElem.scrollTop = avIndex * scrollYStore.rowHeight - optWrapperElem.clientHeight + scrollYStore.rowHeight
              } else {
                optWrapperElem.scrollTop = avIndex * scrollYStore.rowHeight
              }
            }
          }
        }
      }
    },
    /**
     * 如果有滚动条，则滚动到对应的位置
     * @param {Number} scrollLeft 左距离
     * @param {Number} scrollTop 上距离
     */
    scrollTo (scrollLeft: number | null, scrollTop?: number | null) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData

      const scrollBodyElem = $xeSelect.$refs.refVirtualWrapper as HTMLDivElement
      if (scrollBodyElem) {
        if (XEUtils.isNumber(scrollLeft)) {
          scrollBodyElem.scrollLeft = scrollLeft
        }
        if (XEUtils.isNumber(scrollTop)) {
          scrollBodyElem.scrollTop = scrollTop
        }
      }
      if (reactData.scrollYLoad) {
        return new Promise<void>(resolve => {
          setTimeout(() => {
            $xeSelect.$nextTick(() => {
              resolve()
            })
          }, 50)
        })
      }
      return $xeSelect.$nextTick()
    },
    /**
     * 刷新滚动条
     */
    refreshScroll () {
      const $xeSelect = this
      const internalData = $xeSelect.internalData

      const { lastScrollLeft, lastScrollTop } = internalData
      return $xeSelect.clearScroll().then(() => {
        if (lastScrollLeft || lastScrollTop) {
          internalData.lastScrollLeft = 0
          internalData.lastScrollTop = 0
          return $xeSelect.scrollTo(lastScrollLeft, lastScrollTop)
        }
      })
    },
    /**
     * 重新计算列表
     */
    recalculate () {
      const $xeSelect = this

      const el = $xeSelect.$refs.refElem as HTMLDivElement
      if (el && el.clientWidth && el.clientHeight) {
        return $xeSelect.computeScrollLoad()
      }
      return Promise.resolve()
    },
    loadYData (evnt: Event) {
      const $xeSelect = this
      const internalData = $xeSelect.internalData

      const { scrollYStore } = internalData
      const { startIndex, endIndex, visibleSize, offsetSize, rowHeight } = scrollYStore
      const scrollBodyElem = evnt.target as HTMLDivElement
      const scrollTop = scrollBodyElem.scrollTop
      const toVisibleIndex = Math.floor(scrollTop / rowHeight)
      const offsetStartIndex = Math.max(0, toVisibleIndex - 1 - offsetSize)
      const offsetEndIndex = toVisibleIndex + visibleSize + offsetSize
      if (toVisibleIndex <= startIndex || toVisibleIndex >= endIndex - visibleSize - 1) {
        if (startIndex !== offsetStartIndex || endIndex !== offsetEndIndex) {
          scrollYStore.startIndex = offsetStartIndex
          scrollYStore.endIndex = offsetEndIndex
          $xeSelect.updateYData()
        }
      }
    },
    // 滚动、拖动过程中不需要触发
    isVMScrollProcess () {
      const $xeSelect = this
      const internalData = $xeSelect.internalData

      const delayHover = 250
      const { lastScrollTime } = internalData
      return !!(lastScrollTime && Date.now() < lastScrollTime + delayHover)
    },
    scrollEvent (evnt: Event) {
      const $xeSelect = this
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const scrollBodyElem = evnt.target as HTMLDivElement
      const scrollTop = scrollBodyElem.scrollTop
      const scrollLeft = scrollBodyElem.scrollLeft
      const isX = scrollLeft !== internalData.lastScrollLeft
      const isY = scrollTop !== internalData.lastScrollTop
      internalData.lastScrollTop = scrollTop
      internalData.lastScrollLeft = scrollLeft
      if (reactData.scrollYLoad) {
        $xeSelect.loadYData(evnt)
      }
      internalData.lastScrollTime = Date.now()
      $xeSelect.dispatchEvent('scroll', { scrollLeft, scrollTop, isX, isY }, evnt)
    },
    /**
     * 加载数据
     * @param {Array} datas 数据
     */
    loadData (datas: any[]) {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      $xeSelect.cacheItemMap(datas || [])
      const { isLoaded, fullData, scrollYStore } = internalData
      const defaultOpts = $xeSelect.computeDefaultOpts
      const sYOpts = $xeSelect.computeSYOpts
      const valueField = $xeSelect.computeValueField
      Object.assign(scrollYStore, {
        startIndex: 0,
        endIndex: 1,
        visibleSize: 0
      })
      internalData.synchData = datas || []
      // 如果gt为0，则总是启用
      reactData.scrollYLoad = !!sYOpts.enabled && sYOpts.gt > -1 && (sYOpts.gt === 0 || sYOpts.gt <= fullData.length)
      $xeSelect.handleData()
      if (!isLoaded) {
        const { selectMode } = defaultOpts
        if (datas.length > 0 && XEUtils.eqNull(props.value)) {
          if (selectMode === 'first' || selectMode === 'last') {
            const selectItem = XEUtils[selectMode](datas)
            if (selectItem) {
              $xeSelect.$nextTick(() => {
                if (XEUtils.eqNull(props.value)) {
                  $xeSelect.emitModel(selectItem[valueField])
                }
              })
            }
          }
          internalData.isLoaded = true
        }
      }
      return $xeSelect.computeScrollLoad().then(() => {
        $xeSelect.refreshScroll()
      })
    },
    reloadData (datas: any[]) {
      const $xeSelect = this
      const internalData = $xeSelect.internalData

      internalData.isLoaded = false
      $xeSelect.clearScroll()
      return $xeSelect.loadData(datas)
    },
    clearScroll () {
      const $xeSelect = this
      const internalData = $xeSelect.internalData

      const scrollBodyElem = $xeSelect.$refs.refVirtualWrapper as HTMLDivElement
      if (scrollBodyElem) {
        scrollBodyElem.scrollTop = 0
        scrollBodyElem.scrollLeft = 0
      }
      internalData.lastScrollTop = 0
      internalData.lastScrollLeft = 0
      return $xeSelect.$nextTick()
    },
    hasOptGroupById (optid: any) {
      const $xeSelect = this
      const internalData = $xeSelect.internalData

      const { optGroupKeyMaps } = internalData
      return !!optGroupKeyMaps[optid]
    },

    //
    // Render
    //
    renderOption (h: CreateElement, list: VxeOptionProps[], group?: VxeOptgroupProps) {
      const $xeSelect = this
      const props = $xeSelect
      const slots = $xeSelect.$scopedSlots
      const reactData = $xeSelect.reactData
      const internalData = $xeSelect.internalData

      const { allowCreate, optionKey, value } = props
      const { currentOption } = reactData
      const { optAddMaps } = internalData
      const optionOpts = $xeSelect.computeOptionOpts
      const labelField = $xeSelect.computeLabelField
      const valueField = $xeSelect.computeValueField
      const groupLabelField = $xeSelect.computeGroupLabelField
      const { useKey } = optionOpts
      const optionSlot = slots.option
      return list.map((option, cIndex) => {
        const { slots, className } = option
        const optid = $xeSelect.getOptId(option)
        const optionValue = option[valueField as 'value']
        const isOptGroup = $xeSelect.hasOptGroupById(optid)
        const isAdd = !!(allowCreate && optAddMaps[optid])
        const isSelected = !isAdd && (XEUtils.isArray(value) ? value.indexOf(optionValue) > -1 : value === optionValue)
        const isVisible = isAdd || (!isOptGroup || isOptionVisible(option))
        const isDisabled = !isAdd && $xeSelect.checkOptionDisabled(isSelected, option, group)
        const defaultSlot = slots ? slots.default : null
        const optParams = { option, group: null, $select: $xeSelect }
        const optVNs = optionSlot ? $xeSelect.callSlot(optionSlot, optParams, h) : (defaultSlot ? $xeSelect.callSlot(defaultSlot, optParams, h) : getFuncText(option[(isOptGroup ? groupLabelField : labelField) as 'label']))
        return isVisible
          ? h('div', {
            key: useKey || optionKey ? optid : cIndex,
            class: ['vxe-select-option', className ? (XEUtils.isFunction(className) ? className(optParams) : className) : '', {
              'vxe-select-optgroup': isOptGroup,
              'is--disabled': isDisabled,
              'is--selected': isSelected,
              'is--add': isAdd,
              'is--hover': currentOption && $xeSelect.getOptId(currentOption) === optid
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
                if (!isDisabled && !isOptGroup) {
                  $xeSelect.changeOptionEvent(evnt, option)
                }
              },
              mouseenter: () => {
                if (!isDisabled && !isOptGroup && !$xeSelect.isVMScrollProcess()) {
                  $xeSelect.setCurrentOption(option)
                }
              }
            }
          }, allowCreate
            ? [
                h('span', {
                  key: 1,
                  class: 'vxe-select-option--label'
                }, optVNs),
                isAdd
                  ? h('span', {
                    key: 2,
                    class: 'vxe-select-option--add-icon'
                  }, [
                    h('i', {
                      class: getIcon().ADD_OPTION
                    })
                  ])
                  : renderEmptyElement($xeSelect)
              ]
            : optVNs)
          : renderEmptyElement($xeSelect)
      })
    },
    renderOpts  (h: CreateElement): VNode[] {
      const $xeSelect = this
      const props = $xeSelect
      const reactData = $xeSelect.reactData

      const { optList, searchLoading } = reactData
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
      if (optList.length) {
        return $xeSelect.renderOption(h, optList)
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
      const { initialized, isActivated, isAniVisible, visiblePanel, bodyHeight, topSpaceHeight } = reactData
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
          }, selectLabel)
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
            autoFocus: false,
            value: selectLabel
          },
          on: {
            clear: $xeSelect.clearEvent,
            click: $xeSelect.clickEvent,
            focus: $xeSelect.focusEvent,
            blur: $xeSelect.blurEvent,
            'suffix-click': $xeSelect.suffixClickEvent
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
            'ani--leave': !loading && isAniVisible,
            'ani--enter': !loading && visiblePanel
          }],
          attrs: {
            placement: reactData.panelPlacement
          },
          style: reactData.panelStyle
        }, initialized && (visiblePanel || isAniVisible)
          ? [
              h('div', {
                class: 'vxe-select--panel-wrapper'
              }, [
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
                        disabled: false,
                        readonly: false,
                        placeholder: getI18n('vxe.select.search'),
                        prefixIcon: getIcon().INPUT_SEARCH
                      },
                      on: {
                        'model-value': $xeSelect.modelSearchEvent,
                        focus: $xeSelect.focusSearchEvent,
                        change: $xeSelect.triggerSearchEvent,
                        search: $xeSelect.triggerSearchEvent
                      }
                    })
                  ])
                  : renderEmptyElement($xeSelect),
                headerSlot
                  ? h('div', {
                    class: 'vxe-select--panel-header'
                  }, $xeSelect.callSlot(headerSlot, {}, h))
                  : renderEmptyElement($xeSelect),
                h('div', {
                  class: 'vxe-select--panel-body'
                }, [
                  h('div', {
                    ref: 'refVirtualWrapper',
                    class: 'vxe-select-option--wrapper',
                    on: {
                      scroll: $xeSelect.scrollEvent
                    }
                  }, [
                    h('div', {
                      class: 'vxe-select--y-space',
                      style: {
                        height: bodyHeight ? `${bodyHeight}px` : ''
                      }
                    }),
                    h('div', {
                      ref: 'refVirtualBody',
                      class: 'vxe-select--body',
                      style: {
                        marginTop: topSpaceHeight ? `${topSpaceHeight}px` : ''
                      }
                    }, $xeSelect.renderOpts(h))
                  ])
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

      $xeSelect.loadData(val)
    },
    options (val) {
      const $xeSelect = this

      $xeSelect.loadData(val)
    },
    optionGroups (val) {
      const $xeSelect = this

      $xeSelect.loadData(val)
    }
  },
  mounted () {
    const $xeSelect = this
    const props = $xeSelect

    $xeSelect.$nextTick(() => {
      const { options, optionGroups } = props
      if (optionGroups) {
        $xeSelect.loadData(optionGroups)
      } else if (options) {
        $xeSelect.loadData(options)
      }
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
}) /* define-vxe-component end */
