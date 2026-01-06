import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getI18n, getIcon, createEvent, globalMixins, globalEvents, renderEmptyElement, GLOBAL_EVENT_KEYS } from '../../ui'
import { getLastZIndex, nextSubZIndex, nextZIndex, getFuncText } from '../../ui/src/utils'
import { getEventTargetNode, toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'

import type { ContextMenuInternalData, VxeContextMenuPropTypes, ContextMenuReactData, VxeContextMenuEmits, VxeComponentSizeType, ValueOf, VxeContextMenuDefines } from '../../../types'

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

function hasChildMenu (item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption) {
  const { children } = item as VxeContextMenuDefines.MenuFirstOption
  return children && children.some((child) => child.visible !== false)
}

function hasValidItem (item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption) {
  return !item.loading && !item.disabled && item.visible !== false
}

function findNextFirstItem (allFirstList: VxeContextMenuDefines.MenuFirstOption[], firstItem: VxeContextMenuDefines.MenuFirstOption) {
  for (let i = 0; i < allFirstList.length; i++) {
    const item = allFirstList[i]
    if (firstItem === item) {
      const nextItem = allFirstList[i + 1]
      if (nextItem) {
        return nextItem
      }
    }
  }
  return XEUtils.first(allFirstList)
}

function findPrevFirstItem (allFirstList: VxeContextMenuDefines.MenuFirstOption[], firstItem: VxeContextMenuDefines.MenuFirstOption) {
  for (let i = 0; i < allFirstList.length; i++) {
    const item = allFirstList[i]
    if (firstItem === item) {
      if (i > 0) {
        return allFirstList[i - 1]
      }
    }
  }
  return XEUtils.last(allFirstList)
}

function findFirstChildItem (firstItem: VxeContextMenuDefines.MenuFirstOption) {
  const { children } = firstItem
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const item = children[i]
      if (hasValidItem(item)) {
        return item
      }
    }
  }
  return null
}

function findPrevChildItem (firstItem: VxeContextMenuDefines.MenuFirstOption, childItem: VxeContextMenuDefines.MenuChildOption) {
  const { children } = firstItem
  let prevValidItem = null
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const item = children[i]
      if (childItem === item) {
        break
      }
      if (hasValidItem(item)) {
        prevValidItem = item
      }
    }
    if (!prevValidItem) {
      for (let len = children.length - 1; len >= 0; len--) {
        const item = children[len]
        if (hasValidItem(item)) {
          return item
        }
      }
    }
  }
  return prevValidItem
}

