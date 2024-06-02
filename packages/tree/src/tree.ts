import { defineComponent, ref, h, reactive, PropType, computed, VNode, createCommentVNode, watch, onUnmounted } from 'vue'
import { createEvent, getIcon, getConfig } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { getSlotVNs } from '../..//ui/src/vn'

import type { TreeReactData, VxeTreeEmits, VxeTreePropTypes, TreeInternalData, TreePrivateRef, VxeTreePrivateComputed, TreePrivateMethods, TreeMethods, VxeTreeConstructor, VxeTreePrivateMethods } from '../../../types'

/**
 * 生成节点的唯一主键
 */
function getNodeUniqueId () {
  return XEUtils.uniqueId('node_')
}

export default defineComponent({
  name: 'VxeTree',
  props: {
    data: Array as PropType<VxeTreePropTypes.Data>,
    childrenField: {
      type: String as PropType<VxeTreePropTypes.ChildrenField>,
      default: () => getConfig().tree.childrenField
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
    isCurrent: {
      type: Boolean as PropType<VxeTreePropTypes.IsCurrent>,
      default: () => getConfig().tree.isCurrent
    },
    isHover: {
      type: Boolean as PropType<VxeTreePropTypes.IsHover>,
      default: () => getConfig().tree.isHover
    },
    showLine: {
      type: Boolean as PropType<VxeTreePropTypes.ShowLine>,
      default: () => getConfig().tree.showLine
    },
    trigger: String as PropType<VxeTreePropTypes.Trigger>,
    indent: {
      type: Number as PropType<VxeTreePropTypes.Indent>,
      default: () => getConfig().tree.indent
    },
    radioConfig: {
      type: Object as PropType<VxeTreePropTypes.RadioConfig>,
      default: () => XEUtils.clone(getConfig().tree.radioConfig, true)
    },
    checkboxConfig: {
      type: Object as PropType<VxeTreePropTypes.CheckboxConfig>,
      default: () => XEUtils.clone(getConfig().tree.checkboxConfig, true)
    },
    toggleMethod: Object as PropType<VxeTreePropTypes.CheckboxConfig>,
    showIcon: {
      type: Boolean as PropType<VxeTreePropTypes.ShowIcon>,
      default: () => getConfig().tree.showIcon
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
    }
  },
  emits: [
  ] as VxeTreeEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TreeReactData>({
      treeList: [],
      treeExpandedMaps: {}
    })

    const internalData: TreeInternalData = {
      nodeMaps: {}
    }

    const refMaps: TreePrivateRef = {
      refElem
    }

    const computeTitleField = computed(() => {
      return props.titleField || 'title'
    })

    const computeKeyField = computed(() => {
      return props.keyField || '_X_NODE_KEY'
    })

    const computeChildrenField = computed(() => {
      return props.childrenField || 'children'
    })

    const computeMaps: VxeTreePrivateComputed = {
    }

    const $xeTree = {
      xID,
      props,
      context,
      internalData,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTreeConstructor & VxeTreePrivateMethods

    const getRowid = (row: any) => {
      const keyField = computeKeyField.value
      const rowid = XEUtils.get(row, keyField)
      return XEUtils.eqNull(rowid) ? '' : encodeURIComponent(rowid)
    }

    const isExpandByRow = (row: any) => {
      const { treeExpandedMaps } = reactData
      const rowid = getRowid(row)
      return !!treeExpandedMaps[rowid]
    }

    const treeMethods: TreeMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $tree: $xeTree }, params))
      },
      isExpandByRow
    }

    const updateData = (list: any[]) => {
      const keyField = computeKeyField.value
      const childrenField = computeChildrenField.value
      const keyMaps: Record<string, {
        row: any
        rowIndex: number
        parent: any
        level: number
      }> = {}
      XEUtils.eachTree(list, (row, rowIndex, items, path, parent, nodes) => {
        let rowid = getRowid(row)
        if (!rowid) {
          rowid = getNodeUniqueId()
          XEUtils.set(row, keyField, rowid)
        }
        keyMaps[rowid] = {
          row,
          rowIndex,
          parent,
          level: nodes.length
        }
      }, { children: childrenField })
      internalData.nodeMaps = keyMaps
      reactData.treeList = list ? list.slice(0) : []
    }

    const handleNodeEvent = (evnt: MouseEvent, row: any) => {
      const { trigger } = props
      if (trigger === 'row') {
        toggleExpandEvent(evnt, row)
      }
    }

    const toggleExpandEvent = (evnt: MouseEvent, row: any) => {
      evnt.stopPropagation()
      const expandedMaps = Object.assign({}, reactData.treeExpandedMaps)
      const rowid = getRowid(row)
      if (expandedMaps[rowid]) {
        delete expandedMaps[rowid]
      } else {
        expandedMaps[rowid] = true
      }
      reactData.treeExpandedMaps = expandedMaps
    }

    const treePrivateMethods: TreePrivateMethods = {
    }

    Object.assign($xeTree, treeMethods, treePrivateMethods)

    const renderNode = (row: any): VNode => {
      const { indent, iconOpen, iconClose } = props
      const { treeExpandedMaps } = reactData
      const { nodeMaps } = internalData
      const childrenField = computeChildrenField.value
      const titleField = computeTitleField.value
      const childList: any[] = row[childrenField]
      const hasChild = childList && childList.length
      const titleSlot = slots.title
      const rowid = getRowid(row)
      const isExpand = treeExpandedMaps[rowid]
      const nodeItem = nodeMaps[rowid]

      return h('div', {
        class: ['vxe-tree--node-item-row', `node--level-${nodeItem.level}`],
        rowid
      }, [
        h('div', {
          class: 'vxe-tree--node-item-wrapper',
          style: {
            paddingLeft: `${(nodeItem.level - 1) * (indent || 1)}px`
          },
          onClick (evnt) {
            handleNodeEvent(evnt, row)
          }
        }, [
          h('div', {
            class: 'vxe-tree--node-item-switcher'
          }, hasChild
            ? [
                h('div', {
                  class: 'vxe-tree--node-item-icon',
                  onClick (evnt) {
                    toggleExpandEvent(evnt, row)
                  }
                }, [
                  h('i', {
                    class: isExpand ? (iconOpen || getIcon().TREE_NODE_OPEN) : (iconClose || getIcon().TREE_NODE_CLOSE)
                  })
                ])
              ]
            : []),
          h('div', {
            class: 'vxe-tree--node-item-label'
          }, titleSlot ? getSlotVNs(titleSlot({ row })) : `${row[titleField]}`)
        ]),
        hasChild && treeExpandedMaps[rowid]
          ? h('div', {
            class: 'vxe-tree--node-child-wrapper'
          }, childList.map(childItem => renderNode(childItem)))
          : createCommentVNode()
      ])
    }

    const renderNodeList = () => {
      const { treeList } = reactData
      return h('div', {
        class: 'vxe-tree--node-list-wrapper'
      }, treeList.map(row => renderNode(row)))
    }

    const renderVN = () => {
      const { trigger, isHover } = props
      return h('div', {
        ref: refElem,
        class: ['vxe-tree', {
          'row--hover': isHover,
          'row--trigger': trigger === 'row'
        }]
      }, [
        renderNodeList()
      ])
    }

    $xeTree.renderVN = renderVN

    const dataFlag = ref(0)
    watch(() => props.data ? props.data.length : 0, () => {
      dataFlag.value++
    })
    watch(() => props.data, () => {
      dataFlag.value++
    })
    watch(dataFlag, () => {
      updateData(props.data || [])
    })

    onUnmounted(() => {
      reactData.treeList = []
      reactData.treeExpandedMaps = {}
      internalData.nodeMaps = {}
    })

    updateData(props.data || [])

    return $xeTree
  },
  render () {
    return this.renderVN()
  }
})
