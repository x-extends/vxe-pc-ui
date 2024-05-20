import { defineComponent, ref, h, reactive, PropType, resolveComponent, createCommentVNode, nextTick, watch, VNode, onMounted } from 'vue'
import XEUtils from 'xe-utils'
import iconConfigStore from '../../ui/src/iconStore'

import { VxeMenuDefines, VxeMenuPropTypes, MenuReactData, VxeMenuEmits, MenuPrivateRef, VxeMenuPrivateComputed, VxeMenuConstructor, VxeMenuPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeMenu',
  props: {
    modelValue: [String, Number] as PropType<VxeMenuPropTypes.ModelValue>,
    options: {
      type: Array as PropType<VxeMenuPropTypes.Options>,
      default: () => []
    }
  },
  emits: [
    'update:modelValue',
    'click'
  ] as VxeMenuEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refWrapperElem = ref<HTMLDivElement>()

    const reactData = reactive<MenuReactData>({
      activeName: props.modelValue,
      menuList: [],
      itemHeight: 1
    })

    const refMaps: MenuPrivateRef = {
      refElem
    }

    const computeMaps: VxeMenuPrivateComputed = {
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

    const updateActiveMenu = () => {
      const { activeName } = reactData
      XEUtils.eachTree(reactData.menuList, (item, index, items, path, parent, nodes) => {
        if (item.itemKey === activeName) {
          nodes.forEach(obj => {
            obj.isActive = true
          })
          item.isExactActive = true
        } else {
          item.isExactActive = false
          item.isActive = false
        }
      }, { children: 'childList' })
    }

    const updateMenuConfig = () => {
      reactData.menuList = XEUtils.mapTree(props.options, (item, index, items, path, parent) => {
        const objItem = {
          ...item,
          parentKey: parent ? (parent.name || path.slice(0, path.length - 1).join(',')) : '',
          level: path.length,
          itemKey: item.name || path.join(','),
          isExactActive: false,
          isActive: false,
          isExpand: false,
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
        reactData.activeName = item.itemKey
        updateActiveMenu()
        emit('update:modelValue', item.itemKey)
      } else {
        if (hasChild) {
          handleClickIconCollapse(evnt, item)
        }
      }
      emit('click', { $menu: $xeMenu, menu: item, $event: evnt })
    }

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
              class: isExpand ? iconConfigStore.MENU_ITEM_EXPAND_OPEN : iconConfigStore.MENU_ITEM_EXPAND_CLOSE
            })
          ])
          : createCommentVNode()
      ]
    }

    const renderChildren = (item: VxeMenuDefines.MenuItem): VNode => {
      const { itemKey, level, hasChild, isActive, isExactActive, isExpand, routerLink, childList, childHeight } = item
      return h('div', {
        key: itemKey,
        class: ['vxe-menu--item-wrapper', `vxe-menu--item-level${level}`, {
          'is--exact-active': isExactActive,
          'is--active': isActive,
          'is--expand': isExpand
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
              height: `${childHeight}px`
            }
          }, childList.map(child => renderChildren(child)))
          : createCommentVNode()
      ])
    }

    const renderVN = () => {
      const { menuList } = reactData
      return h('div', {
        ref: refElem,
        class: ['vxe-menu']
      }, [
        h('div', {
          ref: refWrapperElem,
          class: 'vxe-menu--item-list'
        }, menuList.map(child => renderChildren(child)))
      ])
    }

    $xeMenu.renderVN = renderVN

    const optFlag = ref(0)
    watch(() => props.options ? props.options.length : -1, () => {
      optFlag.value++
    })
    watch(() => props.options, () => {
      optFlag.value++
    })
    watch(optFlag, () => {
      updateMenuConfig()
    })

    watch(() => props.modelValue, (val) => {
      reactData.activeName = val
      updateActiveMenu()
    })

    onMounted(() => {
      nextTick(updateItemHeight)
    })

    updateMenuConfig()
    updateActiveMenu()

    return $xeMenu
  },
  render () {
    return this.renderVN()
  }
})
