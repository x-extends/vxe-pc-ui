import { defineComponent, ref, h, reactive, PropType, provide, computed, onUnmounted, createCommentVNode, watch, nextTick, onMounted } from 'vue'
import XEUtils from 'xe-utils'
import { createEvent, getConfig, getIcon, globalEvents, permission } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit } from '../..//ui/src/dom'

import type { VxeTabsPropTypes, VxeTabPaneProps, VxeTabsEmits, TabsReactData, TabsPrivateRef, VxeTabsPrivateComputed, VxeTabsConstructor, VxeTabsPrivateMethods, VxeTabPaneDefines, ValueOf, TabsMethods, TabsPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeTabs',
  props: {
    modelValue: [String, Number, Boolean] as PropType<VxeTabsPropTypes.ModelValue>,
    options: Array as PropType<VxeTabsPropTypes.Options>,
    height: [String, Number] as PropType<VxeTabsPropTypes.Height>,
    destroyOnClose: Boolean as PropType<VxeTabsPropTypes.DestroyOnClose>,
    titleWidth: [String, Number] as PropType<VxeTabsPropTypes.TitleWidth>,
    titleAlign: [String, Number] as PropType<VxeTabsPropTypes.TitleAlign>,
    type: String as PropType<VxeTabsPropTypes.Type>,
    showClose: Boolean as PropType<VxeTabsPropTypes.ShowClose>,
    padding: {
      type: Boolean as PropType<VxeTabsPropTypes.Padding>,
      default: () => getConfig().tabs.padding
    },
    beforeChangeMethod: Function as PropType<VxeTabsPropTypes.BeforeChangeMethod>,
    beforeCloseMethod: Function as PropType<VxeTabsPropTypes.BeforeCloseMethod>
  },
  emits: [
    'update:modelValue',
    'change',
    'tab-change-fail',
    'tab-close',
    'tab-close-fail',
    'tab-click',
    'tab-load'
  ] as VxeTabsEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refHeadWrapperElem = ref<HTMLDivElement>()

    const reactData = reactive<TabsReactData>({
      staticTabs: [],
      activeName: props.modelValue,
      initNames: props.modelValue ? [props.modelValue] : [],
      lintLeft: 0,
      lintWidth: 0,
      isTabOver: false
    })

    const refMaps: TabsPrivateRef = {
      refElem
    }

    const handleFilterTab = (item: VxeTabPaneProps | VxeTabPaneDefines.TabConfig) => {
      const { permissionCode } = item
      if (permissionCode) {
        if (!permission.checkVisible(permissionCode)) {
          return false
        }
      }
      return true
    }

    const computeTabOptions = computed(() => {
      const { options } = props
      return (options || []).filter(handleFilterTab)
    })

    const computeTabStaticOptions = computed(() => {
      const { staticTabs } = reactData
      return staticTabs.filter(handleFilterTab)
    })

    const computeMaps: VxeTabsPrivateComputed = {
    }

    const $xeTabs = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTabsConstructor & VxeTabsPrivateMethods

    const callSlot = (slotFunc: any, params: any) => {
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

    const updateTabStyle = () => {
      nextTick(() => {
        const { type } = props
        const { activeName } = reactData
        const tabOptions = computeTabOptions.value
        const tabStaticOptions = computeTabStaticOptions.value
        const headerWrapperEl = refHeadWrapperElem.value
        let lintWidth = 0
        let lintLeft = 0
        let isOver = false
        if (headerWrapperEl) {
          const index = XEUtils.findIndexOf(tabStaticOptions.length ? tabStaticOptions : tabOptions, item => item.name === activeName)
          const { children, scrollWidth, clientWidth } = headerWrapperEl
          isOver = scrollWidth !== clientWidth
          if (index > -1) {
            const tabEl = children[index] as HTMLDivElement
            const tabWidth = tabEl.clientWidth
            if (type) {
              if (type === 'card') {
                lintWidth = tabWidth + 2
                lintLeft = tabEl.offsetLeft
              } else if (type === 'border-card') {
                lintWidth = tabWidth + 2
                lintLeft = tabEl.offsetLeft - 1
              }
            } else {
              lintWidth = Math.max(4, Math.floor(tabWidth * 0.6))
              lintLeft = tabEl.offsetLeft + Math.floor((tabWidth - lintWidth) / 2)
            }
          }
        }
        reactData.lintLeft = lintLeft
        reactData.lintWidth = lintWidth
        reactData.isTabOver = isOver
      })
    }

    const dispatchEvent = (type: ValueOf<VxeTabsEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $tabs: $xeTabs }, params))
    }

    const clickEvent = (evnt: KeyboardEvent, item: VxeTabPaneProps | VxeTabPaneDefines.TabConfig) => {
      const beforeMethod = props.beforeChangeMethod || getConfig().tabs.beforeChangeMethod
      const { initNames, activeName } = reactData
      const { name } = item
      let isInit = false
      const value = name
      if (!initNames.includes(name)) {
        isInit = true
        initNames.push(name)
      }
      reactData.activeName = name
      emit('update:modelValue', value)
      dispatchEvent('tab-click', { name }, evnt)
      if (name !== activeName) {
        if (!beforeMethod || beforeMethod({ $tabs: $xeTabs, name, oldName: activeName, newName: name })) {
          dispatchEvent('change', { value, name, oldName: activeName, newName: name }, evnt)
        } else {
          dispatchEvent('tab-change-fail', { value, name, oldName: activeName, newName: name }, evnt)
        }
        if (isInit) {
          dispatchEvent('tab-load', { name }, evnt)
        }
      }
    }

    const handleCloseTabEvent = (evnt: KeyboardEvent, item: VxeTabPaneDefines.TabConfig | VxeTabPaneProps, index: number, list: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) => {
      evnt.stopPropagation()
      const { activeName } = reactData
      const beforeMethod = props.beforeCloseMethod || getConfig().tabs.beforeCloseMethod
      const { name } = item
      const value = activeName
      let nextName = value
      if (activeName === name) {
        const nextItem = index < list.length - 1 ? list[index + 1] : list[index - 1]
        nextName = nextItem ? nextItem.name : null
      }
      if (!beforeMethod || beforeMethod({ $tabs: $xeTabs, value, name, nextName })) {
        dispatchEvent('tab-close', { value, name, nextName }, evnt)
      } else {
        dispatchEvent('tab-close-fail', { value, name, nextName }, evnt)
      }
    }

    let scrollTimeout: any = null

    const startScrollAnimation = (offsetPos: number, offsetSize: number) => {
      let offsetLeft = offsetSize
      let scrollCount = 6
      let delayNum = 35
      clearTimeout(scrollTimeout)
      const scrollAnimate = () => {
        const headerWrapperEl = refHeadWrapperElem.value
        if (scrollCount > 0) {
          scrollCount--
          if (headerWrapperEl) {
            const { clientWidth, scrollWidth, scrollLeft } = headerWrapperEl
            offsetLeft = Math.floor(offsetLeft / 2)
            if (offsetPos > 0) {
              if (clientWidth + scrollLeft < scrollWidth) {
                headerWrapperEl.scrollLeft += offsetLeft
                delayNum -= 4
                scrollTimeout = setTimeout(scrollAnimate, delayNum)
              }
            } else {
              if (scrollLeft > 0) {
                headerWrapperEl.scrollLeft -= offsetLeft
                delayNum -= 4
                scrollTimeout = setTimeout(scrollAnimate, delayNum)
              }
            }
            updateTabStyle()
          }
        }
      }
      scrollAnimate()
    }

    const handleScrollToLeft = (offsetPos: number) => {
      const headerWrapperEl = refHeadWrapperElem.value
      if (headerWrapperEl) {
        const offsetSize = Math.floor(headerWrapperEl.clientWidth * 0.75)
        startScrollAnimation(offsetPos, offsetSize)
      }
    }

    const scrollLeftEvent = () => {
      handleScrollToLeft(-1)
    }

    const scrollRightEvent = () => {
      handleScrollToLeft(1)
    }

    const scrollToTab = (name: VxeTabsPropTypes.ModelValue) => {
      const tabOptions = computeTabOptions.value
      const tabStaticOptions = computeTabStaticOptions.value
      return nextTick().then(() => {
        const headerWrapperEl = refHeadWrapperElem.value
        if (headerWrapperEl) {
          const index = XEUtils.findIndexOf(tabStaticOptions.length ? tabStaticOptions : tabOptions, item => item.name === name)
          if (index > -1) {
            const { scrollLeft, clientWidth, children } = headerWrapperEl
            const tabEl = children[index] as HTMLDivElement
            if (tabEl) {
              const tabOffsetLeft = tabEl.offsetLeft
              const tabClientWidth = tabEl.clientWidth
              // 如果右侧被挡
              const overSize = (tabOffsetLeft + tabClientWidth) - (scrollLeft + clientWidth)
              if (overSize > 0) {
                headerWrapperEl.scrollLeft += overSize
              }
              // 如果左侧被挡，优先
              if (tabOffsetLeft < scrollLeft) {
                headerWrapperEl.scrollLeft = tabOffsetLeft
              }
            }
          }
          updateTabStyle()
        }
      })
    }

    const tabsMethods: TabsMethods = {
      dispatchEvent,
      scrollToTab
    }

    const tabsPrivateMethods: TabsPrivateMethods = {
    }

    Object.assign($xeTabs, tabsMethods, tabsPrivateMethods)

    const renderTabHeader = (list: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) => {
      const { type, titleWidth: allTitleWidth, titleAlign: allTitleAlign, showClose } = props
      const { activeName, lintLeft, lintWidth, isTabOver } = reactData
      const extraSlot = slots.extra
      return h('div', {
        class: 'vxe-tabs-header'
      }, [
        isTabOver
          ? h('div', {
            class: 'vxe-tabs-header--bar vxe-tabs-header--left-bar',
            onClick: scrollLeftEvent
          }, [
            h('span', {
              class: getIcon().TABS_TAB_BUTTON_LEFT
            })
          ])
          : createCommentVNode(),
        h('div', {
          class: 'vxe-tabs-header--wrapper'
        }, [
          h('div', {
            ref: refHeadWrapperElem,
            class: 'vxe-tabs-header--item-wrapper'
          }, list.map((item, index) => {
            const { title, titleWidth, titleAlign, icon, name, slots } = item
            const tabSlot = slots ? slots.tab : null
            const itemWidth = titleWidth || allTitleWidth
            const itemAlign = titleAlign || allTitleAlign
            return h('div', {
              key: `${name}`,
              class: ['vxe-tabs-header--item', itemAlign ? `align--${itemAlign}` : '', {
                'is--active': activeName === name
              }],
              style: itemWidth
                ? {
                    width: toCssUnit(itemWidth)
                  }
                : null,
              onClick (evnt: KeyboardEvent) {
                clickEvent(evnt, item)
              }
            }, [
              h('div', {
                class: 'vxe-tabs-header--item-inner'
              }, [
                h('div', {
                  class: 'vxe-tabs-header--item-content'
                }, [
                  icon
                    ? h('span', {
                      class: 'vxe-tabs-header--item-icon'
                    }, [
                      h('i', {
                        class: icon
                      })
                    ])
                    : createCommentVNode(),
                  h('span', {
                    class: 'vxe-tabs-header--item-name'
                  }, tabSlot ? callSlot(tabSlot, { name, title }) : `${title}`)
                ]),
                showClose
                  ? h('div', {
                    class: 'vxe-tabs-header--close-btn',
                    onClick (evnt: KeyboardEvent) {
                      handleCloseTabEvent(evnt, item, index, list)
                    }
                  }, [
                    h('i', {
                      class: getIcon().TABS_TAB_CLOSE
                    })
                  ])
                  : createCommentVNode()
              ])
            ])
          }).concat([
            h('span', {
              key: 'line',
              class: `vxe-tabs-header--active-line type--${type || 'default'}`,
              style: {
                left: `${lintLeft}px`,
                width: `${lintWidth}px`
              }
            })
          ]))
        ]),
        isTabOver
          ? h('div', {
            class: 'vxe-tabs-header--bar vxe-tabs-header--right-bar',
            onClick: scrollRightEvent
          }, [
            h('span', {
              class: getIcon().TABS_TAB_BUTTON_RIGHT
            })
          ])
          : createCommentVNode(),
        extraSlot
          ? h('div', {
            class: 'vxe-tabs-header--extra'
          }, getSlotVNs(extraSlot({})))
          : createCommentVNode()
      ])
    }

    const renderTabPane = (item: VxeTabPaneProps | VxeTabPaneDefines.TabConfig) => {
      const { initNames, activeName } = reactData
      const { name, slots } = item
      const defaultSlot = slots ? slots.default : null
      return name && initNames.includes(name)
        ? h('div', {
          key: name,
          class: ['vxe-tabs-pane--item', {
            'is--visible': activeName === name,
            'has--content': !!defaultSlot
          }]
        }, defaultSlot ? callSlot(defaultSlot, { name }) : [])
        : createCommentVNode()
    }

    const renderTabContent = (list: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) => {
      const { destroyOnClose } = props
      const { activeName } = reactData
      const activeDefaultTab = list.find(item => item.name === activeName)
      if (destroyOnClose) {
        return activeDefaultTab ? [renderTabPane(activeDefaultTab)] : createCommentVNode()
      }
      return list.map(renderTabPane)
    }

    const renderVN = () => {
      const { type, height, padding } = props
      const tabOptions = computeTabOptions.value
      const tabStaticOptions = computeTabStaticOptions.value
      const defaultSlot = slots.default

      return h('div', {
        ref: refElem,
        class: ['vxe-tabs', `vxe-tabs--${type || 'default'}`, {
          'is--padding': padding,
          'is--height': height
        }],
        style: height
          ? {
              height: toCssUnit(height)
            }
          : null
      }, [
        h('div', {
          class: 'vxe-tabs-slots'
        }, defaultSlot ? defaultSlot({}) : []),
        renderTabHeader(defaultSlot ? tabStaticOptions : tabOptions),
        h('div', {
          class: 'vxe-tabs-pane'
        }, renderTabContent(defaultSlot ? tabStaticOptions : tabOptions))
      ])
    }

    watch(() => props.modelValue, (val) => {
      const { initNames } = reactData
      if (!initNames.includes(val)) {
        initNames.push(val)
      }
      reactData.activeName = val
    })

    watch(() => reactData.activeName, (val) => {
      updateTabStyle()
      scrollToTab(val)
    })

    const optsFlag = ref(0)
    watch(() => props.options ? props.options.length : -1, () => {
      optsFlag.value++
    })
    watch(() => props.options, () => {
      optsFlag.value++
    })
    watch(optsFlag, () => {
      updateTabStyle()
    })

    nextTick(() => {
      globalEvents.on($xeTabs, 'resize', () => {
        updateTabStyle()
      })
    })

    onMounted(() => {
      updateTabStyle()
    })

    onUnmounted(() => {
      globalEvents.off($xeTabs, 'resize')
    })

    $xeTabs.renderVN = renderVN

    provide('$xeTabs', $xeTabs)

    return $xeTabs
  },
  render () {
    return this.renderVN()
  }
})
