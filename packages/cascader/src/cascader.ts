import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, getI18n, getIcon, globalEvents, createEvent, renderEmptyElement, getSlotVNs, globalMixins } from '../../ui'
import { getEventTargetNode, updatePanelPlacement, toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { enNodeValue, deNodeValue } from './util'
import XEUtils from 'xe-utils'
import VxeListComponent from '../../list'
import VxeInputComponent from '../../input'
import VxeButtonComponent from '../../button'

import type { CascaderReactData, VxeCascaderEmits, CascaderInternalData, VxeComponentSizeType, VxeButtonDefines, VxeCascaderDefines, VxeListSlotTypes, ValueOf, VxeInputConstructor, VxeComponentStyleType, VxeCascaderPropTypes, VxeFormDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeModalConstructor, VxeModalMethods } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

/**
 * 生成节点的唯一主键
 */
function getNodeUniqueId () {
  return XEUtils.uniqueId('node_')
}

function handleVisibleOrCheckMode (mode: '' | 'all' | 'first' | 'last' | null | undefined, isExistChild: boolean, nLevel: number) {
  if (mode) {
    if (mode === 'first') {
      return !nLevel
    }
    if (mode === 'last') {
      return !isExistChild
    }
  }
  return true
}

function createReactData (): CascaderReactData {
  return {
    initialized: false,
    searchValue: '',
    searchLoading: false,
    currentCunkList: [],
    currentItems: [],
    currentNode: null,
    panelIndex: 0,
    panelStyle: {},
    panelPlacement: null,
    triggerFocusPanel: false,
    visiblePanel: false,
    isAniVisible: false,
    isActivated: false,
    selectRadioKey: null,
    treeList: [],
    updateExpandedFlag: 1,
    updateCheckboxFlag: 1,
    fullOptFlag: 1,
    lazyOptFlag: 1
  }
}

function createInternalData (): CascaderInternalData {
  return {
    // hpTimeout: undefined,
    listVirtualYOpts: {
      enabled: true,
      gt: 20
    },
    afterTreeList: [],
    treeFullData: [],
    afterVisibleList: [],
    nodeMaps: {},
    fullNodeMaps: {},
    lazyNodeMaps: {},
    indeterminateRowMaps: {},
    selectCheckboxMaps: {},
    treeExpandedMaps: {},
    treeExpandLazyLoadedMaps: {}
    // isUpdateMode: false
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCascader',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Array] as PropType<VxeCascaderPropTypes.ModelValue>,
    clearable: Boolean as PropType<VxeCascaderPropTypes.Clearable>,
    placeholder: {
      type: String as PropType<VxeCascaderPropTypes.Placeholder>,
      default: () => XEUtils.eqNull(getConfig().cascader.placeholder) ? getI18n('vxe.base.pleaseSelect') : getConfig().cascader.placeholder
    },
    readonly: {
      type: Boolean as PropType<VxeCascaderPropTypes.Readonly>,
      default: null
    },
    loading: Boolean as PropType<VxeCascaderPropTypes.Loading>,
    disabled: {
      type: Boolean as PropType<VxeCascaderPropTypes.Disabled>,
      default: null
    },
    filterable: Boolean as PropType<VxeCascaderPropTypes.Filterable>,
    filterConfig: Object as PropType<VxeCascaderPropTypes.FilterConfig>,
    showFullLabel: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowFullLabel>,
      default: () => getConfig().cascader.showFullLabel
    },
    separator: {
      type: String as PropType<VxeCascaderPropTypes.Separator>,
      default: () => getConfig().cascader.separator
    },
    multiple: Boolean as PropType<VxeCascaderPropTypes.Multiple>,
    className: [String, Function] as PropType<VxeCascaderPropTypes.ClassName>,
    prefixIcon: String as PropType<VxeCascaderPropTypes.PrefixIcon>,
    lazyOptions: Array as PropType<VxeCascaderPropTypes.LazyOptions>,
    options: Array as PropType<VxeCascaderPropTypes.Options>,
    optionProps: Object as PropType<VxeCascaderPropTypes.OptionProps>,
    size: {
      type: String as PropType<VxeCascaderPropTypes.Size>,
      default: () => getConfig().cascader.size || getConfig().size
    },
    treeConfig: Object as PropType<VxeCascaderPropTypes.TreeConfig>,
    showRadio: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowRadio>,
      default: () => getConfig().cascader.showRadio
    },
    radioConfig: Object as PropType<VxeCascaderPropTypes.RadioConfig>,
    showCheckbox: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowCheckbox>,
      default: () => getConfig().cascader.showCheckbox
    },
    checkboxConfig: Object as PropType<VxeCascaderPropTypes.CheckboxConfig>,
    remote: Boolean as PropType<VxeCascaderPropTypes.Remote>,
    remoteConfig: Function as PropType<VxeCascaderPropTypes.RemoteConfig>,
    popupConfig: Object as PropType<VxeCascaderPropTypes.PopupConfig>,
    checkedClosable: {
      type: Boolean as PropType<VxeCascaderPropTypes.CheckedClosable>,
      default: () => getConfig().cascader.checkedClosable
    },
    clearClosable: {
      type: Boolean as PropType<VxeCascaderPropTypes.ClearClosable>,
      default: () => getConfig().cascader.clearClosable
    },
    showCloseButton: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowCloseButton>,
      default: () => getConfig().cascader.showCloseButton
    },
    showTotalButton: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowTotalButton>,
      default: () => getConfig().cascader.showTotalButton
    },
    showCheckedButton: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowCheckedButton>,
      default: () => getConfig().cascader.showCheckedButton
    },
    showClearButton: {
      type: Boolean as PropType<VxeCascaderPropTypes.ShowClearButton>,
      default: () => getConfig().cascader.showClearButton
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
    const $xeCascader = this
    return {
      $xeCascader
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: CascaderInternalData
      }),
      xID,
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
      const $xeCascader = this
      const props = $xeCascader
      const $xeForm = $xeCascader.$xeForm

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
      const $xeCascader = this
      const props = $xeCascader
      const $xeForm = $xeCascader.$xeForm

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
      const $xeCascader = this
      const $xeTable = $xeCascader.$xeTable
      const $xeModal = $xeCascader.$xeModal
      const $xeDrawer = $xeCascader.$xeDrawer
      const $xeForm = $xeCascader.$xeForm

      const popupOpts = $xeCascader.computePopupOpts as VxeCascaderPropTypes.PopupConfig
      const { transfer } = popupOpts
      if (XEUtils.isBoolean(transfer)) {
        return transfer
      }
      if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
        return true
      }
      return false
    },
    computeTreeOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, getConfig().cascader.treeConfig, props.treeConfig)
    },
    computeRadioOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, getConfig().cascader.radioConfig, props.radioConfig)
    },
    computeCheckboxOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, getConfig().cascader.checkboxConfig, props.checkboxConfig)
    },
    computePopupOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, getConfig().cascader.popupConfig, props.popupConfig)
    },
    computePropsOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return props.optionProps || {}
    },
    computeLabelField () {
      const $xeCascader = this

      const propsOpts = $xeCascader.computePropsOpts as VxeCascaderPropTypes.OptionProps
      return propsOpts.label || 'label'
    },
    computeValueField () {
      const $xeCascader = this

      const propsOpts = $xeCascader.computePropsOpts as VxeCascaderPropTypes.OptionProps
      return propsOpts.value || 'value'
    },
    computeKeyField () {
      const $xeCascader = this

      const treeOpts = $xeCascader.computeTreeOpts as VxeCascaderPropTypes.TreeConfig
      return treeOpts.keyField || 'id'
    },
    computeParentField () {
      const $xeCascader = this

      const treeOpts = $xeCascader.computeTreeOpts as VxeCascaderPropTypes.TreeConfig
      return treeOpts.parentField || 'parentId'
    },
    computeChildrenField () {
      const $xeCascader = this

      const treeOpts = $xeCascader.computeTreeOpts as VxeCascaderPropTypes.TreeConfig
      return treeOpts.childrenField || 'children'
    },
    computeMapChildrenField () {
      const $xeCascader = this

      const treeOpts = $xeCascader.computeTreeOpts as VxeCascaderPropTypes.TreeConfig
      return treeOpts.mapChildrenField || 'mapChildren'
    },
    computeHasChildField () {
      const $xeCascader = this

      const treeOpts = $xeCascader.computeTreeOpts as VxeCascaderPropTypes.TreeConfig
      return treeOpts.hasChildField || 'hasChild'
    },
    computeRemoteOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, getConfig().cascader.remoteConfig, props.remoteConfig)
    },
    computeSelectVals () {
      const $xeCascader = this
      const props = $xeCascader

      const { value: modelValue } = props
      return XEUtils.eqNull(modelValue) ? [] : (XEUtils.isArray(modelValue) ? modelValue : [modelValue])
    },
    computeSelectLabel () {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = ($xeCascader as any).reactData as CascaderReactData
      const internalData = ($xeCascader as any).internalData as CascaderInternalData

      const { showFullLabel } = props
      const { fullOptFlag, lazyOptFlag } = reactData
      const { fullNodeMaps, lazyNodeMaps } = internalData
      const labelField = $xeCascader.computeLabelField as string
      const selectVals = $xeCascader.computeSelectVals as any[]
      return selectVals.map(val => {
        const cacheItem = fullNodeMaps[val]
        if (fullOptFlag && cacheItem) {
          return showFullLabel ? cacheItem.fullLabel : cacheItem.item[labelField]
        }
        if (lazyOptFlag) {
          const lazyCacheItem = lazyNodeMaps[val]
          if (lazyCacheItem) {
            return showFullLabel ? lazyCacheItem.fullLabel : lazyCacheItem.item[labelField]
          }
        }
        return val
      }).join(', ')
    },
    computePopupWrapperStyle () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { currentCunkList, panelStyle } = reactData
      const popupOpts = $xeCascader.computePopupOpts
      const { height, nodeWidth, nodeHeight } = popupOpts
      const stys: VxeComponentStyleType = {
        ...panelStyle,
        '--vxe-ui-cascader-chunk-size': currentCunkList.length
      }
      if (height) {
        stys['--vxe-ui-cascader-chunk-height'] = toCssUnit(height)
      }
      if (nodeWidth) {
        stys['--vxe-ui-cascader-node-width'] = toCssUnit(nodeWidth)
      }
      if (nodeHeight) {
        stys['--vxe-ui-cascader-node-height'] = toCssUnit(nodeHeight)
      }
      return stys
    },
    computeFilterOpts () {
      const $xeCascader = this
      const props = $xeCascader

      return Object.assign({}, getConfig().cascader.filterConfig, props.filterConfig)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCascaderEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCascader = this
      $xeCascader.$emit(type, createEvent(evnt, { $cascader: $xeCascader }, params))
    },
    emitModel  (value: any) {
      const $xeCascader = this

      const { _events } = $xeCascader as any
      if (_events && _events.modelValue) {
        $xeCascader.$emit('modelValue', value)
      } else {
        $xeCascader.$emit('model-value', value)
      }
    },
    getNodeId (node: any) {
      const $xeCascader = this

      if (!node) {
        return ''
      }
      const valueField = $xeCascader.computeValueField
      const nodeKey = node[valueField]
      return enNodeValue(nodeKey)
    },
    isPathInTree (treeData: any[], pathIds: string[]) {
      const $xeCascader = this

      if (!pathIds || !pathIds.length) {
        return false
      }
      let currentNodes = treeData
      for (const nodeid of pathIds) {
        const found = currentNodes.find(node => $xeCascader.getNodeId(node) === nodeid)
        if (!found) {
          return false
        }
        currentNodes = found.children || []
      }
      return true
    },
    isCheckedByCheckboxNodeId (nodeid: any) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      return !!(updateCheckboxFlag && selectCheckboxMaps[nodeid])
    },
    handleCheckedCheckboxNode (nodeList: any[], checked: boolean) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { selectCheckboxMaps } = internalData
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const childrenField = $xeCascader.computeChildrenField
      const checkboxOpts = $xeCascader.computeCheckboxOpts
      const { checkStrictly } = checkboxOpts
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      const handleSelect = (node: any) => {
        const nodeid = $xeCascader.getNodeId(node)
        if (checked) {
          if (!selectCheckboxMaps[nodeid]) {
            selectCheckboxMaps[nodeid] = node
          }
        } else {
          if (selectCheckboxMaps[nodeid]) {
            delete selectCheckboxMaps[nodeid]
          }
        }
      }
      if (checkStrictly) {
        nodeList.forEach(handleSelect)
      } else {
        XEUtils.eachTree(nodeList, handleSelect, { children: transform ? mapChildrenField : childrenField })
      }
      reactData.updateCheckboxFlag++
      $xeCascader.updateCheckboxStatus()
    },
    createNode (records: any[]) {
      const $xeCascader = this

      const valueField = $xeCascader.computeValueField
      return Promise.resolve(
        records.map(obj => {
          const item = { ...obj }
          let nodeid = $xeCascader.getNodeId(item)
          if (!nodeid) {
            nodeid = getNodeUniqueId()
            XEUtils.set(item, valueField, nodeid)
          }
          return item
        })
      )
    },
    handleSetCheckboxByNodeId (nodeKeys: any | any[], checked: boolean) {
      const $xeCascader = this
      const internalData = $xeCascader.internalData

      const { nodeMaps } = internalData
      if (nodeKeys) {
        if (!XEUtils.isArray(nodeKeys)) {
          nodeKeys = [nodeKeys]
        }
        const nodeList: any[] = []
        nodeKeys.forEach((nodeKey: string) => {
          const nodeid = enNodeValue(nodeKey)
          const nodeItem = nodeMaps[nodeid]
          if (nodeItem) {
            nodeList.push(nodeItem.item)
          }
        })
        $xeCascader.handleCheckedCheckboxNode(nodeList, checked)
      }
      return $xeCascader.$nextTick()
    },
    updateCheckboxChecked (nodeKeys: any[]) {
      const $xeCascader = this
      const internalData = $xeCascader.internalData

      internalData.selectCheckboxMaps = {}
      $xeCascader.handleSetCheckboxByNodeId(nodeKeys, true)
    },
    updateModelChecked () {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { value: modelValue } = props
      const { nodeMaps } = internalData
      const expandedMaps: Record<string, boolean> = {}
      if (props.multiple) {
        if (modelValue && modelValue.length) {
          $xeCascader.updateCheckboxChecked(modelValue)
        }
      } else {
        if (modelValue) {
          const nodeid = enNodeValue(XEUtils.isArray(modelValue) ? modelValue[0] : modelValue)
          const itemRest = nodeMaps[nodeid]
          if (itemRest) {
            itemRest.nodes.forEach(item => {
              expandedMaps[$xeCascader.getNodeId(item)] = true
            })
            reactData.selectRadioKey = nodeid
          }
        }
      }
      internalData.treeExpandedMaps = expandedMaps
    },
    cacheNodeMap () {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { separator } = props
      const { treeFullData } = internalData
      const valueField = $xeCascader.computeValueField
      const labelField = $xeCascader.computeLabelField
      const childrenField = $xeCascader.computeChildrenField
      const keyMaps: Record<string, VxeCascaderDefines.NodeCacheItem> = {}
      const fullMaps: Record<string, VxeCascaderDefines.NodeCacheItem> = {}
      XEUtils.eachTree(treeFullData, (item, index, items, path, parenItem, nodes) => {
        let nodeid = $xeCascader.getNodeId(item)
        if (!nodeid) {
          nodeid = getNodeUniqueId()
          item[valueField] = nodeid
        }
        const nodeVal = item[valueField]
        const itemRest = {
          item,
          index,
          $index: -1,
          _index: -1,
          items,
          parent: parenItem,
          nodes,
          level: nodes.length - 1,
          treeIndex: index,
          lineCount: 0,
          treeLoaded: false,
          fullLabel: nodes.map(item => item[labelField]).join((separator || ' / '))
        }
        keyMaps[nodeid] = itemRest
        fullMaps[nodeVal] = itemRest
      }, { children: childrenField })
      internalData.nodeMaps = keyMaps
      internalData.fullNodeMaps = fullMaps
      reactData.fullOptFlag++
    },
    updateAfterDataIndex () {
      const $xeCascader = this
      const props = $xeCascader
      const internalData = $xeCascader.internalData

      const { separator } = props
      const { afterTreeList, nodeMaps } = internalData
      const labelField = $xeCascader.computeLabelField
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      let vtIndex = 0
      XEUtils.eachTree(afterTreeList, (item, index, items, path, parenItem, nodes) => {
        const nodeid = $xeCascader.getNodeId(item)
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          nodeItem.items = items
          nodeItem.treeIndex = index
          nodeItem._index = vtIndex
        } else {
          const rest = {
            item,
            index,
            $index: -1,
            _index: vtIndex,
            items,
            parent: parenItem,
            nodes,
            level: nodes.length - 1,
            treeIndex: index,
            lineCount: 0,
            treeLoaded: false,
            fullLabel: nodes.map(item => item[labelField]).join((separator || ' / '))
          }
          nodeMaps[nodeid] = rest
        }
        vtIndex++
      }, { children: transform ? mapChildrenField : childrenField })
    },
    updateAfterFullData () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { searchValue } = reactData
      const { treeFullData, lastFilterValue } = internalData
      const labelField = $xeCascader.computeLabelField
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      const filterOpts = $xeCascader.computeFilterOpts
      const { beforeFilterMethod, filterMethod, afterFilterMethod } = filterOpts
      let fullList = treeFullData
      let treeList = fullList
      let filterStr = ''
      if (searchValue) {
        filterStr = `${searchValue}`
        const handleSearch = filterMethod
          ? (item: any) => {
              return filterMethod({
                $cascader: $xeCascader,
                node: item,
                filterValue: filterStr
              })
            }
          : (item: any) => {
              return String(item[labelField]).toLowerCase().indexOf(filterStr.toLowerCase()) > -1
            }
        const bafParams = { $cascader: $xeCascader, filterValue: filterStr }
        if (beforeFilterMethod) {
          beforeFilterMethod(bafParams)
        }
        if (transform) {
          treeList = XEUtils.searchTree(treeFullData, handleSearch, {
            original: true,
            isEvery: false,
            children: childrenField,
            mapChildren: mapChildrenField
          })
          fullList = treeList
        } else {
          fullList = treeFullData.filter(handleSearch)
        }
        internalData.lastFilterValue = filterStr
        $xeCascader.$nextTick(() => {
          if (afterFilterMethod) {
            afterFilterMethod(bafParams)
          }
        })
      } else {
        if (transform) {
          treeList = XEUtils.searchTree(treeFullData, () => true, {
            original: true,
            isEvery: false,
            children: childrenField,
            mapChildren: mapChildrenField
          })
          fullList = treeList
          if (lastFilterValue) {
            const bafParams = { $cascader: $xeCascader, filterValue: filterStr }
            if (beforeFilterMethod) {
              beforeFilterMethod(bafParams)
            }
            // 取消筛选时自动收起
            $xeCascader.$nextTick(() => {
              if (afterFilterMethod) {
                afterFilterMethod(bafParams)
              }
            })
          }
        }
        internalData.lastFilterValue = ''
      }
      internalData.afterVisibleList = fullList
      internalData.afterTreeList = treeList
      $xeCascader.updateAfterDataIndex()
    },
    /**
     * 如果为虚拟树、则将树结构拍平
     */
    handleTreeToList () {
      const $xeCascader = this
      const internalData = $xeCascader.internalData

      const { afterTreeList, treeExpandedMaps } = internalData
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      const expandMaps: {
        [key: string]: number
      } = {}
      if (transform) {
        const fullData: any[] = []
        XEUtils.eachTree(afterTreeList, (item, index, items, path, parentRow) => {
          const nodeid = $xeCascader.getNodeId(item)
          const parentNodeid = $xeCascader.getNodeId(parentRow)
          if (!parentRow || (expandMaps[parentNodeid] && treeExpandedMaps[parentNodeid])) {
            expandMaps[nodeid] = 1
            fullData.push(item)
          }
        }, { children: mapChildrenField })
        internalData.afterVisibleList = fullData
        return fullData
      }
      return internalData.afterVisibleList
    },
    handleData (force?: boolean) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      let fullList: any[] = internalData.afterVisibleList
      if (force) {
        // 更新数据，处理筛选和排序
        $xeCascader.updateAfterFullData()
        // 如果为虚拟树，将树结构拍平
        fullList = $xeCascader.handleTreeToList()
      }
      const treeList = fullList.slice(0)
      reactData.treeList = treeList
    },
    /**
     * 获取第一个拥有子节点的节点
     */
    handleHasChildNodeIds (treeList: any[], type: 'first' | 'last') {
      const $xeCascader = this

      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      const childField = transform ? mapChildrenField : childrenField
      const nodeIds = []
      let currList = treeList
      while (currList.length) {
        let targetNode = null
        for (const item of currList) {
          const kids = item[childField]
          if (XEUtils.isArray(kids) && kids.length > 0) {
            targetNode = item
            break
          }
        }
        if (targetNode) {
          nodeIds.push($xeCascader.getNodeId(targetNode))
          currList = targetNode[childField]
        } else {
          const endNode = XEUtils[type](currList)
          nodeIds.push($xeCascader.getNodeId(endNode))
          break
        }
      }
      return nodeIds
    },
    triggerSearchEvent: XEUtils.debounce(function (this: any) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      $xeCascader.handleData(true)
      $xeCascader.updateCheckboxStatus()
      const { currentItems } = reactData
      const { afterTreeList } = internalData
      const filterOpts = $xeCascader.computeFilterOpts
      const { autoExpandMode } = filterOpts
      // 如果当前不在列表情况下，触发默认行为
      if (!$xeCascader.isPathInTree(afterTreeList, currentItems)) {
        // 默认展开
        if (autoExpandMode === 'first' || autoExpandMode === 'last') {
          const stItems: string[] = $xeCascader.handleHasChildNodeIds(afterTreeList, autoExpandMode)
          const expandedMaps: Record<string, boolean> = {}
          stItems.forEach(nodeid => {
            expandedMaps[nodeid] = true
          })
          internalData.treeExpandedMaps = expandedMaps
          reactData.currentItems = stItems
        } else {
          $xeCascader.handleCurrentItems()
        }
      }
      $xeCascader.updateCurrentChunk()
    }, 350, { trailing: true }),
    loadData (list: any[]) {
      const $xeCascader = this
      const internalData = $xeCascader.internalData

      const treeOpts = $xeCascader.computeTreeOpts
      const keyField = $xeCascader.computeKeyField
      const parentField = $xeCascader.computeParentField
      const childrenField = $xeCascader.computeChildrenField
      const { rootParentValue, rootValues } = treeOpts
      const { transform } = treeOpts
      const fullData = transform
        ? XEUtils.toArrayTree(list, {
          key: keyField,
          parentKey: parentField,
          mapChildren: childrenField,
          rootParentValue,
          rootValues
        })
        : list ? list.slice(0) : []
      internalData.treeFullData = fullData
      $xeCascader.cacheNodeMap()
      $xeCascader.handleData(true)
      $xeCascader.updateModelChecked()
      $xeCascader.handleCurrentItems()
      $xeCascader.updateCurrentChunk()
      return $xeCascader.$nextTick()
    },
    updateCurrentChunk () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { currentItems } = reactData
      const { afterTreeList } = internalData
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      const currentCunkList: any[][] = [afterTreeList]
      if (currentItems.length) {
        let chunkIndex = 0
        let stNodeid = currentItems[chunkIndex]
        let optList = afterTreeList
        while (stNodeid && optList && optList.length) {
          stNodeid = currentItems[chunkIndex++]
          const currOption = optList.find(item => stNodeid === $xeCascader.getNodeId(item))
          optList = currOption ? currOption[transform ? mapChildrenField : childrenField] : []
          if (!optList || !optList.length) {
            break
          }
          currentCunkList.push(optList)
        }
      }
      reactData.currentCunkList = currentCunkList
    },
    handleCurrentItems () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { currentNode } = reactData
      const { afterTreeList } = internalData
      const selectVals = $xeCascader.computeSelectVals
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      const stItems: string[] = []
      const expandedMaps: Record<string, boolean> = {}
      const lastVal = currentNode ? $xeCascader.getNodeId(currentNode) : enNodeValue(XEUtils.last(selectVals))
      if (lastVal) {
        const stRest = XEUtils.findTree(afterTreeList, (item) => lastVal === $xeCascader.getNodeId(item), { children: transform ? mapChildrenField : childrenField })
        if (stRest) {
          const { nodes } = stRest
          nodes.forEach(item => {
            const nodeid = $xeCascader.getNodeId(item)
            expandedMaps[nodeid] = true
            stItems.push(nodeid)
          })
        }
      }
      reactData.currentItems = stItems
      internalData.treeExpandedMaps = expandedMaps
    },
    updateZindex () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const popupOpts = $xeCascader.computePopupOpts
      const { zIndex } = popupOpts
      if (zIndex) {
        reactData.panelIndex = zIndex
      } else if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { panelIndex } = reactData
      const targetElem = $xeCascader.$refs.refElem as HTMLDivElement
      const panelElem = $xeCascader.$refs.refOptionPanel as HTMLDivElement
      const btnTransfer = $xeCascader.computeBtnTransfer
      const popupOpts = $xeCascader.computePopupOpts
      const handleStyle = () => {
        const ppObj = updatePanelPlacement(targetElem, panelElem, {
          placement: popupOpts.placement,
          defaultPlacement: popupOpts.defaultPlacement,
          teleportTo: btnTransfer,
          isMinWidth: false
        })
        const panelStyle: { [key: string]: string | number } = Object.assign(ppObj.style, {
          zIndex: panelIndex
        })
        reactData.panelStyle = panelStyle
        reactData.panelPlacement = ppObj.placement
      }
      handleStyle()
      return $xeCascader.$nextTick().then(handleStyle)
    },
    showOptionPanel (evnt?: Event) {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { loading, remote, filterable } = props
      const { treeFullData } = internalData
      const isDisabled = $xeCascader.computeIsDisabled
      const remoteOpts = $xeCascader.computeRemoteOpts
      if (!loading && !isDisabled) {
        clearTimeout(internalData.hpTimeout)
        if (!reactData.initialized) {
          reactData.initialized = true
          const btnTransfer = $xeCascader.computeBtnTransfer
          const panelElem = $xeCascader.$refs.refOptionPanel as HTMLElement
          if (btnTransfer) {
            if (panelElem) {
              document.body.appendChild(panelElem)
            }
          }
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        if (filterable) {
          if (remote && remoteOpts.enabled && remoteOpts.autoLoad && !treeFullData.length) {
            $xeCascader.handleSearchEvent()
          }
        }
        setTimeout(() => {
          reactData.visiblePanel = true
          $xeCascader.handleFocusSearch()
        }, 10)
        $xeCascader.updateZindex()
        $xeCascader.updatePlacement()
        $xeCascader.dispatchEvent('visible-change', { visible: true }, evnt || null)
      }
    },
    hideOptionPanel (evnt?: Event) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
      $xeCascader.dispatchEvent('visible-change', { visible: false }, evnt || null)
    },
    setCurrentNode (node: any) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      reactData.currentNode = node
      return $xeCascader.$nextTick()
    },
    setAllCheckboxNode (checked: boolean) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const selectMaps: Record<string, boolean> = {}
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      const checkKeys: string[] = []
      const checkNodes: any[] = []
      if (checked) {
        XEUtils.eachTree(internalData.afterTreeList, (node) => {
          const nodeid = $xeCascader.getNodeId(node)
          checkKeys.push(nodeid)
          checkNodes.push(node)
          selectMaps[nodeid] = true
        }, { children: transform ? mapChildrenField : childrenField })
      }
      internalData.indeterminateRowMaps = {}
      internalData.selectCheckboxMaps = selectMaps
      reactData.updateCheckboxFlag++
      $xeCascader.updateCheckboxStatus()
      return $xeCascader.$nextTick().then(() => {
        return { checkNodeKeys: checkKeys, checkNodes }
      })
    },
    clearSelectedNode () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      internalData.indeterminateRowMaps = {}
      internalData.selectCheckboxMaps = {}
      reactData.updateCheckboxFlag++
      reactData.selectRadioKey = null
      $xeCascader.updateCheckboxStatus()
      return $xeCascader.$nextTick().then(() => {
        return { checkNodeKeys: [], checkNodes: [] }
      })
    },
    changeEvent (evnt: Event, selectValue: any, node: any) {
      const $xeCascader = this
      const props = $xeCascader
      const internalData = $xeCascader.internalData
      const $xeForm = $xeCascader.$xeForm
      const formItemInfo = $xeCascader.formItemInfo

      const value = XEUtils.isArray(selectValue) ? selectValue.map(deNodeValue) : deNodeValue(selectValue)
      internalData.isUpdateMode = true
      $xeCascader.emitModel(value)
      if (value !== props.value) {
        $xeCascader.dispatchEvent('change', { value, node, option: node }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    clearValueEvent (evnt: Event, selectValue: any) {
      const $xeCascader = this

      $xeCascader.changeEvent(evnt, selectValue, null)
      $xeCascader.dispatchEvent('clear', { value: selectValue }, evnt)
    },
    clearEvent (params: any, evnt: Event) {
      const $xeCascader = this

      $xeCascader.clearValueEvent(evnt, null)
      $xeCascader.hideOptionPanel(evnt)
    },
    allCheckedPanelEvent (params: VxeButtonDefines.ClickEventParams) {
      const $xeCascader = this
      const props = $xeCascader

      const { $event } = params
      const { multiple, checkedClosable } = props
      if (multiple) {
        $xeCascader.setAllCheckboxNode(true).then(({ checkNodeKeys, checkNodes }) => {
          $xeCascader.changeEvent($event, checkNodeKeys, checkNodes[0])
          $xeCascader.dispatchEvent('all-change', { value: checkNodeKeys }, $event)
          if (checkedClosable) {
            $xeCascader.hideOptionPanel($event)
          }
        })
      }
    },
    clearCheckedPanelEvent (params: VxeButtonDefines.ClickEventParams) {
      const $xeCascader = this
      const props = $xeCascader

      const { $event } = params
      const { multiple, checkedClosable } = props
      const value = multiple ? [] : null
      $xeCascader.clearSelectedNode().then(() => {
        if (checkedClosable) {
          $xeCascader.hideOptionPanel($event)
        }
      })
      $xeCascader.changeEvent($event, value, null)
      $xeCascader.dispatchEvent('clear', { value }, $event)
    },
    closePanelEvent (params: VxeButtonDefines.ClickEventParams) {
      const $xeCascader = this

      const { $event } = params
      $xeCascader.hideOptionPanel($event)
    },
    handleGlobalMousewheelEvent (evnt: MouseEvent) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeCascader.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelElem = $xeCascader.$refs.refOptionPanel as HTMLDivElement
          if (getEventTargetNode(evnt, panelElem).flag) {
            $xeCascader.updatePlacement()
          } else {
            $xeCascader.hideOptionPanel(evnt)
          }
        }
      }
    },
    handleGlobalMousedownEvent (evnt: MouseEvent) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeCascader.computeIsDisabled
      if (!isDisabled) {
        const el = $xeCascader.$refs.refElem as HTMLDivElement
        const panelElem = $xeCascader.$refs.refOptionPanel as HTMLDivElement
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (visiblePanel && !reactData.isActivated) {
          $xeCascader.hideOptionPanel(evnt)
        }
      }
    },
    handleGlobalBlurEvent (evnt: Event) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        $xeCascader.hideOptionPanel(evnt)
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const $input = $xeCascader.$refs.refInput as HTMLInputElement
        if ($input) {
          $input.blur()
        }
      }
    },
    handleGlobalResizeEvent () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { visiblePanel } = reactData
      if (visiblePanel) {
        $xeCascader.updatePlacement()
      }
    },
    handleFocusSearch () {
      const $xeCascader = this
      const props = $xeCascader

      if (props.filterable) {
        $xeCascader.$nextTick(() => {
          const inpSearch = $xeCascader.$refs.refInpSearch as VxeInputConstructor
          if (inpSearch) {
            inpSearch.focus()
          }
        })
      }
    },
    changeCurrentEvent (evnt: MouseEvent, node: any) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      evnt.preventDefault()
      const isChecked = true
      reactData.currentNode = node
      $xeCascader.dispatchEvent('current-change', { node, checked: isChecked }, evnt)
    },
    changeRadioEvent (evnt: MouseEvent, node: any, chunks: any[], chunkIndex: number) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      evnt.preventDefault()
      evnt.stopPropagation()
      const { currentItems } = reactData
      const { nodeMaps } = internalData
      const radioOpts = $xeCascader.computeRadioOpts
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      const { checkMode, checkMethod } = radioOpts
      const nodeid = $xeCascader.getNodeId(node)
      const childList: any[] = node[transform ? mapChildrenField : childrenField]
      const isExistChild = childList && childList.length > 0
      const nodeItem = nodeMaps[nodeid] || {}
      const nLevel = nodeItem.level
      const isDisabled = checkMethod ? !checkMethod({ $cascader: $xeCascader, node }) : !handleVisibleOrCheckMode(checkMode, isExistChild, nLevel)
      if (isDisabled) {
        return
      }
      const value = nodeid
      reactData.selectRadioKey = value
      $xeCascader.changeEvent(evnt, value, node)
      if (!currentItems.includes(nodeid)) {
        $xeCascader.changeCurrentEvent(evnt, node)
        $xeCascader.toggleExpandEvent(evnt, node, chunks, chunkIndex)
      }
      $xeCascader.hideOptionPanel(evnt)
    },
    handleAsyncTreeExpandChilds (node: any) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const checkboxOpts = $xeCascader.computeCheckboxOpts
      const treeOpts = $xeCascader.computeTreeOpts
      const { loadMethod } = treeOpts
      const { checkStrictly } = checkboxOpts
      return new Promise<void>(resolve => {
        if (loadMethod) {
          const { nodeMaps } = internalData
          const nodeid = $xeCascader.getNodeId(node)
          const nodeItem = nodeMaps[nodeid]
          internalData.treeExpandLazyLoadedMaps[nodeid] = true
          Promise.resolve(
            loadMethod({ $cascader: $xeCascader, node })
          ).then((childRecords: any) => {
            const { treeExpandLazyLoadedMaps } = internalData
            nodeItem.treeLoaded = true
            if (treeExpandLazyLoadedMaps[nodeid]) {
              treeExpandLazyLoadedMaps[nodeid] = false
            }
            if (!XEUtils.isArray(childRecords)) {
              childRecords = []
            }
            if (childRecords) {
              return $xeCascader.loadChildrenNode(node, childRecords).then(childRows => {
                const { treeExpandedMaps } = internalData
                if (childRows.length && !treeExpandedMaps[nodeid]) {
                  treeExpandedMaps[nodeid] = true
                }
                reactData.updateExpandedFlag++
                // 如果当前节点已选中，则展开后子节点也被选中
                if (!checkStrictly && $xeCascader.isCheckedByCheckboxNodeId(nodeid)) {
                  $xeCascader.handleCheckedCheckboxNode(childRows, true)
                }
                $xeCascader.dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
                return $xeCascader.$nextTick()
              })
            } else {
              $xeCascader.dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
            }
          }).catch((e) => {
            const { treeExpandLazyLoadedMaps } = internalData
            nodeItem.treeLoaded = false
            if (treeExpandLazyLoadedMaps[nodeid]) {
              treeExpandLazyLoadedMaps[nodeid] = false
            }
            $xeCascader.dispatchEvent('load-error', { node, data: e }, new Event('load-error'))
          }).finally(() => {
            $xeCascader.handleTreeToList()
            $xeCascader.handleData()
          })
        } else {
          resolve()
        }
      })
    },
    /**
     * 展开与收起树节点
     * @param nodeList
     * @param expanded
     * @returns
     */
    handleBaseTreeExpand (nodeList: any[], expanded: boolean) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { treeExpandLazyLoadedMaps, treeExpandedMaps } = internalData
      const { nodeMaps } = internalData
      const childrenField = $xeCascader.computeChildrenField
      const hasChildField = $xeCascader.computeHasChildField
      const treeOpts = $xeCascader.computeTreeOpts
      const { lazy, toggleMethod } = treeOpts
      const result: any[] = []
      let validNodes = toggleMethod ? nodeList.filter((node: any) => toggleMethod({ $cascader: $xeCascader, expanded, node })) : nodeList

      validNodes = validNodes.length ? [validNodes[validNodes.length - 1]] : []
      // 同一级只能展开一个
      const nodeid = $xeCascader.getNodeId(validNodes[0])
      const nodeItem = nodeMaps[nodeid]
      if (nodeItem) {
        nodeItem.items.forEach(item => {
          const itemNodeId = $xeCascader.getNodeId(item)
          if (treeExpandedMaps[itemNodeId]) {
            delete treeExpandedMaps[itemNodeId]
          }
        })
      }

      const expandNodes: any[] = []
      if (expanded) {
        validNodes.forEach((item) => {
          const itemNodeId = $xeCascader.getNodeId(item)
          if (!treeExpandedMaps[itemNodeId]) {
            const nodeItem = nodeMaps[itemNodeId]
            const isLoad = lazy && item[hasChildField] && !nodeItem.treeLoaded && !treeExpandLazyLoadedMaps[itemNodeId]
            // 是否使用懒加载
            if (isLoad) {
              result.push($xeCascader.handleAsyncTreeExpandChilds(item))
            } else {
              if (item[childrenField] && item[childrenField].length) {
                treeExpandedMaps[itemNodeId] = true
                expandNodes.push(item)
              }
            }
          }
        })
      } else {
        validNodes.forEach(item => {
          const itemNodeId = $xeCascader.getNodeId(item)
          if (treeExpandedMaps[itemNodeId]) {
            delete treeExpandedMaps[itemNodeId]
            expandNodes.push(item)
          }
        })
      }
      reactData.updateExpandedFlag++
      $xeCascader.handleTreeToList()
      $xeCascader.handleData()
      return Promise.all(result)
    },
    toggleExpandEvent (evnt: MouseEvent, node: any, chunks: any[], chunkIndex: number) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { currentItems } = reactData
      const { treeExpandLazyLoadedMaps } = internalData
      const treeOpts = $xeCascader.computeTreeOpts
      const { lazy } = treeOpts
      const stItems = currentItems.slice(0, chunkIndex)
      const nodeid = $xeCascader.getNodeId(node)
      const expanded = true
      evnt.stopPropagation()
      stItems.push(nodeid)
      reactData.currentItems = stItems
      if (!lazy || !treeExpandLazyLoadedMaps[nodeid]) {
        $xeCascader.handleBaseTreeExpand([node], expanded)
      }
      $xeCascader.setCurrentNode(node)
      $xeCascader.updateCurrentChunk()
      $xeCascader.dispatchEvent('node-expand', { node, expanded }, evnt)
    },
    updateCheckboxStatus () {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      const { selectCheckboxMaps, indeterminateRowMaps, afterTreeList } = internalData
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const checkboxOpts = $xeCascader.computeCheckboxOpts
      const { checkStrictly, checkMethod } = checkboxOpts
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      if (!checkStrictly) {
        const childRowMaps: Record<string, number> = {}
        const childRowList: any[][] = []
        XEUtils.eachTree(afterTreeList, (node) => {
          const nodeid = $xeCascader.getNodeId(node)
          const childList = node[transform ? mapChildrenField : childrenField]
          if (childList && childList.length && !childRowMaps[nodeid]) {
            childRowMaps[nodeid] = 1
            childRowList.unshift([node, nodeid, childList])
          }
        }, { children: transform ? mapChildrenField : childrenField })

        childRowList.forEach(vals => {
          const node: string = vals[0]
          const nodeid: string = vals[1]
          const childList: any[] = vals[2]
          let sLen = 0 // 已选
          let hLen = 0 // 半选
          let vLen = 0 // 有效子行
          const cLen = childList.length // 子行
          childList.forEach(
            checkMethod
              ? (item) => {
                  const childNodeid = $xeCascader.getNodeId(item)
                  const isSelect = selectCheckboxMaps[childNodeid]
                  if (checkMethod({ $cascader: $xeCascader, node: item })) {
                    if (isSelect) {
                      sLen++
                    } else if (indeterminateRowMaps[childNodeid]) {
                      hLen++
                    }
                    vLen++
                  } else {
                    if (isSelect) {
                      sLen++
                    } else if (indeterminateRowMaps[childNodeid]) {
                      hLen++
                    }
                  }
                }
              : item => {
                const childNodeid = $xeCascader.getNodeId(item)
                const isSelect = selectCheckboxMaps[childNodeid]
                if (isSelect) {
                  sLen++
                } else if (indeterminateRowMaps[childNodeid]) {
                  hLen++
                }
                vLen++
              }
          )

          let isSelected = false
          if (cLen > 0) {
            if (vLen > 0) {
              isSelected = (sLen > 0 || hLen > 0) && sLen >= vLen
            } else {
            // 如果存在子项禁用
              if ((sLen > 0 && sLen >= vLen)) {
                isSelected = true
              } else if (selectCheckboxMaps[nodeid]) {
                isSelected = true
              } else {
                isSelected = false
              }
            }
          } else {
          // 如果无子项
            isSelected = selectCheckboxMaps[nodeid]
          }
          const halfSelect = !isSelected && (sLen > 0 || hLen > 0)

          if (isSelected) {
            selectCheckboxMaps[nodeid] = node
            if (indeterminateRowMaps[nodeid]) {
              delete indeterminateRowMaps[nodeid]
            }
          } else {
            if (selectCheckboxMaps[nodeid]) {
              delete selectCheckboxMaps[nodeid]
            }
            if (halfSelect) {
              indeterminateRowMaps[nodeid] = node
            } else {
              if (indeterminateRowMaps[nodeid]) {
                delete indeterminateRowMaps[nodeid]
              }
            }
          }
        })
        reactData.updateCheckboxFlag++
      }
    },
    changeCheckboxEvent (evnt: MouseEvent, node: any, chunks: any[], chunkIndex: number) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData

      evnt.preventDefault()
      evnt.stopPropagation()
      // const { filterable } = props
      const { currentItems } = reactData
      const { selectCheckboxMaps, nodeMaps } = internalData
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const checkboxOpts = $xeCascader.computeCheckboxOpts
      const { checkStrictly, checkMode, checkMethod } = checkboxOpts
      const treeOpts = $xeCascader.computeTreeOpts
      const { transform } = treeOpts
      const nodeid = $xeCascader.getNodeId(node)
      const childList: any[] = node[transform ? mapChildrenField : childrenField]
      const isExistChild = childList && childList.length > 0
      const nodeItem = nodeMaps[nodeid] || {}
      const nLevel = nodeItem.level
      const isDisabled = checkMethod ? !checkMethod({ $cascader: $xeCascader, node }) : !handleVisibleOrCheckMode(checkMode, isExistChild, nLevel)
      if (isDisabled) {
        return
      }
      let isChecked = false
      if (selectCheckboxMaps[nodeid]) {
        delete selectCheckboxMaps[nodeid]
      } else {
        isChecked = true
        selectCheckboxMaps[nodeid] = node
      }
      if (!checkStrictly) {
        XEUtils.eachTree(childList, (childNode) => {
          const childNodeid = $xeCascader.getNodeId(childNode)
          if (isChecked) {
            if (!selectCheckboxMaps[childNodeid]) {
              selectCheckboxMaps[childNodeid] = true
            }
          } else {
            if (selectCheckboxMaps[childNodeid]) {
              delete selectCheckboxMaps[childNodeid]
            }
          }
        }, { children: transform ? mapChildrenField : childrenField })
      }
      reactData.updateCheckboxFlag++
      $xeCascader.updateCheckboxStatus()
      const nodeids = XEUtils.keys(selectCheckboxMaps)
      const value = nodeids
      $xeCascader.changeEvent(evnt, value, node)
      if (!currentItems.includes(nodeid)) {
        $xeCascader.changeCurrentEvent(evnt, node)
        $xeCascader.toggleExpandEvent(evnt, node, chunks, chunkIndex)
      }
    },
    handleNodeClickEvent (evnt: MouseEvent, node: any, chunks: any[], chunkIndex: number) {
      const $xeCascader = this
      const props = $xeCascader

      const { multiple, showCheckbox, showRadio } = props
      const treeOpts = $xeCascader.computeTreeOpts
      const radioOpts = $xeCascader.computeRadioOpts
      const checkboxOpts = $xeCascader.computeCheckboxOpts
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const { transform, trigger } = treeOpts
      const childList: any[] = node[transform ? mapChildrenField : childrenField]
      let triggerCurrent = false
      let triggerRadio = false
      let triggerCheckbox = false
      let triggerExpand = false
      triggerCurrent = true
      $xeCascader.changeCurrentEvent(evnt, node)
      if (trigger !== 'icon') {
        triggerExpand = true
        $xeCascader.toggleExpandEvent(evnt, node, chunks, chunkIndex)
      }
      if (multiple) {
        if (checkboxOpts.trigger === 'node' || (!showCheckbox && (!childList || !childList.length))) {
          triggerCheckbox = true
          $xeCascader.changeCheckboxEvent(evnt, node, chunks, chunkIndex)
        }
      } else {
        if (radioOpts.trigger === 'node' || (!showRadio && (!childList || !childList.length))) {
          triggerRadio = true
          $xeCascader.changeRadioEvent(evnt, node, chunks, chunkIndex)
        }
      }
      $xeCascader.dispatchEvent('node-click', { node, triggerCurrent, triggerRadio, triggerCheckbox, triggerExpand }, evnt)
    },
    focusEvent (evnt: FocusEvent) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const isDisabled = $xeCascader.computeIsDisabled
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          reactData.triggerFocusPanel = true
          $xeCascader.showOptionPanel(evnt)
          setTimeout(() => {
            reactData.triggerFocusPanel = false
          }, 150)
        }
      }
      $xeCascader.dispatchEvent('focus', {}, evnt)
    },
    clickEvent (evnt: MouseEvent) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      evnt.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (!reactData.visiblePanel) {
          $xeCascader.showOptionPanel(evnt)
        }
      }
      $xeCascader.dispatchEvent('click', {}, evnt)
    },
    blurEvent (evnt: FocusEvent) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      reactData.isActivated = false
      $xeCascader.dispatchEvent('blur', {}, evnt)
    },
    modelSearchEvent (value: string) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      reactData.searchValue = value
      $xeCascader.triggerSearchEvent(new Event('filter'))
    },
    handleSearchEvent () {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData

      const { value: modelValue, remote } = props
      const { searchValue } = reactData
      const remoteOpts = $xeCascader.computeRemoteOpts
      const queryMethod = remoteOpts.queryMethod
      if (remote && queryMethod && remoteOpts.enabled) {
        reactData.searchLoading = true
        Promise.resolve(
          queryMethod({ $cascader: $xeCascader, searchValue, value: modelValue })
        ).then(() => $xeCascader.$nextTick())
          .catch(() => $xeCascader.$nextTick())
          .finally(() => {
            reactData.searchLoading = false
          })
      }
    },
    togglePanelEvent (params: any) {
      const $xeCascader = this
      const reactData = $xeCascader.reactData

      const { $event } = params
      $event.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (reactData.visiblePanel) {
          $xeCascader.hideOptionPanel($event)
        } else {
          $xeCascader.showOptionPanel($event)
        }
      }
    },
    /**
       * 用于树结构，给行数据加载子节点
       */
    loadChildrenNode (node: any, childRecords: any[]) {
      const $xeCascader = this
      const props = $xeCascader
      const internalData = $xeCascader.internalData

      const { separator } = props
      const { nodeMaps } = internalData
      const treeOpts = $xeCascader.computeTreeOpts
      const labelField = $xeCascader.computeLabelField
      const { lazy, transform } = treeOpts
      if (!lazy) {
        return Promise.resolve([])
      }
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const parentNodeItem = nodeMaps[$xeCascader.getNodeId(node)]
      const parentLevel = parentNodeItem ? parentNodeItem.level : 0
      const parentNodes = parentNodeItem ? parentNodeItem.nodes : []
      return $xeCascader.createNode(childRecords).then((nodeList) => {
        XEUtils.eachTree(nodeList, (childRow, index, items, path, parent, nodes) => {
          const itemNodeId = $xeCascader.getNodeId(childRow)
          nodeMaps[itemNodeId] = {
            item: childRow,
            index: -1,
            $index: -1,
            _index: -1,
            items,
            parent: parent || parentNodeItem.item,
            nodes: parentNodes.concat(nodes),
            level: parentLevel + nodes.length,
            treeIndex: -1,
            lineCount: 0,
            treeLoaded: false,
            fullLabel: nodes.map(item => item[labelField]).join((separator || ' / '))
          }
        }, { children: childrenField })
        node[childrenField] = nodeList
        if (transform) {
          node[mapChildrenField] = nodeList
        }
        $xeCascader.updateAfterDataIndex()
        return nodeList
      })
    },

    //
    // Render
    //
    renderRadio (h: CreateElement, node: any, isExistChild: boolean, nLevel: number, isChecked: boolean, chunks: any[], chunkIndex: number) {
      const $xeCascader = this
      const props = $xeCascader

      const { showRadio } = props
      const radioOpts = $xeCascader.computeRadioOpts
      const { checkMode, checkMethod, visibleMode, visibleMethod } = radioOpts
      const isVisible = visibleMethod ? visibleMethod({ $cascader: $xeCascader, node }) : handleVisibleOrCheckMode(visibleMode, isExistChild, nLevel)
      if (showRadio && isVisible) {
        const isDisabled = checkMethod ? !checkMethod({ $cascader: $xeCascader, node }) : !handleVisibleOrCheckMode(checkMode, isExistChild, nLevel)
        return h('div', {
          class: ['vxe-tree--radio-option', {
            'is--checked': isChecked,
            'is--disabled': isDisabled
          }],
          on: {
            click: (evnt: MouseEvent) => {
              if (!isDisabled) {
                $xeCascader.changeRadioEvent(evnt, node, chunks, chunkIndex)
              }
            }
          }
        }, [
          h('span', {
            class: ['vxe-radio--icon', isChecked ? getIcon().RADIO_CHECKED : getIcon().RADIO_UNCHECKED]
          })
        ])
      }
      return renderEmptyElement($xeCascader)
    },
    renderCheckbox (h: CreateElement, node: any, isExistChild: boolean, nLevel: number, isChecked: boolean, isIndeterminate: boolean, chunks: any[], chunkIndex: number) {
      const $xeCascader = this
      const props = $xeCascader

      const { showCheckbox } = props
      const checkboxOpts = $xeCascader.computeCheckboxOpts
      const { checkMode, checkMethod, visibleMode, visibleMethod } = checkboxOpts
      const isVisible = visibleMethod ? visibleMethod({ $cascader: $xeCascader, node }) : handleVisibleOrCheckMode(visibleMode, isExistChild, nLevel)
      if (showCheckbox && isVisible) {
        const isDisabled = checkMethod ? !checkMethod({ $cascader: $xeCascader, node }) : !handleVisibleOrCheckMode(checkMode, isExistChild, nLevel)
        return h('div', {
          class: ['vxe-cascader--checkbox-option', {
            'is--checked': isChecked,
            'is--indeterminate': isIndeterminate,
            'is--disabled': isDisabled
          }],
          on: {
            click (evnt: MouseEvent) {
              if (!isDisabled) {
                $xeCascader.changeCheckboxEvent(evnt, node, chunks, chunkIndex)
              }
            }
          }
        }, [
          h('span', {
            class: ['vxe-checkbox--icon', isIndeterminate ? getIcon().CHECKBOX_INDETERMINATE : (isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED)]
          })
        ])
      }
      return renderEmptyElement($xeCascader)
    },
    renderNode (h: CreateElement, node: any, nodeid: string, nodeIndex: number, chunks: any[], chunkIndex: number) {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData
      const slots = $xeCascader.$scopedSlots

      const { multiple } = props
      const { currentNode, selectRadioKey, updateCheckboxFlag, updateExpandedFlag } = reactData
      const { nodeMaps, selectCheckboxMaps, indeterminateRowMaps, treeExpandedMaps, treeExpandLazyLoadedMaps } = internalData
      const treeOpts = $xeCascader.computeTreeOpts
      const { lazy, transform, iconLoaded, iconOpen, iconClose } = treeOpts
      const childrenField = $xeCascader.computeChildrenField
      const mapChildrenField = $xeCascader.computeMapChildrenField
      const labelField = $xeCascader.computeLabelField
      const hasChildField = $xeCascader.computeHasChildField
      const childList: any[] = node[transform ? mapChildrenField : childrenField]
      const isExistChild = childList && childList.length > 0
      const iconSlot = slots.icon
      const titleSlot = slots.title
      const isExpand = updateExpandedFlag && treeExpandedMaps[nodeid]
      const nodeItem = nodeMaps[nodeid] || {}
      const nodeTitle = node[labelField]
      const nLevel = nodeItem.level

      let isRadioChecked = false
      if (!multiple) {
        isRadioChecked = nodeid === selectRadioKey
      }

      let isCheckboxChecked = false
      let isIndeterminate = false
      if (multiple) {
        isCheckboxChecked = !!(updateCheckboxFlag && selectCheckboxMaps[nodeid])
        isIndeterminate = !!(updateCheckboxFlag && indeterminateRowMaps[nodeid])
      }

      let hasLazyChilds = false
      let isLazyLoading = false
      let isLazyLoaded = false
      if (lazy) {
        isLazyLoading = !!treeExpandLazyLoadedMaps[nodeid]
        hasLazyChilds = node[hasChildField]
        isLazyLoaded = !!nodeItem.treeLoaded
      }
      const nParams = { node }
      return h('div', {
        key: `${chunkIndex}_${nodeIndex}`,
        class: ['vxe-cascader-chunk--node-item', {
          'is--current': currentNode && (currentNode === node || $xeCascader.getNodeId(currentNode) === nodeid),
          'is-radio--checked': isRadioChecked,
          'is-checkbox--checked': isCheckboxChecked,
          'is-checkbox--indeterminate': isIndeterminate,
          'is--expand': isExpand
        }],
        attrs: {
          title: nodeTitle
        },
        on: {
          mousedown (evnt: MouseEvent) {
            const isLeftBtn = evnt.button === 0
            if (isLeftBtn) {
              evnt.stopPropagation()
            }
          },
          click (evnt: MouseEvent) {
            $xeCascader.handleNodeClickEvent(evnt, node, chunks, chunkIndex)
          }
        }
      }, [
        multiple ? $xeCascader.renderCheckbox(h, node, isExistChild, nLevel, isCheckboxChecked, isIndeterminate, chunks, chunkIndex) : $xeCascader.renderRadio(h, node, isExistChild, nLevel, isRadioChecked, chunks, chunkIndex),
        h('div', {
          class: 'vxe-cascader-chunk--node-item-inner'
        }, [
          h('div', {
            class: 'vxe-cascader-chunk--node-item-title'
          }, titleSlot ? getSlotVNs(titleSlot(nParams)) : nodeTitle)
        ]),
        treeOpts.showIcon && (lazy ? (isLazyLoaded ? isExistChild : hasLazyChilds) : isExistChild)
          ? h('div', {
            class: 'vxe-cascader-chunk--node-item-switcher'
          }, [
            [
              h('div', {
                class: 'vxe-cascader--node-item-icon',
                on: {
                  click (evnt: MouseEvent) {
                    if (treeOpts.trigger === 'icon') {
                      $xeCascader.toggleExpandEvent(evnt, node, chunks, chunkIndex)
                    }
                  }
                }
              }, iconSlot
                ? getSlotVNs(iconSlot(nParams))
                : [
                    h('i', {
                      class: isLazyLoading ? (iconLoaded || getIcon().CASCADER_NODE_LOADED) : (isExpand ? (iconOpen || getIcon().CASCADER_NODE_OPEN) : (iconClose || getIcon().CASCADER_NODE_CLOSE))
                    })
                  ])
            ]
          ])
          : renderEmptyElement($xeCascader)
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeCascader = this
      const props = $xeCascader
      const reactData = $xeCascader.reactData
      const internalData = $xeCascader.internalData
      const slots = $xeCascader.$scopedSlots

      const { className, value: modelValue, multiple, loading, filterable, showTotalButton, showCheckedButton, showClearButton, showCloseButton } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, searchValue, currentCunkList } = reactData
      const { listVirtualYOpts } = internalData
      const vSize = $xeCascader.computeSize
      const isDisabled = $xeCascader.computeIsDisabled
      const selectLabel = $xeCascader.computeSelectLabel
      const btnTransfer = $xeCascader.computeBtnTransfer
      const formReadonly = $xeCascader.computeFormReadonly
      const popupWrapperStyle = $xeCascader.computePopupWrapperStyle
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      const popupOpts = $xeCascader.computePopupOpts
      const popupClassName = popupOpts.className

      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-cascader--readonly', className]
        }, [
          h('span', {
            class: 'vxe-cascader-label'
          }, selectLabel)
        ])
      }
      const selectVals = XEUtils.eqNull(modelValue) ? [] : (XEUtils.isArray(modelValue) ? modelValue : [modelValue])
      return h('div', {
        ref: 'refElem',
        class: ['vxe-cascader', className ? (XEUtils.isFunction(className) ? className({ $cascader: $xeCascader }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--filterable': filterable,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--loading': loading,
          'is--active': isActivated
        }]
      }, [
        h(VxeInputComponent, {
          ref: 'refInput',
          props: {
            clearable: props.clearable,
            placeholder: loading ? getI18n('vxe.select.loadingText') : props.placeholder,
            editable: false,
            disabled: isDisabled,
            type: 'text',
            prefixIcon: props.prefixIcon,
            suffixIcon: loading ? getIcon().TREE_SELECT_LOADED : (visiblePanel ? getIcon().TREE_SELECT_OPEN : getIcon().TREE_SELECT_CLOSE),
            value: loading ? '' : selectLabel,
            title: selectLabel
          },
          on: {
            clear: $xeCascader.clearEvent,
            click: $xeCascader.clickEvent,
            focus: $xeCascader.focusEvent,
            blur: $xeCascader.blurEvent,
            'suffix-click': $xeCascader.togglePanelEvent
          },
          scopedSlots: prefixSlot
            ? {
                prefix: () => prefixSlot({})
              }
            : undefined
        }),
        h('div', {
          ref: 'refOptionPanel',
          class: ['vxe-table--ignore-clear vxe-cascader--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $cascader: $xeCascader }) : popupClassName) : '', {
            [`size--${vSize}`]: vSize,
            'is--transfer': btnTransfer,
            'ani--leave': !loading && isAniVisible,
            'ani--enter': !loading && visiblePanel
          }],
          attrs: {
            placement: reactData.panelPlacement
          },
          style: popupWrapperStyle
        }, initialized
          ? [
              h('div', {
                class: 'vxe-cascader--panel-wrapper'
              }, [
                filterable
                  ? h('div', {
                    class: 'vxe-cascader--panel-search'
                  }, [
                    h(VxeInputComponent, {
                      ref: 'refInpSearch',
                      class: 'vxe-cascader-search--input',
                      props: {
                        value: searchValue,
                        clearable: true,
                        disabled: false,
                        readonly: false,
                        placeholder: getI18n('vxe.cascader.search'),
                        prefixIcon: getIcon().INPUT_SEARCH
                      },
                      on: {
                        'model-value': $xeCascader.modelSearchEvent
                      }
                    })
                  ])
                  : renderEmptyElement($xeCascader),
                (showCheckedButton && multiple) || showClearButton || headerSlot
                  ? h('div', {
                    class: 'vxe-cascader--panel-header'
                  }, headerSlot
                    ? headerSlot({})
                    : [
                        h('div', {
                          class: 'vxe-cascader--header-button'
                        }, [
                          (showCheckedButton && multiple) || showClearButton
                            ? h('div', {
                              class: 'vxe-cascader--selected-btns'
                            }, [
                              (showCheckedButton && multiple)
                                ? h(VxeButtonComponent, {
                                  props: {
                                    content: getI18n('vxe.treeSelect.allChecked'),
                                    mode: 'text'
                                  },
                                  on: {
                                    click: $xeCascader.allCheckedPanelEvent
                                  }
                                })
                                : renderEmptyElement($xeCascader),
                              showClearButton
                                ? h(VxeButtonComponent, {
                                  props: {
                                    content: getI18n('vxe.treeSelect.clearChecked'),
                                    mode: 'text'
                                  },
                                  on: {
                                    click: $xeCascader.clearCheckedPanelEvent
                                  }
                                })
                                : renderEmptyElement($xeCascader)
                            ])
                            : renderEmptyElement($xeCascader)
                        ])
                      ])
                  : renderEmptyElement($xeCascader),
                h('div', {
                  class: 'vxe-cascader--panel-body'
                }, [
                  h('div', {
                    ref: 'refChunkWrapper',
                    class: 'vxe-cascader-chunk--wrapper'
                  }, [
                    currentCunkList.map((chunks, chunkIndex) => {
                      return h('div', {
                        key: chunkIndex,
                        class: 'vxe-cascader-chunk--item-wrapper'
                      }, [
                        h(VxeListComponent, {
                          props: {
                            data: chunks,
                            virtualYConfig: listVirtualYOpts
                          },
                          scopedSlots: {
                            default (slotParams: VxeListSlotTypes.DefaultSlotParams) {
                              const { items } = slotParams
                              return items.map((node, nodeIndex) => {
                                const nodeid = $xeCascader.getNodeId(node)
                                return $xeCascader.renderNode(h, node, nodeid, nodeIndex, chunks, chunkIndex)
                              })
                            }
                          }
                        })
                      ])
                    })
                  ])
                ]),
                footerSlot || showTotalButton || showCloseButton
                  ? h('div', {
                    class: 'vxe-cascader--panel-footer'
                  }, footerSlot
                    ? footerSlot({})
                    : [
                        h('div', {
                          class: 'vxe-cascader--footer-button'
                        }, [
                          showTotalButton
                            ? h('div', {
                              class: 'vxe-cascader--total-btns'
                            }, getI18n('vxe.treeSelect.total', [selectVals.length]))
                            : renderEmptyElement($xeCascader),
                          showCloseButton
                            ? h('div', {
                              class: 'vxe-cascader--oper-btns'
                            }, [
                              h(VxeButtonComponent, {
                                props: {
                                  content: getI18n('vxe.select.close'),
                                  mode: 'text'
                                },
                                on: {
                                  click: $xeCascader.closePanelEvent
                                }
                              })
                            ])
                            : renderEmptyElement($xeCascader)
                        ])
                      ])
                  : renderEmptyElement($xeCascader)
              ])
            ]
          : [])
      ])
    }
  },
  watch: {
    value () {
      const $xeCascader = this
      const internalData = $xeCascader.internalData

      if (!internalData.isUpdateMode) {
        $xeCascader.updateModelChecked()
        $xeCascader.handleCurrentItems()
        $xeCascader.updateCurrentChunk()
      }
      internalData.isUpdateMode = false
    },
    options () {
      const $xeCascader = this
      const props = $xeCascader

      $xeCascader.loadData(props.options || [])
    }
  },
  created () {
    const $xeCascader = this
    const props = $xeCascader
    const reactData = $xeCascader.reactData

    $xeCascader.internalData = createInternalData()

    if (!props.multiple) {
      reactData.selectRadioKey = enNodeValue(props.value)
    }
    $xeCascader.loadData(props.options || [])
  },
  mounted () {
    const $xeCascader = this

    globalEvents.on($xeCascader, 'mousewheel', $xeCascader.handleGlobalMousewheelEvent)
    globalEvents.on($xeCascader, 'mousedown', $xeCascader.handleGlobalMousedownEvent)
    globalEvents.on($xeCascader, 'blur', $xeCascader.handleGlobalBlurEvent)
    globalEvents.on($xeCascader, 'resize', $xeCascader.handleGlobalResizeEvent)
  },
  beforeDestroy () {
    const $xeCascader = this
    const reactData = $xeCascader.reactData
    const internalData = $xeCascader.internalData

    const panelElem = $xeCascader.$refs.refOptionPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeCascader, 'mousewheel')
    globalEvents.off($xeCascader, 'mousedown')
    globalEvents.off($xeCascader, 'blur')
    globalEvents.off($xeCascader, 'resize')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
