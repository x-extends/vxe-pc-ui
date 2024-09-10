import { defineComponent, ref, h, reactive, PropType, inject, resolveComponent, createCommentVNode, nextTick, watch, VNode, onMounted, computed } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, permission, useSize } from '../../ui'
import VxeLoadingComponent from '../../loading/index'

import type { VxeMenuDefines, VxeMenuPropTypes, MenuReactData, VxeMenuEmits, MenuMethods, MenuPrivateMethods, MenuPrivateRef, VxeMenuPrivateComputed, VxeMenuConstructor, VxeMenuPrivateMethods, ValueOf, VxeLayoutAsideConstructor, VxeLayoutAsidePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeMenu',
  props: {
    modelValue: [String, Number] as PropType<VxeMenuPropTypes.ModelValue>,
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
  emits: [
    'update:modelValue',
    'click'
  ] as VxeMenuEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const $xeLayoutAside = inject<(VxeLayoutAsideConstructor & VxeLayoutAsidePrivateMethods) | null>('$xeLayoutAside', null)

    const refElem = ref<HTMLDivElement>()
    const refWrapperElem = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

    const reactData = reactive<MenuReactData>({
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
        return $xeLayoutAside.props.collapsed
      }
      return false
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

    const updateItemHeight = () => {
      const wrapperElem = refWrapperElem.value
      const childEls = wrapperElem ? wrapperElem.children : []
      if (childEls.length) {
        reactData.itemHeight = (childEls[0] as HTMLDivElement).offsetHeight
      }
    }

    const getExpandChildSize = (item: VxeMenuDefines.MenuItem) => {
      let size = 0
      if (item.isExpand) {
        item.childList.forEach(child => {
          size += getExpandChildSize(child) + 1
        })
      }
      return size
    }

    const updateStyle = () => {
      XEUtils.eachTree(reactData.menuList, (item) => {
        if (item.hasChild && item.isExpand) {
          item.childHeight = getExpandChildSize(item) * reactData.itemHeight
        } else {
          item.childHeight = 0
        }
      }, { children: 'childList' })
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
          hasChild: item.children && item.children.length > 0,
          childHeight: 0
        } as VxeMenuDefines.MenuItem
        return objItem
      }, { children: 'children', mapChildren: 'childList' })
    }

    const handleClickIconCollapse = (evnt: KeyboardEvent, item: VxeMenuDefines.MenuItem) => {
      const { hasChild, isExpand } = item
      if (hasChild) {
        evnt.stopPropagation()
        evnt.preventDefault()
        item.isExpand = !isExpand
        updateItemHeight()
        updateStyle()
      }
    }

    const handleClickMenu = (evnt: KeyboardEvent, item: VxeMenuDefines.MenuItem) => {
      const { routerLink, hasChild } = item
      if (routerLink) {
        const value = item.itemKey
        reactData.activeName = value
        emit('update:modelValue', value)
      } else {
        if (hasChild) {
          handleClickIconCollapse(evnt, item)
        }
      }
      dispatchEvent('click', { menu: item }, evnt)
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
      const { icon, isExpand, hasChild } = item
      const title = getMenuTitle(item)
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
          title
        }, title),
        hasChild
          ? h('span', {
            class: 'vxe-menu--item-link-collapse',
            onClick (evnt: KeyboardEvent) {
              handleClickIconCollapse(evnt, item)
            }
          }, [
            h('i', {
              class: isExpand ? getIcon().MENU_ITEM_EXPAND_OPEN : getIcon().MENU_ITEM_EXPAND_CLOSE
            })
          ])
          : createCommentVNode()
      ]
    }

    const renderChildren = (item: VxeMenuDefines.MenuItem): VNode => {
      const { itemKey, level, hasChild, isActive, isExactActive, isExpand, routerLink, childList } = item
      const isCollapsed = computeIsCollapsed.value
      if (item.permissionCode) {
        if (!permission.checkVisible(item.permissionCode)) {
          return createCommentVNode()
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
            class: 'vxe-menu--item-group',
            style: {
              // height: `${childHeight}px`
            }
          }, childList.map(child => renderChildren(child)))
          : createCommentVNode()
      ])
    }

    const renderVN = () => {
      const { loading } = props
      const { menuList } = reactData
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
          ref: refWrapperElem,
          class: 'vxe-menu--item-list'
        }, menuList.map(child => renderChildren(child))),
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

    onMounted(() => {
      nextTick(() => {
        updateItemHeight()
      })
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