function findNextChildItem (firstItem: VxeContextMenuDefines.MenuFirstOption, childItem: VxeContextMenuDefines.MenuChildOption) {
  const { children } = firstItem
  let firstValidItem = null
  if (children) {
    let isMetch = false
    for (let i = 0; i < children.length; i++) {
      const item = children[i]
      if (!firstValidItem) {
        if (hasValidItem(item)) {
          firstValidItem = item
        }
      }
      if (isMetch) {
        if (hasValidItem(item)) {
          return item
        }
      } else {
        isMetch = childItem === item
      }
    }
  }
  return firstValidItem
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeContextMenu',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: Boolean as PropType<VxeContextMenuPropTypes.ModelValue>,
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
  data () {
    const internalData = createInternalData()
    const reactData = createReactData()
    return {
      xID: XEUtils.uniqueId(),
      internalData,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeMenuGroups () {
      const $xeContextMenu = this
      const props = $xeContextMenu

      const { options } = props
      return options || []
    },
    computeAllFirstMenuList () {
      const $xeContextMenu = this

      const menuGroups: VxeContextMenuDefines.MenuFirstOption[] = $xeContextMenu.computeMenuGroups
      const firstList = []
      for (let i = 0; i < menuGroups.length; i++) {
        const list = menuGroups[i]
        for (let j = 0; j < list.length; j++) {
          const firstItem = list[j]
          if (hasValidItem(firstItem)) {
            firstList.push(firstItem)
          }
        }
      }
      return firstList
    },
    computeTopAndLeft () {
      const $xeContextMenu = this
      const props = $xeContextMenu

      const { x, y } = props
      return `${x}${y}`
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeContextMenuEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeContextMenu = this
      $xeContextMenu.$emit(type, createEvent(evnt, { $contextMenu: $xeContextMenu }, params))
    },
    emitModel  (value: any) {
      const $xeContextMenu = this

      const { _events } = $xeContextMenu as any
      $xeContextMenu.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeContextMenu.$emit('modelValue', value)
      } else {
        $xeContextMenu.$emit('model-value', value)
      }
    },
    open () {
      const $xeContextMenu = this
      const props = $xeContextMenu
      const reactData = $xeContextMenu.reactData

      const { value: modelValue } = props
      const { visible } = reactData
      const value = true
      reactData.visible = value
      $xeContextMenu.updateLocate()
      $xeContextMenu.updateZindex()
      if (modelValue !== value) {
        $xeContextMenu.emitModel(value)
        $xeContextMenu.dispatchEvent('change', { value }, null)
      }
      if (visible !== value) {
        $xeContextMenu.dispatchEvent('show', { visible: value }, null)
      }
      return $xeContextMenu.$nextTick()
    },
    close () {
      const $xeContextMenu = this
      const props = $xeContextMenu
      const reactData = $xeContextMenu.reactData

      const { value: modelValue } = props
      const { visible } = reactData
      const value = false
      reactData.visible = value
      if (modelValue !== value) {
        $xeContextMenu.emitModel(value)
        $xeContextMenu.dispatchEvent('change', { value }, null)
      }
      if (visible !== value) {
        $xeContextMenu.dispatchEvent('hide', { visible: value }, null)
      }
      return $xeContextMenu.$nextTick()
    },
    updateLocate () {
      const $xeContextMenu = this
      const props = $xeContextMenu
      const reactData = $xeContextMenu.reactData

      const { x, y } = props
      const { popupStyle } = reactData
      popupStyle.left = toCssUnit(x || 0)
      popupStyle.top = toCssUnit(y || 0)
    },
    updateZindex () {
      const $xeContextMenu = this
      const props = $xeContextMenu
      const reactData = $xeContextMenu.reactData

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
    },
    handleVisible () {
      const $xeContextMenu = this
      const props = $xeContextMenu

      const { value: modelValue } = props
      if (modelValue) {
        $xeContextMenu.open()
      } else {
        $xeContextMenu.close()
      }
    },
    handleItemClickEvent (evnt: MouseEvent | KeyboardEvent, item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption) {
      const $xeContextMenu = this

      if (!hasChildMenu(item)) {
        $xeContextMenu.dispatchEvent('option-click', { option: item }, evnt)
        $xeContextMenu.close()
      }
    },
    handleItemMouseenterEvent (evnt: MouseEvent, item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption, parentitem?: VxeContextMenuDefines.MenuFirstOption | null) {
      const $xeContextMenu = this
      const reactData = $xeContextMenu.reactData

      reactData.activeOption = parentitem || item
      if (parentitem) {
        reactData.activeOption = parentitem
        reactData.activeChildOption = item
      } else {
        reactData.activeOption = item
        if (hasChildMenu(item)) {
          reactData.activeChildOption = findFirstChildItem(item)
        } else {
          reactData.activeChildOption = null
        }
      }
    },
    handleItemMouseleaveEvent () {
      const $xeContextMenu = this
      const reactData = $xeContextMenu.reactData

      reactData.activeOption = null
      reactData.activeChildOption = null
    },
    handleGlobalMousewheelEvent (evnt: MouseEvent) {
      const $xeContextMenu = this
      const reactData = $xeContextMenu.reactData

      const { visible } = reactData
      if (visible) {
        const el = $xeContextMenu.$refs.refElem as HTMLDivElement
        if (!getEventTargetNode(evnt, el, '').flag) {
          close()
        }
      }
    },
    handleGlobalKeydownEvent (evnt: KeyboardEvent) {
      const $xeContextMenu = this
      const reactData = $xeContextMenu.reactData

      const { visible, childPos, activeOption, activeChildOption } = reactData
      const allFirstMenuList = $xeContextMenu.computeAllFirstMenuList
      if (visible) {
        const isLeftArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_LEFT)
        const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
        const isRightArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_RIGHT)
        const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
        const isEnter = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ENTER)
        // 回车选中
        if (isEnter) {
          if (activeOption || activeChildOption) {
            evnt.preventDefault()
            evnt.stopPropagation()
            if (!activeChildOption && hasChildMenu(activeOption)) {
              reactData.activeChildOption = findFirstChildItem(activeOption)
              return
            }
            $xeContextMenu.handleItemClickEvent(evnt, activeChildOption || activeOption)
            return
          }
        }
        // 方向键操作
        if (activeChildOption) {
          if (isUpArrow) {
            evnt.preventDefault()
            reactData.activeChildOption = findPrevChildItem(activeOption, activeChildOption)
          } else if (isDwArrow) {
            evnt.preventDefault()
            reactData.activeChildOption = findNextChildItem(activeOption, activeChildOption)
          } else if (isLeftArrow) {
            evnt.preventDefault()
            if (childPos === 'left') {
              // 无操作
            } else {
              reactData.activeChildOption = null
            }
          } else if (isRightArrow) {
            evnt.preventDefault()
            if (childPos === 'left') {
              reactData.activeChildOption = null
            } else {
              // 无操作
            }
          }
        } else if (activeOption) {
          if (isUpArrow) {
            evnt.preventDefault()
            reactData.activeOption = findPrevFirstItem(allFirstMenuList, activeOption)
          } else if (isDwArrow) {
            evnt.preventDefault()
            reactData.activeOption = findNextFirstItem(allFirstMenuList, activeOption)
          } else {
            evnt.preventDefault()
            if (hasChildMenu(activeOption)) {
              if (childPos === 'left') {
                if (isLeftArrow) {
                  reactData.activeChildOption = findFirstChildItem(activeOption)
                }
              } else {
                if (isRightArrow) {
                  reactData.activeChildOption = findFirstChildItem(activeOption)
                }
              }
            }
          }
        } else {
          evnt.preventDefault()
          reactData.activeOption = XEUtils.first(allFirstMenuList)
        }
      }
    },
    handleGlobalMousedownEvent (evnt: MouseEvent) {
      const $xeContextMenu = this
      const reactData = $xeContextMenu.reactData

      const { visible } = reactData
      if (visible) {
        const el = $xeContextMenu.$refs.refElem as HTMLDivElement
        if (!getEventTargetNode(evnt, el, '').flag) {
          $xeContextMenu.close()
        }
      }
    },
    handleGlobalBlurEvent () {
      const $xeContextMenu = this
      const reactData = $xeContextMenu.reactData

      const { visible } = reactData
      if (visible) {
        close()
      }
    },

    //
    // Render
    //
    renderMenuItem (h: CreateElement, item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption, parentItem: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption | null, hasChildMenus?: boolean) {
      const $xeContextMenu = this

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
        on: {
          click (evnt: MouseEvent) {
            $xeContextMenu.handleItemClickEvent(evnt, item)
          },
          mouseenter (evnt: MouseEvent) {
            $xeContextMenu.handleItemMouseenterEvent(evnt, item, parentItem)
          },
          mouseleave: $xeContextMenu.handleItemMouseleaveEvent
        }
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
    },
    renderMenus (h: CreateElement) {
      const $xeContextMenu = this
      const reactData = $xeContextMenu.reactData

      const { activeOption, activeChildOption } = reactData
      const menuGroups = $xeContextMenu.computeMenuGroups
      const mgVNs: VNode[] = []
      menuGroups.forEach((menuList, gIndex) => {
        const moVNs: VNode[] = []
        menuList.forEach((firstItem, i) => {
          const { children } = firstItem
          const hasChildMenus = children && children.some((child) => child.visible !== false)
          const isActiveFirst = activeOption === firstItem
          moVNs.push(
            h('div', {
              key: `${gIndex}_${i}`,
              class: ['vxe-context-menu--item-wrapper vxe-context-menu--first-item', firstItem.className || '', {
                'is--active': isActiveFirst,
                'is--subactive': isActiveFirst && !!activeChildOption
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
                    $xeContextMenu.renderMenuItem(h, twoItem, firstItem)
                  ])
                }))
                : renderEmptyElement($xeContextMenu),
              $xeContextMenu.renderMenuItem(h, firstItem, null, hasChildMenus)
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
    },
    renderVN (h: CreateElement): VNode {
      const $xeContextMenu = this
      const props = $xeContextMenu
      const reactData = $xeContextMenu.reactData

      const { className, position, destroyOnClose } = props
      const { visible, popupStyle, childPos } = reactData
      const vSize = $xeContextMenu.computeSize
      return h('div', {
        ref: 'refElem',
        class: ['vxe-context-menu vxe-context-menu--wrapper', position === 'absolute' ? ('is--' + position) : 'is--fixed', `cp--${childPos === 'left' ? childPos : 'right'}`, className || '', {
          [`size--${vSize}`]: vSize,
          'is--visible': visible
        }],
        style: popupStyle
      }, (destroyOnClose ? visible : true) ? $xeContextMenu.renderMenus(h) : [])
    }
  },
  watch: {
    value () {
      const $xeContextMenu = this

      $xeContextMenu.handleVisible()
    },
    computeTopAndLeft () {
      const $xeContextMenu = this

      $xeContextMenu.updateLocate()
    }
  },
  created () {
    const $xeContextMenu = this

    $xeContextMenu.handleVisible()
    globalEvents.on($xeContextMenu, 'mousewheel', $xeContextMenu.handleGlobalMousewheelEvent)
    globalEvents.on($xeContextMenu, 'keydown', $xeContextMenu.handleGlobalKeydownEvent)
    globalEvents.on($xeContextMenu, 'mousedown', $xeContextMenu.handleGlobalMousedownEvent)
    globalEvents.on($xeContextMenu, 'blur', $xeContextMenu.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeContextMenu = this
    const reactData = $xeContextMenu.reactData
    const internalData = $xeContextMenu.internalData

    globalEvents.off($xeContextMenu, 'mousewheel')
    globalEvents.off($xeContextMenu, 'keydown')
    globalEvents.off($xeContextMenu, 'mousedown')
    globalEvents.off($xeContextMenu, 'blur')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
