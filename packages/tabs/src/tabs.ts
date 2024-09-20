import { defineComponent, ref, h, reactive, inject, PropType, provide, computed, onUnmounted, createCommentVNode, watch, nextTick, onMounted } from 'vue'
import { createEvent, getConfig, getIcon, globalEvents, permission } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit } from '../..//ui/src/dom'
import { isEnableConf } from '../..//ui/src/utils'
import { warnLog, errLog } from '../../ui/src/log'
import XEUtils from 'xe-utils'

import type { VxeTabsPropTypes, VxeTabPaneProps, VxeTabsEmits, TabsInternalData, TabsReactData, TabsPrivateRef, VxeTabsPrivateComputed, VxeTabsConstructor, VxeTabsPrivateMethods, VxeTabPaneDefines, ValueOf, TabsMethods, TabsPrivateMethods } from '../../../types'

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
    trigger: String as PropType<VxeTabsPropTypes.Trigger>,
    beforeChangeMethod: Function as PropType<VxeTabsPropTypes.BeforeChangeMethod>,
    closeConfig: Object as PropType<VxeTabsPropTypes.CloseConfig>,
    refreshConfig: Object as PropType<VxeTabsPropTypes.RefreshConfig>,
    // 已废弃
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

    const $xeParentTabs = inject<(VxeTabsConstructor & VxeTabsPrivateMethods) | null>('$xeTabs', null)

    const refElem = ref<HTMLDivElement>()
    const refHeadWrapperElem = ref<HTMLDivElement>()

    const reactData = reactive<TabsReactData>({
      staticTabs: [],
      activeName: null,
      initNames: [],
      lintLeft: 0,
      lintWidth: 0,
      isTabOver: false,
      resizeFlag: 1,
      cacheTabMaps: {}
    })

    const internalData: TabsInternalData = {
      slTimeout: undefined
    }

    const refMaps: TabsPrivateRef = {
      refElem
    }

    const computeCloseOpts = computed(() => {
      return Object.assign({}, getConfig().tabs.closeConfig, props.closeConfig)
    })

    const computeRefreshOpts = computed(() => {
      return Object.assign({}, getConfig().tabs.refreshConfig, props.refreshConfig)
    })

    const computeTabOptions = computed(() => {
      const { options } = props
      return (options || []).filter((item) => handleFilterTab(item))
    })

    const computeTabStaticOptions = computed(() => {
      const { staticTabs } = reactData
      return staticTabs.filter((item) => handleFilterTab(item))
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

    const handleFilterTab = (item: VxeTabPaneProps | VxeTabPaneDefines.TabConfig) => {
      const { permissionCode } = item
      if (permissionCode) {
        if (!permission.checkVisible(permissionCode)) {
          return false
        }
      }
      return true
    }

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

    const addInitName = (name: VxeTabsPropTypes.ModelValue, evnt: Event | null) => {
      const { initNames } = reactData
      if (name && !initNames.includes(name)) {
        dispatchEvent('tab-load', { name }, evnt)
        initNames.push(name)
        return true
      }
      return false
    }

    const initDefaultName = (list?: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) => {
      let activeName: VxeTabsPropTypes.ModelValue = null
      const nameMaps: Record<string, {
        loading: boolean
      }> = {}
      if (list && list.length) {
        let validVal = false
        activeName = props.modelValue
        list.forEach((item) => {
          const { name, preload } = item || {}
          if (name) {
            nameMaps[name] = {
              loading: false
            }
            if (activeName === name) {
              validVal = true
            }
            if (preload) {
              addInitName(name, null)
            }
          }
        })
        if (!validVal) {
          activeName = list[0].name
          addInitName(activeName, null)
          emit('update:modelValue', activeName)
        }
      }
      reactData.activeName = activeName
      reactData.cacheTabMaps = nameMaps
    }

    const clickEvent = (evnt: KeyboardEvent, item: VxeTabPaneProps | VxeTabPaneDefines.TabConfig) => {
      const { trigger } = props
      const beforeMethod = props.beforeChangeMethod || getConfig().tabs.beforeChangeMethod
      const { activeName } = reactData
      const { name } = item
      if (trigger === 'manual') {
        dispatchEvent('tab-click', { name }, evnt)
        return
      }
      const value = name
      reactData.activeName = name
      emit('update:modelValue', value)
      dispatchEvent('tab-click', { name }, evnt)
      addInitName(name, evnt)
      if (name !== activeName) {
        if (!beforeMethod || beforeMethod({ $tabs: $xeTabs, name, oldName: activeName, newName: name, option: item })) {
          dispatchEvent('change', { value, name, oldName: activeName, newName: name, option: item }, evnt)
        } else {
          dispatchEvent('tab-change-fail', { value, name, oldName: activeName, newName: name, option: item }, evnt)
        }
      }
    }

    const handleRefreshTabEvent = (evnt: KeyboardEvent, item: VxeTabPaneDefines.TabConfig | VxeTabPaneProps) => {
      evnt.stopPropagation()
      const { activeName, cacheTabMaps } = reactData
      const { name } = item
      const refreshOpts = computeRefreshOpts.value
      const { queryMethod } = refreshOpts
      const cacheItem = name ? cacheTabMaps[name] : null
      if (cacheItem) {
        if (queryMethod) {
          cacheItem.loading = true
          Promise.resolve(
            queryMethod({ $tabs: $xeTabs, value: activeName, name, option: item })
          ).finally(() => {
            cacheItem.loading = false
          })
        } else {
          errLog('vxe.error.notFunc', ['refresh-config.queryMethod'])
        }
      }
    }

    const handleCloseTabEvent = (evnt: KeyboardEvent, item: VxeTabPaneDefines.TabConfig | VxeTabPaneProps, index: number, list: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) => {
      evnt.stopPropagation()
      const { activeName } = reactData
      const closeOpts = computeCloseOpts.value
      const beforeMethod = closeOpts.beforeMethod || props.beforeCloseMethod || getConfig().tabs.beforeCloseMethod
      const { name } = item
      const value = activeName
      let nextName = value
      if (activeName === name) {
        const nextItem = index < list.length - 1 ? list[index + 1] : list[index - 1]
        nextName = nextItem ? nextItem.name : null
      }
      if (!beforeMethod || beforeMethod({ $tabs: $xeTabs, value, name, nextName, option: item })) {
        dispatchEvent('tab-close', { value, name, nextName }, evnt)
      } else {
        dispatchEvent('tab-close-fail', { value, name, nextName }, evnt)
      }
    }

    const startScrollAnimation = (offsetPos: number, offsetSize: number) => {
      const { slTimeout } = internalData
      let offsetLeft = offsetSize
      let scrollCount = 6
      let delayNum = 35
      if (slTimeout) {
        clearTimeout(slTimeout)
        internalData.slTimeout = undefined
      }
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
                internalData.slTimeout = setTimeout(scrollAnimate, delayNum)
              }
            } else {
              if (scrollLeft > 0) {
                headerWrapperEl.scrollLeft -= offsetLeft
                delayNum -= 4
                internalData.slTimeout = setTimeout(scrollAnimate, delayNum)
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

    const handlePrevNext = (isNext: boolean) => {
      const { activeName } = reactData
      const tabOptions = computeTabOptions.value
      const tabStaticOptions = computeTabStaticOptions.value
      const list = tabStaticOptions.length ? tabStaticOptions : tabOptions
      const index = XEUtils.findIndexOf(list, item => item.name === activeName)
      if (index > -1) {
        let item: VxeTabPaneProps | null = null
        if (isNext) {
          if (index < list.length - 1) {
            item = list[index + 1]
          }
        } else {
          if (index > 0) {
            item = list[index - 1]
          }
        }
        if (item) {
          const name = item.name
          const value = name
          reactData.activeName = name
          emit('update:modelValue', value)
          addInitName(name, null)
        }
      }
      return nextTick()
    }

    const tabsMethods: TabsMethods = {
      dispatchEvent,
      scrollToTab,
      prev () {
        return handlePrevNext(false)
      },
      next () {
        return handlePrevNext(true)
      },
      prevTab () {
        if (process.env.VUE_APP_VXE_ENV === 'development') {
          warnLog('vxe.error.delFunc', ['prevTab', 'prev'])
        }
        return tabsMethods.prev()
      },
      nextTab () {
        if (process.env.VUE_APP_VXE_ENV === 'development') {
          warnLog('vxe.error.delFunc', ['nextTab', 'next'])
        }
        return tabsMethods.next()
      }
    }

    const tabsPrivateMethods: TabsPrivateMethods = {
    }

    Object.assign($xeTabs, tabsMethods, tabsPrivateMethods)

    const renderTabHeader = (tabList: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) => {
      const { type, titleWidth: allTitleWidth, titleAlign: allTitleAlign, showClose, closeConfig, refreshConfig } = props
      const { activeName, lintLeft, lintWidth, isTabOver, cacheTabMaps } = reactData
      const extraSlot = slots.extra
      const closeOpts = computeCloseOpts.value
      const closeVisibleMethod = closeOpts.visibleMethod
      const refreshOpts = computeRefreshOpts.value
      const refreshVisibleMethod = refreshOpts.visibleMethod

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
          }, tabList.map((item, index) => {
            const { title, titleWidth, titleAlign, icon, name, slots } = item
            const tabSlot = slots ? slots.tab : null
            const itemWidth = titleWidth || allTitleWidth
            const itemAlign = titleAlign || allTitleAlign
            const params = { $tabs: $xeTabs, value: activeName, name, option: item }
            const isActive = activeName === name
            const cacheItem = name ? cacheTabMaps[name] : null
            const isLoading = cacheItem ? cacheItem.loading : false
            return h('div', {
              key: `${name}`,
              class: ['vxe-tabs-header--item', itemAlign ? `align--${itemAlign}` : '', {
                'is--active': isActive
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
                (isEnableConf(refreshConfig) || refreshOpts.enabled) && (refreshVisibleMethod ? refreshVisibleMethod(params) : isActive)
                  ? h('div', {
                    class: 'vxe-tabs-header--refresh-btn',
                    onClick (evnt: KeyboardEvent) {
                      handleRefreshTabEvent(evnt, item)
                    }
                  }, [
                    h('i', {
                      class: isLoading ? getIcon().TABS_TAB_REFRESH_LOADING : getIcon().TABS_TAB_REFRESH
                    })
                  ])
                  : createCommentVNode(),
                (showClose || (isEnableConf(closeConfig) || closeOpts.enabled)) && (!closeVisibleMethod || closeVisibleMethod(params))
                  ? h('div', {
                    class: 'vxe-tabs-header--close-btn',
                    onClick (evnt: KeyboardEvent) {
                      handleCloseTabEvent(evnt, item, index, tabList)
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

    const renderTabContent = (tabList: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) => {
      const { destroyOnClose } = props
      const { activeName } = reactData
      const activeDefaultTab = tabList.find(item => item.name === activeName)
      if (destroyOnClose) {
        return [activeDefaultTab ? renderTabPane(activeDefaultTab) : createCommentVNode()]
      }
      return tabList.map((item) => renderTabPane(item))
    }

    const renderVN = () => {
      const { type, height, padding, trigger } = props
      const tabOptions = computeTabOptions.value
      const tabStaticOptions = computeTabStaticOptions.value
      const defaultSlot = slots.default
      const tabList = defaultSlot ? tabStaticOptions : tabOptions

      return h('div', {
        ref: refElem,
        class: ['vxe-tabs', `vxe-tabs--${type || 'default'}`, `trigger--${trigger === 'manual' ? 'trigger' : 'default'}`, {
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
        renderTabHeader(tabList),
        h('div', {
          class: 'vxe-tabs-pane'
        }, renderTabContent(tabList))
      ])
    }

    watch(() => props.modelValue, (val) => {
      addInitName(val, null)
      reactData.activeName = val
    })

    watch(() => reactData.activeName, (val) => {
      scrollToTab(val)
      nextTick(() => {
        reactData.resizeFlag++
      })
    })

    const optsFlag = ref(0)
    watch(() => props.options ? props.options.length : -1, () => {
      optsFlag.value++
    })
    watch(() => props.options, () => {
      optsFlag.value++
    })
    watch(optsFlag, () => {
      initDefaultName(props.options)
      updateTabStyle()
    })

    const stFlag = ref(0)
    watch(() => reactData.staticTabs ? reactData.staticTabs.length : -1, () => {
      stFlag.value++
    })
    watch(() => reactData.staticTabs, () => {
      stFlag.value++
    })
    watch(stFlag, () => {
      initDefaultName(reactData.staticTabs)
      updateTabStyle()
    })

    if ($xeParentTabs) {
      watch(() => $xeParentTabs ? $xeParentTabs.reactData.resizeFlag : null, () => {
        reactData.resizeFlag++
      })
    }

    watch(() => reactData.resizeFlag, () => {
      nextTick(() => {
        updateTabStyle()
      })
    })

    onMounted(() => {
      globalEvents.on($xeTabs, 'resize', updateTabStyle)
      updateTabStyle()
    })

    onUnmounted(() => {
      globalEvents.off($xeTabs, 'resize')
    })

    provide('$xeTabs', $xeTabs)

    addInitName(props.modelValue, null)
    initDefaultName(reactData.staticTabs.length ? reactData.staticTabs : props.options)

    $xeTabs.renderVN = renderVN

    return $xeTabs
  },
  render () {
    return this.renderVN()
  }
})
