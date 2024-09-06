import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, permission, globalMixins, renderEmptyElement } from '../../ui'
import VxeLoadingComponent from '../../loading/index'

import type { VxeMenuDefines, MenuReactData, VxeMenuPropTypes, VxeLayoutAsideConstructor, VxeMenuEmits, VxeComponentPermissionInfo, VxeComponentSizeType, ValueOf } from '../../../types'

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
    getMenuTitle  (item: VxeMenuPropTypes.MenuOption) {
      return `${item.title || item.name}`
    },
    updateItemHeight () {
      const $xeMenu = this

      const reactData = $xeMenu.reactData
      const wrapperElem = $xeMenu.$refs.refWrapperElem as HTMLDivElement
      const childEls = wrapperElem ? wrapperElem.children : []
      if (childEls.length) {
        reactData.itemHeight = (childEls[0] as HTMLDivElement).offsetHeight
      }
    },
    getExpandChildSize  (item: VxeMenuDefines.MenuItem) {
      const $xeMenu = this
      let size = 0
      if (item.isExpand) {
        item.childList.forEach(child => {
          size += $xeMenu.getExpandChildSize(child) + 1
        })
      }
      return size
    },
    updateStyle () {
      const $xeMenu = this

      const reactData = $xeMenu.reactData
      XEUtils.eachTree(reactData.menuList, (item) => {
        if (item.hasChild && item.isExpand) {
          item.childHeight = $xeMenu.getExpandChildSize(item) * reactData.itemHeight
        } else {
          item.childHeight = 0
        }
      }, { children: 'childList' })
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
          hasChild: item.children && item.children.length > 0,
          childHeight: 0
        } as VxeMenuDefines.MenuItem
        return objItem
      }, { children: 'children', mapChildren: 'childList' })
    },
    handleClickIconCollapse  (evnt: KeyboardEvent, item: VxeMenuDefines.MenuItem) {
      const $xeMenu = this

      const { hasChild, isExpand } = item
      if (hasChild) {
        evnt.stopPropagation()
        evnt.preventDefault()
        item.isExpand = !isExpand
        $xeMenu.updateItemHeight()
        $xeMenu.updateStyle()
      }
    },
    handleClickMenu (evnt: KeyboardEvent, item: VxeMenuDefines.MenuItem) {
      const $xeMenu = this
      const reactData = $xeMenu.reactData

      const { routerLink, hasChild } = item
      if (routerLink) {
        const value = item.itemKey
        reactData.activeName = value
        $xeMenu.$emit('input', value)
        $xeMenu.$emit('modelValue', value)
      } else {
        if (hasChild) {
          $xeMenu.handleClickIconCollapse(evnt, item)
        }
      }
      $xeMenu.dispatchEvent('click', { menu: item }, evnt)
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
    renderChildren (h: CreateElement, item: VxeMenuDefines.MenuItem): VNode {
      const $xeMenu = this

      const { itemKey, level, hasChild, isActive, isExactActive, isExpand, routerLink, childList } = item
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
          'is--expand': !isCollapsed && isExpand
        }]
      }, [
        routerLink
          ? h('router-link', {
            class: 'vxe-menu--item-link',
            props: {
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
            class: 'vxe-menu--item-group',
            style: {
              // height: `${childHeight}px`
            }
          }, childList.map(child => $xeMenu.renderChildren(h, child)))
          : renderEmptyElement($xeMenu)
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeMenu = this
      const props = $xeMenu
      const reactData = $xeMenu.reactData

      const { loading } = props
      const { menuList } = reactData
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
          ref: 'refWrapperElem',
          class: 'vxe-menu--item-list'
        }, menuList.map(child => $xeMenu.renderChildren(h, child))),
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
  mounted () {
    const $xeMenu = this
    this.$nextTick(() => {
      $xeMenu.updateItemHeight()
    })
  },
  created () {
    const $xeMenu = this
    const props = $xeMenu

    const reactData = $xeMenu.reactData
    reactData.activeName = props.value
    $xeMenu.updateMenuConfig()
    $xeMenu.updateActiveMenu(true)
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
