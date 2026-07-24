import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, createEvent, permission, globalMixins, globalEvents, renderEmptyElement } from '../../ui'
import { getPopupContainer, scrollToView, toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, isEnableConf } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import { createComponentLog } from '../../ui/src/log'
import VxeLoadingComponent from '../../loading'

import type { VxeMenuDefines, MenuInternalData, MenuReactData, VxeMenuPropTypes, VxeLayoutAsideConstructor, VxeMenuEmits, VxeLayoutAsidePropTypes, VxeComponentPermissionInfo, VxeComponentSizeType, ValueOf } from '../../../types'

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

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeMenu',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [String, Number] as PropType<VxeMenuPropTypes.ModelValue>,
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
  inject: {
    $xeLayoutAside: {
      default: null
    }
  },
  data () {
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: MenuInternalData,
      }),
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computePermissionInfo(): VxeComponentPermissionInfo
      computeSize(): VxeComponentSizeType
      $xeLayoutAside(): VxeLayoutAsideConstructor | null
    }),
    computePropsOpts () {
      const $xeMenu = this
      const props = $xeMenu

      return Object.assign({}, getConfig().menu.optionProps, props.optionProps)
    },
    computeTitleField () {
      const $xeMenu = this

      const propsOpts = $xeMenu.computePropsOpts as VxeMenuPropTypes.OptionProps
      return propsOpts.title || 'title'
    },
    computeKeyField () {
      const $xeMenu = this

      const propsOpts = $xeMenu.computePropsOpts as VxeMenuPropTypes.OptionProps
      return propsOpts.name || 'name'
    },
    computeChildrenField () {
      const $xeMenu = this

      const propsOpts = $xeMenu.computePropsOpts as VxeMenuPropTypes.OptionProps
      return propsOpts.children || 'children'
    },
    computeLinkUrlField () {
      const $xeMenu = this

      const propsOpts = $xeMenu.computePropsOpts as VxeMenuPropTypes.OptionProps
      return propsOpts.linkUrl || 'linkUrl'
    },
    computeRouterLinkField () {
      const $xeMenu = this

      const propsOpts = $xeMenu.computePropsOpts as VxeMenuPropTypes.OptionProps
      return propsOpts.routerLink || 'routerLink'
    },
    computeCurrBorder () {
      const $xeMenu = this
      const props = $xeMenu

      const { border } = props
      if (border) {
        return border === true ? 'first-group' : border
      }
      return ''
    },
    computeMenuOpts () {
      const $xeMenu = this
      const props = $xeMenu

      return Object.assign({}, getConfig().tree.menuConfig, props.menuConfig)
    },
    computeIsCollapsed  () {
      const $xeMenu = this
      const $xeLayoutAside = $xeMenu.$xeLayoutAside
      const { collapsed } = $xeMenu
      if (XEUtils.isBoolean(collapsed)) {
        return collapsed
      }
      if ($xeLayoutAside) {
        return !!$xeLayoutAside.collapsed
      }
      return false
    },
    computeVarStyle () {
      const $xeMenu = this
      const $xeLayoutAside = $xeMenu.$xeLayoutAside

      if ($xeLayoutAside) {
        const asideVarStyle = $xeLayoutAside.computeVarStyle
        return asideVarStyle
      }
      return {}
    },
    computeCollapseEnterWidth () {
      const $xeMenu = this
      const $xeLayoutAside = $xeMenu.$xeLayoutAside

      let width: VxeLayoutAsidePropTypes.Width = ''
      if ($xeLayoutAside) {
        width = $xeLayoutAside.width || ''
      }
      return width
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeMenuEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeMenu = this
      $xeMenu.$emit(type, createEvent(evnt, { $menu: $xeMenu }, params))
    },
    emitModel  (value: any) {
      const $xeMenu = this
      const reactData = $xeMenu.reactData

      const { _events } = $xeMenu as any
      reactData.activeName = value
      $xeMenu.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeMenu.$emit('modelValue', value)
      } else {
        $xeMenu.$emit('model-value', value)
      }
    },
    callSlot (slotFunc: any, params: any, h: CreateElement) {
      const $xeMenu = this
      const slots = $xeMenu.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc.call($xeMenu, params, h))
        }
      }
      return []
    },
    setExpandByMenuKey (menuKeys: string | number | (string | number)[], expanded: boolean) {
      const $xeMenu = this
      const internalData = $xeMenu.internalData

      const { menuKeyMaps, menuInitMaps } = internalData
      if (menuKeys) {
        if (!XEUtils.isArray(menuKeys)) {
          menuKeys = [menuKeys]
        }
        menuKeys.forEach((mKey) => {
          const menuItem = menuKeyMaps[mKey]
          if (menuItem) {
            if (expanded) {
              menuInitMaps[menuItem.itemId] = true
            }
            menuItem.isExpand = !!expanded
          }
        })
      }
      return $xeMenu.$nextTick()
    },
    clearAllExpandMenu () {
      const $xeMenu = this
      const reactData = $xeMenu.reactData
      const internalData = $xeMenu.internalData

      const { menuList } = reactData
      XEUtils.eachTree(menuList, (item) => {
        item.isExpand = false
      }, { children: 'childList' })
      internalData.menuInitMaps = {}
      return $xeMenu.$nextTick()
    },
    handleScrollToView (itemId: number) {
      const $xeMenu = this

      const el = $xeMenu.$refs.refElem as HTMLDivElement
      const nemuEl = el ? el.querySelector<HTMLDivElement>(`.vxe-menu--item-wrapper[data-menu-id="${itemId}"]`) : null
      if (nemuEl) {
        scrollToView(nemuEl)
        return true
      }
      return false
    },
    scrollToMenuKey (menuKey: string | number) {
      const $xeMenu = this
      const internalData = $xeMenu.internalData

      const { menuKeyMaps } = internalData
      const menuItem = menuKeyMaps[menuKey]
      if (!menuItem) {
        return $xeMenu.$nextTick()
      }
      const { itemId } = menuItem
      if ($xeMenu.handleScrollToView(itemId)) {
        return $xeMenu.$nextTick()
      }
      return $xeMenu.$nextTick().then(() => {
        $xeMenu.handleScrollToView(itemId)
      })
    },
    scrollToActiveMenu () {
      const $xeMenu = this
      const reactData = $xeMenu.reactData

      const { activeName } = reactData
      if (activeName) {
        return $xeMenu.scrollToMenuKey(activeName)
      }
      return $xeMenu.$nextTick().then(() => {
        const { activeName } = reactData
        if (activeName) {
          return $xeMenu.scrollToMenuKey(activeName)
        }
      })
    },
    getMenuTitle  (item: VxeMenuPropTypes.MenuOption) {
      return `${item.title || item.name}`
    },
    updateZindex  () {
      const $xeMenu = this
      const reactData = $xeMenu.reactData

      if (reactData.collapseZindex < getLastZIndex()) {
        reactData.collapseZindex = nextZIndex()
      }
    },
    updateActiveMenu  (isDefExpand?: boolean) {
      const $xeMenu = this
      const reactData = $xeMenu.reactData
      const internalData = $xeMenu.internalData

      const { activeName } = reactData
      const { menuInitMaps } = internalData
      XEUtils.eachTree(reactData.menuList, (item, index, items, path, parent, nodes) => {
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
    },
    updateMenuConfig  () {
      const $xeMenu = this
      const props = $xeMenu
      const reactData = $xeMenu.reactData
      const internalData = $xeMenu.internalData

      const { options, expandAll, expandKeys } = props
      const muInitMaps: Record<string, boolean> = {}
      const titleField = $xeMenu.computeTitleField
      const keyField = $xeMenu.computeKeyField
      const childrenField = $xeMenu.computeChildrenField
      const linkUrlField = $xeMenu.computeLinkUrlField
      const routerLinkField = $xeMenu.computeRouterLinkField
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
    },
    updateCollapseStyle  () {
      const $xeMenu = this
      const props = $xeMenu
      const reactData = $xeMenu.reactData

      const { collapseFixed } = props
      if (collapseFixed) {
        $xeMenu.$nextTick(() => {
          const isCollapsed = $xeMenu.computeIsCollapsed
          const el = $xeMenu.$refs.refElem as HTMLDivElement
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
    },
    handleCollapseMenu () {
      const $xeMenu = this
      const props = $xeMenu
      const reactData = $xeMenu.reactData

      const { collapseFixed, appendTo } = props
      if (collapseFixed) {
        const { initialized } = reactData
        const isCollapsed = $xeMenu.computeIsCollapsed
        if (isCollapsed) {
          if (!initialized) {
            reactData.initialized = true
            $xeMenu.$nextTick(() => {
              const collapseEl = $xeMenu.$refs.refCollapseElem as HTMLDivElement
              if (collapseEl) {
                getPopupContainer(appendTo).appendChild(collapseEl)
              }
            })
          }
        }
        reactData.isEnterCollapse = false
        $xeMenu.updateZindex()
        $xeMenu.updateCollapseStyle()
      }
    },
    handleClickIconCollapse  (evnt: MouseEvent, item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]) {
      const $xeMenu = this
      const props = $xeMenu
      const internalData = $xeMenu.internalData

      const { accordion } = props
      const { menuEffectMaps, menuInitMaps } = internalData
      const { itemId, hasChild, isExpand } = item
      const isCollapsed = $xeMenu.computeIsCollapsed
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

        const wrapperEl = isCollapsed ? $xeMenu.$refs.refCollapseElem as HTMLDivElement : $xeMenu.$refs.refElem as HTMLDivElement
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
    },
    handleContextmenuEvent (evnt: MouseEvent, item: VxeMenuDefines.MenuItem) {
      const $xeMenu = this
      const props = $xeMenu

      const { menuConfig } = props
      const menuOpts = $xeMenu.computeMenuOpts
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
                  $xeMenu.dispatchEvent('menu-click', params, eventParams.$event)
                }
              }
            })
          }
        }
      }
      $xeMenu.dispatchEvent('option-menu', { currentMenu: item }, evnt)
    },
    handleClickMenu (evnt: MouseEvent, item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]) {
      const $xeMenu = this
      const reactData = $xeMenu.reactData
      const internalData = $xeMenu.internalData

      const { itemKey, linkUrl, routerLink, hasChild } = item
      if (linkUrl || routerLink) {
        $xeMenu.emitModel(itemKey)
        reactData.isEnterCollapse = false
        internalData.lastActiveTime = Date.now()
      } else {
        if (hasChild) {
          $xeMenu.handleClickIconCollapse(evnt, item, itemList)
        } else {
          $xeMenu.emitModel(itemKey)
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
      $xeMenu.dispatchEvent('click', params, evnt)
    },
    handleMenuMouseenter  () {
      const $xeMenu = this
      const reactData = $xeMenu.reactData
      const internalData = $xeMenu.internalData

      const { lastActiveTime } = internalData

      if (lastActiveTime < Date.now() - 500) {
        reactData.isEnterCollapse = true
      }
    },
    handleMenuMouseleave  () {
      const $xeMenu = this
      const reactData = $xeMenu.reactData

      reactData.isEnterCollapse = false
    },

    //
    //
    // Render
    //
    renderMenuTitle (h:CreateElement, item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]) {
      const $xeMenu = this
      const slots = $xeMenu.$scopedSlots

      const { icon, isExpand, hasChild } = item
      const itemSlots = item.slots || {}
      const optionSlot = itemSlots.default || slots.option
      const titleSlot = itemSlots.title || slots.optionTitle || slots['option-title']
      const iconSlot = itemSlots.icon || slots.optionIcon || slots['option-icon']
      const title = $xeMenu.getMenuTitle(item)
      const isCollapsed = $xeMenu.computeIsCollapsed
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
            ? $xeMenu.callSlot(iconSlot, params, h)
            : (icon
                ? [h('i', {
                    class: icon
                  })]
                : [])),
        optionSlot
          ? h('div', {
            class: 'vxe-menu--item-custom-title'
          }, $xeMenu.callSlot(optionSlot, params, h))
          : h('div', {
            class: 'vxe-menu--item-link-title',
            attrs: {
              title
            }
          }, titleSlot ? $xeMenu.callSlot(titleSlot, params, h) : title),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-link-collapse',
            on: {
              click (evnt: MouseEvent) {
                $xeMenu.handleClickIconCollapse(evnt, item, itemList)
              }
            }
          }, [
            h('i', {
              class: isExpand ? getIcon().MENU_ITEM_EXPAND_OPEN : getIcon().MENU_ITEM_EXPAND_CLOSE
            })
          ])
          : renderEmptyElement($xeMenu)
      ]
    },
    renderDefaultChildren  (h: CreateElement, item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]): VNode {
      const $xeMenu = this
      const reactData = $xeMenu.reactData
      const internalData = $xeMenu.internalData

      const { itemId, itemKey, level, hasChild, isActive, isExactActive, isExpand, linkUrl, routerLink, linkTarget, childList } = item
      const { isEnterCollapse } = reactData
      const { menuInitMaps } = internalData
      const isCollapsed = $xeMenu.computeIsCollapsed
      if (item.permissionCode) {
        if (!permission.checkVisible(item.permissionCode)) {
          return renderEmptyElement($xeMenu)
        }
      }
      const isExpandChild = (!isCollapsed || isEnterCollapse) && isExpand
      const linkOns = {
        contextmenu (evnt: MouseEvent) {
          $xeMenu.handleContextmenuEvent(evnt, item)
        },
        click (evnt: MouseEvent) {
          $xeMenu.handleClickMenu(evnt, item, itemList)
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
        attrs: {
          'data-menu-id': itemId
        }
      }, [
        linkUrl
          ? h('a', {
            class: 'vxe-menu--item-link is--link',
            attrs: {
              href: linkUrl,
              target: linkTarget
            },
            on: linkOns
          }, $xeMenu.renderMenuTitle(h, item, itemList))
          : (
              routerLink
                ? h('router-link', {
                  class: 'vxe-menu--item-link is--router',
                  props: {
                    custom: true,
                    to: routerLink,
                    target: linkTarget
                  },
                  nativeOn: linkOns
                }, $xeMenu.renderMenuTitle(h, item, itemList))
                : h('div', {
                  class: 'vxe-menu--item-link is--default',
                  on: linkOns
                }, $xeMenu.renderMenuTitle(h, item, itemList))
            ),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-group'
          }, isExpandChild || menuInitMaps[itemId] ? childList.map(child => $xeMenu.renderDefaultChildren(h, child, childList)) : [])
          : renderEmptyElement($xeMenu)
      ])
    },
    renderCollapseChildren (h: CreateElement, item: VxeMenuDefines.MenuItem, itemList: VxeMenuDefines.MenuItem[]): VNode {
      const $xeMenu = this

      const { itemId, itemKey, level, hasChild, isActive, isExactActive, routerLink, linkUrl, linkTarget, childList } = item
      if (item.permissionCode) {
        if (!permission.checkVisible(item.permissionCode)) {
          return renderEmptyElement($xeMenu)
        }
      }
      const linkOns = {
        contextmenu (evnt: MouseEvent) {
          $xeMenu.handleContextmenuEvent(evnt, item)
        },
        click (evnt: MouseEvent) {
          $xeMenu.handleClickMenu(evnt, item, itemList)
        }
      }
      return h('div', {
        key: itemKey,
        class: ['vxe-menu--item-wrapper', `vxe-menu--item-level${level}`, {
          'has--child': hasChild,
          'is--exact-active': isExactActive,
          'is--active': isActive
        }],
        attrs: {
          'data-menu-id': itemId
        }
      }, [
        linkUrl
          ? h('a', {
            class: 'vxe-menu--item-link is--link',
            attrs: {
              href: linkUrl,
              target: linkTarget
            },
            on: linkOns
          }, $xeMenu.renderMenuTitle(h, item, itemList))
          : (
              routerLink
                ? h('router-link', {
                  class: 'vxe-menu--item-link is--router',
                  props: {
                    custom: true,
                    to: routerLink,
                    target: linkTarget
                  },
                  nativeOn: linkOns
                }, $xeMenu.renderMenuTitle(h, item, itemList))
                : h('div', {
                  class: 'vxe-menu--item-link is--default',
                  on: linkOns
                }, $xeMenu.renderMenuTitle(h, item, itemList))
            ),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-group'
          }, childList.map(child => $xeMenu.renderDefaultChildren(h, child, childList)))
          : renderEmptyElement($xeMenu)
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeMenu = this
      const props = $xeMenu
      const slots = $xeMenu.$scopedSlots
      const reactData = $xeMenu.reactData

      const { loading, collapseFixed } = props
      const { initialized, menuList, collapseStyle, isEnterCollapse } = reactData
      const vSize = $xeMenu.computeSize
      const isCollapsed = $xeMenu.computeIsCollapsed
      const currBorder = $xeMenu.computeCurrBorder
      const varStyle = $xeMenu.computeVarStyle
      const headerSlot = slots.header
      const footerSlot = slots.footer
      let ons: Record<string, any> = {}
      if (collapseFixed) {
        ons = {
          mouseenter: $xeMenu.handleMenuMouseenter,
          mouseleave: $xeMenu.handleMenuMouseleave
        }
      }
      const stParams = { collapsed: isCollapsed }
      return h('div', {
        ref: 'refElem',
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
        }, menuList.map(child => isCollapsed ? $xeMenu.renderCollapseChildren(h, child, menuList) : $xeMenu.renderDefaultChildren(h, child, menuList))),
        footerSlot
          ? h('div', {
            class: 'vxe-menu--footer'
          }, footerSlot(stParams))
          : renderEmptyElement($xeMenu),
        initialized
          ? h('div', {
            ref: 'refCollapseElem',
            class: ['vxe-menu--collapse-wrapper', {
              [`size--${vSize}`]: vSize,
              'is--collapsed': isCollapsed,
              'is--enter': isEnterCollapse,
              'is--loading': loading
            }],
            style: Object.assign({}, varStyle, collapseStyle),
            on: ons
          }, isCollapsed
            ? [
                headerSlot
                  ? h('div', {
                    class: 'vxe-menu--header'
                  }, headerSlot(stParams))
                  : renderEmptyElement($xeMenu),
                h('div', {
                  class: 'vxe-menu--body'
                }, menuList.map(child => $xeMenu.renderDefaultChildren(h, child, menuList))),
                footerSlot
                  ? h('div', {
                    class: 'vxe-menu--footer'
                  }, footerSlot(stParams))
                  : renderEmptyElement($xeMenu)
              ]
            : [])
          : renderEmptyElement($xeMenu),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-list-view--loading',
          props: {
            value: loading
          }
        })
      ])
    }
  },
  watch: {
    value (val) {
      const $xeMenu = this
      const reactData = $xeMenu.reactData
      reactData.activeName = val
    },
    options () {
      const $xeMenu = this
      $xeMenu.updateMenuConfig()
      $xeMenu.updateActiveMenu(true)
      $xeMenu.$nextTick(() => {
        $xeMenu.scrollToActiveMenu()
      })
    },
    'reactData.activeName' () {
      const $xeMenu = this
      $xeMenu.updateActiveMenu(true)
    },
    computeIsCollapsed () {
      const $xeMenu = this

      $xeMenu.handleCollapseMenu()
    }
  },
  created () {
    const $xeMenu = this
    const props = $xeMenu

    $xeMenu.internalData = createInternalData()

    const reactData = $xeMenu.reactData
    reactData.initialized = !!props.collapsed
    reactData.activeName = props.value
    $xeMenu.updateMenuConfig()
    $xeMenu.updateActiveMenu(true)
  },
  mounted () {
    const $xeMenu = this
    const props = $xeMenu

    const { menuConfig } = props
    const VxeUIContextMenu = VxeUI.getComponent('VxeContextMenu')
    if (menuConfig && !VxeUIContextMenu) {
      errLog('vxe.error.reqComp', ['vxe-context-menu'])
    }
    $xeMenu.updateCollapseStyle()
    globalEvents.on($xeMenu, 'resize', $xeMenu.updateCollapseStyle)
    $xeMenu.$nextTick(() => {
      $xeMenu.scrollToActiveMenu()
    })
  },
  beforeDestroy () {
    const $xeMenu = this
    const reactData = $xeMenu.reactData
    const internalData = $xeMenu.internalData

    const collapseEl = $xeMenu.$refs.refCollapseElem as HTMLDivElement
    if (collapseEl) {
      const parentNode = collapseEl.parentNode
      if (parentNode) {
        parentNode.removeChild(collapseEl)
      }
    }
    globalEvents.off($xeMenu, 'resize')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
