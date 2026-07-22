import { ref, h, reactive, Teleport, PropType, inject, resolveComponent, watch, VNode, computed, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, createEvent, permission, useSize, globalEvents, renderEmptyElement } from '../../ui'
import { getPopupContainer, scrollToView, toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, isEnableConf } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import { createComponentLog } from '../../ui/src/log'
import VxeLoadingComponent from '../../loading'

import type { VxeMenuDefines, VxeMenuPropTypes, MenuInternalData, MenuReactData, VxeMenuEmits, MenuMethods, VxeComponentSlotType, MenuPrivateMethods, MenuPrivateRef, VxeMenuPrivateComputed, VxeMenuConstructor, VxeMenuPrivateMethods, ValueOf, VxeLayoutAsideConstructor, VxeLayoutAsidePrivateMethods } from '../../../types'

const { errLog } = createComponentLog('menu')

const { menus, getConfig, getIcon } = VxeUI

function createInternalData (): MenuInternalData {
  return {
    lastActiveTime: 0,
    menuInitMaps: {},
    menuCacheMaps: {},
    menuKeyMaps: {},
    menuEffectMaps: {}
  }
}

function createReactData (): MenuReactData {
  return {
    initialized: false,
    isEnterCollapse: false,
    collapseStyle: {},
    collapseZindex: 0,
    activeName: '',
    menuList: [],
    itemHeight: 1
  }
}

let nemuUniqueKey = 100000000

