import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, createEvent, globalEvents, globalResize, renderEmptyElement, globalMixins } from '../../ui'
import { calcTreeLine, enNodeValue, deNodeValue } from './util'
import { errLog } from '../../ui/src/log'
import { getSlotVNs } from '../../ui/src/vn'
import { crossTreeDragNodeGlobal, getCrossTreeDragNodeInfo } from './store'
import { toCssUnit, isScale, getPaddingTopBottomSize, addClass, removeClass, getTpImg, hasControlKey, getEventTargetNode } from '../../ui/src/dom'
import { isEnableConf } from '../../ui/src/utils'
import { moveRowAnimateToTb, clearRowAnimate } from '../../ui/src/anime'
import VxeLoadingComponent from '../../loading'

import type { TreeReactData, VxeTreeEmits, VxeTreeConstructor, VxeTreePropTypes, TreeInternalData, VxeTreeDefines, VxeTreePrivateMethods, VxeComponentSizeType, ValueOf } from '../../../types'

const { menus, getConfig, getI18n, getIcon } = VxeUI

// let crossTreeDragNodeObj: {
//   $oldTree: VxeTreeConstructor & VxeTreePrivateMethods
//   $newTree: (VxeTreeConstructor & VxeTreePrivateMethods) | null
// } | null = null

/**
 * 生成节点的唯一主键
 */
function getNodeUniqueId () {
  return XEUtils.uniqueId('node_')
}

function handleSetExpand (nodeid: string, expanded: boolean, expandedMaps: Record<string, boolean>) {
  if (expanded) {
    if (!expandedMaps[nodeid]) {
      expandedMaps[nodeid] = true
    }
  } else {
    if (expandedMaps[nodeid]) {
      delete expandedMaps[nodeid]
    }
  }
}

function handleScrollTo ($xeTree: VxeTreeConstructor, scrollLeft: { top?: number | null; left?: number | null; } | number | null | undefined, scrollTop?: number | null) {
  const reactData = $xeTree.reactData

  const scrollBodyElem = $xeTree.$refs.refVirtualWrapper as HTMLDivElement
  if (scrollLeft) {
    if (!XEUtils.isNumber(scrollLeft)) {
      scrollTop = scrollLeft.top
      scrollLeft = scrollLeft.left
    }
  }
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
        $xeTree.$nextTick(() => {
          resolve()
        })
      }, 50)
    })
  }
  return $xeTree.$nextTick()
}

function clearNodeDropOrigin ($xeTree: VxeTreeConstructor) {
  const el = $xeTree.$refs.refElem as HTMLDivElement
  if (el) {
    const clss = 'node--drag-origin'
    XEUtils.arrayEach(el.querySelectorAll(`.${clss}`), (elem) => {
      (elem as HTMLTableCellElement).draggable = false
      removeClass(elem, clss)
    })
  }
}

function updateNodeDropOrigin ($xeTree: VxeTreeConstructor, node: any) {
  const el = $xeTree.$refs.refElem as HTMLDivElement
  if (el) {
    const clss = 'node--drag-origin'
    const nodeid = $xeTree.getNodeId(node)
    XEUtils.arrayEach(el.querySelectorAll<HTMLDivElement>(`.vxe-tree--node-wrapper[nodeid="${nodeid}"]`), (elem) => {
      addClass(elem, clss)
    })
  }
}

function updateRowDropTipContent ($xeTree: VxeTreeConstructor, itemEl: HTMLElement) {
  const reactData = $xeTree.reactData

  const { dragNode } = reactData
  const dragOpts = $xeTree.computeDragOpts
  const { tooltipMethod } = dragOpts
  const rTooltipMethod = tooltipMethod
  let tipContent = ''
  if (rTooltipMethod) {
    const rtParams = {
      $tree: $xeTree,
      node: dragNode
    }
    tipContent = `${rTooltipMethod(rtParams) || ''}`
  } else {
    tipContent = getI18n('vxe.tree.dragTip', [itemEl.textContent || ''])
  }
  reactData.dragTipText = tipContent
}

function hideDropTip ($xeTree: VxeTreeConstructor) {
  const rdTipEl = $xeTree.$refs.refDragTipElem as HTMLDivElement
  const rdLineEl = $xeTree.$refs.refDragNodeLineElem as HTMLDivElement
  if (rdTipEl) {
    rdTipEl.style.display = ''
  }
  if (rdLineEl) {
    rdLineEl.style.display = ''
  }
}

function clearCrossTreeDragStatus ($xeTree: VxeTreeConstructor) {
  const crossTreeDragNodeInfo = getCrossTreeDragNodeInfo($xeTree as VxeTreeConstructor & VxeTreePrivateMethods)

  // crossTreeDragNodeObj = null
  crossTreeDragNodeInfo.node = null
}

function clearDragStatus ($xeTree: VxeTreeConstructor) {
  const reactData = $xeTree.reactData

  const { dragNode } = reactData
  if (dragNode) {
    hideDropTip($xeTree)
    clearNodeDropOrigin($xeTree)
    clearCrossTreeDragStatus($xeTree)
    reactData.dragNode = null
  }
}

function showDropTip ($xeTree: VxeTreeConstructor, evnt: DragEvent | MouseEvent, itemEl: HTMLElement | null, showLine: boolean, dragPos: string) {
  const internalData = $xeTree.internalData

  const wrapperEl = $xeTree.$refs.refElem as HTMLDivElement
  if (!wrapperEl) {
    return
  }
  const { prevDragToChild } = internalData
  const wrapperRect = wrapperEl.getBoundingClientRect()
  const wrapperHeight = wrapperEl.clientHeight
  if (itemEl) {
    const rdLineEl = $xeTree.$refs.refDragNodeLineElem as HTMLDivElement
    if (rdLineEl) {
      if (showLine) {
        const trRect = itemEl.getBoundingClientRect()
        let itemHeight = itemEl.clientHeight
        const offsetTop = Math.max(1, trRect.y - wrapperRect.y)
        if (offsetTop + itemHeight > wrapperHeight) {
          itemHeight = wrapperHeight - offsetTop
        }
        rdLineEl.style.display = 'block'
        rdLineEl.style.top = `${offsetTop}px`
        rdLineEl.style.height = `${itemHeight}px`
        rdLineEl.setAttribute('drag-pos', dragPos)
        rdLineEl.setAttribute('drag-to-child', prevDragToChild ? 'y' : 'n')
      } else {
        rdLineEl.style.display = ''
      }
    }
  }
  const rdTipEl = $xeTree.$refs.refDragTipElem as HTMLDivElement
  if (rdTipEl) {
    rdTipEl.style.display = 'block'
    rdTipEl.style.top = `${Math.min(wrapperEl.clientHeight - wrapperEl.scrollTop - rdTipEl.clientHeight, evnt.clientY - wrapperRect.y)}px`
    rdTipEl.style.left = `${Math.min(wrapperEl.clientWidth - wrapperEl.scrollLeft - rdTipEl.clientWidth - 1, evnt.clientX - wrapperRect.x)}px`
    rdTipEl.setAttribute('drag-status', showLine ? (prevDragToChild ? 'sub' : 'normal') : 'disabled')
  }
}

function clearNodeDragData ($xeTree: VxeTreeConstructor) {
  const reactData = $xeTree.reactData
  const internalData = $xeTree.internalData

  const wrapperEl = $xeTree.$refs.refElem as HTMLDivElement
  const dtClss = ['.vxe-tree--node-wrapper']
  hideDropTip($xeTree)
  clearNodeDropOrigin($xeTree)
  clearRowAnimate(wrapperEl, dtClss)
  internalData.prevDragToChild = false
  reactData.dragNode = null
}

