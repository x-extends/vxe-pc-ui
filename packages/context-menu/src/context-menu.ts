import { ref, h, reactive, PropType, computed, VNode, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, createEvent, useSize, globalEvents, renderEmptyElement } from '../../ui'
import { getLastZIndex, nextSubZIndex, nextZIndex, getFuncText } from '../../ui/src/utils'
import { getEventTargetNode, toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'

import type { ContextMenuInternalData, ContextMenuReactData, VxeContextMenuPropTypes, VxeContextMenuDefines, ContextMenuPrivateRef, VxeContextMenuEmits, VxeContextMenuPrivateComputed, ContextMenuMethods, ContextMenuPrivateMethods, VxeContextMenuConstructor, VxeContextMenuPrivateMethods, ValueOf } from '../../../types'

function createInternalData (): ContextMenuInternalData {
  return {
  }
}

function createReactData (): ContextMenuReactData {
  return {
    visible: false,
    activeOption: null,
    activeChildOption: null,
    popupStyle: {
      top: '',
      left: '',
      zIndex: 0
    },
    childPos: ''
  }
}

export default defineVxeComponent({
  name: 'VxeContextMenu',
  props: {
    modelValue: Boolean as PropType<VxeContextMenuPropTypes.ModelValue>,
    className: String as PropType<VxeContextMenuPropTypes.ClassName>,
    size: {
      type: String as PropType<VxeContextMenuPropTypes.Size>,
      default: () => getConfig().contextMenu.size || getConfig().size
    },
    options: Array as PropType<VxeContextMenuPropTypes.Options>,
    x: [Number, String] as PropType<VxeContextMenuPropTypes.X>,
    y: [Number, String] as PropType<VxeContextMenuPropTypes.Y>,
    zIndex: [Number, String] as PropType<VxeContextMenuPropTypes.ZIndex>,
    position: {
      type: String as PropType<VxeContextMenuPropTypes.Position>,
      default: () => getConfig().contextMenu.position
    },
    destroyOnClose: {
      type: Boolean as PropType<VxeContextMenuPropTypes.DestroyOnClose>,
      default: () => getConfig().contextMenu.destroyOnClose
    },
    transfer: {
      type: Boolean as PropType<VxeContextMenuPropTypes.Transfer>,
      default: () => getConfig().contextMenu.transfer
    }
  },
  emits: [
    'update:modelValue',
    'option-click',
    'change',
    'show',
    'hide'
  ] as VxeContextMenuEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

    const internalData = createInternalData()
    const reactData = reactive(createReactData())

    const refMaps: ContextMenuPrivateRef = {
      refElem
    }

    const computeMenuGroups = computed(() => {
      const { options } = props
      return options || []
    })

    const computeTopAndLeft = computed(() => {
      const { x, y } = props
      return `${x}${y}`
    })

    const computeMaps: VxeContextMenuPrivateComputed = {
    }

    const $xeContextMenu = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeContextMenuConstructor & VxeContextMenuPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeContextMenuEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $contextMenu: $xeContextMenu }, params))
    }

    const emitModel = (value: any) => {
      emit('update:modelValue', value)
    }

    const open = () => {
      const { modelValue } = props
      const { visible } = reactData
      const value = true
      reactData.visible = value
      updateLocate()
      updateZindex()
      if (modelValue !== value) {
        emitModel(value)
        dispatchEvent('change', { value }, null)
      }
      if (visible !== value) {
        dispatchEvent('show', { visible: value }, null)
      }
      return nextTick()
    }

    const close = () => {
      const { modelValue } = props
      const { visible } = reactData
      const value = false
      reactData.visible = value
      if (modelValue !== value) {
        emitModel(value)
        dispatchEvent('change', { value }, null)
      }
      if (visible !== value) {
        dispatchEvent('hide', { visible: value }, null)
      }
      return nextTick()
    }

    const updateLocate = () => {
      const { x, y } = props
      const { popupStyle } = reactData
      popupStyle.left = toCssUnit(x || 0)
      popupStyle.top = toCssUnit(y || 0)
    }

    const updateZindex = () => {
      const { zIndex, transfer } = props
      const { popupStyle } = reactData
      const menuZIndex = popupStyle.zIndex
      if (zIndex) {
        popupStyle.zIndex = XEUtils.toNumber(zIndex)
      } else {
        if (menuZIndex < getLastZIndex()) {
          popupStyle.zIndex = transfer ? nextSubZIndex() : nextZIndex()
        }
      }
    }

    const handleVisible = () => {
      const { modelValue } = props
      if (modelValue) {
        open()
      } else {
        close()
      }
    }

    const tagMethods: ContextMenuMethods = {
      dispatchEvent,
      open,
      close
    }

    const hasChildMenu = (item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption) => {
      const { children } = item as VxeContextMenuDefines.MenuFirstOption
      return children && children.some((child) => child.visible !== false)
    }

    const handleItemClickEvent = (evnt: MouseEvent, item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption) => {
      if (!hasChildMenu(item)) {
        dispatchEvent('option-click', { option: item }, evnt)
        close()
      }
    }

    const handleItemMouseenterEvent = (evnt: MouseEvent, item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption, parentitem?: VxeContextMenuDefines.MenuFirstOption | null) => {
      reactData.activeOption = parentitem || item
      reactData.activeChildOption = parentitem ? item : null
    }

    const handleItemMouseleaveEvent = () => {
      reactData.activeOption = null
      reactData.activeChildOption = null
    }

    const handleGlobalMousedownEvent = (evnt: MouseEvent) => {
      const { visible } = reactData
      if (visible) {
        const el = refElem.value
        if (!getEventTargetNode(evnt, el, '').flag) {
          close()
        }
      }
    }

    const tagPrivateMethods: ContextMenuPrivateMethods = {
    }

    Object.assign($xeContextMenu, tagMethods, tagPrivateMethods)

    const renderMenuItem = (item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption, parentItem: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption | null, hasChildMenus?: boolean) => {
      const { visible, disabled, loading } = item
      if (visible === false) {
        return renderEmptyElement($xeContextMenu)
      }
      const prefixOpts = Object.assign({}, item.prefixConfig)
      const prefixIcon = prefixOpts.icon || item.prefixIcon
      const suffixOpts = Object.assign({}, item.suffixConfig)
      const suffixIcon = suffixOpts.icon || item.suffixIcon
      const menuContent = loading ? getI18n('vxe.contextMenu.loadingText') : getFuncText(item.name)
      return h('div', {
        class: ['vxe-context-menu--item-inner', {
          'is--disabled': disabled,
          'is--loading': loading
        }],
        onClick (evnt) {
          handleItemClickEvent(evnt, item)
        },
        onMouseenter (evnt) {
          handleItemMouseenterEvent(evnt, item, parentItem)
        },
        onMouseleave: handleItemMouseleaveEvent
      }, [
        h('div', {
          class: ['vxe-context-menu--item-prefix', prefixOpts.className || '']
        }, loading
          ? [
              h('span', {
                key: '1'
              }, [
                h('i', {
                  class: getIcon().CONTEXT_MENU_OPTION_LOADING
                })
              ])
            ]
          : [
              prefixIcon && XEUtils.isFunction(prefixIcon)
                ? h('span', {
                  key: '2'
                }, getSlotVNs(prefixIcon({})))
                : h('span', {
                  key: '3'
                }, [
                  h('i', {
                    class: prefixIcon
                  })
                ]),
              prefixOpts.content
                ? h('span', {
                  key: '4'
                }, `${prefixOpts.content || ''}`)
                : renderEmptyElement($xeContextMenu)
            ]),
        h('div', {
          class: 'vxe-context-menu--item-label'
        }, menuContent),
        !loading && (suffixIcon || suffixOpts.content)
          ? h('div', {
            class: ['vxe-context-menu--item-suffix', suffixOpts.className || '']
          }, [
            suffixIcon && XEUtils.isFunction(suffixIcon)
              ? h('span', {
                key: '2'
              }, getSlotVNs(suffixIcon({})))
              : h('span', {
                key: '3'
              }, [
                h('i', {
                  class: suffixIcon
                })
              ]),
            suffixOpts.content
              ? h('span', {
                key: '4'
              }, `${suffixOpts.content || ''}`)
              : renderEmptyElement($xeContextMenu)
          ])
          : renderEmptyElement($xeContextMenu),
        hasChildMenus
          ? h('div', {
            class: 'vxe-context-menu--item-subicon'
          }, [
            h('i', {
              class: getIcon().CONTEXT_MENU_CHILDREN
            })
          ])
          : renderEmptyElement($xeContextMenu)
      ])
    }

    const renderMenus = () => {
      const { activeOption, activeChildOption } = reactData
      const menuGroups = computeMenuGroups.value
      const mgVNs: VNode[] = []
      menuGroups.forEach((menuList, gIndex) => {
        const moVNs: VNode[] = []
        menuList.forEach((firstItem, i) => {
          const { children } = firstItem
          const hasChildMenus = children && children.some((child) => child.visible !== false)
          moVNs.push(
            h('div', {
              key: `${gIndex}_${i}`,
              class: ['vxe-context-menu--item-wrapper vxe-context-menu--first-item', firstItem.className || '', {
                'is--active': activeOption === firstItem
              }]
            }, [
              hasChildMenus
                ? h('div', {
                  class: 'vxe-context-menu--children-wrapper'
                }, children.map(twoItem => {
                  return h('div', {
                    class: ['vxe-context-menu--item-wrapper vxe-context-menu--child-item', twoItem.className || '', {
                      'is--active': activeChildOption === twoItem
                    }]
                  }, [
                    renderMenuItem(twoItem, firstItem)
                  ])
                }))
                : renderEmptyElement($xeContextMenu),
              renderMenuItem(firstItem, null, hasChildMenus)
            ])
          )
        })
        mgVNs.push(
          h('div', {
            key: gIndex,
            class: 'vxe-context-menu--group-wrapper'
          }, moVNs)
        )
      })
      return mgVNs
    }

    const renderVN = () => {
      const { className, position, destroyOnClose } = props
      const { visible, popupStyle, childPos } = reactData
      const vSize = computeSize.value
      return h('div', {
        ref: refElem,
        class: ['vxe-context-menu vxe-context-menu--wrapper', position === 'absolute' ? ('is--' + position) : 'is--fixed', `cp--${childPos === 'left' ? childPos : 'right'}`, className || '', {
          [`size--${vSize}`]: vSize,
          'is--visible': visible
        }],
        style: popupStyle
      }, (destroyOnClose ? visible : true) ? renderMenus() : [])
    }

    watch(computeTopAndLeft, () => {
      updateLocate()
    })

    watch(() => props.modelValue, () => {
      handleVisible()
    })

    handleVisible()

    onMounted(() => {
      globalEvents.on($xeContextMenu, 'mousedown', handleGlobalMousedownEvent)
    })

    onBeforeUnmount(() => {
      globalEvents.off($xeContextMenu, 'mousedown')
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    $xeContextMenu.renderVN = renderVN

    return $xeContextMenu
  },
  render () {
    return this.renderVN()
  }
})
