import { ref, h, reactive, PropType, inject, resolveComponent, watch, VNode, computed, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, permission, useSize, globalEvents, renderEmptyElement } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import VxeLoadingComponent from '../../loading/src/loading'

import type { VxeMenuDefines, VxeMenuPropTypes, MenuReactData, VxeMenuEmits, MenuMethods, VxeComponentSlotType, VxeLayoutAsidePropTypes, MenuPrivateMethods, MenuPrivateRef, VxeMenuPrivateComputed, VxeMenuConstructor, VxeMenuPrivateMethods, ValueOf, VxeLayoutAsideConstructor, VxeLayoutAsidePrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxeMenu',
  props: {
    modelValue: [String, Number] as PropType<VxeMenuPropTypes.ModelValue>,
    expandAll: Boolean as PropType<VxeMenuPropTypes.ExpandAll>,
    collapsed: {
      type: Boolean as PropType<VxeMenuPropTypes.Collapsed>,
      default: null
    },
    collapseFixed: Boolean as PropType<VxeMenuPropTypes.CollapseFixed>,
    loading: Boolean as PropType<VxeMenuPropTypes.Loading>,
    options: {
      type: Array as PropType<VxeMenuPropTypes.Options>,
      default: () => []
    },
    size: {
      type: String as PropType<VxeMenuPropTypes.Size>,
      default: () => getConfig().image.size || getConfig().size
    }
  },
  emits: [
    'update:modelValue',
    'click'
  ] as VxeMenuEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const $xeLayoutAside = inject<(VxeLayoutAsideConstructor & VxeLayoutAsidePrivateMethods) | null>('$xeLayoutAside', null)

    const refElem = ref<HTMLDivElement>()
    const refCollapseElem = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

    const reactData = reactive<MenuReactData>({
      initialized: !!props.collapsed,
      isEnterCollapse: false,
      collapseStyle: {},
      collapseZindex: 0,
      activeName: props.modelValue,
      menuList: [],
      itemHeight: 1
    })

    const refMaps: MenuPrivateRef = {
      refElem
    }

    const computeIsCollapsed = computed(() => {
      const { collapsed } = props
      if (XEUtils.isBoolean(collapsed)) {
        return collapsed
      }
      if ($xeLayoutAside) {
        return !!$xeLayoutAside.props.collapsed
      }
      return false
    })

    const computeCollapseWidth = computed(() => {
      let collapseWidth: VxeLayoutAsidePropTypes.CollapseWidth = ''
      if ($xeLayoutAside) {
        collapseWidth = $xeLayoutAside.props.collapseWidth || ''
      }
      return collapseWidth
    })

    const computeCollapseEnterWidth = computed(() => {
      let width: VxeLayoutAsidePropTypes.Width = ''
      if ($xeLayoutAside) {
        width = $xeLayoutAside.props.width || ''
      }
      return width
    })

    const computeMaps: VxeMenuPrivateComputed = {
      computeSize
    }

    const $xeMenu = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeMenuConstructor & VxeMenuPrivateMethods

    const getMenuTitle = (item: VxeMenuPropTypes.MenuOption) => {
      return `${item.title || item.name}`
    }

    const updateZindex = () => {
      if (reactData.collapseZindex < getLastZIndex()) {
        reactData.collapseZindex = nextZIndex()
      }
    }

    const updateActiveMenu = (isDefExpand?: boolean) => {
      const { activeName } = reactData
      XEUtils.eachTree(reactData.menuList, (item, index, items, path, parent, nodes) => {
        if (item.itemKey === activeName) {
          nodes.forEach(obj => {
            obj.isActive = true
            if (isDefExpand) {
              obj.isExpand = true
            }
          })
          item.isExactActive = true
        } else {
          item.isExactActive = false
          item.isActive = false
        }
      }, { children: 'childList' })
    }

    const updateMenuConfig = () => {
      const { options, expandAll } = props
      reactData.menuList = XEUtils.mapTree(options, (item, index, items, path, parent) => {
        const objItem = {
          ...item,
          parentKey: parent ? (parent.name || path.slice(0, path.length - 1).join(',')) : '',
          level: path.length,
          itemKey: item.name || path.join(','),
          isExactActive: false,
          isActive: false,
          isExpand: XEUtils.isBoolean(item.expanded) ? item.expanded : !!expandAll,
          hasChild: item.children && item.children.length > 0
        } as VxeMenuDefines.MenuItem
        return objItem
      }, { children: 'children', mapChildren: 'childList' })
    }

    const updateCollapseStyle = () => {
      const { collapseFixed } = props
      if (collapseFixed) {
        nextTick(() => {
          const { isEnterCollapse } = reactData
          const isCollapsed = computeIsCollapsed.value
          const collapseEnterWidth = computeCollapseEnterWidth.value
          const collapseWidth = computeCollapseWidth.value
          const el = refElem.value
          if (el) {
            const clientRect = el.getBoundingClientRect()
            const parentNode = el.parentNode as HTMLElement
            reactData.collapseStyle = isCollapsed
              ? {
                  top: toCssUnit(clientRect.top),
                  left: toCssUnit(clientRect.left),
                  height: toCssUnit(parentNode.clientHeight),
                  width: isEnterCollapse ? (collapseEnterWidth ? toCssUnit(collapseEnterWidth) : '') : (collapseWidth ? toCssUnit(collapseWidth) : ''),
                  zIndex: reactData.collapseZindex
                }
              : {}
          }
        })
      }
    }

    const handleCollapseMenu = () => {
      const { collapseFixed } = props
      if (collapseFixed) {
        const { initialized } = reactData
        const isCollapsed = computeIsCollapsed.value
        if (isCollapsed) {
          if (!initialized) {
            reactData.initialized = true
            nextTick(() => {
              const collapseEl = refCollapseElem.value
              if (collapseEl) {
                document.body.appendChild(collapseEl)
              }
            })
          }
        }
        reactData.isEnterCollapse = false
        updateZindex()
        updateCollapseStyle()
      }
    }

    const handleClickIconCollapse = (evnt: KeyboardEvent, item: VxeMenuDefines.MenuItem) => {
      const { hasChild, isExpand } = item
      if (hasChild) {
        evnt.stopPropagation()
        evnt.preventDefault()
        item.isExpand = !isExpand
      }
    }

    const emitModel = (value: any) => {
      reactData.activeName = value
      emit('update:modelValue', value)
    }

    const handleClickMenu = (evnt: KeyboardEvent, item: VxeMenuDefines.MenuItem) => {
      const { itemKey, routerLink, hasChild } = item
      if (routerLink) {
        emitModel(itemKey)
        handleMenuMouseleave()
      } else {
        if (hasChild) {
          handleClickIconCollapse(evnt, item)
        } else {
          emitModel(itemKey)
          handleMenuMouseleave()
        }
      }
      dispatchEvent('click', { menu: item }, evnt)
    }

    const handleMenuMouseenter = () => {
      const { collapseStyle } = reactData
      const collapseEnterWidth = computeCollapseEnterWidth.value
      reactData.collapseStyle = Object.assign({}, collapseStyle, {
        width: collapseEnterWidth ? toCssUnit(collapseEnterWidth) : ''
      })
      reactData.isEnterCollapse = true
    }

    const handleMenuMouseleave = () => {
      const { collapseStyle } = reactData
      const el = refElem.value
      reactData.collapseStyle = Object.assign({}, collapseStyle, {
        width: el ? toCssUnit(el.offsetWidth) : ''
      })
      reactData.isEnterCollapse = false
    }

    const callSlot = <T>(slotFunc: ((params: T) => VxeComponentSlotType | VxeComponentSlotType[]) | string | null, params: T) => {
      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc(params))
        }
      }
      return []
    }

    const dispatchEvent = (type: ValueOf<VxeMenuEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $menu: $xeMenu }, params))
    }

    const menuMethods: MenuMethods = {
      dispatchEvent
    }

    const menuPrivateMethods: MenuPrivateMethods = {
    }

    Object.assign($xeMenu, menuMethods, menuPrivateMethods)

    const renderMenuTitle = (item: VxeMenuDefines.MenuItem) => {
      const { icon, isExpand, hasChild, slots: itemSlots } = item
      const optionSlot = itemSlots ? itemSlots.default : slots.option
      const title = getMenuTitle(item)
      const isCollapsed = computeIsCollapsed.value
      return [
        h('div', {
          class: 'vxe-menu--item-link-icon'
        }, icon
          ? [
              h('i', {
                class: icon
              })
            ]
          : []),
        optionSlot
          ? h('div', {
            class: 'vxe-menu--item-custom-title'
          }, callSlot(optionSlot, {
            option: item as any,
            collapsed: isCollapsed
          }))
          : h('div', {
            class: 'vxe-menu--item-link-title',
            title
          }, title),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-link-collapse',
            onClick (evnt: KeyboardEvent) {
              handleClickIconCollapse(evnt, item)
            }
          }, [
            h('i', {
              class: isExpand ? getIcon().MENU_ITEM_EXPAND_OPEN : getIcon().MENU_ITEM_EXPAND_CLOSE
            })
          ])
          : renderEmptyElement($xeMenu)
      ]
    }

    const renderDefaultChildren = (item: VxeMenuDefines.MenuItem): VNode => {
      const { itemKey, level, hasChild, isActive, isExactActive, isExpand, routerLink, childList } = item
      const { isEnterCollapse } = reactData
      const isCollapsed = computeIsCollapsed.value
      if (item.permissionCode) {
        if (!permission.checkVisible(item.permissionCode)) {
          return renderEmptyElement($xeMenu)
        }
      }
      return h('div', {
        key: itemKey,
        class: ['vxe-menu--item-wrapper', `vxe-menu--item-level${level}`, {
          'is--exact-active': isExactActive,
          'is--active': isActive,
          'is--expand': (!isCollapsed || isEnterCollapse) && isExpand
        }]
      }, [
        routerLink
          ? h(resolveComponent('router-link'), {
            class: 'vxe-menu--item-link',
            to: routerLink,
            onClick (evnt: KeyboardEvent) {
              handleClickMenu(evnt, item)
            }
          }, {
            default: () => renderMenuTitle(item)
          })
          : h('div', {
            class: 'vxe-menu--item-link',
            onClick (evnt: KeyboardEvent) {
              handleClickMenu(evnt, item)
            }
          }, renderMenuTitle(item)),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-group'
          }, childList.map(child => renderDefaultChildren(child)))
          : renderEmptyElement($xeMenu)
      ])
    }

    const renderCollapseChildren = (item: VxeMenuDefines.MenuItem): VNode => {
      const { itemKey, level, hasChild, isActive, isExactActive, routerLink, childList } = item
      if (item.permissionCode) {
        if (!permission.checkVisible(item.permissionCode)) {
          return renderEmptyElement($xeMenu)
        }
      }
      return h('div', {
        key: itemKey,
        class: ['vxe-menu--item-wrapper', `vxe-menu--item-level${level}`, {
          'is--exact-active': isExactActive,
          'is--active': isActive
        }]
      }, [
        routerLink
          ? h(resolveComponent('router-link'), {
            class: 'vxe-menu--item-link',
            to: routerLink,
            onClick (evnt: KeyboardEvent) {
              handleClickMenu(evnt, item)
            }
          }, {
            default: () => renderMenuTitle(item)
          })
          : h('div', {
            class: 'vxe-menu--item-link',
            onClick (evnt: KeyboardEvent) {
              handleClickMenu(evnt, item)
            }
          }, renderMenuTitle(item)),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-group'
          }, childList.map(child => renderDefaultChildren(child)))
          : renderEmptyElement($xeMenu)
      ])
    }

    const renderVN = () => {
      const { loading } = props
      const { initialized, menuList, collapseStyle, isEnterCollapse } = reactData
      const vSize = computeSize.value
      const isCollapsed = computeIsCollapsed.value
      return h('div', {
        ref: refElem,
        class: ['vxe-menu', {
          [`size--${vSize}`]: vSize,
          'is--collapsed': isCollapsed,
          'is--loading': loading
        }]
      }, [
        h('div', {
          class: 'vxe-menu--item-list'
        }, menuList.map(child => isCollapsed ? renderCollapseChildren(child) : renderDefaultChildren(child))),
        initialized
          ? h('div', {
            ref: refCollapseElem,
            class: ['vxe-menu--collapse-wrapper', {
              [`size--${vSize}`]: vSize,
              'is--collapsed': isCollapsed,
              'is--enter': isEnterCollapse,
              'is--loading': loading
            }],
            style: collapseStyle,
            onMouseenter: handleMenuMouseenter,
            onMouseleave: handleMenuMouseleave
          }, [
            isCollapsed
              ? h('div', {
                class: 'vxe-menu--item-list'
              }, menuList.map(child => renderDefaultChildren(child)))
              : renderEmptyElement($xeMenu)
          ])
          : renderEmptyElement($xeMenu),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-list-view--loading',
          modelValue: loading
        })
      ])
    }

    const optFlag = ref(0)
    watch(() => props.options ? props.options.length : -1, () => {
      optFlag.value++
    })
    watch(() => props.options, () => {
      optFlag.value++
    })
    watch(optFlag, () => {
      updateMenuConfig()
      updateActiveMenu(true)
    })

    watch(() => props.modelValue, (val) => {
      reactData.activeName = val
    })

    watch(() => reactData.activeName, () => {
      updateActiveMenu(true)
    })

    watch(computeIsCollapsed, () => {
      handleCollapseMenu()
    })

    onMounted(() => {
      globalEvents.on($xeMenu, 'resize', updateCollapseStyle)
      updateCollapseStyle()
    })

    onBeforeUnmount(() => {
      globalEvents.off($xeMenu, 'resize')
      const collapseEl = refCollapseElem.value
      if (collapseEl) {
        const parentNode = collapseEl.parentNode
        if (parentNode) {
          parentNode.removeChild(collapseEl)
        }
      }
    })

    updateMenuConfig()
    updateActiveMenu(true)

    $xeMenu.renderVN = renderVN

    return $xeMenu
  },
  render () {
    return this.renderVN()
  }
})
