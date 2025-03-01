import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent, getConfig, getIcon, globalEvents, permission, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit } from '../..//ui/src/dom'
import { isEnableConf } from '../..//ui/src/utils'
import { warnLog, errLog } from '../../ui/src/log'

import type { VxeTabsPropTypes, VxeTabPaneProps, VxeTabsEmits, TabsInternalData, TabsReactData, VxeComponentSizeType, VxeTabsConstructor, VxeTabsPrivateMethods, VxeTabPaneDefines, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTabs',
  props: {
    value: [String, Number, Boolean] as PropType<VxeTabsPropTypes.ModelValue>,
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
  inject: {
    $xeParentTabs: {
      from: '$xeTabs',
      default: null
    }
  },
  provide () {
    const $xeTabs = this
    return {
      $xeTabs
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: TabsReactData = {
      staticTabs: [],
      activeName: null,
      initNames: [],
      lintLeft: 0,
      lintWidth: 0,
      isTabOver: false,
      resizeFlag: 1,
      cacheTabMaps: {}
    }
    const internalData: TabsInternalData = {
      slTimeout: undefined
    }
    return {
      xID,
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeParentTabs():(VxeTabsConstructor & VxeTabsPrivateMethods) | null
    }),
    computeParentResizeFlag () {
      const $xeTabs = this
      const $xeParentTabs = $xeTabs.$xeParentTabs

      return $xeParentTabs ? $xeParentTabs.reactData.resizeFlag : null
    },
    computeCloseOpts () {
      const $xeTabs = this
      const props = $xeTabs

      return Object.assign({}, getConfig().tabs.closeConfig, props.closeConfig)
    },
    computeRefreshOpts () {
      const $xeTabs = this
      const props = $xeTabs

      return Object.assign({}, getConfig().tabs.refreshConfig, props.refreshConfig)
    },
    computeTabOptions (this: any) {
      const $xeTabs = this
      const props = $xeTabs

      const options = props.options as VxeTabsPropTypes.Options
      return (options || []).filter((item) => $xeTabs.handleFilterTab(item))
    },
    computeTabStaticOptions (this: any) {
      const $xeTabs = this
      const reactData = $xeTabs.reactData

      const staticTabs = reactData.staticTabs as VxeTabPaneDefines.TabConfig[]
      return staticTabs.filter((item) => $xeTabs.handleFilterTab(item))
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTabsEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTabs = this
      $xeTabs.$emit(type, createEvent(evnt, { $tabs: $xeTabs }, params))
    },
    emitModel  (value: any) {
      const $xeTabs = this

      const { _events } = $xeTabs as any
      $xeTabs.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeTabs.$emit('modelValue', value)
      } else {
        $xeTabs.$emit('model-value', value)
      }
    },
    prev () {
      const $xeTabs = this

      return $xeTabs.handlePrevNext(false)
    },
    next () {
      const $xeTabs = this

      return $xeTabs.handlePrevNext(true)
    },
    prevTab () {
      const $xeTabs = this

      if (process.env.VUE_APP_VXE_ENV === 'development') {
        warnLog('vxe.error.delFunc', ['prevTab', 'prev'])
      }
      return $xeTabs.prev()
    },
    nextTab () {
      const $xeTabs = this

      if (process.env.VUE_APP_VXE_ENV === 'development') {
        warnLog('vxe.error.delFunc', ['nextTab', 'next'])
      }
      return $xeTabs.next()
    },
    handleFilterTab (item: VxeTabPaneProps | VxeTabPaneDefines.TabConfig) {
      const { permissionCode } = item
      if (permissionCode) {
        if (!permission.checkVisible(permissionCode)) {
          return false
        }
      }
      return true
    },
    callSlot  (slotFunc: any, params: any, h: CreateElement) {
      const $xeTabs = this
      const slots = $xeTabs.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc.call($xeTabs, params, h))
        }
      }
      return []
    },
    updateTabStyle  () {
      const $xeTabs = this
      const props = $xeTabs
      const reactData = $xeTabs.reactData

      $xeTabs.$nextTick(() => {
        const { type } = props
        const { activeName } = reactData
        const tabOptions = $xeTabs.computeTabOptions
        const tabStaticOptions = $xeTabs.computeTabStaticOptions
        const headerWrapperEl = $xeTabs.$refs.refHeadWrapperElem as HTMLDivElement
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
    },
    addInitName  (name: VxeTabsPropTypes.ModelValue, evnt: Event | null) {
      const $xeTabs = this
      const reactData = $xeTabs.reactData

      const { initNames } = reactData
      if (name && !initNames.includes(name)) {
        $xeTabs.dispatchEvent('tab-load', { name }, evnt)
        initNames.push(name)
        return true
      }
      return false
    },
    initDefaultName  (list?: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) {
      const $xeTabs = this
      const props = $xeTabs
      const reactData = $xeTabs.reactData

      let activeName: VxeTabsPropTypes.ModelValue = null
      const nameMaps: Record<string, {
        loading: boolean
      }> = {}
      if (list && list.length) {
        let validVal = false
        activeName = props.value
        list.forEach((item) => {
          const { name, preload } = item || {}
          if (name) {
            nameMaps[`${name}`] = {
              loading: false
            }
            if (activeName === name) {
              validVal = true
            }
            if (preload) {
              $xeTabs.addInitName(name, null)
            }
          }
        })
        if (!validVal) {
          activeName = list[0].name
          $xeTabs.addInitName(activeName, null)
          $xeTabs.emitModel(activeName)
        }
      }
      reactData.activeName = activeName
      reactData.cacheTabMaps = nameMaps
    },
    clickEvent  (evnt: KeyboardEvent, item: VxeTabPaneProps | VxeTabPaneDefines.TabConfig) {
      const $xeTabs = this
      const props = $xeTabs
      const reactData = $xeTabs.reactData

      const { trigger } = props
      const beforeMethod = props.beforeChangeMethod || getConfig().tabs.beforeChangeMethod
      const { activeName } = reactData
      const { name } = item
      const value = name
      $xeTabs.dispatchEvent('tab-click', { name }, evnt)
      if (trigger === 'manual') {
        return
      }
      if (name !== activeName) {
        Promise.resolve(
          !beforeMethod || beforeMethod({ $tabs: $xeTabs, name, oldName: activeName, newName: name, option: item })
        ).then((status) => {
          if (status) {
            reactData.activeName = name
            $xeTabs.emitModel(value)
            $xeTabs.addInitName(name, evnt)
            $xeTabs.dispatchEvent('change', { value, name, oldName: activeName, newName: name, option: item }, evnt)
            $xeTabs.dispatchEvent('tab-change', { value, name, oldName: activeName, newName: name, option: item }, evnt)
          } else {
            $xeTabs.dispatchEvent('tab-change-fail', { value, name, oldName: activeName, newName: name, option: item }, evnt)
          }
        }).catch(() => {
          $xeTabs.dispatchEvent('tab-change-fail', { value, name, oldName: activeName, newName: name, option: item }, evnt)
        })
      }
    },
    handleRefreshTabEvent (evnt: KeyboardEvent, item: VxeTabPaneDefines.TabConfig | VxeTabPaneProps) {
      const $xeTabs = this
      const reactData = $xeTabs.reactData

      evnt.stopPropagation()
      const { activeName, cacheTabMaps } = reactData
      const { name } = item
      const refreshOpts = $xeTabs.computeRefreshOpts
      const { queryMethod } = refreshOpts
      const cacheItem = name ? cacheTabMaps[`${name}`] : null
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
    },
    handleCloseTabEvent  (evnt: KeyboardEvent, item: VxeTabPaneDefines.TabConfig | VxeTabPaneProps, index: number, list: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) {
      const $xeTabs = this
      const props = $xeTabs
      const reactData = $xeTabs.reactData

      evnt.stopPropagation()
      const { activeName } = reactData
      const closeOpts = $xeTabs.computeCloseOpts
      const beforeMethod = closeOpts.beforeMethod || props.beforeCloseMethod || getConfig().tabs.beforeCloseMethod
      const { name } = item
      const value = activeName
      let nextName = value
      if (activeName === name) {
        const nextItem = index < list.length - 1 ? list[index + 1] : list[index - 1]
        nextName = nextItem ? nextItem.name : null
      }
      Promise.resolve(
        !beforeMethod || beforeMethod({ $tabs: $xeTabs, value, name, nextName, option: item })
      ).then(status => {
        if (status) {
          $xeTabs.dispatchEvent('tab-close', { value, name, nextName }, evnt)
        } else {
          $xeTabs.dispatchEvent('tab-close-fail', { value, name, nextName }, evnt)
        }
      }).catch(() => {
        $xeTabs.dispatchEvent('tab-close-fail', { value, name, nextName }, evnt)
      })
    },
    startScrollAnimation  (offsetPos: number, offsetSize: number) {
      const $xeTabs = this
      const internalData = $xeTabs.internalData

      const { slTimeout } = internalData
      let offsetLeft = offsetSize
      let scrollCount = 6
      let delayNum = 35
      if (slTimeout) {
        clearTimeout(slTimeout)
        internalData.slTimeout = undefined
      }
      const scrollAnimate = () => {
        const headerWrapperEl = $xeTabs.$refs.refHeadWrapperElem as HTMLDivElement
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
            $xeTabs.updateTabStyle()
          }
        }
      }
      scrollAnimate()
    },
    handleScrollToLeft  (offsetPos: number) {
      const $xeTabs = this

      const headerWrapperEl = $xeTabs.$refs.refHeadWrapperElem as HTMLDivElement
      if (headerWrapperEl) {
        const offsetSize = Math.floor(headerWrapperEl.clientWidth * 0.75)
        $xeTabs.startScrollAnimation(offsetPos, offsetSize)
      }
    },
    scrollLeftEvent  () {
      const $xeTabs = this

      $xeTabs.handleScrollToLeft(-1)
    },
    scrollRightEvent  () {
      const $xeTabs = this

      $xeTabs.handleScrollToLeft(1)
    },
    scrollToTab (name: VxeTabsPropTypes.ModelValue) {
      const $xeTabs = this

      const tabOptions = $xeTabs.computeTabOptions
      const tabStaticOptions = $xeTabs.computeTabStaticOptions
      return $xeTabs.$nextTick().then(() => {
        const headerWrapperEl = $xeTabs.$refs.refHeadWrapperElem as HTMLDivElement
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
          $xeTabs.updateTabStyle()
        }
      })
    },
    handlePrevNext (isNext: boolean) {
      const $xeTabs = this
      const reactData = $xeTabs.reactData

      const { activeName } = reactData
      const tabOptions = $xeTabs.computeTabOptions
      const tabStaticOptions = $xeTabs.computeTabStaticOptions
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
          $xeTabs.emitModel(value)
          $xeTabs.addInitName(name, null)
        }
      }
      return $xeTabs.$nextTick()
    },

    //
    // Render
    //
    renderTabHeader  (h: CreateElement, tabList: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) {
      const $xeTabs = this
      const props = $xeTabs
      const slots = $xeTabs.$scopedSlots
      const reactData = $xeTabs.reactData

      const { type, titleWidth: allTitleWidth, titleAlign: allTitleAlign, showClose, closeConfig, refreshConfig } = props
      const { activeName, lintLeft, lintWidth, isTabOver, cacheTabMaps } = reactData
      const extraSlot = slots.extra
      const closeOpts = $xeTabs.computeCloseOpts
      const closeVisibleMethod = closeOpts.visibleMethod
      const refreshOpts = $xeTabs.computeRefreshOpts
      const refreshVisibleMethod = refreshOpts.visibleMethod

      return h('div', {
        class: 'vxe-tabs-header'
      }, [
        isTabOver
          ? h('div', {
            class: 'vxe-tabs-header--bar vxe-tabs-header--left-bar',
            on: {
              click: $xeTabs.scrollLeftEvent
            }
          }, [
            h('span', {
              class: getIcon().TABS_TAB_BUTTON_LEFT
            })
          ])
          : renderEmptyElement($xeTabs),
        h('div', {
          class: 'vxe-tabs-header--wrapper'
        }, [
          h('div', {
            ref: 'refHeadWrapperElem',
            class: 'vxe-tabs-header--item-wrapper'
          }, tabList.map((item, index) => {
            const { title, titleWidth, titleAlign, icon, name, slots } = item
            const titleSlot = slots ? (slots.title || slots.tab) : null
            const itemWidth = titleWidth || allTitleWidth
            const itemAlign = titleAlign || allTitleAlign
            const params = { $tabs: $xeTabs, value: activeName, name, option: item }
            const isActive = activeName === name
            const cacheItem = name ? cacheTabMaps[`${name}`] : null
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
                : {},
              on: {
                click (evnt: KeyboardEvent) {
                  $xeTabs.clickEvent(evnt, item)
                }
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
                    : renderEmptyElement($xeTabs),
                  h('span', {
                    class: 'vxe-tabs-header--item-name'
                  }, titleSlot ? $xeTabs.callSlot(titleSlot, { name, title }, h) : `${title}`)
                ]),
                (isEnableConf(refreshConfig) || refreshOpts.enabled) && (refreshVisibleMethod ? refreshVisibleMethod(params) : isActive)
                  ? h('div', {
                    class: 'vxe-tabs-header--refresh-btn',
                    on: {
                      click (evnt: KeyboardEvent) {
                        $xeTabs.handleRefreshTabEvent(evnt, item)
                      }
                    }
                  }, [
                    h('i', {
                      class: isLoading ? getIcon().TABS_TAB_REFRESH_LOADING : getIcon().TABS_TAB_REFRESH
                    })
                  ])
                  : renderEmptyElement($xeTabs),
                (showClose || (isEnableConf(closeConfig) || closeOpts.enabled)) && (!closeVisibleMethod || closeVisibleMethod(params))
                  ? h('div', {
                    class: 'vxe-tabs-header--close-btn',
                    on: {
                      click (evnt: KeyboardEvent) {
                        $xeTabs.handleCloseTabEvent(evnt, item, index, tabList)
                      }
                    }
                  }, [
                    h('i', {
                      class: getIcon().TABS_TAB_CLOSE
                    })
                  ])
                  : renderEmptyElement($xeTabs)
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
            on: {
              click: $xeTabs.scrollRightEvent
            }
          }, [
            h('span', {
              class: getIcon().TABS_TAB_BUTTON_RIGHT
            })
          ])
          : renderEmptyElement($xeTabs),
        extraSlot
          ? h('div', {
            class: 'vxe-tabs-header--extra'
          }, $xeTabs.callSlot(extraSlot, {}, h))
          : renderEmptyElement($xeTabs)
      ])
    },
    renderTabPane  (h: CreateElement, item: VxeTabPaneProps | VxeTabPaneDefines.TabConfig) {
      const $xeTabs = this
      const reactData = $xeTabs.reactData

      const { initNames, activeName } = reactData
      const { name, slots } = item
      const defaultSlot = slots ? slots.default : null
      return name && initNames.includes(name)
        ? h('div', {
          key: `${name}`,
          class: ['vxe-tabs-pane--item', {
            'is--visible': activeName === name,
            'has--content': !!defaultSlot
          }]
        }, defaultSlot ? $xeTabs.callSlot(defaultSlot, { name }, h) : [])
        : renderEmptyElement($xeTabs)
    },
    renderTabContent  (h: CreateElement, tabList: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) {
      const $xeTabs = this
      const props = $xeTabs
      const reactData = $xeTabs.reactData

      const { destroyOnClose } = props
      const { activeName } = reactData
      const activeDefaultTab = tabList.find(item => item.name === activeName)
      if (destroyOnClose) {
        return [activeDefaultTab ? $xeTabs.renderTabPane(h, activeDefaultTab) : renderEmptyElement($xeTabs)]
      }
      return tabList.map((item) => $xeTabs.renderTabPane(h, item))
    },
    renderVN (h: CreateElement): VNode {
      const $xeTabs = this
      const props = $xeTabs
      const slots = $xeTabs.$scopedSlots

      const { type, height, padding, trigger } = props
      const tabOptions = $xeTabs.computeTabOptions
      const tabStaticOptions = $xeTabs.computeTabStaticOptions
      const defaultSlot = slots.default
      const footerSlot = slots.footer
      const tabList = defaultSlot ? tabStaticOptions : tabOptions

      return h('div', {
        ref: 'refElem',
        class: ['vxe-tabs', `vxe-tabs--${type || 'default'}`, `trigger--${trigger === 'manual' ? 'trigger' : 'default'}`, {
          'is--padding': padding,
          'is--height': height
        }],
        style: height
          ? {
              height: toCssUnit(height)
            }
          : {}
      }, [
        h('div', {
          class: 'vxe-tabs-slots'
        }, defaultSlot ? $xeTabs.callSlot(defaultSlot, {}, h) : []),
        $xeTabs.renderTabHeader(h, tabList),
        h('div', {
          class: 'vxe-tabs-pane'
        }, $xeTabs.renderTabContent(h, tabList)),
        footerSlot
          ? h('div', {
            class: 'vxe-tabs-footer'
          }, $xeTabs.callSlot(footerSlot, {}, h))
          : renderEmptyElement($xeTabs)
      ])
    }
  },
  watch: {
    value (val) {
      const $xeTabs = this
      const reactData = $xeTabs.reactData

      $xeTabs.addInitName(val, null)
      reactData.activeName = val
    },
    'reactData.activeName' (val) {
      const $xeTabs = this
      const reactData = $xeTabs.reactData

      $xeTabs.scrollToTab(val)
      $xeTabs.$nextTick(() => {
        reactData.resizeFlag++
      })
    },
    options () {
      const $xeTabs = this
      const props = $xeTabs

      $xeTabs.initDefaultName(props.options)
      $xeTabs.updateTabStyle()
    },
    'reactData.staticTabs' () {
      const $xeTabs = this
      const reactData = $xeTabs.reactData

      $xeTabs.initDefaultName(reactData.staticTabs)
      $xeTabs.updateTabStyle()
    },
    computeParentResizeFlag () {
      const $xeTabs = this

      $xeTabs.$nextTick(() => {
        $xeTabs.updateTabStyle()
      })
    }
  },
  created () {
    const $xeTabs = this
    const props = $xeTabs
    const reactData = $xeTabs.reactData

    $xeTabs.addInitName(props.value, null)
    $xeTabs.initDefaultName(reactData.staticTabs.length ? reactData.staticTabs : props.options)
  },
  mounted () {
    const $xeTabs = this

    $xeTabs.updateTabStyle()
    globalEvents.on($xeTabs, 'resize', $xeTabs.updateTabStyle)
  },
  beforeDestroy () {
    const $xeTabs = this

    globalEvents.off($xeTabs, 'resize')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
