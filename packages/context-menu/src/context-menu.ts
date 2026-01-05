import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getI18n, getIcon, createEvent, globalMixins, globalEvents, renderEmptyElement } from '../../ui'
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
    handleItemClickEvent (evnt: MouseEvent, item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption) {
      const $xeContextMenu = this

      $xeContextMenu.dispatchEvent('option-click', { option: item }, evnt)
      $xeContextMenu.close()
    },
    handleItemMouseenterEvent (evnt: MouseEvent, item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption, parentitem?: VxeContextMenuDefines.MenuFirstOption) {
      const $xeContextMenu = this
      const reactData = $xeContextMenu.reactData

      reactData.activeOption = parentitem || item
      reactData.activeChildOption = parentitem ? item : null
    },
    handleItemMouseleaveEvent () {
      const $xeContextMenu = this
      const reactData = $xeContextMenu.reactData

      reactData.activeOption = null
      reactData.activeChildOption = null
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

    //
    // Render
    //
    renderMenuItem (h: CreateElement, item: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption, hasChildMenus?: boolean) {
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
        }]
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
          moVNs.push(
            h('div', {
              key: `${gIndex}_${i}`,
              class: ['vxe-context-menu--item-wrapper vxe-context-menu--first-item', {
                'is--active': activeOption === firstItem
              }],
              on: {
                click (evnt: MouseEvent) {
                  $xeContextMenu.handleItemClickEvent(evnt, firstItem)
                },
                mouseenter (evnt: MouseEvent) {
                  $xeContextMenu.handleItemMouseenterEvent(evnt, firstItem)
                },
                mouseleave: $xeContextMenu.handleItemMouseleaveEvent
              }
            }, [
              hasChildMenus
                ? h('div', {
                  class: 'vxe-context-menu--children-wrapper'
                }, children.map(twoItem => {
                  return h('div', {
                    class: ['vxe-context-menu--item-wrapper vxe-context-menu--child-item', {
                      'is--active': activeChildOption === twoItem
                    }],
                    on: {
                      click (evnt: MouseEvent) {
                        $xeContextMenu.handleItemClickEvent(evnt, twoItem)
                      },
                      mouseenter (evnt: MouseEvent) {
                        $xeContextMenu.handleItemMouseenterEvent(evnt, twoItem, firstItem)
                      },
                      mouseleave: $xeContextMenu.handleItemMouseleaveEvent
                    }
                  }, [
                    $xeContextMenu.renderMenuItem(h, twoItem)
                  ])
                }))
                : renderEmptyElement($xeContextMenu),
              $xeContextMenu.renderMenuItem(h, firstItem, hasChildMenus)
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
        class: ['vxe-context-menu vxe-context-menu--wrapper', position === 'fixed' ? ('is--' + position) : 'is--absolute', `cp--${childPos === 'left' ? childPos : 'right'}`, className || '', {
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
    globalEvents.on($xeContextMenu, 'mousedown', $xeContextMenu.handleGlobalMousedownEvent)
  },
  beforeDestroy () {
    const $xeContextMenu = this
    const reactData = $xeContextMenu.reactData
    const internalData = $xeContextMenu.internalData

    globalEvents.off($xeContextMenu, 'mousedown')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
