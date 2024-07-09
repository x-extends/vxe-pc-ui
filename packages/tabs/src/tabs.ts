import { defineComponent, ref, h, reactive, PropType, provide, computed, createCommentVNode, watch, nextTick, onMounted } from 'vue'
import XEUtils from 'xe-utils'
import { createEvent, getConfig, permission } from '../../ui'
import VxeTabPaneComponent from './tab-pane'
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
    padding: {
      type: Boolean as PropType<VxeTabsPropTypes.Padding>,
      default: () => getConfig().tabs.padding
    }
  },
  emits: [
    'update:modelValue',
    'change',
    'tab-click',
    'tab-load'
  ] as VxeTabsEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refHeaderElem = ref<HTMLDivElement>()

    const reactData = reactive<TabsReactData>({
      staticTabs: [],
      activeName: props.modelValue,
      initNames: props.modelValue ? [props.modelValue] : [],
      lintLeft: 0,
      lintWidth: 0
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

    const computeActiveOptionTab = computed(() => {
      const { activeName } = reactData
      const tabOptions = computeTabOptions.value
      return tabOptions.find(item => item.name === activeName)
    })

    const computeActiveDefaultTab = computed(() => {
      const { activeName } = reactData
      const tabStaticOptions = computeTabStaticOptions.value
      return tabStaticOptions.find(item => item.name === activeName)
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

    const updateLineStyle = () => {
      nextTick(() => {
        const { type } = props
        const { activeName } = reactData
        const tabOptions = computeTabOptions.value
        const tabStaticOptions = computeTabStaticOptions.value
        const headerWrapperEl = refHeaderElem.value
        let lintWidth = 0
        let lintLeft = 0
        if (headerWrapperEl) {
          const index = XEUtils.findIndexOf(tabStaticOptions.length ? tabStaticOptions : tabOptions, item => item.name === activeName)
          if (index > -1) {
            const tabEl = headerWrapperEl.children[index] as HTMLDivElement
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
      })
    }

    const dispatchEvent = (type: ValueOf<VxeTabsEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $tabs: $xeTabs }, params))
    }

    const clickEvent = (evnt: KeyboardEvent, item: VxeTabPaneProps | VxeTabPaneDefines.TabConfig) => {
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
      if (name !== activeName) {
        dispatchEvent('change', { value, name }, evnt)
      }
      dispatchEvent('tab-click', { name }, evnt)
      if (isInit) {
        dispatchEvent('tab-load', { name }, evnt)
      }
    }

    const tabsMethods: TabsMethods = {
      dispatchEvent
    }

    const tabsPrivateMethods: TabsPrivateMethods = {
    }

    Object.assign($xeTabs, tabsMethods, tabsPrivateMethods)

    const renderTabHeader = (list: VxeTabsPropTypes.Options | VxeTabPaneDefines.TabConfig[]) => {
      const { type, titleWidth: allTitleWidth, titleAlign: allTitleAlign } = props
      const { activeName, lintLeft, lintWidth } = reactData
      return h('div', {
        class: 'vxe-tabs-header'
      }, [
        h('div', {
          ref: refHeaderElem,
          class: 'vxe-tabs-header--wrapper'
        }, list.map((item) => {
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
              icon
                ? h('div', {
                  class: 'vxe-tabs-header--item-icon'
                }, [
                  h('i', {
                    class: icon
                  })
                ])
                : createCommentVNode(),
              h('div', {
                class: 'vxe-tabs-header--item-name'
              }, tabSlot ? callSlot(tabSlot, { name, title }) : `${title}`)
            ])
          ])
        })),
        h('span', {
          class: `vxe-tabs-header--active-line-${type || 'default'}`,
          style: {
            left: `${lintLeft}px`,
            width: `${lintWidth}px`
          }
        })
      ])
    }

    const renderOptionPane = (item: VxeTabPaneProps) => {
      const { initNames, activeName } = reactData
      const { name, slots } = item
      const defaultSlot = slots ? slots.default : null
      return h(VxeTabPaneComponent, {
        key: name,
        ...item
      }, {
        default () {
          return name && initNames.includes(name)
            ? h('div', {
              key: name,
              class: ['vxe-tabs-pane--item', {
                'is--visible': activeName === name
              }]
            }, callSlot(defaultSlot, {}))
            : createCommentVNode()
        }
      })
    }

    const renderOptionContent = (tabList: VxeTabsPropTypes.Options) => {
      const { destroyOnClose } = props
      const activeOptionTab = computeActiveOptionTab.value
      if (destroyOnClose) {
        return activeOptionTab ? [renderOptionPane(activeOptionTab)] : createCommentVNode()
      }
      return tabList.map(renderOptionPane)
    }

    const renderDefaultPane = (item: VxeTabPaneDefines.TabConfig) => {
      const { initNames, activeName } = reactData
      const { name, slots } = item
      const defaultSlot = slots ? slots.default : null
      return name && initNames.includes(name)
        ? h('div', {
          key: name,
          class: ['vxe-tabs-pane--item', {
            'is--visible': activeName === name
          }]
        }, callSlot(defaultSlot, {}))
        : createCommentVNode()
    }

    const renderDefaultContent = (staticTabList: VxeTabPaneDefines.TabConfig[]) => {
      const { destroyOnClose } = props
      const activeDefaultTab = computeActiveDefaultTab.value
      if (destroyOnClose) {
        return activeDefaultTab ? [renderDefaultPane(activeDefaultTab)] : createCommentVNode()
      }
      return staticTabList.map(renderDefaultPane)
    }

    const renderVN = () => {
      const { type, height, padding } = props
      const tabOptions = computeTabOptions.value
      const tabStaticOptions = computeTabStaticOptions.value
      const defaultSlot = slots.default

      return h('div', {
        ref: refElem,
        class: ['vxe-tabs', `vxe-tabs--${type || 'default'}`, {
          'is--padding': padding
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
        }, defaultSlot ? renderDefaultContent(tabStaticOptions) : renderOptionContent(tabOptions))
      ])
    }

    watch(() => props.modelValue, (val) => {
      reactData.activeName = val
    })

    watch(() => reactData.activeName, () => {
      updateLineStyle()
    })

    onMounted(() => {
      updateLineStyle()
    })

    $xeTabs.renderVN = renderVN

    provide('$xeTabs', $xeTabs)

    return $xeTabs
  },
  render () {
    return this.renderVN()
  }
})