function handleNodeDragSwapEvent ($xeTree: VxeTreeConstructor & VxeTreePrivateMethods, evnt: DragEvent | null, dragNode: any, prevDragNode: any, prevDragPos: '' | 'top' | 'bottom' | undefined, prevDragToChild: boolean | undefined) {
  const props = $xeTree
  const reactData = $xeTree.reactData
  const internalData = $xeTree.internalData

  const { transform } = props
  const { nodeMaps, treeFullData, afterVisibleList } = internalData
  const dragConfig = $xeTree.computeDragOpts
  const { animation, isCrossDrag, isPeerDrag, isSelfToChildDrag, dragEndMethod, dragToChildMethod } = dragConfig
  const dEndMethod = dragEndMethod || (dragConfig ? dragConfig.dragEndMethod : null)
  const keyField = $xeTree.computeKeyField
  const parentField = $xeTree.computeParentField
  const childrenField = $xeTree.computeChildrenField
  const mapChildrenField = $xeTree.computeMapChildrenField
  const dragOffsetIndex = prevDragPos === 'bottom' ? 1 : 0
  const el = $xeTree.$refs.refElem as HTMLDivElement
  const errRest = {
    status: false
  }
  if (!(el && prevDragNode && dragNode)) {
    return Promise.resolve(errRest)
  }
  // 判断是否有拖动
  if (prevDragNode !== dragNode) {
    const dragParams = {
      oldNode: dragNode,
      newNode: prevDragNode,
      dragNode,
      dragPos: prevDragPos as 'top' | 'bottom',
      dragToChild: !!prevDragToChild,
      offsetIndex: dragOffsetIndex as 0 | 1
    }

    const dragNodeid = $xeTree.getNodeId(dragNode)
    const dragNodeRest = nodeMaps[dragNodeid] || {}
    const _dragNodeIndex = dragNodeRest._index
    let dragNodeHeight = 0
    let dragOffsetTop = -1
    if (animation) {
      const prevItemEl = el.querySelector<HTMLElement>(`.vxe-tree--node-wrapper[nodeid="${prevDragNode}"]`)
      const oldItemEl = el.querySelector<HTMLElement>(`.vxe-tree--node-wrapper[nodeid="${dragNodeid}"]`)
      const targetItemEl = prevItemEl || oldItemEl
      if (targetItemEl) {
        dragNodeHeight = targetItemEl.offsetHeight
      }
      if (oldItemEl) {
        dragOffsetTop = oldItemEl.offsetTop
      }
    }

    let oafIndex = -1
    let nafIndex = -1
    const oldAllMaps: Record<string, any> = {}
    let isSelfToChildStatus = false

    const oldRest = dragNodeRest
    const newNodeid = $xeTree.getNodeId(prevDragNode)
    const newRest = nodeMaps[newNodeid]
    if (transform) {
      if (oldRest && newRest) {
        const { level: oldLevel } = oldRest
        const { level: newLevel } = newRest

        XEUtils.eachTree([dragNode], item => {
          oldAllMaps[$xeTree.getNodeId(item)] = item
        }, { children: mapChildrenField })

        if (oldLevel && newLevel) {
          // 子到子

          if (isPeerDrag && !isCrossDrag) {
            if (oldRest.item[parentField] !== newRest.item[parentField]) {
              // 非同级
              clearNodeDragData($xeTree)
              clearCrossTreeDragStatus($xeTree)
              return errRest
            }
          } else {
            if (!isCrossDrag) {
              clearNodeDragData($xeTree)
              clearCrossTreeDragStatus($xeTree)
              return errRest
            }
            if (oldAllMaps[newNodeid]) {
              isSelfToChildStatus = true
              if (!(isCrossDrag && isSelfToChildDrag)) {
                if (VxeUI.modal) {
                  VxeUI.modal.message({
                    status: 'error',
                    content: getI18n('vxe.error.treeDragChild')
                  })
                }
                clearNodeDragData($xeTree)
                clearCrossTreeDragStatus($xeTree)
                return errRest
              }
            }
          }
        } else if (oldLevel) {
          // 子到根

          if (!isCrossDrag) {
            clearNodeDragData($xeTree)
            clearCrossTreeDragStatus($xeTree)
            return errRest
          }
        } else if (newLevel) {
          // 根到子

          if (!isCrossDrag) {
            clearNodeDragData($xeTree)
            clearCrossTreeDragStatus($xeTree)
            return errRest
          }
          if (oldAllMaps[newNodeid]) {
            isSelfToChildStatus = true
            if (!(isCrossDrag && isSelfToChildDrag)) {
              if (VxeUI.modal) {
                VxeUI.modal.message({
                  status: 'error',
                  content: getI18n('vxe.error.treeDragChild')
                })
              }
              clearNodeDragData($xeTree)
              clearCrossTreeDragStatus($xeTree)
              return errRest
            }
          }
        } else {
          // 根到根
        }
      }
    }
    const isDragToChildFlag = isSelfToChildDrag && dragToChildMethod ? dragToChildMethod(dragParams) : prevDragToChild
    return Promise.resolve(dEndMethod ? dEndMethod(dragParams) : true).then((status) => {
      if (!status) {
        return errRest
      }

      if (transform) {
        // 移出源位置
        if (oldRest && newRest) {
          const fullList = XEUtils.toTreeArray(internalData.afterTreeList, {
            key: keyField,
            parentKey: parentField,
            children: mapChildrenField
          })

          // 移出
          const otfIndex = $xeTree.findNodeIndexOf(fullList, dragNode)
          fullList.splice(otfIndex, 1)

          // 插入
          const ptfIndex = $xeTree.findNodeIndexOf(fullList, prevDragNode)
          const ntfIndex = ptfIndex + dragOffsetIndex
          fullList.splice(ntfIndex, 0, dragNode)

          // 改变层级
          if (isSelfToChildStatus && (isCrossDrag && isSelfToChildDrag)) {
            XEUtils.each(dragNode[childrenField], childNode => {
              childNode[parentField] = dragNode[parentField]
            })
          }
          dragNode[parentField] = isDragToChildFlag ? prevDragNode[keyField] : prevDragNode[parentField]

          internalData.treeFullData = XEUtils.toArrayTree(fullList, {
            key: keyField,
            parentKey: parentField,
            children: childrenField,
            mapChildren: mapChildrenField
          })
        }
      } else {
        // 移出
        oafIndex = $xeTree.findNodeIndexOf(afterVisibleList, dragNode)
        const otfIndex = $xeTree.findNodeIndexOf(treeFullData, dragNode)
        afterVisibleList.splice(oafIndex, 1)
        treeFullData.splice(otfIndex, 1)
        // 插入
        const pafIndex = $xeTree.findNodeIndexOf(afterVisibleList, prevDragNode)
        const ptfIndex = $xeTree.findNodeIndexOf(treeFullData, prevDragNode)
        nafIndex = pafIndex + dragOffsetIndex
        const ntfIndex = ptfIndex + dragOffsetIndex
        afterVisibleList.splice(nafIndex, 0, dragNode)
        treeFullData.splice(ntfIndex, 0, dragNode)
      }

      $xeTree.cacheNodeMap()
      $xeTree.handleData(transform)
      if (!(transform)) {
        $xeTree.updateAfterDataIndex()
      }
      $xeTree.updateCheckboxStatus()
      if (reactData.scrollYLoad) {
        $xeTree.updateYSpace()
      }

      if (evnt) {
        $xeTree.dispatchEvent('node-dragend', {
          oldNode: dragNode,
          newNode: prevDragNode,
          dragNode,
          dragPos: prevDragPos as any,
          dragToChild: isDragToChildFlag,
          offsetIndex: dragOffsetIndex,
          _index: {
            newIndex: nafIndex,
            oldIndex: oafIndex
          }
        }, evnt)
      }

      return $xeTree.$nextTick().then(() => {
        if (animation) {
          const { treeList } = reactData
          const { nodeMaps } = internalData
          const dragNodeRest = nodeMaps[dragNodeid]
          const _newNodeIndex = dragNodeRest._index
          const firstNode = treeList[0]
          const firstNodeRest = nodeMaps[$xeTree.getNodeId(firstNode)]
          const wrapperEl = el
          if (firstNodeRest) {
            const _firstNodeIndex = firstNodeRest._index
            const _lastNodeIndex = _firstNodeIndex + treeList.length

            let rsIndex = -1
            let reIndex = -1
            let offsetRate = 1
            if (_dragNodeIndex < _firstNodeIndex) {
              // 从上往下虚拟拖拽
              rsIndex = 0
              reIndex = _newNodeIndex - _firstNodeIndex
            } else if (_dragNodeIndex > _lastNodeIndex) {
              // 从下往上虚拟拖拽
              const $newNodeIndex = dragNodeRest.$index
              rsIndex = $newNodeIndex + 1
              reIndex = treeList.length
              offsetRate = -1
            } else {
              if (_newNodeIndex > _dragNodeIndex) {
                // 从上往下拖拽
                rsIndex = _dragNodeIndex - _firstNodeIndex
                reIndex = rsIndex + _newNodeIndex - _dragNodeIndex
              } else {
                // 从下往上拖拽
                rsIndex = _newNodeIndex - _firstNodeIndex
                reIndex = rsIndex + _dragNodeIndex - _newNodeIndex + 1
                offsetRate = -1
              }
            }

            const dragRangeList = treeList.slice(rsIndex, reIndex)
            if (dragRangeList.length) {
              const dtClss: string[] = []
              dragRangeList.forEach(item => {
                const nodeid = $xeTree.getNodeId(item)
                dtClss.push(`.vxe-tree--node-wrapper[nodeid="${nodeid}"]`)
              })
              const dtTrList = wrapperEl.querySelectorAll<HTMLElement>(dtClss.join(','))
              moveRowAnimateToTb(dtTrList, offsetRate * dragNodeHeight)
            }
          }

          const drClss = [`.vxe-tree--node-wrapper[nodeid="${dragNodeid}"]`]
          const newDtTrList = wrapperEl.querySelectorAll<HTMLElement>(drClss.join(','))
          const newTrEl = newDtTrList[0]
          if (dragOffsetTop > -1 && newTrEl) {
            moveRowAnimateToTb(newDtTrList, dragOffsetTop - newTrEl.offsetTop)
          }
        }

        $xeTree.recalculate()
      }).then(() => {
        return {
          status: true
        }
      })
    }).catch(() => {
      return errRest
    }).then((rest) => {
      clearNodeDragData($xeTree)
      clearCrossTreeDragStatus($xeTree)
      return rest
    })
  }
  clearNodeDragData($xeTree)
  clearCrossTreeDragStatus($xeTree)
  return Promise.resolve(errRest)
}

function createInternalData (): TreeInternalData {
  return {
    // initialized: false,
    // lastFilterValue: '',
    treeFullData: [],
    afterTreeList: [],
    afterVisibleList: [],
    nodeMaps: {},
    selectCheckboxMaps: {},
    indeterminateRowMaps: {},
    treeExpandedMaps: {},
    treeExpandLazyLoadedMaps: {},

    lastScrollLeft: 0,
    lastScrollTop: 0,
    scrollYStore: {
      startIndex: 0,
      endIndex: 0,
      visibleSize: 0,
      offsetSize: 0,
      rowHeight: 0
    },

    // prevDragNode: null,
    // prevDragToChild: false,
    // prevDragPos: ''

    lastScrollTime: 0
    // hpTimeout: undefined
  }
}

