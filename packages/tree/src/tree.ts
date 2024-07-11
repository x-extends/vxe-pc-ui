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
    radioCheckNodeKey: {
      type: [String, Number] as PropType<VxeTreePropTypes.RadioCheckNodeKey>,
      default: () => getConfig().tree.radioCheckNodeKey
    },
    radioConfig: {
      type: Object as PropType<VxeTreePropTypes.RadioConfig>,
      default: () => XEUtils.clone(getConfig().tree.radioConfig, true)
    },
    showCheckbox: {
      type: Boolean as PropType<VxeTreePropTypes.ShowCheckbox>,
      default: () => getConfig().tree.showCheckbox
    },
    checkboxCheckNodeKeys: {
      type: Array as PropType<VxeTreePropTypes.CheckboxCheckNodeKeys>,
      default: () => getConfig().tree.checkboxCheckNodeKeys
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
    'update:radioCheckNodeKey',
    'update:checkboxCheckNodeKeys',
    'node-click',
    'node-dblclick',
    'radio-change',
    'checkbox-change'
  ] as VxeTreeEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TreeReactData>({
      currentNode: null,
      selectRadioKey: props.radioCheckNodeKey,
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

    const getNodeid = (node: any) => {
      const keyField = computeKeyField.value
      const nodeid = XEUtils.get(node, keyField)
      return XEUtils.eqNull(nodeid) ? '' : encodeURIComponent(nodeid)
    }

    const isExpandByNode = (node: any) => {
      const { treeExpandedMaps } = reactData
      const nodeid = getNodeid(node)
      return !!treeExpandedMaps[nodeid]
    }

    const isCheckedByRadioNodeid = (nodeid: any) => {
      const { selectRadioKey } = reactData
      return selectRadioKey === nodeid
    }

    const isCheckedByRadioNode = (node: any) => {
      return isCheckedByRadioNodeid(getNodeid(node))
    }

    const isCheckedByCheckboxNodeid = (nodeid: any) => {
      const { selectCheckboxMaps } = reactData
      return !!selectCheckboxMaps[nodeid]
    }

    const isCheckedByCheckboxNode = (node: any) => {
      return isCheckedByCheckboxNodeid(getNodeid(node))
    }

    const isIndeterminateByCheckboxNodeid = (nodeid: any) => {
      const { indeterminateCheckboxMaps } = reactData
      return !!indeterminateCheckboxMaps[nodeid]
    }

    const isIndeterminateByCheckboxNode = (node: any) => {
      return isIndeterminateByCheckboxNodeid(getNodeid(node))
    }

    const emitCheckboxMode = (value: VxeTreePropTypes.CheckboxCheckNodeKeys) => {
      emit('update:checkboxCheckNodeKeys', value)
    }

    const emitRadioMode = (value: VxeTreePropTypes.RadioCheckNodeKey) => {
      emit('update:radioCheckNodeKey', value)
    }

    const updateCheckboxChecked = (nodeKeys: VxeTreePropTypes.CheckboxCheckNodeKeys) => {
      const selectKeyMaps: Record<string, boolean> = {}
      if (nodeKeys) {
        nodeKeys.forEach((key) => {
          selectKeyMaps[key] = true
        })
      }
      reactData.selectCheckboxMaps = selectKeyMaps
    }

    const handleSetExpand = (nodeid: string, expanded: boolean, expandedMaps: Record<string, boolean>) => {
      if (expanded) {
        if (expandedMaps[nodeid]) {
          expandedMaps[nodeid] = true
        }
      } else {
        if (expandedMaps[nodeid]) {
          delete expandedMaps[nodeid]
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
      setExpandByNodeid (nodeids, expanded) {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        if (nodeids) {
          if (!XEUtils.isArray(nodeids)) {
            nodeids = [nodeids]
          }
          nodeids.forEach((nodeid: string) => {
            handleSetExpand(nodeid, expanded, expandedMaps)
          })
          reactData.treeExpandedMaps = expandedMaps
        }
        return nextTick()
      },
      setExpand (nodes, expanded) {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        if (nodes) {
          if (!XEUtils.isArray(nodes)) {
            nodes = [nodes]
          }
          nodes.forEach((node: any) => {
            const nodeid = getNodeid(node)
            handleSetExpand(nodeid, expanded, expandedMaps)
          })
          reactData.treeExpandedMaps = expandedMaps
        }
        return nextTick()
      },
      toggleExpandByNodeid (nodeids) {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        if (nodeids) {
          if (!XEUtils.isArray(nodeids)) {
            nodeids = [nodeids]
          }
          nodeids.forEach((nodeid: string) => {
            handleSetExpand(nodeid, !expandedMaps[nodeid], expandedMaps)
          })
          reactData.treeExpandedMaps = expandedMaps
        }
        return nextTick()
      },
      toggleExpand (nodes) {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        if (nodes) {
          if (!XEUtils.isArray(nodes)) {
            nodes = [nodes]
          }
          nodes.forEach((node: any) => {
            const nodeid = getNodeid(node)
            handleSetExpand(nodeid, !expandedMaps[nodeid], expandedMaps)
          })
          reactData.treeExpandedMaps = expandedMaps
        }
        return nextTick()
      },
      setAllExpand () {
        const expandedMaps: Record<string, boolean> = Object.assign(reactData.treeExpandedMaps)
        const childrenField = computeChildrenField.value
        XEUtils.eachTree(reactData.treeList, (node) => {
          const nodeid = getNodeid(node)
          expandedMaps[nodeid] = true
        }, { children: childrenField })
        reactData.treeExpandedMaps = expandedMaps
        return nextTick()
      },
      isExpandByNode,
      isCheckedByRadioNodeid,
      isCheckedByRadioNode,
      isCheckedByCheckboxNodeid,
      isIndeterminateByCheckboxNode,
      isCheckedByCheckboxNode
    }

    const updateData = (list: any[]) => {
      const keyField = computeKeyField.value
      const childrenField = computeChildrenField.value
      const keyMaps: Record<string, {
        node: any
        nodeIndex: number
        parent: any
        level: number
      }> = {}
      XEUtils.eachTree(list, (node, nodeIndex, items, path, parent, nodes) => {
        let nodeid = getNodeid(node)
        if (!nodeid) {
          nodeid = getNodeUniqueId()
          XEUtils.set(node, keyField, nodeid)
        }
        keyMaps[nodeid] = {
          node,
          nodeIndex,
          parent,
          level: nodes.length
        }
      }, { children: childrenField })
      internalData.nodeMaps = keyMaps
      reactData.treeList = list ? list.slice(0) : []
    }

    const handleNodeClickEvent = (evnt: MouseEvent, node: any) => {
      const { trigger, isCurrent } = props
      const radioOpts = computeRadioOpts.value
      const checkboxOpts = computeCheckboxOpts.value
      let triggerRadio = false
      let triggerCheckbox = false
      let triggerExpand = false
      if (isCurrent) {
        reactData.currentNode = node
      } else {
        reactData.currentNode = null
      }
      if (trigger === 'node') {
        triggerExpand = true
        toggleExpandEvent(evnt, node)
      }
      if (radioOpts.trigger === 'node') {
        triggerRadio = true
        changeRadioEvent(evnt, node)
      }
      if (checkboxOpts.trigger === 'node') {
        triggerCheckbox = true
        changeCheckboxEvent(evnt, node)
      }
      dispatchEvent('node-click', { node, triggerRadio, triggerCheckbox, triggerExpand }, evnt)
    }

    const handleNodeDblclickEvent = (evnt: MouseEvent, node: any) => {
      dispatchEvent('node-dblclick', { node }, evnt)
    }

    const toggleExpandEvent = (evnt: MouseEvent, node: any) => {
      evnt.stopPropagation()
      const expandedMaps = Object.assign({}, reactData.treeExpandedMaps)
      const nodeid = getNodeid(node)
      if (expandedMaps[nodeid]) {
        delete expandedMaps[nodeid]
      } else {
        expandedMaps[nodeid] = true
      }
      reactData.treeExpandedMaps = expandedMaps
    }

    const handleNodeCheckboxStatus = (node: any, selectKeyMaps: Record<string, boolean>, indeterminateMaps: Record<string, boolean>) => {
      const childrenField = computeChildrenField.value
      const childList: any[] = XEUtils.get(node, childrenField)
      const nodeid = getNodeid(node)
      if (childList && childList.length) {
        let checkSome = false
        let checkSize = 0
        childList.forEach(childNode => {
          const childNodeid = getNodeid(childNode)
          const isChecked = selectKeyMaps[childNodeid]
          if (isChecked || indeterminateMaps[childNodeid]) {
            if (isChecked) {
              checkSize++
            }
            checkSome = true
          }
        })
        const checkAll = checkSize === childList.length
        if (checkAll) {
          if (!selectKeyMaps[nodeid]) {
            selectKeyMaps[nodeid] = true
          }
          if (indeterminateMaps[nodeid]) {
            delete indeterminateMaps[nodeid]
          }
        } else {
          if (selectKeyMaps[nodeid]) {
            delete selectKeyMaps[nodeid]
          }
          indeterminateMaps[nodeid] = checkSome
        }
      } else {
        if (indeterminateMaps[nodeid]) {
          delete indeterminateMaps[nodeid]
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
        XEUtils.eachTree(treeList, (node, index, items, path, parent, nodes) => {
          const childList: any[] = XEUtils.get(node, childrenField)
          if (!childList || !childList.length) {
            handleNodeCheckboxStatus(node, selectKeyMaps, indeterminateMaps)
          }
          if (index === items.length - 1) {
            for (let len = nodes.length - 2; len >= 0; len--) {
              const parentItem = nodes[len]
              handleNodeCheckboxStatus(parentItem, selectKeyMaps, indeterminateMaps)
            }
          }
        })
        reactData.selectCheckboxMaps = selectKeyMaps
        reactData.indeterminateCheckboxMaps = indeterminateMaps
      }
    }

    const changeCheckboxEvent = (evnt: MouseEvent, node: any) => {
      evnt.stopPropagation()
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly } = checkboxOpts
      const selectKeyMaps = Object.assign({}, reactData.selectCheckboxMaps)
      const childrenField = computeChildrenField.value
      const nodeid = getNodeid(node)
      let isChecked = false
      if (selectKeyMaps[nodeid]) {
        delete selectKeyMaps[nodeid]
      } else {
        isChecked = true
        selectKeyMaps[nodeid] = isChecked
      }
      if (!checkStrictly) {
        XEUtils.eachTree(XEUtils.get(node, childrenField), (childNode) => {
          const childNodeid = getNodeid(childNode)
          if (isChecked) {
            if (!selectKeyMaps[childNodeid]) {
              selectKeyMaps[childNodeid] = true
            }
          } else {
            if (selectKeyMaps[childNodeid]) {
              delete selectKeyMaps[childNodeid]
            }
          }
        }, { children: childrenField })
      }
      reactData.selectCheckboxMaps = selectKeyMaps
      updateCheckboxStatus()
      const value = Object.keys(reactData.selectCheckboxMaps)
      emitCheckboxMode(value)
      dispatchEvent('checkbox-change', { value }, evnt)
    }

    const changeRadioEvent = (evnt: MouseEvent, node: any) => {
      evnt.stopPropagation()
      const value = getNodeid(node)
      reactData.selectRadioKey = value
      emitRadioMode(value)
      dispatchEvent('radio-change', { value }, evnt)
    }

    const treePrivateMethods: TreePrivateMethods = {
    }

    Object.assign($xeTree, treeMethods, treePrivateMethods)

    const renderRadio = (node: any, nodeid: string) => {
      const { showRadio } = props
      const { selectRadioKey } = reactData
      const isChecked = nodeid === selectRadioKey
      const isDisabled = false
      if (showRadio) {
        return h('div', {
          class: ['vxe-tree--radio-option', {
            'is--checked': isChecked,
            'is--disabled': isDisabled
          }],
          onClick: (evnt) => {
            if (!isDisabled) {
              changeRadioEvent(evnt, node)
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

    const renderCheckbox = (node: any, nodeid: string) => {
      const { showCheckbox } = props
      const isChecked = isCheckedByCheckboxNodeid(nodeid)
      const isIndeterminate = isIndeterminateByCheckboxNodeid(nodeid)
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
              changeCheckboxEvent(evnt, node)
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

    const renderNode = (node: any): VNode => {
      const { showLine, indent, iconOpen, iconClose, showIcon } = props
      const { treeExpandedMaps, currentNode } = reactData
      const { nodeMaps } = internalData
      const childrenField = computeChildrenField.value
      const titleField = computeTitleField.value
      const childList: any[] = XEUtils.get(node, childrenField)
      const hasChild = childList && childList.length
      const titleSlot = slots.title
      const nodeid = getNodeid(node)
      const isExpand = treeExpandedMaps[nodeid]
      const nodeItem = nodeMaps[nodeid]
      const nodeValue = XEUtils.get(node, titleField)
      const childVns: VNode[] = []
      if (hasChild && treeExpandedMaps[nodeid]) {
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
        class: ['vxe-tree--node-item-node', `node--level-${nodeItem.level}`, {
          'is--current': currentNode && nodeid === getNodeid(currentNode)
        }],
        nodeid
      }, [
        h('div', {
          class: 'vxe-tree--node-item-wrapper',
          style: {
            paddingLeft: `${(nodeItem.level - 1) * (indent || 1)}px`
          },
          onClick (evnt) {
            handleNodeClickEvent(evnt, node)
          },
          onDblclick (evnt) {
            handleNodeDblclickEvent(evnt, node)
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
                      toggleExpandEvent(evnt, node)
                    }
                  }, [
                    h('i', {
                      class: isExpand ? (iconOpen || getIcon().TREE_NODE_OPEN) : (iconClose || getIcon().TREE_NODE_CLOSE)
                    })
                  ])
                ]
              : [])
            : createCommentVNode(),
          renderRadio(node, nodeid),
          renderCheckbox(node, nodeid),
          h('div', {
            class: 'vxe-tree--node-item-label'
          }, titleSlot ? getSlotVNs(titleSlot({ node })) : `${nodeValue}`)
        ]),
        hasChild && treeExpandedMaps[nodeid]
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
      }, treeList.map(node => renderNode(node)))
    }

    const renderVN = () => {
      const { trigger, showLine, isHover } = props
      const vSize = computeSize.value
      return h('div', {
        ref: refElem,
        class: ['vxe-tree', {
          [`size--${vSize}`]: vSize,
          'show--line': showLine,
          'node--hover': isHover,
          'node--trigger': trigger === 'node'
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

    watch(() => props.radioCheckNodeKey, (val) => {
      reactData.selectRadioKey = val
    })

    const checkboxFlag = ref(0)
    watch(() => props.checkboxCheckNodeKeys ? props.checkboxCheckNodeKeys.length : 0, () => {
      checkboxFlag.value++
    })
    watch(() => props.checkboxCheckNodeKeys, () => {
      checkboxFlag.value++
    })
    watch(checkboxFlag, () => {
      updateCheckboxChecked(props.checkboxCheckNodeKeys || [])
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