export default defineVxeComponent({
  name: 'VxeMenu',
  props: {
    modelValue: [String, Number] as PropType<VxeMenuPropTypes.ModelValue>,
    expandAll: Boolean as PropType<VxeMenuPropTypes.ExpandAll>,
    expandKeys: Array as PropType<VxeMenuPropTypes.ExpandKeys>,
    accordion: {
      type: Boolean as PropType<VxeMenuPropTypes.Accordion>,
      default: () => getConfig().menu.accordion
    },
    border: {
      type: [Boolean, String] as PropType<VxeMenuPropTypes.Border>,
      default: () => getConfig().menu.border
    },
    optionProps: {
      type: Object as PropType<VxeMenuPropTypes.OptionProps>,
      default: () => getConfig().menu.optionProps
    },
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
      default: () => getConfig().menu.size || getConfig().size
    },
    menuConfig: Object as PropType<VxeMenuPropTypes.MenuConfig>,
    appendTo: {
      type: [String, Function] as PropType<VxeMenuPropTypes.AppendTo>,
      default: () => getConfig().menu.appendTo
    }
  },
  emits: [
    'update:modelValue',
    'click',
    'option-menu',
    'menu-click'
  ] as VxeMenuEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const $xeLayoutAside = inject<(VxeLayoutAsideConstructor & VxeLayoutAsidePrivateMethods) | null>('$xeLayoutAside', null)

    const refElem = ref<HTMLDivElement>()
    const refCollapseElem = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

    const reactData = reactive(createReactData())
    const internalData = createInternalData()

    const refMaps: MenuPrivateRef = {
      refElem
    }

    const computeMenuOpts = computed(() => {
      return Object.assign({}, getConfig().menu.menuConfig, props.menuConfig)
    })

    const computePropsOpts = computed(() => {
      return Object.assign({}, getConfig().menu.optionProps, props.optionProps)
    })

    const computeTitleField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.title || 'title'
    })

    const computeKeyField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.name || 'name'
    })

    const computeChildrenField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.children || 'children'
    })

    const computeLinkUrlField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.linkUrl || 'linkUrl'
    })

    const computeRouterLinkField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.routerLink || 'routerLink'
    })

    const computeCurrBorder = computed(() => {
      const { border } = props
      if (border) {
        return border === true ? 'first-group' : border
      }
      return ''
    })

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

    const computeVarStyle = computed(() => {
      if ($xeLayoutAside) {
        const { computeVarStyle: asideComputeVarStyle } = $xeLayoutAside.getComputeMaps()
        const asideVarStyle = asideComputeVarStyle.value
        return asideVarStyle
      }
      return {}
    })

    const computeMaps: VxeMenuPrivateComputed = {
      computeSize
    }

    const $xeMenu = {
      xID,
      props,
      context,
      reactData,
      internalData,

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
      const { menuInitMaps } = internalData
      XEUtils.eachTree(reactData.menuList, (item, index, items, path, parentItem, nodes) => {
        if (item.itemKey === activeName) {
          nodes.forEach(obj => {
            obj.isActive = true
            if (isDefExpand) {
              obj.isExpand = true
              menuInitMaps[obj.itemId] = true
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
      const { options, expandAll, expandKeys } = props
      const muInitMaps: Record<string, boolean> = {}
      const titleField = computeTitleField.value
      const keyField = computeKeyField.value
      const childrenField = computeChildrenField.value
      const linkUrlField = computeLinkUrlField.value
      const routerLinkField = computeRouterLinkField.value
      const defaultExpandMaps: Record<string, boolean> = {}
      if (expandKeys) {
        expandKeys.forEach(key => {
          defaultExpandMaps[key] = true
        })
      }
      const muCacheMaps: Record<string, VxeMenuDefines.MenuItem> = {}
      const muKeyMaps: Record<string, VxeMenuDefines.MenuItem> = {}
      reactData.menuList = XEUtils.mapTree(options, (item, index, items, path, parentItem) => {
        const itemId = ++nemuUniqueKey
        const itemKey = item[keyField] || path.join(',')
        const childList = item[childrenField]
        const hasChild = childList && childList.length > 0
        const isExpand = hasChild ? (XEUtils.isBoolean(item.expanded) ? item.expanded : (defaultExpandMaps[itemKey] || !!expandAll)) : false
        if (isExpand) {
          muInitMaps[itemId] = true
        }
        const objItem: VxeMenuDefines.MenuItem = {
          itemConf: item,
          title: item[titleField],
          name: item[keyField],
          icon: item.icon,
          linkUrl: item[linkUrlField],
          linkTarget: item.linkTarget,
          routerLink: item[routerLinkField],
          permissionCode: item.permissionCode,
          children: childList,
          slots: item.slots,
          parentKey: parentItem ? (parentItem.name || path.slice(0, path.length - 1).join(',')) : '',
          level: path.length,
          itemId,
          itemKey,
          isExactActive: false,
          isActive: false,
          isExpand,
          hasChild,
          childList: []
        }
        if (muKeyMaps[itemKey]) {
          errLog('vxe.error.repeatKey', [keyField, item[keyField]])
        }
        muCacheMaps[itemId] = objItem
        muKeyMaps[itemKey] = objItem
        return objItem
      }, { children: 'children', mapChildren: 'childList' })
      internalData.menuInitMaps = muInitMaps
      internalData.menuCacheMaps = muCacheMaps
      internalData.menuKeyMaps = muKeyMaps
    }

    const updateCollapseStyle = () => {
      const { collapseFixed } = props
      if (collapseFixed) {
        nextTick(() => {
          const isCollapsed = computeIsCollapsed.value
          const el = refElem.value
          if (el) {
            const clientRect = el.getBoundingClientRect()
            const parentNode = el.parentNode as HTMLElement
            reactData.collapseStyle = isCollapsed
              ? {
                  top: toCssUnit(clientRect.top),
                  left: toCssUnit(clientRect.left),
                  height: toCssUnit(parentNode.clientHeight),
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
          }
        }
        reactData.isEnterCollapse = false
        updateZindex()
        updateCollapseStyle()
      }
    }

    const handleClickIconCollapse = (evnt: MouseEvent, item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]) => {
      const { accordion } = props
      const { menuEffectMaps, menuInitMaps } = internalData
      const { itemId, hasChild, isExpand } = item
      const isCollapsed = computeIsCollapsed.value
      const expanded = !isExpand
      if (hasChild) {
        evnt.stopPropagation()
        evnt.preventDefault()

        if (menuEffectMaps[itemId]) {
          clearTimeout(menuEffectMaps[itemId])
        }

        if (accordion) {
          itemList.forEach(obj => {
            if (obj !== item) {
              obj.isExpand = false
            }
          })
        }
        item.isExpand = expanded
        menuInitMaps[itemId] = true

        const wrapperEl = isCollapsed ? refCollapseElem.value : refElem.value
        if (wrapperEl) {
          const nemuEl = wrapperEl.querySelector<HTMLDivElement>(`.vxe-menu--item-wrapper[data-menu-id="${itemId}"]`)
          const groupEl = nemuEl ? nemuEl.querySelector<HTMLDivElement>('.vxe-menu--item-group') : null
          if (groupEl) {
            if (expanded) {
              groupEl.style.height = '0'
              groupEl.setAttribute('data-effect', 'y')
              requestAnimationFrame(() => {
                groupEl.style.height = `${groupEl.scrollHeight}px`
              })
            } else {
              groupEl.style.height = `${groupEl.scrollHeight}px`
              groupEl.setAttribute('data-effect', 'y')
              requestAnimationFrame(() => {
                groupEl.style.height = '0'
              })
            }
            menuEffectMaps[itemId] = setTimeout(() => {
              delete menuEffectMaps[itemId]
              groupEl.removeAttribute('data-effect')
              groupEl.style.height = ''
            }, 350)
          }
        }
      }
    }

    const emitModel = (value: any) => {
      reactData.activeName = value
      emit('update:modelValue', value)
    }

    const handleContextmenuEvent = (evnt: MouseEvent, item: VxeMenuDefines.MenuItem) => {
      const { menuConfig } = props
      const menuOpts = computeMenuOpts.value
      if (menuConfig ? isEnableConf(menuOpts) : menuOpts.enabled) {
        const { options, visibleMethod } = menuOpts
        if (!visibleMethod || visibleMethod({ $menu: $xeMenu, options, currentMenu: item, currentOption: item.itemConf })) {
          if (VxeUI.contextMenu) {
            VxeUI.contextMenu.openByEvent(evnt, {
              options,
              events: {
                optionClick (eventParams) {
                  const { option } = eventParams
                  const gMenuOpts = menus.get(option.code)
                  const mmMethod = gMenuOpts ? gMenuOpts.menuMenuMethod : null
                  const params = { menu: option, currentMenu: item, currentOption: item.itemConf, $event: evnt, $menu: $xeMenu }
                  if (mmMethod) {
                    mmMethod(params, evnt)
                  }
                  dispatchEvent('menu-click', params, eventParams.$event)
                }
              }
            })
          }
        }
      }
      dispatchEvent('option-menu', { currentMenu: item }, evnt)
    }

    const handleClickMenu = (evnt: MouseEvent, item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]) => {
      const { itemKey, linkUrl, routerLink, hasChild } = item
      if (linkUrl || routerLink) {
        emitModel(itemKey)
        reactData.isEnterCollapse = false
        internalData.lastActiveTime = Date.now()
      } else {
        if (hasChild) {
          handleClickIconCollapse(evnt, item, itemList)
        } else {
          emitModel(itemKey)
          reactData.isEnterCollapse = false
          internalData.lastActiveTime = Date.now()
        }
      }
      const params = {
        currentMenu: item,
        currentOption: item.itemConf,
        option: item.itemConf,

        // 已废弃
        menu: item
      }
      dispatchEvent('click', params, evnt)
    }

    const handleMenuMouseenter = () => {
      const { lastActiveTime } = internalData

      if (lastActiveTime < Date.now() - 500) {
        reactData.isEnterCollapse = true
      }
    }

    const handleMenuMouseleave = () => {
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

    const handleScrollToView = (itemId: number) => {
      const wrapperEl = refElem.value
      const nemuEl = wrapperEl ? wrapperEl.querySelector<HTMLDivElement>(`.vxe-menu--item-wrapper[data-menu-id="${itemId}"]`) : null
      if (nemuEl) {
        scrollToView(nemuEl)
        return true
      }
      return false
    }

    const menuMethods: MenuMethods = {
      dispatchEvent,
      setExpandByMenuKey (menuKeys, expanded) {
        const { menuKeyMaps, menuInitMaps } = internalData
        if (menuKeys) {
          if (!XEUtils.isArray(menuKeys)) {
            menuKeys = [menuKeys]
          }
          menuKeys.forEach(mKey => {
            const menuItem = menuKeyMaps[mKey]
            if (menuItem) {
              if (expanded) {
                menuInitMaps[menuItem.itemId] = true
              }
              menuItem.isExpand = !!expanded
            }
          })
        }
        return nextTick()
      },
      clearAllExpandMenu () {
        const { menuList } = reactData
        XEUtils.eachTree(menuList, (item) => {
          item.isExpand = false
        }, { children: 'childList' })
        internalData.menuInitMaps = {}
        return nextTick()
      },
      scrollToMenuKey (menuKey) {
        const { menuKeyMaps } = internalData
        const menuItem = menuKeyMaps[menuKey]
        if (!menuItem) {
          return nextTick()
        }
        const { itemId } = menuItem
        if (handleScrollToView(itemId)) {
          return nextTick()
        }
        return nextTick().then(() => {
          handleScrollToView(itemId)
        })
      },
      scrollToActiveMenu () {
        const { activeName } = reactData
        if (activeName) {
          return $xeMenu.scrollToMenuKey(activeName)
        }
        return nextTick().then(() => {
          const { activeName } = reactData
          if (activeName) {
            return $xeMenu.scrollToMenuKey(activeName)
          }
        })
      }
    }

    const menuPrivateMethods: MenuPrivateMethods = {
    }

    Object.assign($xeMenu, menuMethods, menuPrivateMethods)

    const renderMenuTitle = (item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]) => {
      const { icon, isExpand, hasChild } = item
      const itemSlots = item.slots || {}
      const optionSlot = itemSlots.default || slots.option
      const titleSlot = itemSlots.title || slots.optionTitle || slots['option-title']
      const iconSlot = itemSlots.icon || slots.optionIcon || slots['option-icon']
      const title = getMenuTitle(item)
      const isCollapsed = computeIsCollapsed.value
      const params = {
        currentMenu: item,
        currentOption: item.itemConf,
        option: item.itemConf,
        collapsed: isCollapsed
      }
      return [
        optionSlot
          ? renderEmptyElement($xeMenu)
          : h('div', {
            class: 'vxe-menu--item-link-icon'
          }, iconSlot
            ? callSlot(iconSlot, params)
            : (icon
                ? [h('i', {
                    class: icon
                  })]
                : [])),
        optionSlot
          ? h('div', {
            class: 'vxe-menu--item-custom-title'
          }, callSlot(optionSlot, params))
          : h('div', {
            class: 'vxe-menu--item-link-title',
            title
          }, titleSlot ? callSlot(titleSlot, params) : title),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-link-collapse',
            onClick (evnt: MouseEvent) {
              handleClickIconCollapse(evnt, item, itemList)
            }
          }, [
            h('i', {
              class: isExpand ? getIcon().MENU_ITEM_EXPAND_OPEN : getIcon().MENU_ITEM_EXPAND_CLOSE
            })
          ])
          : renderEmptyElement($xeMenu)
      ]
    }

    const renderDefaultChildren = (item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]): VNode => {
      const { itemId, itemKey, level, hasChild, isActive, isExactActive, isExpand, linkUrl, routerLink, linkTarget, childList } = item
      const { isEnterCollapse } = reactData
      const { menuInitMaps } = internalData
      const isCollapsed = computeIsCollapsed.value
      if (item.permissionCode) {
        if (!permission.checkVisible(item.permissionCode)) {
          return renderEmptyElement($xeMenu)
        }
      }
      const isExpandChild = (!isCollapsed || isEnterCollapse) && isExpand
      const linkOns = {
        onContextmenu (evnt: MouseEvent) {
          handleContextmenuEvent(evnt, item)
        },
        onClick (evnt: MouseEvent) {
          handleClickMenu(evnt, item, itemList)
        }
      }
      return h('div', {
        key: itemKey,
        class: ['vxe-menu--item-wrapper', `vxe-menu--item-level${level}`, {
          'has--child': hasChild,
          'is--exact-active': isExactActive,
          'is--active': isActive,
          'is--expand': isExpandChild
        }],
        'data-menu-id': itemId
      }, [
        linkUrl
          ? h('a', {
            class: 'vxe-menu--item-link is--link',
            href: linkUrl,
            target: linkTarget,
            ...linkOns
          }, renderMenuTitle(item, itemList))
          : (
              routerLink
                ? h(resolveComponent('router-link'), {
                  class: 'vxe-menu--item-link is--router',
                  to: routerLink,
                  target: linkTarget,
                  ...linkOns
                }, {
                  default: () => renderMenuTitle(item, itemList)
                })
                : h('div', {
                  class: 'vxe-menu--item-link is--default',
                  ...linkOns
                }, renderMenuTitle(item, itemList))
            ),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-group'
          }, isExpandChild || menuInitMaps[itemId] ? childList.map(child => renderDefaultChildren(child, childList)) : [])
          : renderEmptyElement($xeMenu)
      ])
    }

    const renderCollapseChildren = (item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]): VNode => {
      const { itemId, itemKey, level, hasChild, isActive, isExactActive, routerLink, linkUrl, linkTarget, childList } = item
      if (item.permissionCode) {
        if (!permission.checkVisible(item.permissionCode)) {
          return renderEmptyElement($xeMenu)
        }
      }
      const linkOns = {
        onContextmenu (evnt: MouseEvent) {
          handleContextmenuEvent(evnt, item)
        },
        onClick (evnt: MouseEvent) {
          handleClickMenu(evnt, item, itemList)
        }
      }
      return h('div', {
        key: itemKey,
        class: ['vxe-menu--item-wrapper', `vxe-menu--item-level${level}`, {
          'has--child': hasChild,
          'is--exact-active': isExactActive,
          'is--active': isActive
        }],
        'data-menu-id': itemId
      }, [
        linkUrl
          ? h('a', {
            class: 'vxe-menu--item-link is--link',
            href: linkUrl,
            target: linkTarget,
            ...linkOns
          }, renderMenuTitle(item, itemList))
          : (
              routerLink
                ? h(resolveComponent('router-link'), {
                  class: 'vxe-menu--item-link is--router',
                  to: routerLink,
                  target: linkTarget,
                  ...linkOns
                }, {
                  default: () => renderMenuTitle(item, itemList)
                })
                : h('div', {
                  class: 'vxe-menu--item-link is--default',
                  ...linkOns
                }, renderMenuTitle(item, itemList))
            ),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-group'
          }, childList.map(child => renderDefaultChildren(child, childList)))
          : renderEmptyElement($xeMenu)
      ])
    }

    const renderVN = () => {
      const { loading, collapseFixed, appendTo } = props
      const { initialized, menuList, collapseStyle, isEnterCollapse } = reactData
      const vSize = computeSize.value
      const isCollapsed = computeIsCollapsed.value
      const currBorder = computeCurrBorder.value
      const varStyle = computeVarStyle.value
      const headerSlot = slots.header
      const footerSlot = slots.footer
      let ons: Record<string, any> = {}
      if (collapseFixed) {
        ons = {
          onMouseenter: handleMenuMouseenter,
          onMouseleave: handleMenuMouseleave
        }
      }
      const stParams = { collapsed: isCollapsed }
      return h('div', {
        ref: refElem,
        class: ['vxe-menu', {
          [`border--${currBorder}`]: currBorder,
          [`size--${vSize}`]: vSize,
          'is--collapsed': isCollapsed,
          'is--loading': loading
        }]
      }, [
        headerSlot
          ? h('div', {
            class: 'vxe-menu--header'
          }, headerSlot(stParams))
          : renderEmptyElement($xeMenu),
        h('div', {
          class: 'vxe-menu--body'
        }, menuList.map(child => isCollapsed ? renderCollapseChildren(child, menuList) : renderDefaultChildren(child, menuList))),
        footerSlot
          ? h('div', {
            class: 'vxe-menu--footer'
          }, footerSlot(stParams))
          : renderEmptyElement($xeMenu),
        h(Teleport, {
          to: getPopupContainer(appendTo),
          disabled: !initialized
        }, [
          h('div', {
            ref: refCollapseElem,
            class: ['vxe-menu--collapse-wrapper', {
              [`size--${vSize}`]: vSize,
              'is--collapsed': isCollapsed,
              'is--enter': isEnterCollapse,
              'is--loading': loading
            }],
            style: Object.assign({}, varStyle, collapseStyle),
            ...ons
          }, isCollapsed
            ? [
                headerSlot
                  ? h('div', {
                    class: 'vxe-menu--header'
                  }, headerSlot(stParams))
                  : renderEmptyElement($xeMenu),
                h('div', {
                  class: 'vxe-menu--body'
                }, menuList.map(child => renderDefaultChildren(child, menuList))),
                footerSlot
                  ? h('div', {
                    class: 'vxe-menu--footer'
                  }, footerSlot(stParams))
                  : renderEmptyElement($xeMenu)
              ]
            : [])
        ]),
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
      nextTick(() => {
        $xeMenu.scrollToActiveMenu()
      })
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
      const { menuConfig } = props
      const VxeUIContextMenu = VxeUI.getComponent('VxeContextMenu')
      if (menuConfig && !VxeUIContextMenu) {
        errLog('vxe.error.reqComp', ['vxe-context-menu'])
      }
      globalEvents.on($xeMenu, 'resize', updateCollapseStyle)
      updateCollapseStyle()
      nextTick(() => {
        $xeMenu.scrollToActiveMenu()
      })
    })

    onBeforeUnmount(() => {
      globalEvents.off($xeMenu, 'resize')
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    reactData.initialized = !!props.collapsed
    reactData.activeName = props.modelValue
    updateMenuConfig()
    updateActiveMenu(true)

    $xeMenu.renderVN = renderVN

    return $xeMenu
  },
  render () {
    return this.renderVN()
  }
})
