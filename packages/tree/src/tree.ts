import { defineComponent, ref, h, reactive, PropType, computed, VNode, createCommentVNode, watch, onUnmounted, nextTick } from 'vue'
import { createEvent, getIcon, getConfig, useSize } from '../../ui'
import XEUtils from 'xe-utils'
import { getSlotVNs } from '../..//ui/src/vn'

import type { TreeReactData, VxeTreeEmits, VxeTreePropTypes, TreeInternalData, TreePrivateRef, VxeTreePrivateComputed, TreePrivateMethods, TreeMethods, ValueOf, VxeTreeConstructor, VxeTreePrivateMethods } from '../../../types'

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
    showRadio: {
      type: Boolean as PropType<VxeTreePropTypes.ShowRadio>,
      default: () => getConfig().tree.showRadio
    },
    radioCheckRowKey: {
      type: [String, Number] as PropType<VxeTreePropTypes.RadioCheckRowKey>,
      default: () => getConfig().tree.radioCheckRowKey
    },
    radioConfig: {
      type: Object as PropType<VxeTreePropTypes.RadioConfig>,
      default: () => XEUtils.clone(getConfig().tree.radioConfig, true)
    },
    showCheckbox: {
      type: Boolean as PropType<VxeTreePropTypes.ShowCheckbox>,
      default: () => getConfig().tree.showCheckbox
    },
    checkboxCheckRowKeys: {
      type: Array as PropType<VxeTreePropTypes.CheckboxCheckRowKeys>,
      default: () => getConfig().tree.checkboxCheckRowKeys
    },
    checkboxConfig: {
      type: Object as PropType<VxeTreePropTypes.CheckboxConfig>,
      default: () => XEUtils.clone(getConfig().tree.checkboxConfig, true)
    },
    toggleMethod: Function as PropType<VxeTreePropTypes.ToggleMethod>,
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
    size: { type: String as PropType<VxeTreePropTypes.Size>, default: () => getConfig().tree.size || getConfig().size }
  },
  emits: [
    'update:modelValue',
    'update:radioCheckRowKey',
    'update:checkboxCheckRowKeys',
    'row-click',
    'row-dblclick'
  ] as VxeTreeEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TreeReactData>({
      currentNode: null,
      selectRadioKey: props.radioCheckRowKey,
      treeList: [],
      treeExpandedMaps: {},
      selectCheckboxMaps: {},
      indeterminateCheckboxMaps: {}
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

    const computeRadioOpts = computed(() => {
      return Object.assign({}, props.radioConfig)
    })

    const computeCheckboxOpts = computed(() => {
      return Object.assign({}, props.checkboxConfig)
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

    const isCheckedByRadioRowid = (rowid: any) => {
      const { selectRadioKey } = reactData
      return selectRadioKey === rowid
    }

    const isCheckedByRadioRow = (row: any) => {
      return isCheckedByRadioRowid(getRowid(row))
    }

    const isCheckedByCheckboxRowid = (rowid: any) => {
      const { selectCheckboxMaps } = reactData
      return !!selectCheckboxMaps[rowid]
    }

    const isCheckedByCheckboxRow = (row: any) => {
      return isCheckedByCheckboxRowid(getRowid(row))
    }

    const isIndeterminateByCheckboxRowid = (rowid: any) => {
      const { indeterminateCheckboxMaps } = reactData
      return !!indeterminateCheckboxMaps[rowid]
    }

    const isIndeterminateByCheckboxRow = (row: any) => {
      return isIndeterminateByCheckboxRowid(getRowid(row))
    }

    const emitCheckboxMode = (value: VxeTreePropTypes.CheckboxCheckRowKeys) => {
      emit('update:checkboxCheckRowKeys', value)
    }

    const emitRadioMode = (value: VxeTreePropTypes.RadioCheckRowKey) => {
      emit('update:radioCheckRowKey', value)
    }

    const updateCheckboxChecked = (rowKeys: VxeTreePropTypes.CheckboxCheckRowKeys) => {
      const selectKeyMaps: Record<string, boolean> = {}
      if (rowKeys) {
        rowKeys.forEach((key) => {
          selectKeyMaps[key] = true
        })
      }
      reactData.selectCheckboxMaps = selectKeyMaps
    }

    const handleSetExpand = (rowid: string, expanded: boolean, expandedMaps: Record<string, boolean>) => {
      if (expanded) {
        if (expandedMaps[rowid]) {
          expandedMaps[rowid] = true
        }
      } else {
        if (expandedMaps[rowid]) {
          delete expandedMaps[rowid]
        }
      }
    }

    const dispatchEvent = (type: ValueOf<VxeTreeEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $tree: $xeTree }, params))
    }

    const treeMethods: TreeMethods = {
      dispatchEvent,
      clearExpand () {
        reactData.treeExpandedMaps = {}
        return nextTick()
      },
      setExpandByRowid (rowids, expanded) {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        if (rowids) {
          if (!XEUtils.isArray(rowids)) {
            rowids = [rowids]
          }
          rowids.forEach((rowid: string) => {
            handleSetExpand(rowid, expanded, expandedMaps)
          })
          reactData.treeExpandedMaps = expandedMaps
        }
        return nextTick()
      },
      setExpand (rows, expanded) {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        if (rows) {
          if (!XEUtils.isArray(rows)) {
            rows = [rows]
          }
          rows.forEach((row: any) => {
            const rowid = getRowid(row)
            handleSetExpand(rowid, expanded, expandedMaps)
          })
          reactData.treeExpandedMaps = expandedMaps
        }
        return nextTick()
      },
      toggleExpandByRowid (rowids) {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        if (rowids) {
          if (!XEUtils.isArray(rowids)) {
            rowids = [rowids]
          }
          rowids.forEach((rowid: string) => {
            handleSetExpand(rowid, !expandedMaps[rowid], expandedMaps)
          })
          reactData.treeExpandedMaps = expandedMaps
        }
        return nextTick()
      },
      toggleExpand (rows) {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        if (rows) {
          if (!XEUtils.isArray(rows)) {
            rows = [rows]
          }
          rows.forEach((row: any) => {
            const rowid = getRowid(row)
            handleSetExpand(rowid, !expandedMaps[rowid], expandedMaps)
          })
          reactData.treeExpandedMaps = expandedMaps
        }
        return nextTick()
      },
      setAllExpand () {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        const childrenField = computeChildrenField.value
        XEUtils.eachTree(reactData.treeList, (row) => {
          const rowid = getRowid(row)
          expandedMaps[rowid] = true
        }, { children: childrenField })
        reactData.treeExpandedMaps = expandedMaps
        return nextTick()
      },
      isExpandByRow,
      isCheckedByRadioRowid,
      isCheckedByRadioRow,
      isCheckedByCheckboxRowid,
      isIndeterminateByCheckboxRow,
      isCheckedByCheckboxRow
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

    const handleNodeClickEvent = (evnt: MouseEvent, row: any) => {
      const { trigger, isCurrent } = props
      const radioOpts = computeRadioOpts.value
      const checkboxOpts = computeCheckboxOpts.value
      let triggerRadio = false
      let triggerCheckbox = false
      let triggerExpand = false
      if (isCurrent) {
        reactData.currentNode = row
      } else {
        reactData.currentNode = null
      }
      if (trigger === 'row') {
        triggerExpand = true
        toggleExpandEvent(evnt, row)
      }
      if (radioOpts.trigger === 'row') {
        triggerRadio = true
        changeRadioEvent(evnt, row)
      }
      if (checkboxOpts.trigger === 'row') {
        triggerCheckbox = true
        changeCheckboxEvent(evnt, row)
      }
      dispatchEvent('row-click', { row, triggerRadio, triggerCheckbox, triggerExpand }, evnt)
    }

    const handleNodeDblclickEvent = (evnt: MouseEvent, row: any) => {
      dispatchEvent('row-dblclick', { row }, evnt)
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

    const handleRowCheckboxStatus = (row: any, selectKeyMaps: Record<string, boolean>, indeterminateMaps: Record<string, boolean>) => {
      const childrenField = computeChildrenField.value
      const childList: any[] = XEUtils.get(row, childrenField)
      const rowid = getRowid(row)
      if (childList && childList.length) {
        let checkSome = false
        let checkSize = 0
        childList.forEach(childRow => {
          const childRowid = getRowid(childRow)
          const isChecked = selectKeyMaps[childRowid]
          if (isChecked || indeterminateMaps[childRowid]) {
            if (isChecked) {
              checkSize++
            }
            checkSome = true
          }
        })
        const checkAll = checkSize === childList.length
        if (checkAll) {
          if (!selectKeyMaps[rowid]) {
            selectKeyMaps[rowid] = true
          }
          if (indeterminateMaps[rowid]) {
            delete indeterminateMaps[rowid]
          }
        } else {
          if (selectKeyMaps[rowid]) {
            delete selectKeyMaps[rowid]
          }
          indeterminateMaps[rowid] = checkSome
        }
      } else {
        if (indeterminateMaps[rowid]) {
          delete indeterminateMaps[rowid]
        }
      }
    }

    const updateCheckboxStatus = () => {
      const { treeList } = reactData
      const childrenField = computeChildrenField.value
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly } = checkboxOpts
      if (!checkStrictly) {
        const selectKeyMaps = Object.assign({}, reactData.selectCheckboxMaps)
        const indeterminateMaps: Record<string, boolean> = {}
        XEUtils.eachTree(treeList, (row, index, items, path, parent, nodes) => {
          const childList: any[] = XEUtils.get(row, childrenField)
          if (!childList || !childList.length) {
            handleRowCheckboxStatus(row, selectKeyMaps, indeterminateMaps)
          }
          if (index === items.length - 1) {
            for (let len = nodes.length - 2; len >= 0; len--) {
              const parentItem = nodes[len]
              handleRowCheckboxStatus(parentItem, selectKeyMaps, indeterminateMaps)
            }
          }
        })
        reactData.selectCheckboxMaps = selectKeyMaps
        reactData.indeterminateCheckboxMaps = indeterminateMaps
      }
    }

    const changeCheckboxEvent = (evnt: MouseEvent, row: any) => {
      evnt.stopPropagation()
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly } = checkboxOpts
      const selectKeyMaps = Object.assign({}, reactData.selectCheckboxMaps)
      const childrenField = computeChildrenField.value
      const rowid = getRowid(row)
      let isChecked = false
      if (selectKeyMaps[rowid]) {
        delete selectKeyMaps[rowid]
      } else {
        isChecked = true
        selectKeyMaps[rowid] = isChecked
      }
      if (!checkStrictly) {
        XEUtils.eachTree(XEUtils.get(row, childrenField), (childRow) => {
          const childRowid = getRowid(childRow)
          if (isChecked) {
            if (!selectKeyMaps[childRowid]) {
              selectKeyMaps[childRowid] = true
            }
          } else {
            if (selectKeyMaps[childRowid]) {
              delete selectKeyMaps[childRowid]
            }
          }
        }, { children: childrenField })
      }
      reactData.selectCheckboxMaps = selectKeyMaps
      updateCheckboxStatus()
      emitCheckboxMode(Object.keys(reactData.selectCheckboxMaps))
    }

    const changeRadioEvent = (evnt: MouseEvent, row: any) => {
      evnt.stopPropagation()
      const rowid = getRowid(row)
      reactData.selectRadioKey = rowid
      emitRadioMode(rowid)
    }

    const treePrivateMethods: TreePrivateMethods = {
    }

    Object.assign($xeTree, treeMethods, treePrivateMethods)

    const renderRadio = (row: any, rowid: string) => {
      const { showRadio } = props
      const { selectRadioKey } = reactData
      const isChecked = rowid === selectRadioKey
      const isDisabled = false
      if (showRadio) {
        return h('div', {
          class: ['vxe-tree--radio-option', {
            'is--checked': isChecked,
            'is--disabled': isDisabled
          }],
          onClick: (evnt) => {
            if (!isDisabled) {
              changeRadioEvent(evnt, row)
            }
          }
        }, [
          h('span', {
            class: ['vxe-radio--icon', isChecked ? getIcon().RADIO_CHECKED : getIcon().RADIO_UNCHECKED]
          })
        ])
      }
      return createCommentVNode()
    }

    const renderCheckbox = (row: any, rowid: string) => {
      const { showCheckbox } = props
      const isChecked = isCheckedByCheckboxRowid(rowid)
      const isIndeterminate = isIndeterminateByCheckboxRowid(rowid)
      const isDisabled = false
      if (showCheckbox) {
        return h('div', {
          class: ['vxe-tree--checkbox-option', {
            'is--checked': isChecked,
            'is--indeterminate': isIndeterminate,
            'is--disabled': isDisabled
          }],
          onClick: (evnt) => {
            if (!isDisabled) {
              changeCheckboxEvent(evnt, row)
            }
          }
        }, [
          h('span', {
            class: ['vxe-checkbox--icon', isIndeterminate ? getIcon().CHECKBOX_INDETERMINATE : (isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED)]
          })
        ])
      }
      return createCommentVNode()
    }

    const renderNode = (row: any): VNode => {
      const { showLine, indent, iconOpen, iconClose, showIcon } = props
      const { treeExpandedMaps, currentNode } = reactData
      const { nodeMaps } = internalData
      const childrenField = computeChildrenField.value
      const titleField = computeTitleField.value
      const childList: any[] = XEUtils.get(row, childrenField)
      const hasChild = childList && childList.length
      const titleSlot = slots.title
      const rowid = getRowid(row)
      const isExpand = treeExpandedMaps[rowid]
      const nodeItem = nodeMaps[rowid]
      const nodeValue = XEUtils.get(row, titleField)
      const childVns: VNode[] = []
      if (hasChild && treeExpandedMaps[rowid]) {
        if (showLine) {
          childVns.push(
            h('div', {
              key: 'line',
              class: 'vxe-tree--node-child-line',
              style: {
                height: `calc(${childList.length} * var(--vxe-ui-tree-node-height) - var(--vxe-ui-tree-node-height) / 2)`,
                left: `${(nodeItem.level + 1) * (indent || 1)}px`
              }
            })
          )
        }
        childList.forEach(childItem => {
          childVns.push(renderNode(childItem))
        })
      }

      return h('div', {
        class: ['vxe-tree--node-item-row', `node--level-${nodeItem.level}`, {
          'is--current': currentNode && rowid === getRowid(currentNode)
        }],
        rowid
      }, [
        h('div', {
          class: 'vxe-tree--node-item-wrapper',
          style: {
            paddingLeft: `${(nodeItem.level - 1) * (indent || 1)}px`
          },
          onClick (evnt) {
            handleNodeClickEvent(evnt, row)
          },
          onDblclick (evnt) {
            handleNodeDblclickEvent(evnt, row)
          }
        }, [
          showIcon || showLine
            ? h('div', {
              class: 'vxe-tree--node-item-switcher'
            }, showIcon && hasChild
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
              : [])
            : createCommentVNode(),
          renderRadio(row, rowid),
          renderCheckbox(row, rowid),
          h('div', {
            class: 'vxe-tree--node-item-label'
          }, titleSlot ? getSlotVNs(titleSlot({ row })) : `${nodeValue}`)
        ]),
        hasChild && treeExpandedMaps[rowid]
          ? h('div', {
            class: 'vxe-tree--node-child-wrapper'
          }, childVns)
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
      const { trigger, showLine, isHover } = props
      const vSize = computeSize.value
      return h('div', {
        ref: refElem,
        class: ['vxe-tree', {
          [`size--${vSize}`]: vSize,
          'show--line': showLine,
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

    watch(() => props.radioCheckRowKey, (val) => {
      reactData.selectRadioKey = val
    })

    const checkboxFlag = ref(0)
    watch(() => props.checkboxCheckRowKeys ? props.checkboxCheckRowKeys.length : 0, () => {
      checkboxFlag.value++
    })
    watch(() => props.checkboxCheckRowKeys, () => {
      checkboxFlag.value++
    })
    watch(checkboxFlag, () => {
      updateCheckboxChecked(props.checkboxCheckRowKeys || [])
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
