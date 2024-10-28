import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, permission, globalMixins, globalEvents, renderEmptyElement } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import VxeLoadingComponent from '../../loading/index'

import type { VxeMenuDefines, MenuReactData, VxeMenuPropTypes, VxeLayoutAsideConstructor, VxeMenuEmits, VxeLayoutAsidePropTypes, VxeComponentPermissionInfo, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeMenu',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [String, Number] as PropType<VxeMenuPropTypes.ModelValue>,
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
  inject: {
    $xeLayoutAside: {
      default: null
    }
  },
  data () {
    const reactData: MenuReactData = {
      initialized: false,
      isEnterCollapse: false,
      collapseStyle: {},
      collapseZindex: 0,
      activeName: null,
      menuList: [],
      itemHeight: 1
    }
    return {
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
    computeIsCollapsed  () {
      const $xeMenu = this
      const $xeLayoutAside = $xeMenu.$xeLayoutAside
      const { collapsed } = $xeMenu
      if (XEUtils.isBoolean(collapsed)) {
        return collapsed
      }
      if ($xeLayoutAside) {
        return $xeLayoutAside.collapsed
      }
      return false
    },
    computeCollapseWidth () {
      const $xeMenu = this
      const $xeLayoutAside = $xeMenu.$xeLayoutAside

      let collapseWidth: VxeLayoutAsidePropTypes.CollapseWidth = ''
      if ($xeLayoutAside) {
        collapseWidth = $xeLayoutAside.collapseWidth || ''
      }
      return collapseWidth
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
    },
    updateMenuConfig  () {
      const $xeMenu = this
      const props = $xeMenu
      const reactData = $xeMenu.reactData

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
    },
    updateCollapseStyle  () {
      const $xeMenu = this
      const props = $xeMenu
      const reactData = $xeMenu.reactData

      const { collapseFixed } = props
      if (collapseFixed) {
        $xeMenu.$nextTick(() => {
          const { isEnterCollapse } = reactData
          const isCollapsed = $xeMenu.computeIsCollapsed
          const collapseEnterWidth = $xeMenu.computeCollapseEnterWidth
          const collapseWidth = $xeMenu.computeCollapseWidth
          const el = $xeMenu.$refs.refElem as HTMLDivElement
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
    },
    handleCollapseMenu () {
      const $xeMenu = this
      const props = $xeMenu
      const reactData = $xeMenu.reactData

      const { collapseFixed } = props
      if (collapseFixed) {
        const { initialized } = reactData
        const isCollapsed = $xeMenu.computeIsCollapsed
        if (isCollapsed) {
          if (!initialized) {
            reactData.initialized = true
            $xeMenu.$nextTick(() => {
              const collapseEl = $xeMenu.$refs.refCollapseElem as HTMLDivElement
              if (collapseEl) {
                document.body.appendChild(collapseEl)
              }
            })
          }
        }
        reactData.isEnterCollapse = false
        $xeMenu.updateZindex()
        $xeMenu.updateCollapseStyle()
      }
    },
    handleClickIconCollapse  (evnt: KeyboardEvent, item: VxeMenuDefines.MenuItem) {
      const { hasChild, isExpand } = item
      if (hasChild) {
        evnt.stopPropagation()
        evnt.preventDefault()
        item.isExpand = !isExpand
      }
    },
    handleClickMenu (evnt: KeyboardEvent, item: VxeMenuDefines.MenuItem) {
      const $xeMenu = this

      const { itemKey, routerLink, hasChild } = item
      if (routerLink) {
        $xeMenu.emitModel(itemKey)
      } else {
        if (hasChild) {
          $xeMenu.handleClickIconCollapse(evnt, item)
        } else {
          $xeMenu.emitModel(itemKey)
        }
      }
      $xeMenu.dispatchEvent('click', { menu: item }, evnt)
    },
    handleMenuMouseenter  () {
      const $xeMenu = this
      const reactData = $xeMenu.reactData

      const { collapseStyle } = reactData
      const collapseEnterWidth = $xeMenu.computeCollapseEnterWidth
      reactData.collapseStyle = Object.assign({}, collapseStyle, {
        width: collapseEnterWidth ? toCssUnit(collapseEnterWidth) : ''
      })
      reactData.isEnterCollapse = true
    },
    handleMenuMouseleave  () {
      const $xeMenu = this
      const reactData = $xeMenu.reactData

      const { collapseStyle } = reactData
      const el = this.$refs.refElem as HTMLDivElement
      reactData.collapseStyle = Object.assign({}, collapseStyle, {
        width: el ? toCssUnit(el.offsetWidth) : ''
      })
      reactData.isEnterCollapse = false
    },

    //
    //
    // Render
    //
    renderMenuTitle (h:CreateElement, item: VxeMenuDefines.MenuItem) {
      const $xeMenu = this

      const { icon, isExpand, hasChild } = item
      const title = $xeMenu.getMenuTitle(item)
      return [
        h('span', {
          class: 'vxe-menu--item-link-icon'
        }, icon
          ? [
              h('i', {
                class: icon
              })
            ]
          : []),
        h('span', {
          class: 'vxe-menu--item-link-title',
          attrs: {
            title
          }
        }, title),
        hasChild
          ? h('span', {
            class: 'vxe-menu--item-link-collapse',
            on: {
              click (evnt: KeyboardEvent) {
                $xeMenu.handleClickIconCollapse(evnt, item)
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
    renderDefaultChildren  (h: CreateElement, item: VxeMenuDefines.MenuItem): VNode {
      const $xeMenu = this
      const reactData = $xeMenu.reactData

      const { itemKey, level, hasChild, isActive, isExactActive, isExpand, routerLink, childList } = item
      const { isEnterCollapse } = reactData
      const isCollapsed = $xeMenu.computeIsCollapsed
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
          ? h('router-link', {
            class: 'vxe-menu--item-link',
            props: {
              custom: true,
              to: routerLink
            },
            on: {
              click (evnt: KeyboardEvent) {
                $xeMenu.handleClickMenu(evnt, item)
              }
            }
          }, $xeMenu.renderMenuTitle(h, item))
          : h('div', {
            class: 'vxe-menu--item-link',
            on: {
              click (evnt: KeyboardEvent) {
                $xeMenu.handleClickMenu(evnt, item)
              }
            }
          }, $xeMenu.renderMenuTitle(h, item)),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-group'
          }, childList.map(child => $xeMenu.renderDefaultChildren(h, child)))
          : renderEmptyElement($xeMenu)
      ])
    },
    renderCollapseChildren (h: CreateElement, item: VxeMenuDefines.MenuItem): VNode {
      const $xeMenu = this

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
          ? h('router-link', {
            class: 'vxe-menu--item-link',
            props: {
              custom: true,
              to: routerLink
            },
            on: {
              click (evnt: KeyboardEvent) {
                $xeMenu.handleClickMenu(evnt, item)
              }
            }
          }, $xeMenu.renderMenuTitle(h, item))
          : h('div', {
            class: 'vxe-menu--item-link',
            on: {
              click (evnt: KeyboardEvent) {
                $xeMenu.handleClickMenu(evnt, item)
              }
            }
          }, $xeMenu.renderMenuTitle(h, item)),
        hasChild
          ? h('div', {
            class: 'vxe-menu--item-group'
          }, childList.map(child => $xeMenu.renderDefaultChildren(h, child)))
          : renderEmptyElement($xeMenu)
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeMenu = this
      const props = $xeMenu
      const reactData = $xeMenu.reactData

      const { loading } = props
      const { initialized, menuList, collapseStyle, isEnterCollapse } = reactData
      const vSize = $xeMenu.computeSize
      const isCollapsed = $xeMenu.computeIsCollapsed

      return h('div', {
        ref: 'refElem',
        class: ['vxe-menu', {
          [`size--${vSize}`]: vSize,
          'is--collapsed': isCollapsed,
          'is--loading': loading
        }]
      }, [
        h('div', {
          class: 'vxe-menu--item-list'
        }, menuList.map(child => isCollapsed ? $xeMenu.renderCollapseChildren(h, child) : $xeMenu.renderDefaultChildren(h, child))),
        initialized
          ? h('div', {
            ref: 'refCollapseElem',
            class: ['vxe-menu--collapse-wrapper', {
              [`size--${vSize}`]: vSize,
              'is--collapsed': isCollapsed,
              'is--enter': isEnterCollapse,
              'is--loading': loading
            }],
            style: collapseStyle,
            on: {
              mouseenter: $xeMenu.handleMenuMouseenter,
              mouseleave: $xeMenu.handleMenuMouseleave
            }
          }, [
            isCollapsed
              ? h('div', {
                class: 'vxe-menu--item-list'
              }, menuList.map(child => $xeMenu.renderDefaultChildren(h, child)))
              : renderEmptyElement($xeMenu)
          ])
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
  mounted () {
    const $xeMenu = this

    globalEvents.on($xeMenu, 'resize', $xeMenu.updateCollapseStyle)
    $xeMenu.updateCollapseStyle()
  },
  beforeDestroy () {
    const $xeMenu = this

    globalEvents.off($xeMenu, 'resize')
    const collapseEl = $xeMenu.$refs.refCollapseElem as HTMLDivElement
    if (collapseEl) {
      const parentNode = collapseEl.parentNode
      if (parentNode) {
        parentNode.removeChild(collapseEl)
      }
    }
  },
  created () {
    const $xeMenu = this
    const props = $xeMenu

    const reactData = $xeMenu.reactData
    reactData.initialized = !!props.collapsed
    reactData.activeName = props.value
    $xeMenu.updateMenuConfig()
    $xeMenu.updateActiveMenu(true)
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