function createReactData ():TreeReactData {
  return {
    parentHeight: 0,
    customHeight: 0,
    customMinHeight: 0,
    customMaxHeight: 0,
    currentNode: null,
    scrollYLoad: false,
    bodyHeight: 0,
    topSpaceHeight: 0,
    selectRadioKey: null,
    treeList: [],
    updateExpandedFlag: 1,
    updateCheckboxFlag: 1,
    dragNode: null,
    dragTipText: ''
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTree',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    data: Array as PropType<VxeTreePropTypes.Data>,
    autoResize: {
      type: Boolean as PropType<VxeTreePropTypes.AutoResize>,
      default: () => getConfig().tree.autoResize
    },
    height: [String, Number] as PropType<VxeTreePropTypes.Height>,
    maxHeight: {
      type: [String, Number] as PropType<VxeTreePropTypes.MaxHeight>,
      default: () => getConfig().tree.maxHeight
    },
    minHeight: {
      type: [String, Number] as PropType<VxeTreePropTypes.MinHeight>,
      default: () => getConfig().tree.minHeight
    },
    loading: Boolean as PropType<VxeTreePropTypes.Loading>,
    loadingConfig: Object as PropType<VxeTreePropTypes.LoadingConfig>,
    accordion: {
      type: Boolean as PropType<VxeTreePropTypes.Accordion>,
      default: () => getConfig().tree.accordion
    },
    childrenField: {
      type: String as PropType<VxeTreePropTypes.ChildrenField>,
      default: () => getConfig().tree.childrenField
    },
    valueField: {
      type: String as PropType<VxeTreePropTypes.ValueField>,
      default: () => getConfig().tree.valueField
    },
    keyField: {
      type: String as PropType<VxeTreePropTypes.KeyField>,
      default: () => getConfig().tree.keyField
    },
    parentField: {
      type: String as PropType<VxeTreePropTypes.ParentField>,
      default: () => getConfig().tree.parentField
    },
    titleField: {
      type: String as PropType<VxeTreePropTypes.TitleField>,
      default: () => getConfig().tree.titleField
    },
    hasChildField: {
      type: String as PropType<VxeTreePropTypes.HasChildField>,
      default: () => getConfig().tree.hasChildField
    },
    mapChildrenField: {
      type: String as PropType<VxeTreePropTypes.MapChildrenField>,
      default: () => getConfig().tree.mapChildrenField
    },
    transform: Boolean as PropType<VxeTreePropTypes.Transform>,
    // 已废弃
    isCurrent: Boolean as PropType<VxeTreePropTypes.IsCurrent>,
    // 已废弃
    isHover: Boolean as PropType<VxeTreePropTypes.IsHover>,
    expandAll: Boolean as PropType<VxeTreePropTypes.ExpandAll>,
    expandNodeKeys: Array as PropType<VxeTreePropTypes.ExpandNodeKeys>,
    showLine: {
      type: Boolean as PropType<VxeTreePropTypes.ShowLine>,
      default: () => getConfig().tree.showLine
    },
    trigger: String as PropType<VxeTreePropTypes.Trigger>,
    indent: {
      type: Number as PropType<VxeTreePropTypes.Indent>,
      default: () => getConfig().tree.indent
    },
    showRadio: {
      type: Boolean as PropType<VxeTreePropTypes.ShowRadio>,
      default: () => getConfig().tree.showRadio
    },
    checkNodeKey: {
      type: [String, Number] as PropType<VxeTreePropTypes.CheckNodeKey>,
      default: () => getConfig().tree.checkNodeKey
    },
    radioConfig: Object as PropType<VxeTreePropTypes.RadioConfig>,
    showCheckbox: {
      type: Boolean as PropType<VxeTreePropTypes.ShowCheckbox>,
      default: () => getConfig().tree.showCheckbox
    },
    checkNodeKeys: {
      type: Array as PropType<VxeTreePropTypes.CheckNodeKeys>,
      default: () => getConfig().tree.checkNodeKeys
    },
    checkboxConfig: Object as PropType<VxeTreePropTypes.CheckboxConfig>,
    nodeConfig: Object as PropType<VxeTreePropTypes.NodeConfig>,
    lazy: Boolean as PropType<VxeTreePropTypes.Lazy>,
    toggleMethod: Function as PropType<VxeTreePropTypes.ToggleMethod>,
    loadMethod: Function as PropType<VxeTreePropTypes.LoadMethod>,
    drag: {
      type: Boolean as PropType<VxeTreePropTypes.Drag>,
      default: () => getConfig().tree.drag
    },
    dragConfig: Object as PropType<VxeTreePropTypes.DragConfig>,
    menuConfig: Object as PropType<VxeTreePropTypes.MenuConfig>,
    showIcon: {
      type: Boolean as PropType<VxeTreePropTypes.ShowIcon>,
      default: true
    },
    iconOpen: {
      type: String as PropType<VxeTreePropTypes.IconOpen>,
      default: () => getConfig().tree.iconOpen
    },
    iconClose: {
      type: String as PropType<VxeTreePropTypes.IconClose>,
      default: () => getConfig().tree.iconClose
    },
    iconLoaded: {
      type: String as PropType<VxeTreePropTypes.IconLoaded>,
      default: () => getConfig().tree.iconLoaded
    },
    filterValue: [String, Number] as PropType<VxeTreePropTypes.FilterValue>,
    filterConfig: Object as PropType<VxeTreePropTypes.FilterConfig>,
    size: {
      type: String as PropType<VxeTreePropTypes.Size>,
      default: () => getConfig().tree.size || getConfig().size
    },
    virtualYConfig: Object as PropType<VxeTreePropTypes.VirtualYConfig>
  },
  provide () {
    const $xeTree = this
    return {
      $xeTree
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()
    const internalData = createInternalData()
    return {
      xID,
      reactData,
      internalData,
      crossTreeDragNodeInfo: crossTreeDragNodeGlobal
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeTitleField () {
      const $xeTree = this
      const props = $xeTree

      return props.titleField || 'title'
    },
    computeKeyField () {
      const $xeTree = this
      const props = $xeTree

      return props.keyField || 'id'
    },
    computeValueField () {
      const $xeTree = this
      const props = $xeTree

      const keyField = $xeTree.computeKeyField as string
      return props.valueField || keyField
    },
    computeParentField () {
      const $xeTree = this
      const props = $xeTree

      return props.parentField || 'parentId'
    },
    computeChildrenField () {
      const $xeTree = this
      const props = $xeTree

      return props.childrenField || 'children'
    },
    computeMapChildrenField () {
      const $xeTree = this
      const props = $xeTree

      return props.mapChildrenField || 'mapChildren'
    },
    computeHasChildField () {
      const $xeTree = this
      const props = $xeTree

      return props.hasChildField || 'hasChild'
    },
    computeVirtualYOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({} as { gt: number }, getConfig().tree.virtualYConfig, props.virtualYConfig)
    },
    computeIsRowCurrent () {
      const $xeTree = this
      const props = $xeTree

      const nodeOpts = $xeTree.computeNodeOpts as VxeTreePropTypes.NodeConfig
      const { isCurrent } = nodeOpts
      if (XEUtils.isBoolean(isCurrent)) {
        return isCurrent
      }
      return props.isCurrent
    },
    computeIsRowHover () {
      const $xeTree = this
      const props = $xeTree

      const nodeOpts = $xeTree.computeNodeOpts as VxeTreePropTypes.NodeConfig
      const { isHover } = nodeOpts
      if (XEUtils.isBoolean(isHover)) {
        return isHover
      }
      return props.isHover
    },
    computeRadioOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({ showIcon: true }, getConfig().tree.radioConfig, props.radioConfig)
    },
    computeCheckboxOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({ showIcon: true }, getConfig().tree.checkboxConfig, props.checkboxConfig)
    },
    computeNodeOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({}, getConfig().tree.nodeConfig, props.nodeConfig)
    },
    computeLoadingOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({}, getConfig().tree.loadingConfig, props.loadingConfig)
    },
    computeDragOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({}, getConfig().tree.dragConfig, props.dragConfig)
    },
    computeMenuOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({}, getConfig().tree.menuConfig, props.menuConfig)
    },
    computeTreeStyle () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      const { customHeight, customMinHeight, customMaxHeight } = reactData
      const stys: Record<string, string> = {}
      if (customHeight) {
        stys.height = toCssUnit(customHeight)
      }
      if (customMinHeight) {
        stys.minHeight = toCssUnit(customMinHeight)
      }
      if (customMaxHeight) {
        stys.maxHeight = toCssUnit(customMaxHeight)
      }
      return stys
    },
    computeFilterOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({}, getConfig().tree.filterConfig, props.filterConfig)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTreeEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTree = this
      $xeTree.$emit(type, createEvent(evnt, { $tree: $xeTree }, params))
    },
    getNodeId (node: any) {
      const $xeTree = this

      const valueField = $xeTree.computeValueField
      const nodeKey = XEUtils.get(node, valueField)
      return enNodeValue(nodeKey)
    },
    getNodeById (nodeid: string) {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { nodeMaps } = internalData
      if (nodeid) {
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          return nodeItem.item
        }
      }
      return null
    },
    isExpandByNode (node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { updateExpandedFlag } = reactData
      const { treeExpandedMaps } = internalData
      const nodeid = $xeTree.getNodeId(node)
      return !!(updateExpandedFlag && treeExpandedMaps[nodeid])
    },
    isCheckedByRadioNodeId (nodeid: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      const { selectRadioKey } = reactData
      return selectRadioKey === nodeid
    },
    isCheckedByRadioNode (node: any) {
      const $xeTree = this

      return $xeTree.isCheckedByRadioNodeId($xeTree.getNodeId(node))
    },
    isCheckedByCheckboxNodeId (nodeid: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      return !!(updateCheckboxFlag && selectCheckboxMaps[nodeid])
    },
    isCheckedByCheckboxNode (node: any) {
      const $xeTree = this

      return $xeTree.isCheckedByCheckboxNodeId($xeTree.getNodeId(node))
    },
    isIndeterminateByCheckboxNodeid (nodeid: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { updateCheckboxFlag } = reactData
      const { indeterminateRowMaps } = internalData
      return !!(updateCheckboxFlag && indeterminateRowMaps[nodeid])
    },
    isIndeterminateByCheckboxNode (node: any) {
      const $xeTree = this

      return $xeTree.isIndeterminateByCheckboxNodeid($xeTree.getNodeId(node))
    },
    emitCheckboxMode (value: VxeTreePropTypes.CheckNodeKeys) {
      const $xeTree = this

      $xeTree.$emit('update:checkNodeKeys', value)
    },
    emitRadioMode (value: VxeTreePropTypes.CheckNodeKey) {
      const $xeTree = this

      $xeTree.$emit('update:checkNodeKey', value)
    },
    setRadioNode (node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      if (node) {
        const nodeid = $xeTree.getNodeId(node)
        reactData.selectRadioKey = nodeid
        $xeTree.emitRadioMode(deNodeValue(nodeid))
      } else {
        $xeTree.emitRadioMode(null)
      }
      return $xeTree.$nextTick()
    },
    setCheckboxNode (nodeList: any | any[], checked: boolean) {
      const $xeTree = this

      if (nodeList) {
        if (!XEUtils.isArray(nodeList)) {
          nodeList = [nodeList]
        }
        $xeTree.handleCheckedCheckboxNode(nodeList, checked)
      }
      $xeTree.emitCheckboxMode($xeTree.getCheckboxNodeIds())
      return $xeTree.$nextTick()
    },
    setCheckboxByNodeId (nodeKeys: any | any[], checked: boolean) {
      const $xeTree = this

      $xeTree.handleSetCheckboxByNodeId(nodeKeys, checked)
      $xeTree.emitCheckboxMode($xeTree.getCheckboxNodeIds())
      return $xeTree.$nextTick()
    },
    handleSetCheckboxByNodeId (nodeKeys: any | any[], checked: boolean) {
      const $xeTree = this
      const internalData = $xeTree.internalData

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
        $xeTree.handleCheckedCheckboxNode(nodeList, checked)
      }
      return $xeTree.$nextTick()
    },
    handleCheckedCheckboxNode (nodeList: any[], checked: boolean) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const { selectCheckboxMaps } = internalData
      const mapChildrenField = $xeTree.computeMapChildrenField
      const childrenField = $xeTree.computeChildrenField
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { checkStrictly } = checkboxOpts
      const handleSelect = (node: any) => {
        const nodeid = $xeTree.getNodeId(node)
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
      $xeTree.updateCheckboxStatus()
    },
    updateCheckboxChecked (nodeKeys: VxeTreePropTypes.CheckNodeKeys) {
      const $xeTree = this
      const internalData = $xeTree.internalData

      internalData.selectCheckboxMaps = {}
      $xeTree.handleSetCheckboxByNodeId(nodeKeys, true)
    },
    handleSetExpand (nodeid: string, expanded: boolean, expandedMaps: Record<string, boolean>) {
      if (expanded) {
        if (!expandedMaps[nodeid]) {
          expandedMaps[nodeid] = true
        }
      } else {
        if (expandedMaps[nodeid]) {
          delete expandedMaps[nodeid]
        }
      }
    },
    getParentElem () {
      const $xeTree = this

      const el = $xeTree.$refs.refElem as HTMLDivElement
      return el ? el.parentElement : null
    },
    calcTreeHeight (key: 'height' | 'minHeight' | 'maxHeight') {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData

      const { parentHeight } = reactData
      const val = props[key]
      let num = 0
      if (val) {
        if (val === '100%' || val === 'auto') {
          num = parentHeight
        } else {
          if (isScale(val)) {
            num = Math.floor((XEUtils.toInteger(val) || 1) / 100 * parentHeight)
          } else {
            num = XEUtils.toNumber(val)
          }
          num = Math.max(40, num)
        }
      }
      return num
    },
    updateHeight () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.customHeight = $xeTree.calcTreeHeight('height')
      reactData.customMinHeight = $xeTree.calcTreeHeight('minHeight')
      reactData.customMaxHeight = $xeTree.calcTreeHeight('maxHeight')

      // 如果启用虚拟滚动，默认高度
      if (reactData.scrollYLoad && !(reactData.customHeight || reactData.customMinHeight)) {
        reactData.customHeight = 300
      }
    },
    createNode (records: any[]) {
      const $xeTree = this

      const valueField = $xeTree.computeValueField
      return Promise.resolve(
        records.map(obj => {
          const item = { ...obj }
          let nodeid = $xeTree.getNodeId(item)
          if (!nodeid) {
            nodeid = getNodeUniqueId()
            XEUtils.set(item, valueField, nodeid)
          }
          return item
        })
      )
    },
    cacheNodeMap () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { treeFullData } = internalData
      const valueField = $xeTree.computeValueField
      const childrenField = $xeTree.computeChildrenField
      const keyMaps: Record<string, VxeTreeDefines.NodeCacheItem> = {}
      XEUtils.eachTree(treeFullData, (item, index, items, path, parent, nodes) => {
        let nodeid = $xeTree.getNodeId(item)
        if (!nodeid) {
          nodeid = getNodeUniqueId()
          XEUtils.set(item, valueField, nodeid)
        }
        keyMaps[nodeid] = {
          item,
          index,
          $index: -1,
          _index: -1,
          items,
          parent,
          nodes,
          level: nodes.length - 1,
          treeIndex: index,
          lineCount: 0,
          treeLoaded: false
        }
      }, { children: childrenField })
      internalData.nodeMaps = keyMaps
    },
    updateAfterDataIndex () {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { transform } = props
      const { afterTreeList, nodeMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      let vtIndex = 0
      XEUtils.eachTree(afterTreeList, (item, index, items) => {
        const nodeid = $xeTree.getNodeId(item)
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
            parent,
            nodes: [],
            level: 0,
            treeIndex: index,
            lineCount: 0,
            treeLoaded: false
          }
          nodeMaps[nodeid] = rest
        }
        vtIndex++
      }, { children: transform ? mapChildrenField : childrenField })
    },
    updateAfterFullData () {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { transform, filterValue } = props
      const { treeFullData, lastFilterValue } = internalData
      const titleField = $xeTree.computeTitleField
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      const filterOpts = $xeTree.computeFilterOpts
      const { autoExpandAll, beforeFilterMethod, filterMethod, afterFilterMethod } = filterOpts
      let fullList = treeFullData
      let treeList = fullList
      let filterStr = ''
      if (filterValue || filterValue === 0) {
        filterStr = `${filterValue}`
        const handleSearch = filterMethod
          ? (item: any) => {
              return filterMethod({
                $tree: $xeTree,
                node: item,
                filterValue: filterStr
              })
            }
          : (item: any) => {
              return String(item[titleField]).toLowerCase().indexOf(filterStr.toLowerCase()) > -1
            }
        const bafParams = { $tree: $xeTree, filterValue: filterStr }
        if (beforeFilterMethod) {
          beforeFilterMethod(bafParams)
        }
        if (transform) {
          treeList = XEUtils.searchTree(treeFullData, handleSearch, {
            original: true,
            isEvery: true,
            children: childrenField,
            mapChildren: mapChildrenField
          })
          fullList = treeList
        } else {
          fullList = treeFullData.filter(handleSearch)
        }
        internalData.lastFilterValue = filterStr
        $xeTree.$nextTick(() => {
          // 筛选时自动展开
          if (autoExpandAll) {
            $xeTree.setAllExpandNode(true).then(() => {
              if (afterFilterMethod) {
                afterFilterMethod(bafParams)
              }
            })
          } else {
            if (afterFilterMethod) {
              afterFilterMethod(bafParams)
            }
          }
        })
      } else {
        if (transform) {
          treeList = XEUtils.searchTree(treeFullData, () => true, {
            original: true,
            isEvery: true,
            children: childrenField,
            mapChildren: mapChildrenField
          })
          fullList = treeList
          if (lastFilterValue) {
            const bafParams = { $tree: $xeTree, filterValue: filterStr }
            if (beforeFilterMethod) {
              beforeFilterMethod(bafParams)
            }
            // 取消筛选时自动收起
            $xeTree.$nextTick(() => {
              if (autoExpandAll) {
                $xeTree.clearAllExpandNode().then(() => {
                  if (afterFilterMethod) {
                    afterFilterMethod(bafParams)
                  }
                })
              } else {
                if (afterFilterMethod) {
                  afterFilterMethod(bafParams)
                }
              }
            })
          }
        }
        internalData.lastFilterValue = ''
      }
      internalData.afterVisibleList = fullList
      internalData.afterTreeList = treeList
      $xeTree.updateAfterDataIndex()
    },
    /**
     * 如果为虚拟树、则将树结构拍平
     */
    handleTreeToList () {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { transform } = props
      const { afterTreeList, treeExpandedMaps } = internalData
      const mapChildrenField = $xeTree.computeMapChildrenField
      const expandMaps: {
        [key: string]: number
      } = {}
      if (transform) {
        const fullData: any[] = []
        XEUtils.eachTree(afterTreeList, (item, index, items, path, parentRow) => {
          const nodeid = $xeTree.getNodeId(item)
          const parentNodeid = $xeTree.getNodeId(parentRow)
          if (!parentRow || (expandMaps[parentNodeid] && treeExpandedMaps[parentNodeid])) {
            expandMaps[nodeid] = 1
            fullData.push(item)
          }
        }, { children: mapChildrenField })
        $xeTree.updateScrollYStatus(fullData)
        internalData.afterVisibleList = fullData
        return fullData
      }
      return internalData.afterVisibleList
    },
    handleData (force?: boolean) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { scrollYLoad } = reactData
      const { scrollYStore, nodeMaps } = internalData
      let fullList: any[] = internalData.afterVisibleList
      if (force) {
        // 更新数据，处理筛选和排序
        $xeTree.updateAfterFullData()
        // 如果为虚拟树，将树结构拍平
        fullList = $xeTree.handleTreeToList()
      }
      const treeList = scrollYLoad ? fullList.slice(scrollYStore.startIndex, scrollYStore.endIndex) : fullList.slice(0)
      treeList.forEach((item, $index) => {
        const nodeid = $xeTree.getNodeId(item)
        const itemRest = nodeMaps[nodeid]
        if (itemRest) {
          itemRest.$index = $index
        }
      })
      reactData.treeList = treeList
    },
    triggerSearchEvent: XEUtils.debounce(function (this: any) {
      const $xeSelect = this

      $xeSelect.handleData(true)
    }, 350, { trailing: true }),
    loadData (list: any[]) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { expandAll, expandNodeKeys, transform } = props
      const { initialized, scrollYStore } = internalData
      const keyField = $xeTree.computeKeyField
      const parentField = $xeTree.computeParentField
      const childrenField = $xeTree.computeChildrenField
      const fullData = transform ? XEUtils.toArrayTree(list, { key: keyField, parentKey: parentField, mapChildren: childrenField }) : list ? list.slice(0) : []
      internalData.treeFullData = fullData
      Object.assign(scrollYStore, {
        startIndex: 0,
        endIndex: 1,
        visibleSize: 0
      })
      const sYLoad = $xeTree.updateScrollYStatus(fullData)
      $xeTree.cacheNodeMap()
      $xeTree.handleData(true)
      if (sYLoad) {
        if (!(props.height || props.maxHeight)) {
          errLog('vxe.error.reqProp', ['[tree] height | max-height | virtual-y-config.enabled=false'])
        }
      }
      return $xeTree.computeScrollLoad().then(() => {
        if (!initialized) {
          if (list && list.length) {
            internalData.initialized = true
            if (expandAll) {
              $xeTree.setAllExpandNode(true)
            } else if (expandNodeKeys && expandNodeKeys.length) {
              $xeTree.setExpandByNodeId(expandNodeKeys, true)
            }
            $xeTree.handleSetCheckboxByNodeId(props.checkNodeKeys || [], true)
          }
        }
        $xeTree.updateHeight()
        $xeTree.refreshScroll()
      })
    },
    updateScrollYStatus (fullData?: any[]) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const virtualYOpts = $xeTree.computeVirtualYOpts
      const allList = fullData || internalData.treeFullData
      // 如果gt为0，则总是启用
      const scrollYLoad = !!transform && !!virtualYOpts.enabled && virtualYOpts.gt > -1 && (virtualYOpts.gt === 0 || virtualYOpts.gt < allList.length)
      reactData.scrollYLoad = scrollYLoad
      return scrollYLoad
    },
    updateYSpace () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { scrollYLoad } = reactData
      const { scrollYStore, afterVisibleList } = internalData
      reactData.bodyHeight = scrollYLoad ? afterVisibleList.length * scrollYStore.rowHeight : 0
      reactData.topSpaceHeight = scrollYLoad ? Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0) : 0
    },
    updateYData () {
      const $xeTree = this

      $xeTree.handleData()
      $xeTree.updateYSpace()
    },
    computeScrollLoad () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      return $xeTree.$nextTick().then(() => {
        const { scrollYLoad } = reactData
        const { scrollYStore } = internalData
        const virtualBodyElem = $xeTree.$refs.refVirtualBody as HTMLDivElement
        const virtualYOpts = $xeTree.computeVirtualYOpts
        let rowHeight = 0
        let firstItemElem: HTMLElement | undefined
        if (virtualBodyElem) {
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
          const scrollBodyElem = $xeTree.$refs.refVirtualWrapper as HTMLDivElement
          const visibleYSize = Math.max(8, scrollBodyElem ? Math.ceil(scrollBodyElem.clientHeight / rowHeight) : 0)
          const offsetYSize = Math.max(0, Math.min(2, XEUtils.toNumber(virtualYOpts.oSize)))
          scrollYStore.offsetSize = offsetYSize
          scrollYStore.visibleSize = visibleYSize
          scrollYStore.endIndex = Math.max(scrollYStore.startIndex, visibleYSize + offsetYSize, scrollYStore.endIndex)
          $xeTree.updateYData()
        } else {
          $xeTree.updateYSpace()
        }
      })
    },
    /**
     * 如果有滚动条，则滚动到对应的位置
     */
    scrollTo (scrollLeft: { top?: number | null; left?: number | null; } | number | null | undefined, scrollTop?: number | null) {
      const $xeTree = this

      return handleScrollTo($xeTree, scrollLeft, scrollTop)
    },
    scrollToNode (node: any) {
      const $xeTree = this

      return $xeTree.scrollToNodeId($xeTree.getNodeId(node))
    },
    scrollToNodeId (nodeid: string | number | null) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { transform } = props
      const { scrollYStore, afterTreeList } = internalData
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      const scrollBodyElem = $xeTree.$refs.refVirtualWrapper as HTMLDivElement
      if (nodeid && scrollBodyElem) {
        if (transform) {
          const matchObj = XEUtils.findTree(afterTreeList, item => $xeTree.getNodeId(item) === nodeid, { children: transform ? mapChildrenField : childrenField })
          if (matchObj) {
            return $xeTree.setExpandNode(matchObj.nodes, true).then(() => {
              const itemIndex = XEUtils.findIndexOf(internalData.afterVisibleList, item => $xeTree.getNodeId(item) === nodeid)
              if (itemIndex > -1) {
                const targetTop = Math.max(0, (itemIndex - 1) * scrollYStore.rowHeight)
                return handleScrollTo($xeTree, scrollBodyElem.scrollLeft, targetTop)
              }
            })
          }
        } else {
          const itemEl = scrollBodyElem.querySelector<HTMLDivElement>(`.vxe-tree--node-wrapper[nodeid="${nodeid}"]`)
          if (itemEl) {
            return handleScrollTo($xeTree, scrollBodyElem.scrollLeft, itemEl.offsetTop)
          }
        }
      }
      return $xeTree.recalculate()
    },
    /**
     * 刷新滚动条
     */
    refreshScroll () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { lastScrollLeft, lastScrollTop } = internalData
      return $xeTree.clearScroll().then(() => {
        if (lastScrollLeft || lastScrollTop) {
          internalData.lastScrollLeft = 0
          internalData.lastScrollTop = 0
          return scrollTo(lastScrollLeft, lastScrollTop)
        }
      })
    },
    /**
     * 重新计算列表
     */
    recalculate () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { scrollYStore } = internalData
      const { rowHeight } = scrollYStore
      const el = $xeTree.$refs.refElem as HTMLDivElement
      if (el && el.clientWidth && el.clientHeight) {
        const parentEl = $xeTree.getParentElem()
        const headerWrapperEl = $xeTree.$refs.refHeaderWrapperElem as HTMLDivElement
        const footerWrapperEl = $xeTree.$refs.refFooterWrapperElem as HTMLDivElement
        const headHeight = headerWrapperEl ? headerWrapperEl.clientHeight : 0
        const footHeight = footerWrapperEl ? footerWrapperEl.clientHeight : 0
        if (parentEl) {
          const parentPaddingSize = getPaddingTopBottomSize(parentEl)
          reactData.parentHeight = Math.max(headHeight + footHeight + rowHeight, parentEl.clientHeight - parentPaddingSize - headHeight - footHeight)
        }
        $xeTree.updateHeight()
        return $xeTree.computeScrollLoad().then(() => {
          $xeTree.updateHeight()
          $xeTree.updateYSpace()
        })
      }
      return $xeTree.$nextTick()
    },
    getFullData () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { treeFullData } = internalData
      return treeFullData.slice(0)
    },
    loadYData () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { scrollYStore } = internalData
      const { startIndex, endIndex, visibleSize, offsetSize, rowHeight } = scrollYStore
      const scrollBodyElem = $xeTree.$refs.refVirtualWrapper as HTMLDivElement
      if (!scrollBodyElem) {
        return
      }
      const scrollTop = scrollBodyElem.scrollTop
      const toVisibleIndex = Math.floor(scrollTop / rowHeight)
      const offsetStartIndex = Math.max(0, toVisibleIndex - 1 - offsetSize)
      const offsetEndIndex = toVisibleIndex + visibleSize + offsetSize
      if (toVisibleIndex <= startIndex || toVisibleIndex >= endIndex - visibleSize - 1) {
        if (startIndex !== offsetStartIndex || endIndex !== offsetEndIndex) {
          scrollYStore.startIndex = offsetStartIndex
          scrollYStore.endIndex = offsetEndIndex
          $xeTree.updateYData()
        }
      }
    },
    scrollEvent (evnt: Event) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const scrollBodyElem = evnt.target as HTMLDivElement
      const scrollTop = scrollBodyElem.scrollTop
      const scrollLeft = scrollBodyElem.scrollLeft
      const isX = scrollLeft !== internalData.lastScrollLeft
      const isY = scrollTop !== internalData.lastScrollTop
      internalData.lastScrollTop = scrollTop
      internalData.lastScrollLeft = scrollLeft
      if (reactData.scrollYLoad) {
        $xeTree.loadYData()
      }
      internalData.lastScrollTime = Date.now()
      $xeTree.dispatchEvent('scroll', { scrollLeft, scrollTop, isX, isY }, evnt)
    },
    clearScroll () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const scrollBodyElem = $xeTree.$refs.refVirtualWrapper as HTMLDivElement
      if (scrollBodyElem) {
        scrollBodyElem.scrollTop = 0
        scrollBodyElem.scrollLeft = 0
      }
      internalData.lastScrollTop = 0
      internalData.lastScrollLeft = 0
      return $xeTree.$nextTick()
    },
    handleNodeMousedownEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { drag } = props
      const { nodeMaps } = internalData
      const targetEl = evnt.currentTarget
      const dragConfig = $xeTree.computeDragOpts
      const { trigger, isCrossDrag, isPeerDrag, disabledMethod } = dragConfig
      const nodeid = $xeTree.getNodeId(node)
      const triggerTreeNode = getEventTargetNode(evnt, targetEl, 'vxe-tree--node-item-switcher').flag
      let isNodeDrag = false
      if (drag) {
        isNodeDrag = trigger === 'node'
      }
      if (!triggerTreeNode) {
        const params = { node, $tree: $xeTree }
        const itemRest = nodeMaps[nodeid]
        if (isNodeDrag && (isCrossDrag || isPeerDrag || (itemRest && !itemRest.level)) && !(disabledMethod && disabledMethod(params))) {
          $xeTree.handleNodeDragMousedownEvent(evnt, { node })
        }
      }
    },
    handleNodeClickEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData

      const { showRadio, showCheckbox, trigger } = props
      const radioOpts = $xeTree.computeRadioOpts
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const isRowCurrent = $xeTree.computeIsRowCurrent
      let triggerCurrent = false
      let triggerRadio = false
      let triggerCheckbox = false
      let triggerExpand = false
      if (isRowCurrent) {
        triggerCurrent = true
        $xeTree.changeCurrentEvent(evnt, node)
      } else if (reactData.currentNode) {
        reactData.currentNode = null
      }
      if (trigger === 'node') {
        triggerExpand = true
        $xeTree.toggleExpandEvent(evnt, node)
      }
      if (showRadio && radioOpts.trigger === 'node') {
        triggerRadio = true
        $xeTree.changeRadioEvent(evnt, node)
      }
      if (showCheckbox && checkboxOpts.trigger === 'node') {
        triggerCheckbox = true
        $xeTree.changeCheckboxEvent(evnt, node)
      }
      $xeTree.dispatchEvent('node-click', { node, triggerCurrent, triggerRadio, triggerCheckbox, triggerExpand }, evnt)
    },
    handleNodeDblclickEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this

      $xeTree.dispatchEvent('node-dblclick', { node }, evnt)
    },
    handleContextmenuEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData

      const { menuConfig } = props
      const isRowCurrent = $xeTree.computeIsRowCurrent
      const menuOpts = $xeTree.computeMenuOpts
      if (menuConfig ? isEnableConf(menuOpts) : menuOpts.enabled) {
        const { options, visibleMethod } = menuOpts
        if (!visibleMethod || visibleMethod({ $tree: $xeTree, options, node })) {
          if (isRowCurrent) {
            $xeTree.changeCurrentEvent(evnt, node)
          } else if (reactData.currentNode) {
            reactData.currentNode = null
          }
          if (VxeUI.contextMenu) {
            VxeUI.contextMenu.openByEvent(evnt, {
              options,
              events: {
                optionClick (eventParams) {
                  const { option } = eventParams
                  const gMenuOpts = menus.get(option.code)
                  const tmMethod = gMenuOpts ? gMenuOpts.treeMenuMethod : null
                  const params = {
                    menu: option,
                    node,
                    $event: evnt,
                    $tree: $xeTree,

                    /**
                     * @@deprecated
                     */
                    option
                  }
                  if (tmMethod) {
                    tmMethod(params, evnt)
                  }
                  $xeTree.dispatchEvent('menu-click', params, eventParams.$event)
                }
              }
            })
          }
        }
      }
      $xeTree.dispatchEvent('node-menu', { node }, evnt)
    },
    handleAsyncTreeExpandChilds (node: any) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { loadMethod } = props
      const { checkStrictly } = checkboxOpts
      return new Promise<void>(resolve => {
        if (loadMethod) {
          const { nodeMaps } = internalData
          const nodeid = $xeTree.getNodeId(node)
          const nodeItem = nodeMaps[nodeid]
          internalData.treeExpandLazyLoadedMaps[nodeid] = true
          Promise.resolve(
            loadMethod({ $tree: $xeTree, node })
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
              return $xeTree.loadChildrenNode(node, childRecords).then(childRows => {
                const { treeExpandedMaps } = internalData
                if (childRows.length && !treeExpandedMaps[nodeid]) {
                  treeExpandedMaps[nodeid] = true
                }
                reactData.updateExpandedFlag++
                // 如果当前节点已选中，则展开后子节点也被选中
                if (!checkStrictly && $xeTree.isCheckedByCheckboxNodeId(nodeid)) {
                  $xeTree.handleCheckedCheckboxNode(childRows, true)
                }
                $xeTree.dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
                return $xeTree.$nextTick()
              })
            } else {
              $xeTree.dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
            }
          }).catch((e) => {
            const { treeExpandLazyLoadedMaps } = internalData
            nodeItem.treeLoaded = false
            if (treeExpandLazyLoadedMaps[nodeid]) {
              treeExpandLazyLoadedMaps[nodeid] = false
            }
            $xeTree.dispatchEvent('load-error', { node, data: e }, new Event('load-error'))
          }).finally(() => {
            $xeTree.handleTreeToList()
            $xeTree.handleData()
            return $xeTree.recalculate()
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
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { lazy, accordion, toggleMethod } = props
      const { treeExpandLazyLoadedMaps, treeExpandedMaps } = internalData
      const { nodeMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const hasChildField = $xeTree.computeHasChildField
      const result: any[] = []
      let validNodes = toggleMethod ? nodeList.filter((node: any) => toggleMethod({ $tree: $xeTree, expanded, node })) : nodeList
      if (accordion) {
        validNodes = validNodes.length ? [validNodes[validNodes.length - 1]] : []
        // 同一级只能展开一个
        const nodeid = $xeTree.getNodeId(validNodes[0])
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          nodeItem.items.forEach(item => {
            const itemNodeId = $xeTree.getNodeId(item)
            if (treeExpandedMaps[itemNodeId]) {
              delete treeExpandedMaps[itemNodeId]
            }
          })
        }
      }
      const expandNodes: any[] = []
      if (expanded) {
        validNodes.forEach((item) => {
          const itemNodeId = $xeTree.getNodeId(item)
          if (!treeExpandedMaps[itemNodeId]) {
            const nodeItem = nodeMaps[itemNodeId]
            const isLoad = lazy && item[hasChildField] && !nodeItem.treeLoaded && !treeExpandLazyLoadedMaps[itemNodeId]
            // 是否使用懒加载
            if (isLoad) {
              result.push($xeTree.handleAsyncTreeExpandChilds(item))
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
          const itemNodeId = $xeTree.getNodeId(item)
          if (treeExpandedMaps[itemNodeId]) {
            delete treeExpandedMaps[itemNodeId]
            expandNodes.push(item)
          }
        })
      }
      reactData.updateExpandedFlag++
      $xeTree.handleTreeToList()
      $xeTree.handleData()
      return Promise.all(result).then(() => $xeTree.recalculate())
    },
    toggleExpandEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { lazy } = props
      const { treeExpandedMaps, treeExpandLazyLoadedMaps } = internalData
      const nodeid = $xeTree.getNodeId(node)
      const expanded = !treeExpandedMaps[nodeid]
      evnt.stopPropagation()
      if (!lazy || !treeExpandLazyLoadedMaps[nodeid]) {
        $xeTree.handleBaseTreeExpand([node], expanded)
      }
      $xeTree.dispatchEvent('node-expand', { node, expanded }, evnt)
    },
    updateCheckboxStatus () {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const { selectCheckboxMaps, indeterminateRowMaps, afterTreeList } = internalData
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { checkStrictly, checkMethod } = checkboxOpts
      if (!checkStrictly) {
        const childRowMaps: Record<string, number> = {}
        const childRowList: any[][] = []
        XEUtils.eachTree(afterTreeList, (node) => {
          const nodeid = $xeTree.getNodeId(node)
          const childList = node[childrenField]
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
                  const childNodeid = $xeTree.getNodeId(item)
                  const isSelect = selectCheckboxMaps[childNodeid]
                  if (checkMethod({ $tree: $xeTree, node: item })) {
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
                const childNodeid = $xeTree.getNodeId(item)
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
    changeCheckboxEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      evnt.preventDefault()
      evnt.stopPropagation()
      const { transform } = props
      const { selectCheckboxMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { checkStrictly, checkMethod } = checkboxOpts
      let isDisabled = !!checkMethod
      if (checkMethod) {
        isDisabled = !checkMethod({ $tree: $xeTree, node })
      }
      if (isDisabled) {
        return
      }
      const nodeid = $xeTree.getNodeId(node)
      let isChecked = false
      if (selectCheckboxMaps[nodeid]) {
        delete selectCheckboxMaps[nodeid]
      } else {
        isChecked = true
        selectCheckboxMaps[nodeid] = node
      }
      if (!checkStrictly) {
        XEUtils.eachTree(XEUtils.get(node, transform ? mapChildrenField : childrenField), (childNode) => {
          const childNodeid = $xeTree.getNodeId(childNode)
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
      $xeTree.updateCheckboxStatus()
      const nodeids = XEUtils.keys(selectCheckboxMaps)
      const value = nodeids.map(deNodeValue)
      $xeTree.emitCheckboxMode(value)
      $xeTree.dispatchEvent('checkbox-change', { node, value, checked: isChecked }, evnt)
    },
    changeCurrentEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      evnt.preventDefault()
      const nodeOpts = $xeTree.computeNodeOpts
      const { currentMethod, trigger } = nodeOpts
      const childrenField = $xeTree.computeChildrenField
      const childList: any[] = XEUtils.get(node, childrenField)
      const hasChild = childList && childList.length
      let isDisabled = !!currentMethod
      if (trigger === 'child') {
        if (hasChild) {
          return
        }
      } else if (trigger === 'parent') {
        if (!hasChild) {
          return
        }
      }
      if (currentMethod) {
        isDisabled = !currentMethod({ node })
      }
      if (isDisabled) {
        return
      }
      const isChecked = true
      reactData.currentNode = node
      $xeTree.dispatchEvent('current-change', { node, checked: isChecked }, evnt)
    },
    changeRadioEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      evnt.preventDefault()
      evnt.stopPropagation()
      const radioOpts = $xeTree.computeRadioOpts
      const { checkMethod } = radioOpts
      let isDisabled = !!checkMethod
      if (checkMethod) {
        isDisabled = !checkMethod({ $tree: $xeTree, node })
      }
      if (isDisabled) {
        return
      }
      const isChecked = true
      const nodeid = $xeTree.getNodeId(node)
      const value = deNodeValue(nodeid)
      reactData.selectRadioKey = nodeid
      $xeTree.emitRadioMode(value)
      $xeTree.dispatchEvent('radio-change', { node, value, checked: isChecked }, evnt)
    },
    handleGlobalResizeEvent () {
      const $xeTree = this

      const el = $xeTree.$refs.refElem as HTMLDivElement
      if (!el || !el.clientWidth) {
        return
      }
      $xeTree.recalculate()
    },
    reloadData (data: any[]) {
      const $xeTree = this

      return $xeTree.loadData(data || [])
    },
    clearCurrentNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.currentNode = null
      return $xeTree.$nextTick()
    },
    getCurrentNodeId () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      const { currentNode } = reactData
      if (currentNode) {
        return deNodeValue($xeTree.getNodeId(currentNode))
      }
      return null
    },
    getCurrentNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { currentNode } = reactData
      const { nodeMaps } = internalData
      if (currentNode) {
        const nodeItem = nodeMaps[$xeTree.getNodeId(currentNode)]
        if (nodeItem) {
          return nodeItem.item
        }
      }
      return null
    },
    setCurrentNodeId (nodeKey: string | number | null) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { nodeMaps } = internalData
      const nodeItem = nodeMaps[enNodeValue(nodeKey)]
      reactData.currentNode = nodeItem ? nodeItem.item : null
      return $xeTree.$nextTick()
    },
    setCurrentNode (node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.currentNode = node
      return $xeTree.$nextTick()
    },
    clearRadioNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.selectRadioKey = null
      $xeTree.emitRadioMode(null)
      return $xeTree.$nextTick()
    },
    getRadioNodeId () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      return reactData.selectRadioKey || null
    },
    getRadioNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { selectRadioKey } = reactData
      const { nodeMaps } = internalData
      if (selectRadioKey) {
        const nodeItem = nodeMaps[selectRadioKey]
        if (nodeItem) {
          return nodeItem.item
        }
      }
      return null
    },
    setRadioNodeId (nodeKey: string | number | null) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.selectRadioKey = enNodeValue(nodeKey)
      $xeTree.emitRadioMode(nodeKey)
      return $xeTree.$nextTick()
    },
    getCheckboxNodeIds () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { selectCheckboxMaps } = internalData
      const nodeKeys: any[] = []
      XEUtils.each(selectCheckboxMaps, (item, nodeId) => {
        nodeKeys.push(deNodeValue(nodeId))
      })
      return nodeKeys
    },
    getCheckboxNodes () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { nodeMaps, selectCheckboxMaps } = internalData
      const list: any[] = []
      XEUtils.each(selectCheckboxMaps, (item, nodeid) => {
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          list.push(nodeItem.item)
        }
      })
      return list
    },
    clearCheckboxNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      internalData.indeterminateRowMaps = {}
      internalData.selectCheckboxMaps = {}
      reactData.updateCheckboxFlag++
      $xeTree.updateCheckboxStatus()
      $xeTree.emitCheckboxMode([])
      return $xeTree.$nextTick().then(() => {
        return { checkNodeKeys: [], checkNodes: [] }
      })
    },
    setAllCheckboxNode (checked: boolean) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const selectMaps: Record<string, boolean> = {}
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      const checkKeys: string[] = []
      const checkNodes: any[] = []
      if (checked) {
        XEUtils.eachTree(internalData.afterTreeList, (node) => {
          const nodeid = $xeTree.getNodeId(node)
          checkKeys.push(nodeid)
          checkNodes.push(node)
          selectMaps[nodeid] = true
        }, { children: transform ? mapChildrenField : childrenField })
      }
      internalData.indeterminateRowMaps = {}
      internalData.selectCheckboxMaps = selectMaps
      reactData.updateCheckboxFlag++
      $xeTree.updateCheckboxStatus()
      return $xeTree.$nextTick().then(() => {
        return { checkNodeKeys: checkKeys, checkNodes }
      })
    },
    clearExpandNode () {
      const $xeTree = this

      return $xeTree.clearAllExpandNode()
    },
    clearAllExpandNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { nodeMaps, scrollYStore } = internalData
      XEUtils.each(nodeMaps, (nodeItem: VxeTreeDefines.NodeCacheItem) => {
        nodeItem.treeLoaded = false
      })
      internalData.treeExpandedMaps = {}
      reactData.updateExpandedFlag++
      reactData.topSpaceHeight = 0
      scrollYStore.startIndex = 0
      scrollYStore.endIndex = 1
      $xeTree.handleTreeToList()
      $xeTree.handleData()
      return $xeTree.recalculate()
    },
    setExpandByNodeId (nodeKeys: string | number | (string | number | null)[] | null, expanded: boolean) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { treeExpandedMaps } = internalData
      if (nodeKeys) {
        if (!XEUtils.isArray(nodeKeys)) {
          nodeKeys = [nodeKeys]
        }
        nodeKeys.forEach((nodeKey) => {
          const nodeid = enNodeValue(nodeKey)
          handleSetExpand(nodeid, expanded, treeExpandedMaps)
        })
        reactData.updateExpandedFlag++
      }
      $xeTree.handleTreeToList()
      $xeTree.handleData()
      return $xeTree.recalculate()
    },
    getExpandNodeIds () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { treeExpandedMaps } = internalData
      const nodeKeys: any[] = []
      XEUtils.each(treeExpandedMaps, (item, nodeId) => {
        nodeKeys.push(deNodeValue(nodeId))
      })
      return nodeKeys
    },
    getExpandNodes () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { nodeMaps, treeExpandedMaps } = internalData
      const list: any[] = []
      XEUtils.each(treeExpandedMaps, (item, nodeid) => {
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          list.push(nodeItem.item)
        }
      })
      return list
    },
    setExpandNode (nodes: any, expanded: boolean) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { treeExpandedMaps } = internalData
      if (nodes) {
        if (!XEUtils.isArray(nodes)) {
          nodes = [nodes]
        }
        nodes.forEach((node: any) => {
          const nodeid = $xeTree.getNodeId(node)
          handleSetExpand(nodeid, expanded, treeExpandedMaps)
        })
        reactData.updateExpandedFlag++
      }
      $xeTree.handleTreeToList()
      $xeTree.handleData()
      return $xeTree.recalculate()
    },
    toggleExpandByNodeId (nodeKeys: string | number | null | (string | number | null)[]) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { treeExpandedMaps } = internalData
      if (nodeKeys) {
        if (!XEUtils.isArray(nodeKeys)) {
          nodeKeys = [nodeKeys]
        }
        nodeKeys.forEach((nodeKey) => {
          const nodeid = enNodeValue(nodeKey)
          handleSetExpand(nodeid, !treeExpandedMaps[`${nodeid}`], treeExpandedMaps)
        })
        reactData.updateExpandedFlag++
      }
      $xeTree.handleTreeToList()
      $xeTree.handleData()
      return $xeTree.recalculate()
    },
    toggleExpandNode (nodes: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { treeExpandedMaps } = internalData
      if (nodes) {
        if (!XEUtils.isArray(nodes)) {
          nodes = [nodes]
        }
        nodes.forEach((node: any) => {
          const nodeid = $xeTree.getNodeId(node)
          handleSetExpand(nodeid, !treeExpandedMaps[nodeid], treeExpandedMaps)
        })
        reactData.updateExpandedFlag++
      }
      $xeTree.handleTreeToList()
      $xeTree.handleData()
      return $xeTree.recalculate()
    },
    setAllExpandNode (expanded: boolean) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const { scrollYLoad } = reactData
      const { scrollYStore, treeExpandedMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      if (expanded) {
        XEUtils.eachTree(internalData.afterTreeList, (node) => {
          const childList: any[] = XEUtils.get(node, childrenField)
          const hasChild = childList && childList.length
          if (hasChild) {
            const nodeid = $xeTree.getNodeId(node)
            treeExpandedMaps[nodeid] = true
          }
        }, { children: transform ? mapChildrenField : childrenField })
      } else {
        internalData.treeExpandedMaps = {}
      }
      reactData.updateExpandedFlag++
      reactData.topSpaceHeight = 0
      scrollYStore.startIndex = 0
      scrollYStore.endIndex = 1
      $xeTree.handleTreeToList()
      $xeTree.handleData()
      return $xeTree.recalculate().then(() => {
        if (scrollYLoad) {
          $xeTree.loadYData()
        }
        return $xeTree.recalculate()
      })
    },
    reloadExpandNode (node: any) {
      const $xeTree = this
      const props = $xeTree

      const { lazy } = props
      if (lazy) {
        $xeTree.clearExpandLoaded(node)
        return $xeTree.handleAsyncTreeExpandChilds(node)
      }
      return $xeTree.recalculate()
    },
    clearExpandLoaded (node: any) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { lazy } = props
      const { nodeMaps } = internalData
      if (lazy) {
        const nodeItem = nodeMaps[$xeTree.getNodeId(node)]
        if (nodeItem) {
          nodeItem.treeLoaded = false
        }
      }
      return $xeTree.recalculate()
    },
    /**
     * 用于树结构，给行数据加载子节点
     */
    loadChildrenNode (node: any, childRecords: any[]) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { lazy, transform } = props
      const { nodeMaps } = internalData
      if (!lazy) {
        return Promise.resolve([])
      }
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      const parentNodeItem = nodeMaps[$xeTree.getNodeId(node)]
      const parentLevel = parentNodeItem ? parentNodeItem.level : 0
      const parentNodes = parentNodeItem ? parentNodeItem.nodes : []
      return $xeTree.createNode(childRecords).then((nodeList) => {
        XEUtils.eachTree(nodeList, (childRow, index, items, path, parent, nodes) => {
          const itemNodeId = $xeTree.getNodeId(childRow)
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
            treeLoaded: false
          }
        }, { children: childrenField })
        node[childrenField] = nodeList
        if (transform) {
          node[mapChildrenField] = nodeList
        }
        $xeTree.updateAfterDataIndex()
        return nodeList
      })
    },
    findNodeIndexOf (list: any, node: any) {
      const $xeTree = this

      return node ? XEUtils.findIndexOf(list, item => $xeTree.eqNode(item, node)) : -1
    },
    eqNode (node1: any, node2: any) {
      const $xeTree = this

      if (node1 && node2) {
        if (node1 === node2) {
          return true
        }
        return $xeTree.getNodeId(node1) === $xeTree.getNodeId(node2)
      }
      return false
    },
    handleCrossTreeNodeDragCancelEvent () {
      const $xeTree = this

      clearNodeDragData($xeTree)
      clearCrossTreeDragStatus($xeTree)
    },
    /**
       * 处理跨树拖拽完成
       */
    handleCrossTreeNodeDragFinishEvent () {
    },
    /**
       * 处理跨树拖至新的空树
       */
    handleCrossTreeNodeDragInsertEvent () {
    },
    /**
       * 处理跨树拖插入
       */
    handleCrossTreeNodeDragoverEmptyEvent () {
    },
    hideCrossTreeNodeDropClearStatus () {
      const $xeTree = this

      hideDropTip($xeTree)
    },
    getCheckboxIndeterminateNodes () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { nodeMaps, indeterminateRowMaps } = internalData
      const list: any[] = []
      XEUtils.each(indeterminateRowMaps, (item, nodeid) => {
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          list.push(nodeItem.item)
        }
      })
      return list
    },
    handleNodeDragMousedownEvent (evnt: MouseEvent, params: { node: any }) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      evnt.stopPropagation()
      const { node } = params
      const dragConfig = $xeTree.computeDragOpts
      const { trigger, dragStartMethod } = dragConfig
      const dragEl = evnt.currentTarget as HTMLElement
      const itemEl = trigger === 'node' ? dragEl : (dragEl.parentElement as HTMLElement).parentElement as HTMLElement
      clearNodeDropOrigin($xeTree)
      if (dragStartMethod && !dragStartMethod(params)) {
        itemEl.draggable = false
        reactData.dragNode = null
        hideDropTip($xeTree)
        return
      }
      reactData.dragNode = node
      itemEl.draggable = true
      updateNodeDropOrigin($xeTree, node)
      updateRowDropTipContent($xeTree, itemEl)
      $xeTree.dispatchEvent('node-dragstart', params, evnt)
    },
    handleNodeDragMouseupEvent () {
      const $xeTree = this

      clearDragStatus($xeTree)
    },
    handleNodeDragDragstartEvent (evnt: DragEvent) {
      if (evnt.dataTransfer) {
        evnt.dataTransfer.setDragImage(getTpImg(), 0, 0)
      }
    },
    handleNodeDragDragendEvent (evnt: DragEvent) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { lazy } = props
      const { dragNode } = reactData
      const { nodeMaps, prevDragNode, prevDragPos, prevDragToChild } = internalData
      const hasChildField = $xeTree.computeHasChildField
      if (lazy && prevDragToChild) {
        // 懒加载
        const newNodeid = $xeTree.getNodeId(prevDragNode)
        const nodeRest = nodeMaps[newNodeid]
        if (prevDragNode[hasChildField]) {
          if (nodeRest && nodeRest.treeLoaded) {
            handleNodeDragSwapEvent($xeTree, evnt, dragNode, prevDragNode, prevDragPos, prevDragToChild)
          }
        } else {
          handleNodeDragSwapEvent($xeTree, evnt, dragNode, prevDragNode, prevDragPos, prevDragToChild)
        }
      } else {
        handleNodeDragSwapEvent($xeTree, evnt, dragNode, prevDragNode, prevDragPos, prevDragToChild)
      }
    },
    handleNodeDragDragoverEvent (evnt: DragEvent) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { lazy, transform } = props
      const { dragNode } = reactData
      const { nodeMaps } = internalData
      const dragConfig = $xeTree.computeDragOpts
      const parentField = $xeTree.computeParentField
      const hasChildField = $xeTree.computeHasChildField
      const { isCrossDrag, isPeerDrag, isToChildDrag } = dragConfig
      if (!dragNode && !isCrossDrag) {
        evnt.preventDefault()
      }
      const isControlKey = hasControlKey(evnt)
      const itemEl = evnt.currentTarget as HTMLElement
      const nodeid = itemEl.getAttribute('nodeid') || ''
      const nodeItem = nodeMaps[nodeid]
      if (nodeItem) {
        evnt.preventDefault()
        const node = nodeItem.item
        const offsetY = evnt.clientY - itemEl.getBoundingClientRect().y
        const dragPos = offsetY < itemEl.clientHeight / 2 ? 'top' : 'bottom'
        internalData.prevDragToChild = !!(transform && (isCrossDrag && isToChildDrag) && isControlKey)
        internalData.prevDragNode = node
        internalData.prevDragPos = dragPos
        if ((dragNode && $xeTree.getNodeId(dragNode) === nodeid) ||
            (isControlKey && lazy && node[hasChildField] && nodeItem && !nodeItem.treeLoaded) ||
            (!isCrossDrag && transform && (isPeerDrag ? dragNode[parentField] !== node[parentField] : nodeItem.level))
        ) {
          showDropTip($xeTree, evnt, itemEl, false, dragPos)
          return
        }
        showDropTip($xeTree, evnt, itemEl, true, dragPos)
        $xeTree.dispatchEvent('node-dragover', {
          oldRNode: dragNode,
          targetNode: node,
          dragPos
        }, evnt)
      }
    },

    //
    // Render
    //
    renderDragIcon (h: CreateElement, node: any, nodeid: string) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { drag, transform } = props
      const { nodeMaps } = internalData
      const dragOpts = $xeTree.computeDragOpts
      const { showIcon, isPeerDrag, isCrossDrag, visibleMethod } = dragOpts
      const params = { node, $tree: $xeTree }
      if (drag && showIcon && transform && (!visibleMethod || visibleMethod(params))) {
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem && (isPeerDrag || isCrossDrag || !nodeItem.level)) {
          const dragConfig = $xeTree.computeDragOpts
          const { icon, trigger, disabledMethod } = dragConfig
          const isDisabled = disabledMethod && disabledMethod(params)
          const ons: {
            mousedown?: any
            mouseup?: any
          } = {}
          if (trigger !== 'node') {
            ons.mousedown = (evnt: MouseEvent) => {
              if (!isDisabled) {
                $xeTree.handleNodeDragMousedownEvent(evnt, params)
              }
            }
            ons.mouseup = $xeTree.handleNodeDragMouseupEvent
          }
          return h('div', {
            class: ['vxe-tree--drag-handle', {
              'is--disabled': isDisabled
            }],
            on: ons
          }, [
            h('i', {
              class: icon || getIcon().TREE_DRAG
            })
          ])
        }
      }
      return renderEmptyElement($xeTree)
    },
    renderRadio (h: CreateElement, node: any, nodeid: string, isChecked: boolean) {
      const $xeTree = this
      const props = $xeTree

      const { showRadio } = props
      const radioOpts = $xeTree.computeRadioOpts
      const { showIcon, checkMethod, visibleMethod } = radioOpts
      const isVisible = !visibleMethod || visibleMethod({ $tree: $xeTree, node })
      let isDisabled = !!checkMethod
      if (showRadio && showIcon && isVisible) {
        if (checkMethod) {
          isDisabled = !checkMethod({ $tree: $xeTree, node })
        }
        return h('div', {
          class: ['vxe-tree--radio-option', {
            'is--checked': isChecked,
            'is--disabled': isDisabled
          }],
          on: {
            click: (evnt: MouseEvent) => {
              if (!isDisabled) {
                $xeTree.changeRadioEvent(evnt, node)
              }
            }
          }
        }, [
          h('span', {
            class: ['vxe-radio--icon', isChecked ? getIcon().RADIO_CHECKED : getIcon().RADIO_UNCHECKED]
          })
        ])
      }
      return renderEmptyElement($xeTree)
    },
    renderCheckbox  (h: CreateElement, node: any, nodeid: string, isChecked: boolean) {
      const $xeTree = this
      const props = $xeTree

      const { showCheckbox } = props
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { showIcon, checkMethod, visibleMethod } = checkboxOpts
      const isIndeterminate = $xeTree.isIndeterminateByCheckboxNodeid(nodeid)
      const isVisible = !visibleMethod || visibleMethod({ $tree: $xeTree, node })
      let isDisabled = !!checkMethod
      if (showCheckbox && showIcon && isVisible) {
        if (checkMethod) {
          isDisabled = !checkMethod({ $tree: $xeTree, node })
        }
        return h('div', {
          class: ['vxe-tree--checkbox-option', {
            'is--checked': isChecked,
            'is--indeterminate': isIndeterminate,
            'is--disabled': isDisabled
          }],
          on: {
            click: (evnt: MouseEvent) => {
              if (!isDisabled) {
                $xeTree.changeCheckboxEvent(evnt, node)
              }
            }
          }
        }, [
          h('span', {
            class: ['vxe-checkbox--icon', isIndeterminate ? getIcon().CHECKBOX_INDETERMINATE : (isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED)]
          })
        ])
      }
      return renderEmptyElement($xeTree)
    },
    renderNode (h: CreateElement, node: any, nodeid: string) {
      const $xeTree = this
      const props = $xeTree
      const slots = $xeTree.$scopedSlots
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { lazy, drag, transform, showRadio, showCheckbox, showLine, indent, iconOpen, iconClose, iconLoaded, showIcon } = props
      const { currentNode, selectRadioKey, updateExpandedFlag } = reactData
      const { afterTreeList, nodeMaps, treeExpandedMaps, treeExpandLazyLoadedMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const titleField = $xeTree.computeTitleField
      const hasChildField = $xeTree.computeHasChildField
      const childList: any[] = XEUtils.get(node, childrenField)
      const hasChild = childList && childList.length
      const iconSlot = slots.icon
      const titleSlot = slots.title
      const extraSlot = slots.extra
      const isExpand = updateExpandedFlag && treeExpandedMaps[nodeid]
      const nodeItem = nodeMaps[nodeid]
      const nodeValue = XEUtils.get(node, titleField)
      const nLevel = nodeItem.level

      let isRadioChecked = false
      if (showRadio) {
        isRadioChecked = nodeid === String(selectRadioKey)
      }

      let isCheckboxChecked = false
      if (showCheckbox) {
        isCheckboxChecked = $xeTree.isCheckedByCheckboxNodeId(nodeid)
      }

      let hasLazyChilds = false
      let isLazyLoading = false
      let isLazyLoaded = false
      if (lazy) {
        isLazyLoading = !!treeExpandLazyLoadedMaps[nodeid]
        hasLazyChilds = node[hasChildField]
        isLazyLoaded = !!nodeItem.treeLoaded
      }
      const prevNode = nodeItem.items[nodeItem.treeIndex - 1]
      const nParams = { node, isExpand }

      const itemOn: {
        mousedown: any
        mouseup: any
        click: any
        dblclick: any
        dragstart?: any
        dragend?: any
        dragover?: any
        contextmenu?: any
      } = {
        mousedown (evnt: MouseEvent) {
          $xeTree.handleNodeMousedownEvent(evnt, node)
        },
        mouseup: $xeTree.handleNodeDragMouseupEvent,
        click (evnt: MouseEvent) {
          $xeTree.handleNodeClickEvent(evnt, node)
        },
        dblclick (evnt: MouseEvent) {
          $xeTree.handleNodeDblclickEvent(evnt, node)
        },
        contextmenu (evnt: MouseEvent) {
          $xeTree.handleContextmenuEvent(evnt, node)
        }
      }
      // 拖拽行事件
      if (drag && transform) {
        itemOn.dragstart = $xeTree.handleNodeDragDragstartEvent
        itemOn.dragend = $xeTree.handleNodeDragDragendEvent
        itemOn.dragover = $xeTree.handleNodeDragDragoverEvent
      }
      return h('div', {
        key: nodeid,
        class: ['vxe-tree--node-wrapper', `node--level-${nLevel}`],
        attrs: {
          nodeid
        },
        on: itemOn
      }, [
        h('div', {
          class: ['vxe-tree--node-item', {
            'is--current': currentNode && nodeid === $xeTree.getNodeId(currentNode),
            'is-radio--checked': isRadioChecked,
            'is-checkbox--checked': isCheckboxChecked
          }],
          style: {
            paddingLeft: `${nLevel * (indent || 1)}px`
          }
        }, [
          showLine
            ? h('div', {
              class: 'vxe-tree--node-line-wrapper'
            }, [
              h('div', {
                class: 'vxe-tree--node-line',
                style: {
                  height: `${$xeTree.getNodeId(afterTreeList[0]) === nodeid ? 1 : calcTreeLine($xeTree, node, prevNode)}px`
                }
              })
            ])
            : renderEmptyElement($xeTree),
          h('div', {
            class: 'vxe-tree--node-item-switcher'
          }, showIcon && (lazy ? (isLazyLoaded ? hasChild : hasLazyChilds) : hasChild)
            ? [
                h('div', {
                  class: 'vxe-tree--node-item-icon',
                  on: {
                    click (evnt: MouseEvent) {
                      $xeTree.toggleExpandEvent(evnt, node)
                    }
                  }
                }, iconSlot
                  ? getSlotVNs(iconSlot(nParams))
                  : [
                      h('i', {
                        class: isLazyLoading ? (iconLoaded || getIcon().TREE_NODE_LOADED) : (isExpand ? (iconOpen || getIcon().TREE_NODE_OPEN) : (iconClose || getIcon().TREE_NODE_CLOSE))
                      })
                    ])
              ]
            : []),
          $xeTree.renderDragIcon(h, node, nodeid),
          $xeTree.renderRadio(h, node, nodeid, isRadioChecked),
          $xeTree.renderCheckbox(h, node, nodeid, isCheckboxChecked),
          h('div', {
            class: 'vxe-tree--node-item-inner'
          }, [
            h('div', {
              class: 'vxe-tree--node-item-title'
            }, titleSlot ? getSlotVNs(titleSlot(nParams)) : `${nodeValue}`),
            extraSlot
              ? h('div', {
                class: 'vxe-tree--node-item-extra'
              }, getSlotVNs(extraSlot(nParams)))
              : renderEmptyElement($xeTree)
          ])
        ])
      ])
    },
    renderList (h: CreateElement, treeList: any[]) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { transform } = props
      const { treeExpandedMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      if (!treeList.length) {
        return [
          h('div', {
            class: 'vxe-tree--empty-placeholder'
          }, getI18n('vxe.tree.searchEmpty'))
        ]
      }
      const nodeVNs: VNode[] = []
      treeList.forEach(transform
        ? (node) => {
            const nodeid = $xeTree.getNodeId(node)
            nodeVNs.push($xeTree.renderNode(h, node, nodeid))
          }
        : (node) => {
            const nodeid = $xeTree.getNodeId(node)
            nodeVNs.push($xeTree.renderNode(h, node, nodeid))
            const childList: any[] = XEUtils.get(node, childrenField)
            const hasChild = childList && childList.length
            if (hasChild && treeExpandedMaps[nodeid]) {
              nodeVNs.push(...$xeTree.renderList(h, childList))
            }
          })
      return nodeVNs
    },
    renderDragTip (h: CreateElement) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData

      const { drag } = props
      const { dragNode, dragTipText } = reactData
      const dragOpts = $xeTree.computeDragOpts
      const dNode = dragNode
      if (drag) {
        return h('div', {
          class: 'vxe-tree--drag-wrapper'
        }, [
          h('div', {
            ref: 'refDragNodeLineElem',
            class: ['vxe-tree--drag-node-line', {
              'is--guides': dragOpts.showGuidesStatus
            }]
          }),
          dNode && dragOpts.showDragTip
            ? h('div', {
              ref: 'refDragTipElem',
              class: 'vxe-tree--drag-sort-tip'
            }, [
              h('div', {
                class: 'vxe-tree--drag-sort-tip-wrapper'
              }, [
                h('div', {
                  class: 'vxe-tree--drag-sort-tip-status'
                }, [
                  h('span', {
                    class: ['vxe-tree--drag-sort-tip-normal-status', getIcon().TREE_DRAG_STATUS_NODE]
                  }),
                  h('span', {
                    class: ['vxe-tree--drag-sort-tip-sub-status', getIcon().TREE_DRAG_STATUS_SUB_NODE]
                  }),
                  h('span', {
                    class: ['vxe-tree--drag-sort-tip-disabled-status', getIcon().TREE_DRAG_DISABLED]
                  })
                ]),
                h('div', {
                  class: 'vxe-tree--drag-sort-tip-content'
                }, dragTipText)
              ])
            ])
            : renderEmptyElement($xeTree)
        ])
      }
      return renderEmptyElement($xeTree)
    },
    renderVN (h: CreateElement): VNode {
      const $xeTree = this
      const props = $xeTree
      const slots = $xeTree.$scopedSlots
      const reactData = $xeTree.reactData

      const { loading, trigger, showLine } = props
      const { bodyHeight, topSpaceHeight, treeList } = reactData
      const vSize = $xeTree.computeSize
      const radioOpts = $xeTree.computeRadioOpts
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const loadingOpts = $xeTree.computeLoadingOpts
      const isRowHover = $xeTree.computeIsRowHover
      const treeStyle = $xeTree.computeTreeStyle
      const loadingSlot = slots.loading
      const headerSlot = slots.header
      const footerSlot = slots.footer

      return h('div', {
        ref: 'refElem',
        class: ['vxe-tree', {
          [`size--${vSize}`]: vSize,
          'show--line': showLine,
          'checkbox--highlight': checkboxOpts.highlight,
          'radio--highlight': radioOpts.highlight,
          'node--hover': isRowHover,
          'node--trigger': trigger === 'node',
          'is--loading': loading
        }]
      }, [
        headerSlot
          ? h('div', {
            ref: 'refHeaderWrapperElem',
            class: 'vxe-tree--header-wrapper'
          }, headerSlot({ $tree: $xeTree }))
          : renderEmptyElement($xeTree),
        h('div', {
          ref: 'refVirtualWrapper',
          class: 'vxe-tree--node-list-wrapper',
          style: treeStyle,
          on: {
            scroll: $xeTree.scrollEvent
          }
        }, [
          h('div', {
            class: 'vxe-tree--y-space',
            style: {
              height: bodyHeight ? `${bodyHeight}px` : ''
            }
          }),
          h('div', {
            ref: 'refVirtualBody',
            class: 'vxe-tree--node-list-body',
            style: {
              transform: `translateY(${topSpaceHeight}px)`
            }
          }, $xeTree.renderList(h, treeList))
        ]),
        footerSlot
          ? h('div', {
            ref: 'refFooterWrapperElem',
            class: 'vxe-tree--footer-wrapper'
          }, footerSlot({ $tree: $xeTree }))
          : renderEmptyElement($xeTree),
        /**
         * 拖拽提示
         */
        $xeTree.renderDragTip(h),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-tree--loading',
          props: {
            value: loading,
            icon: loadingOpts.icon,
            text: loadingOpts.text
          },
          scopedSlots: loadingSlot
            ? {
                default: () => loadingSlot({ $tree: $xeTree })
              }
            : {}
        })
      ])
    }
  },
  watch: {
    data (val) {
      const $xeTree = this

      $xeTree.loadData(val || [])
    },
    checkNodeKey (nodeKey) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.selectRadioKey = enNodeValue(nodeKey)
    },
    checkNodeKeys () {
      const $xeTree = this
      const props = $xeTree

      $xeTree.updateCheckboxChecked(props.checkNodeKeys || [])
    },
    filterValue () {
      const $xeTree = this

      $xeTree.triggerSearchEvent(new Event('filter'))
    },
    height () {
      const $xeTree = this

      $xeTree.recalculate()
    },
    minHeight () {
      const $xeTree = this

      $xeTree.recalculate()
    },
    maxHeight () {
      const $xeTree = this

      $xeTree.recalculate()
    }
  },
  created () {
    const $xeTree = this
    const props = $xeTree
    const reactData = $xeTree.reactData

    reactData.selectRadioKey = enNodeValue(props.checkNodeKey)
    $xeTree.loadData(props.data || [])
  },
  mounted () {
    const $xeTree = this
    const props = $xeTree
    const internalData = $xeTree.internalData

    const { transform, drag, menuConfig } = props
    const dragOpts = $xeTree.computeDragOpts
    if (drag && !transform) {
      errLog('vxe.error.notSupportProp', ['drag', 'transform=false', 'transform=true'])
    }
    if (dragOpts.isCrossTreeDrag) {
      errLog('vxe.error.notProp', ['drag-config.isCrossTreeDrag'])
    }
    const VxeUIContextMenu = VxeUI.getComponent('VxeContextMenu')
    if (menuConfig && !VxeUIContextMenu) {
      errLog('vxe.error.reqComp', ['vxe-context-menu'])
    }
    if (props.autoResize) {
      const el = $xeTree.$refs.refElem as HTMLDivElement
      const parentEl = $xeTree.getParentElem()
      const resizeObserver = globalResize.create(() => {
        if (props.autoResize) {
          $xeTree.recalculate()
        }
      })
      if (el) {
        resizeObserver.observe(el)
      }
      if (parentEl) {
        resizeObserver.observe(parentEl)
      }
      internalData.resizeObserver = resizeObserver
    }

    globalEvents.on($xeTree, 'resize', $xeTree.handleGlobalResizeEvent)
  },
  beforeDestroy () {
    const $xeTree = this
    const reactData = $xeTree.reactData
    const internalData = $xeTree.internalData

    const { resizeObserver } = internalData
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    globalEvents.off($xeTree, 'resize')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
