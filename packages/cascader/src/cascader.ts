import { ref, computed, h, PropType, nextTick, inject, provide, reactive, Teleport, onMounted, onUnmounted, watch } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, getI18n, getIcon, globalEvents, createEvent, useSize, renderEmptyElement, getSlotVNs } from '../../ui'
import { getEventTargetNode, updatePanelPlacement, toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { enNodeValue, deNodeValue } from './util'
import XEUtils from 'xe-utils'
import VxeListComponent from '../../list'
import VxeInputComponent from '../../input'
import VxeButtonComponent from '../../button'

import type { CascaderReactData, VxeCascaderEmits, CascaderInternalData, VxeButtonEvents, ValueOf, VxeComponentStyleType, VxeCascaderDefines, CascaderPrivateRef, CascaderPrivateMethods, CascaderMethods, VxeCascaderPrivateComputed, VxeCascaderPropTypes, VxeCascaderConstructor, VxeListSlotTypes, VxeFormDefines, VxeDrawerConstructor, VxeDrawerMethods, VxeCascaderPrivateMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeInputConstructor, VxeModalConstructor, VxeModalMethods } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

/**
 * 生成节点的唯一主键
 */
function getNodeUniqueId () {
  return XEUtils.uniqueId('node_')
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

export default defineVxeComponent({
  name: 'VxeCascader',
  props: {
    modelValue: [String, Number, Array] as PropType<VxeCascaderPropTypes.ModelValue>,
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
  emits: [
    'update:modelValue',
    'change',
    'all-change',
    'clear',
    'blur',
    'focus',
    'click',
    'node-click',
    'node-expand',
    'current-change',
    'radio-change',
    'checkbox-change',
    'load-success',
    'load-error',
    'visible-change'
  ] as VxeCascaderEmits,
  setup (props, context) {
    const { emit, slots } = context

    const $xeModal = inject<(VxeModalConstructor & VxeModalMethods)| null>('$xeModal', null)
    const $xeDrawer = inject<(VxeDrawerConstructor & VxeDrawerMethods) | null>('$xeDrawer', null)
    const $xeTable = inject<(VxeTableConstructor & VxeTablePrivateMethods) | null>('$xeTable', null)
    const $xeForm = inject<(VxeFormConstructor & VxeFormPrivateMethods) | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()
    const refInput = ref<VxeInputConstructor>()
    const refInpSearch = ref<VxeInputConstructor>()
    const refChunkWrapper = ref<HTMLDivElement>()
    const refOptionPanel = ref<HTMLDivElement>()

    const reactData = reactive(createReactData())
    const internalData = createInternalData()

    const refMaps: CascaderPrivateRef = {
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

    const computeBtnTransfer = computed(() => {
      const popupOpts = computePopupOpts.value
      const { transfer } = popupOpts
      if (XEUtils.isBoolean(transfer)) {
        return transfer
      }
      if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
        return true
      }
      return false
    })

    const computeTreeOpts = computed(() => {
      return Object.assign({}, getConfig().cascader.treeConfig, props.treeConfig)
    })

    const computeRadioOpts = computed(() => {
      return Object.assign({}, getConfig().cascader.radioConfig, props.radioConfig)
    })

    const computeCheckboxOpts = computed(() => {
      return Object.assign({}, getConfig().cascader.checkboxConfig, props.checkboxConfig)
    })

    const computePopupOpts = computed(() => {
      return Object.assign({}, getConfig().cascader.popupConfig, props.popupConfig)
    })

    const computePropsOpts = computed(() => {
      return props.optionProps || {}
    })

    const computeLabelField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.label || 'label'
    })

    const computeValueField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.value || 'value'
    })

    const computeKeyField = computed(() => {
      const treeOpts = computeTreeOpts.value
      return treeOpts.keyField || 'id'
    })

    const computeParentField = computed(() => {
      const treeOpts = computeTreeOpts.value
      return treeOpts.parentField || 'parentId'
    })

    const computeChildrenField = computed(() => {
      const treeOpts = computeTreeOpts.value
      return treeOpts.childrenField || 'children'
    })

    const computeMapChildrenField = computed(() => {
      const treeOpts = computeTreeOpts.value
      return treeOpts.mapChildrenField || 'mapChildren'
    })

    const computeHasChildField = computed(() => {
      const treeOpts = computeTreeOpts.value
      return treeOpts.hasChildField || 'hasChild'
    })

    const computeRemoteOpts = computed(() => {
      return Object.assign({}, getConfig().cascader.remoteConfig, props.remoteConfig)
    })

    const computeSelectVals = computed(() => {
      const { modelValue } = props
      return XEUtils.eqNull(modelValue) ? [] : (XEUtils.isArray(modelValue) ? modelValue : [modelValue])
    })

    const computeSelectLabel = computed(() => {
      const { showFullLabel } = props
      const { fullOptFlag, lazyOptFlag } = reactData
      const { fullNodeMaps, lazyNodeMaps } = internalData
      const labelField = computeLabelField.value
      const selectVals = computeSelectVals.value
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
    })

    const computePopupWrapperStyle = computed(() => {
      const { currentCunkList, panelStyle } = reactData
      const popupOpts = computePopupOpts.value
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
    })

    const computeFilterOpts = computed(() => {
      return Object.assign({}, getConfig().cascader.filterConfig, props.filterConfig)
    })

    const computeMaps: VxeCascaderPrivateComputed = {
    }

    const $xeCascader = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCascaderConstructor & VxeCascaderPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeCascaderEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $cascader: $xeCascader }, params))
    }

    const emitModel = (value: any) => {
      emit('update:modelValue', value)
    }

    const cascaderMethods: CascaderMethods = {
      dispatchEvent
    }

    const getNodeId = (node: any) => {
      if (!node) {
        return ''
      }
      const valueField = computeValueField.value
      const nodeKey = node[valueField]
      return enNodeValue(nodeKey)
    }

    const isPathInTree = (treeData: any[], pathIds: string[]) => {
      if (!pathIds || !pathIds.length) {
        return false
      }
      let currentNodes = treeData
      for (const nodeid of pathIds) {
        const found = currentNodes.find(node => getNodeId(node) === nodeid)
        if (!found) {
          return false
        }
        currentNodes = found.children || []
      }
      return true
    }

    const isCheckedByCheckboxNodeId = (nodeid: any) => {
      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      return !!(updateCheckboxFlag && selectCheckboxMaps[nodeid])
    }

    const handleCheckedCheckboxNode = (nodeList: any[], checked: boolean) => {
      const { selectCheckboxMaps } = internalData
      const mapChildrenField = computeMapChildrenField.value
      const childrenField = computeChildrenField.value
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly } = checkboxOpts
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      const handleSelect = (node: any) => {
        const nodeid = getNodeId(node)
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
      updateCheckboxStatus()
    }

    const createNode = (records: any[]) => {
      const valueField = computeValueField.value
      return Promise.resolve(
        records.map(obj => {
          const item = { ...obj }
          let nodeid = getNodeId(item)
          if (!nodeid) {
            nodeid = getNodeUniqueId()
            XEUtils.set(item, valueField, nodeid)
          }
          return item
        })
      )
    }

    const handleSetCheckboxByNodeId = (nodeKeys: any | any[], checked: boolean) => {
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
        handleCheckedCheckboxNode(nodeList, checked)
      }
      return nextTick()
    }

    const updateCheckboxChecked = (nodeKeys: any[]) => {
      internalData.selectCheckboxMaps = {}
      handleSetCheckboxByNodeId(nodeKeys, true)
    }

    const updateModelChecked = () => {
      const { modelValue } = props
      const { nodeMaps } = internalData
      const expandedMaps: Record<string, boolean> = {}
      if (props.multiple) {
        if (modelValue && modelValue.length) {
          updateCheckboxChecked(modelValue)
        }
      } else {
        if (modelValue) {
          const nodeid = enNodeValue(XEUtils.isArray(modelValue) ? modelValue[0] : modelValue)
          const itemRest = nodeMaps[nodeid]
          if (itemRest) {
            itemRest.nodes.forEach(item => {
              expandedMaps[getNodeId(item)] = true
            })
            reactData.selectRadioKey = nodeid
          }
        }
      }
      internalData.treeExpandedMaps = expandedMaps
    }

    const cacheNodeMap = () => {
      const { separator } = props
      const { treeFullData } = internalData
      const valueField = computeValueField.value
      const labelField = computeLabelField.value
      const childrenField = computeChildrenField.value
      const keyMaps: Record<string, VxeCascaderDefines.NodeCacheItem> = {}
      const fullMaps: Record<string, VxeCascaderDefines.NodeCacheItem> = {}
      XEUtils.eachTree(treeFullData, (item, index, items, path, parenItem, nodes) => {
        let nodeid = getNodeId(item)
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
    }

    const updateAfterDataIndex = () => {
      const { separator } = props
      const { afterTreeList, nodeMaps } = internalData
      const labelField = computeLabelField.value
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      let vtIndex = 0
      XEUtils.eachTree(afterTreeList, (item, index, items, path, parenItem, nodes) => {
        const nodeid = getNodeId(item)
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
    }

    const updateAfterFullData = () => {
      const { searchValue } = reactData
      const { treeFullData, lastFilterValue } = internalData
      const labelField = computeLabelField.value
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      const filterOpts = computeFilterOpts.value
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
        nextTick(() => {
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
            nextTick(() => {
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
      updateAfterDataIndex()
    }

    /**
     * 如果为虚拟树、则将树结构拍平
     */
    const handleTreeToList = () => {
      const { afterTreeList, treeExpandedMaps } = internalData
      const mapChildrenField = computeMapChildrenField.value
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      const expandMaps: {
        [key: string]: number
      } = {}
      if (transform) {
        const fullData: any[] = []
        XEUtils.eachTree(afterTreeList, (item, index, items, path, parentRow) => {
          const nodeid = getNodeId(item)
          const parentNodeid = getNodeId(parentRow)
          if (!parentRow || (expandMaps[parentNodeid] && treeExpandedMaps[parentNodeid])) {
            expandMaps[nodeid] = 1
            fullData.push(item)
          }
        }, { children: mapChildrenField })
        internalData.afterVisibleList = fullData
        return fullData
      }
      return internalData.afterVisibleList
    }

    const handleData = (force?: boolean) => {
      let fullList: any[] = internalData.afterVisibleList
      if (force) {
        // 更新数据，处理筛选和排序
        updateAfterFullData()
        // 如果为虚拟树，将树结构拍平
        fullList = handleTreeToList()
      }
      const treeList = fullList.slice(0)
      reactData.treeList = treeList
    }

    /**
     * 获取第一个拥有子节点的节点
     */
    function handleHasChildNodeIds (treeList: any[], type: 'first' | 'last') {
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const treeOpts = computeTreeOpts.value
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
          nodeIds.push(getNodeId(targetNode))
          currList = targetNode[childField]
        } else {
          const endNode = XEUtils[type](currList)
          nodeIds.push(getNodeId(endNode))
          break
        }
      }
      return nodeIds
    }

    const triggerSearchEvent = XEUtils.debounce(() => {
      handleData(true)
      updateCheckboxStatus()
      const { currentItems } = reactData
      const { afterTreeList } = internalData
      const filterOpts = computeFilterOpts.value
      const { autoExpandMode } = filterOpts
      // 如果当前不在列表情况下，触发默认行为
      if (!isPathInTree(afterTreeList, currentItems)) {
        // 默认展开
        if (autoExpandMode === 'first' || autoExpandMode === 'last') {
          const stItems = handleHasChildNodeIds(afterTreeList, autoExpandMode)
          const expandedMaps: Record<string, boolean> = {}
          stItems.forEach(nodeid => {
            expandedMaps[nodeid] = true
          })
          internalData.treeExpandedMaps = expandedMaps
          reactData.currentItems = stItems
        } else {
          handleCurrentItems()
        }
      }
      updateCurrentChunk()
    }, 350, { trailing: true })

    const loadData = (list: any[]) => {
      const treeOpts = computeTreeOpts.value
      const keyField = computeKeyField.value
      const parentField = computeParentField.value
      const childrenField = computeChildrenField.value
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
      cacheNodeMap()
      handleData(true)
      updateModelChecked()
      handleCurrentItems()
      updateCurrentChunk()
      return nextTick()
    }

    const updateCurrentChunk = () => {
      const { currentItems } = reactData
      const { afterTreeList } = internalData
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      const currentCunkList: any[][] = [afterTreeList]
      if (currentItems.length) {
        let chunkIndex = 0
        let stNodeid = currentItems[chunkIndex]
        let optList = afterTreeList
        while (stNodeid && optList && optList.length) {
          stNodeid = currentItems[chunkIndex++]
          const currOption = optList.find(item => stNodeid === getNodeId(item))
          optList = currOption ? currOption[transform ? mapChildrenField : childrenField] : []
          if (!optList || !optList.length) {
            break
          }
          currentCunkList.push(optList)
        }
      }
      reactData.currentCunkList = currentCunkList
    }

    const handleCurrentItems = () => {
      const { currentNode } = reactData
      const { afterTreeList } = internalData
      const selectVals = computeSelectVals.value
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      const stItems: string[] = []
      const expandedMaps: Record<string, boolean> = {}
      const lastVal = currentNode ? getNodeId(currentNode) : enNodeValue(XEUtils.last(selectVals))
      if (lastVal) {
        const stRest = XEUtils.findTree(afterTreeList, (item) => lastVal === getNodeId(item), { children: transform ? mapChildrenField : childrenField })
        if (stRest) {
          const { nodes } = stRest
          nodes.forEach(item => {
            const nodeid = getNodeId(item)
            expandedMaps[nodeid] = true
            stItems.push(nodeid)
          })
        }
      }
      reactData.currentItems = stItems
      internalData.treeExpandedMaps = expandedMaps
    }

    const updateZindex = () => {
      const popupOpts = computePopupOpts.value
      const { zIndex } = popupOpts
      if (zIndex) {
        reactData.panelIndex = zIndex
      } else if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      const { panelIndex } = reactData
      const targetElem = refElem.value
      const panelElem = refOptionPanel.value
      const btnTransfer = computeBtnTransfer.value
      const popupOpts = computePopupOpts.value
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
      return nextTick().then(handleStyle)
    }

    const showOptionPanel = (evnt?: Event) => {
      const { loading, remote, filterable } = props
      const { treeFullData } = internalData
      const isDisabled = computeIsDisabled.value
      const remoteOpts = computeRemoteOpts.value
      if (!loading && !isDisabled) {
        clearTimeout(internalData.hpTimeout)
        if (!reactData.initialized) {
          reactData.initialized = true
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        if (filterable) {
          if (remote && remoteOpts.enabled && remoteOpts.autoLoad && !treeFullData.length) {
            handleSearchEvent()
          }
        }
        setTimeout(() => {
          reactData.visiblePanel = true
          handleFocusSearch()
        }, 10)
        updateZindex()
        updatePlacement()
        dispatchEvent('visible-change', { visible: true }, evnt || null)
      }
    }

    const hideOptionPanel = (evnt?: Event) => {
      reactData.visiblePanel = false
      internalData.hpTimeout = setTimeout(() => {
        reactData.isAniVisible = false
      }, 350)
      dispatchEvent('visible-change', { visible: false }, evnt || null)
    }

    const setCurrentNode = (node: any) => {
      reactData.currentNode = node
      updateCurrentChunk()
      return nextTick()
    }

    const setAllCheckboxNode = (checked: boolean) => {
      const selectMaps: Record<string, boolean> = {}
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      const checkKeys: string[] = []
      const checkNodes: any[] = []
      if (checked) {
        XEUtils.eachTree(internalData.afterTreeList, (node) => {
          const nodeid = getNodeId(node)
          checkKeys.push(nodeid)
          checkNodes.push(node)
          selectMaps[nodeid] = true
        }, { children: transform ? mapChildrenField : childrenField })
      }
      internalData.indeterminateRowMaps = {}
      internalData.selectCheckboxMaps = selectMaps
      reactData.updateCheckboxFlag++
      updateCheckboxStatus()
      return nextTick().then(() => {
        return { checkNodeKeys: checkKeys, checkNodes }
      })
    }

    const clearSelectedNode = () => {
      internalData.indeterminateRowMaps = {}
      internalData.selectCheckboxMaps = {}
      reactData.updateCheckboxFlag++
      reactData.selectRadioKey = null
      updateCheckboxStatus()
      return nextTick().then(() => {
        return { checkNodeKeys: [], checkNodes: [] }
      })
    }

    const changeEvent = (evnt: Event, selectValue: any, node: any) => {
      const value = XEUtils.isArray(selectValue) ? selectValue.map(deNodeValue) : deNodeValue(selectValue)
      internalData.isUpdateMode = true
      emitModel(value)
      if (value !== props.modelValue) {
        dispatchEvent('change', { value, node, option: node }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    }

    const clearValueEvent = (evnt: Event, selectValue: any) => {
      changeEvent(evnt, selectValue, null)
      dispatchEvent('clear', { value: selectValue }, evnt)
    }

    const clearEvent = (params: any, evnt: Event) => {
      clearValueEvent(evnt, null)
      hideOptionPanel(evnt)
    }

    const allCheckedPanelEvent: VxeButtonEvents.Click = (params) => {
      const { $event } = params
      const { multiple, checkedClosable } = props
      if (multiple) {
        setAllCheckboxNode(true).then(({ checkNodeKeys, checkNodes }) => {
          changeEvent($event, checkNodeKeys, checkNodes[0])
          dispatchEvent('all-change', { value: checkNodeKeys }, $event)
          if (checkedClosable) {
            hideOptionPanel($event)
          }
        })
      }
    }

    const clearCheckedPanelEvent: VxeButtonEvents.Click = (params) => {
      const { $event } = params
      const { multiple, checkedClosable } = props
      const value = multiple ? [] : null
      clearSelectedNode().then(() => {
        if (checkedClosable) {
          hideOptionPanel($event)
        }
      })
      changeEvent($event, value, null)
      dispatchEvent('clear', { value }, $event)
    }

    const closePanelEvent: VxeButtonEvents.Click = (params) => {
      const { $event } = params
      hideOptionPanel($event)
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
            hideOptionPanel(evnt)
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
          hideOptionPanel(evnt)
        }
      }
    }

    const handleGlobalBlurEvent = (evnt: Event) => {
      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        hideOptionPanel(evnt)
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const $input = refInput.value
        if ($input) {
          $input.blur()
        }
      }
    }

    const handleGlobalResizeEvent = () => {
      const { visiblePanel } = reactData
      if (visiblePanel) {
        updatePlacement()
      }
    }

    const handleFocusSearch = () => {
      if (props.filterable) {
        nextTick(() => {
          const inpSearch = refInpSearch.value
          if (inpSearch) {
            inpSearch.focus()
          }
        })
      }
    }

    const changeCurrentEvent = (evnt: MouseEvent, node: any) => {
      evnt.preventDefault()
      const isChecked = true
      reactData.currentNode = node
      dispatchEvent('current-change', { node, checked: isChecked }, evnt)
    }

    const changeRadioEvent = (evnt: MouseEvent, node: any, chunks: any[], chunkIndex: number) => {
      evnt.preventDefault()
      evnt.stopPropagation()
      const { currentItems } = reactData
      const { nodeMaps } = internalData
      const radioOpts = computeRadioOpts.value
      const childrenField = computeChildrenField.value
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      const mapChildrenField = computeMapChildrenField.value
      const { checkMode, checkMethod } = radioOpts
      const nodeid = getNodeId(node)
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
      changeEvent(evnt, value, node)
      if (!currentItems.includes(nodeid)) {
        changeCurrentEvent(evnt, node)
        toggleExpandEvent(evnt, node, chunks, chunkIndex)
      }
      hideOptionPanel(evnt)
    }

    const handleAsyncTreeExpandChilds = (node: any) => {
      const checkboxOpts = computeCheckboxOpts.value
      const treeOpts = computeTreeOpts.value
      const { loadMethod } = treeOpts
      const { checkStrictly } = checkboxOpts
      return new Promise<void>(resolve => {
        if (loadMethod) {
          const { nodeMaps } = internalData
          const nodeid = getNodeId(node)
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
                  handleCheckedCheckboxNode(childRows, true)
                }
                dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
                return nextTick()
              })
            } else {
              dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
            }
          }).catch((e) => {
            const { treeExpandLazyLoadedMaps } = internalData
            nodeItem.treeLoaded = false
            if (treeExpandLazyLoadedMaps[nodeid]) {
              treeExpandLazyLoadedMaps[nodeid] = false
            }
            dispatchEvent('load-error', { node, data: e }, new Event('load-error'))
          }).finally(() => {
            handleTreeToList()
            handleData()
          })
        } else {
          resolve()
        }
      })
    }

    /**
     * 展开与收起树节点
     * @param nodeList
     * @param expanded
     * @returns
     */
    const handleBaseTreeExpand = (nodeList: any[], expanded: boolean) => {
      const { treeExpandLazyLoadedMaps, treeExpandedMaps } = internalData
      const { nodeMaps } = internalData
      const childrenField = computeChildrenField.value
      const hasChildField = computeHasChildField.value
      const treeOpts = computeTreeOpts.value
      const { lazy, toggleMethod } = treeOpts
      const result: any[] = []
      let validNodes = toggleMethod ? nodeList.filter((node: any) => toggleMethod({ $cascader: $xeCascader, expanded, node })) : nodeList

      validNodes = validNodes.length ? [validNodes[validNodes.length - 1]] : []
      // 同一级只能展开一个
      const nodeid = getNodeId(validNodes[0])
      const nodeItem = nodeMaps[nodeid]
      if (nodeItem) {
        nodeItem.items.forEach(item => {
          const itemNodeId = getNodeId(item)
          if (treeExpandedMaps[itemNodeId]) {
            delete treeExpandedMaps[itemNodeId]
          }
        })
      }

      const expandNodes: any[] = []
      if (expanded) {
        validNodes.forEach((item) => {
          const itemNodeId = getNodeId(item)
          if (!treeExpandedMaps[itemNodeId]) {
            const nodeItem = nodeMaps[itemNodeId]
            const isLoad = lazy && item[hasChildField] && !nodeItem.treeLoaded && !treeExpandLazyLoadedMaps[itemNodeId]
            // 是否使用懒加载
            if (isLoad) {
              result.push(handleAsyncTreeExpandChilds(item))
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
          const itemNodeId = getNodeId(item)
          if (treeExpandedMaps[itemNodeId]) {
            delete treeExpandedMaps[itemNodeId]
            expandNodes.push(item)
          }
        })
      }
      reactData.updateExpandedFlag++
      handleTreeToList()
      handleData()
      return Promise.all(result)
    }

    const toggleExpandEvent = (evnt: MouseEvent, node: any, chunks: any[], chunkIndex: number) => {
      const { currentItems } = reactData
      const { treeExpandLazyLoadedMaps } = internalData
      const treeOpts = computeTreeOpts.value
      const { lazy } = treeOpts
      const stItems = currentItems.slice(0, chunkIndex)
      const nodeid = getNodeId(node)
      const expanded = true
      evnt.stopPropagation()
      stItems.push(nodeid)
      reactData.currentItems = stItems
      if (!lazy || !treeExpandLazyLoadedMaps[nodeid]) {
        handleBaseTreeExpand([node], expanded)
      }
      setCurrentNode(node)
      dispatchEvent('node-expand', { node, expanded }, evnt)
    }

    const updateCheckboxStatus = () => {
      const { selectCheckboxMaps, indeterminateRowMaps, afterTreeList } = internalData
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly, checkMethod } = checkboxOpts
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      if (!checkStrictly) {
        const childRowMaps: Record<string, number> = {}
        const childRowList: any[][] = []
        XEUtils.eachTree(afterTreeList, (node) => {
          const nodeid = getNodeId(node)
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
                  const childNodeid = getNodeId(item)
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
                const childNodeid = getNodeId(item)
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
    }

    const changeCheckboxEvent = (evnt: MouseEvent, node: any, chunks: any[], chunkIndex: number) => {
      evnt.preventDefault()
      evnt.stopPropagation()
      // const { filterable } = props
      const { currentItems } = reactData
      const { selectCheckboxMaps, nodeMaps } = internalData
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly, checkMode, checkMethod } = checkboxOpts
      const treeOpts = computeTreeOpts.value
      const { transform } = treeOpts
      const nodeid = getNodeId(node)
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
          const childNodeid = getNodeId(childNode)
          if (isChecked) {
            if (!selectCheckboxMaps[childNodeid]) {
              selectCheckboxMaps[childNodeid] = childNode
            }
          } else {
            if (selectCheckboxMaps[childNodeid]) {
              delete selectCheckboxMaps[childNodeid]
            }
          }
        }, { children: transform ? mapChildrenField : childrenField })
      }
      selectCheckboxMaps[nodeid] = node
      reactData.updateCheckboxFlag++
      updateCheckboxStatus()
      const nodeids = XEUtils.keys(selectCheckboxMaps)
      const value = nodeids
      changeEvent(evnt, value, node)
      if (!currentItems.includes(nodeid)) {
        changeCurrentEvent(evnt, node)
        toggleExpandEvent(evnt, node, chunks, chunkIndex)
      }
    }

    const handleNodeClickEvent = (evnt: MouseEvent, node: any, chunks: any[], chunkIndex: number) => {
      const { multiple, showCheckbox, showRadio } = props
      const treeOpts = computeTreeOpts.value
      const radioOpts = computeRadioOpts.value
      const checkboxOpts = computeCheckboxOpts.value
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const { transform, trigger } = treeOpts
      const childList: any[] = node[transform ? mapChildrenField : childrenField]
      let triggerCurrent = false
      let triggerRadio = false
      let triggerCheckbox = false
      let triggerExpand = false
      triggerCurrent = true
      changeCurrentEvent(evnt, node)
      if (trigger !== 'icon') {
        triggerExpand = true
        toggleExpandEvent(evnt, node, chunks, chunkIndex)
      }
      if (multiple) {
        if (checkboxOpts.trigger === 'node' || (!showCheckbox && (!childList || !childList.length))) {
          triggerCheckbox = true
          changeCheckboxEvent(evnt, node, chunks, chunkIndex)
        }
      } else {
        if (radioOpts.trigger === 'node' || (!showRadio && (!childList || !childList.length))) {
          triggerRadio = true
          changeRadioEvent(evnt, node, chunks, chunkIndex)
        }
      }
      dispatchEvent('node-click', { node, triggerCurrent, triggerRadio, triggerCheckbox, triggerExpand }, evnt)
    }

    const focusEvent = (evnt: FocusEvent) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (!reactData.visiblePanel) {
          reactData.triggerFocusPanel = true
          showOptionPanel(evnt)
          setTimeout(() => {
            reactData.triggerFocusPanel = false
          }, 150)
        }
      }
      dispatchEvent('focus', {}, evnt)
    }

    const clickEvent = (evnt: MouseEvent) => {
      evnt.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (!reactData.visiblePanel) {
          showOptionPanel(evnt)
        }
      }
      dispatchEvent('click', {}, evnt)
    }

    const blurEvent = (evnt: FocusEvent) => {
      reactData.isActivated = false
      dispatchEvent('blur', {}, evnt)
    }

    const modelSearchEvent = (value: string) => {
      reactData.searchValue = value
      triggerSearchEvent(new Event('filter'))
    }

    const handleSearchEvent = () => {
      const { modelValue, remote } = props
      const { searchValue } = reactData
      const remoteOpts = computeRemoteOpts.value
      const queryMethod = remoteOpts.queryMethod
      if (remote && queryMethod && remoteOpts.enabled) {
        reactData.searchLoading = true
        Promise.resolve(
          queryMethod({ $cascader: $xeCascader, searchValue, value: modelValue })
        ).then(() => nextTick())
          .catch(() => nextTick())
          .finally(() => {
            reactData.searchLoading = false
          })
      }
    }

    const togglePanelEvent = (params: any) => {
      const { $event } = params
      $event.preventDefault()
      if (reactData.triggerFocusPanel) {
        reactData.triggerFocusPanel = false
      } else {
        if (reactData.visiblePanel) {
          hideOptionPanel($event)
        } else {
          showOptionPanel($event)
        }
      }
    }

    const cascaderPrivateMethods: CascaderPrivateMethods = {
      isCheckedByCheckboxNodeId,
      /**
       * 用于树结构，给行数据加载子节点
       */
      loadChildrenNode (node, childRecords) {
        const { separator } = props
        const { nodeMaps } = internalData
        const treeOpts = computeTreeOpts.value
        const labelField = computeLabelField.value
        const { lazy, transform } = treeOpts
        if (!lazy) {
          return Promise.resolve([])
        }
        const childrenField = computeChildrenField.value
        const mapChildrenField = computeMapChildrenField.value
        const parentNodeItem = nodeMaps[getNodeId(node)]
        const parentLevel = parentNodeItem ? parentNodeItem.level : 0
        const parentNodes = parentNodeItem ? parentNodeItem.nodes : []
        return createNode(childRecords).then((nodeList) => {
          XEUtils.eachTree(nodeList, (childRow, index, items, path, parent, nodes) => {
            const itemNodeId = getNodeId(childRow)
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
          updateAfterDataIndex()
          return nodeList
        })
      }
    }

    Object.assign($xeCascader, cascaderMethods, cascaderPrivateMethods)

    const handleVisibleOrCheckMode = (mode: '' | 'all' | 'first' | 'last' | null | undefined, isExistChild: boolean, nLevel: number) => {
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

    const renderRadio = (node: any, isExistChild: boolean, nLevel: number, isChecked: boolean, chunks: any[], chunkIndex: number) => {
      const { showRadio } = props
      const radioOpts = computeRadioOpts.value
      const { checkMode, checkMethod, visibleMode, visibleMethod } = radioOpts
      const isVisible = visibleMethod ? visibleMethod({ $cascader: $xeCascader, node }) : handleVisibleOrCheckMode(visibleMode, isExistChild, nLevel)
      if (showRadio && isVisible) {
        const isDisabled = checkMethod ? !checkMethod({ $cascader: $xeCascader, node }) : !handleVisibleOrCheckMode(checkMode, isExistChild, nLevel)
        return h('div', {
          class: ['vxe-tree--radio-option', {
            'is--checked': isChecked,
            'is--disabled': isDisabled
          }],
          onClick: (evnt) => {
            if (!isDisabled) {
              changeRadioEvent(evnt, node, chunks, chunkIndex)
            }
          }
        }, [
          h('span', {
            class: ['vxe-radio--icon', isChecked ? getIcon().RADIO_CHECKED : getIcon().RADIO_UNCHECKED]
          })
        ])
      }
      return renderEmptyElement($xeCascader)
    }

    const renderCheckbox = (node: any, isExistChild: boolean, nLevel: number, isChecked: boolean, isIndeterminate: boolean, chunks: any[], chunkIndex: number) => {
      const { showCheckbox } = props
      const checkboxOpts = computeCheckboxOpts.value
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
          onClick: (evnt) => {
            if (!isDisabled) {
              changeCheckboxEvent(evnt, node, chunks, chunkIndex)
            }
          }
        }, [
          h('span', {
            class: ['vxe-checkbox--icon', isIndeterminate ? getIcon().CHECKBOX_INDETERMINATE : (isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED)]
          })
        ])
      }
      return renderEmptyElement($xeCascader)
    }

    const renderNode = (node: any, nodeid: string, nodeIndex: number, chunks: any[], chunkIndex: number) => {
      const { multiple } = props
      const { currentNode, selectRadioKey, updateCheckboxFlag, updateExpandedFlag } = reactData
      const { nodeMaps, selectCheckboxMaps, indeterminateRowMaps, treeExpandedMaps, treeExpandLazyLoadedMaps } = internalData
      const treeOpts = computeTreeOpts.value
      const { lazy, transform, iconLoaded, iconOpen, iconClose } = treeOpts
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const labelField = computeLabelField.value
      const hasChildField = computeHasChildField.value
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
          'is--current': currentNode && (currentNode === node || getNodeId(currentNode) === nodeid),
          'is-radio--checked': isRadioChecked,
          'is-checkbox--checked': isCheckboxChecked,
          'is-checkbox--indeterminate': isIndeterminate,
          'is--expand': isExpand
        }],
        title: nodeTitle,
        onMousedown: (evnt) => {
          const isLeftBtn = evnt.button === 0
          if (isLeftBtn) {
            evnt.stopPropagation()
          }
        },
        onClick (evnt) {
          handleNodeClickEvent(evnt, node, chunks, chunkIndex)
        }
      }, [
        multiple ? renderCheckbox(node, isExistChild, nLevel, isCheckboxChecked, isIndeterminate, chunks, chunkIndex) : renderRadio(node, isExistChild, nLevel, isRadioChecked, chunks, chunkIndex),
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
                onClick (evnt) {
                  if (treeOpts.trigger === 'icon') {
                    toggleExpandEvent(evnt, node, chunks, chunkIndex)
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
    }

    const renderVN = () => {
      const { className, modelValue, multiple, loading, filterable, showTotalButton, showCheckedButton, showClearButton, showCloseButton } = props
      const { initialized, isActivated, isAniVisible, visiblePanel, searchValue, currentCunkList } = reactData
      const { listVirtualYOpts } = internalData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const selectLabel = computeSelectLabel.value
      const btnTransfer = computeBtnTransfer.value
      const formReadonly = computeFormReadonly.value
      const popupWrapperStyle = computePopupWrapperStyle.value
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const prefixSlot = slots.prefix
      const popupOpts = computePopupOpts.value
      const popupClassName = popupOpts.className

      if (formReadonly) {
        return h('div', {
          ref: refElem,
          class: ['vxe-cascader--readonly', className]
        }, [
          h('span', {
            class: 'vxe-cascader-label'
          }, selectLabel)
        ])
      }
      const selectVals = XEUtils.eqNull(modelValue) ? [] : (XEUtils.isArray(modelValue) ? modelValue : [modelValue])
      return h('div', {
        ref: refElem,
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
          ref: refInput,
          clearable: props.clearable,
          placeholder: loading ? getI18n('vxe.select.loadingText') : props.placeholder,
          editable: false,
          disabled: isDisabled,
          type: 'text',
          prefixIcon: props.prefixIcon,
          suffixIcon: loading ? getIcon().TREE_SELECT_LOADED : (visiblePanel ? getIcon().TREE_SELECT_OPEN : getIcon().TREE_SELECT_CLOSE),
          modelValue: loading ? '' : selectLabel,
          title: selectLabel,
          onClear: clearEvent,
          onClick: clickEvent,
          onFocus: focusEvent,
          onBlur: blurEvent,
          onSuffixClick: togglePanelEvent
        }, prefixSlot
          ? {
              prefix: () => prefixSlot({})
            }
          : {}),
        h(Teleport, {
          to: 'body',
          disabled: btnTransfer ? !initialized : true
        }, [
          h('div', {
            ref: refOptionPanel,
            class: ['vxe-table--ignore-clear vxe-cascader--panel', popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $cascader: $xeCascader }) : popupClassName) : '', {
              [`size--${vSize}`]: vSize,
              'is--transfer': btnTransfer,
              'ani--leave': !loading && isAniVisible,
              'ani--enter': !loading && visiblePanel
            }],
            placement: reactData.panelPlacement,
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
                        ref: refInpSearch,
                        class: 'vxe-cascader-search--input',
                        modelValue: searchValue,
                        clearable: true,
                        disabled: false,
                        readonly: false,
                        placeholder: getI18n('vxe.cascader.search'),
                        prefixIcon: getIcon().INPUT_SEARCH,
                        'onUpdate:modelValue': modelSearchEvent
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
                                    content: getI18n('vxe.treeSelect.allChecked'),
                                    mode: 'text',
                                    onClick: allCheckedPanelEvent
                                  })
                                  : renderEmptyElement($xeCascader),
                                showClearButton
                                  ? h(VxeButtonComponent, {
                                    content: getI18n('vxe.treeSelect.clearChecked'),
                                    mode: 'text',
                                    onClick: clearCheckedPanelEvent
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
                      ref: refChunkWrapper,
                      class: 'vxe-cascader-chunk--wrapper'
                    }, [
                      currentCunkList.map((chunks, chunkIndex) => {
                        return h('div', {
                          key: chunkIndex,
                          class: 'vxe-cascader-chunk--item-wrapper'
                        }, [
                          h(VxeListComponent, {
                            data: chunks,
                            virtualYConfig: listVirtualYOpts
                          }, {
                            default (slotParams: VxeListSlotTypes.DefaultSlotParams) {
                              const { items } = slotParams
                              return items.map((node, nodeIndex) => {
                                const nodeid = getNodeId(node)
                                return renderNode(node, nodeid, nodeIndex, chunks, chunkIndex)
                              })
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
                                  content: getI18n('vxe.select.close'),
                                  mode: 'text',
                                  onClick: closePanelEvent
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
      ])
    }

    watch(() => props.modelValue, () => {
      if (!internalData.isUpdateMode) {
        updateModelChecked()
        handleCurrentItems()
        updateCurrentChunk()
      }
      internalData.isUpdateMode = false
    })

    watch(() => props.options, () => {
      cacheNodeMap()
    })

    const dataFlag = ref(0)
    watch(() => props.options ? props.options.length : 0, () => {
      dataFlag.value++
    })
    watch(() => props.options, () => {
      dataFlag.value++
    })
    watch(dataFlag, () => {
      loadData(props.options || [])
    })

    loadData(props.options || [])

    onMounted(() => {
      globalEvents.on($xeCascader, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeCascader, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeCascader, 'blur', handleGlobalBlurEvent)
      globalEvents.on($xeCascader, 'resize', handleGlobalResizeEvent)
    })

    onUnmounted(() => {
      globalEvents.off($xeCascader, 'mousewheel')
      globalEvents.off($xeCascader, 'mousedown')
      globalEvents.off($xeCascader, 'blur')
      globalEvents.off($xeCascader, 'resize')
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    provide('$xeCascader', $xeCascader)

    $xeCascader.renderVN = renderVN

    return $xeCascader
  },
  render () {
    return this.renderVN()
  }
})
