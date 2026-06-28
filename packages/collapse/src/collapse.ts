import { ref, h, reactive, provide, computed, PropType, watch, nextTick, onUnmounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, getIcon, createEvent, permission, renderEmptyElement, useSize } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import XEUtils from 'xe-utils'

import type { CollapseReactData, CollapseInternalData, VxeCollapseEmits, CollapsePrivateRef, VxeCollapsePropTypes, VxeCollapsePanePropTypes, VxeCollapseDefines, VxeCollapsePaneProps, VxeCollapsePaneDefines, ValueOf, CollapseMethods, CollapsePrivateMethods, VxeCollapsePrivateComputed, VxeCollapseConstructor, VxeCollapsePrivateMethods } from '../../../types'

function createReactData (): CollapseReactData {
  return {
    staticPanes: [],
    cachePaneMaps: {},
    activeKeyFlag: 0,
    openKeyFlag: 0
  }
}

function createInternalData (): CollapseInternalData {
  return {
    // esTime: null,
    activeKeyMaps: {},
    openKeyMaps: {}
  }
}

export default defineVxeComponent({
  name: 'VxeCollapse',
  props: {
    modelValue: Array as PropType<VxeCollapsePropTypes.ModelValue>,
    options: Array as PropType<VxeCollapsePropTypes.Options>,
    padding: {
      type: Boolean as PropType<VxeCollapsePropTypes.Padding>,
      default: () => getConfig().collapse.padding
    },
    border: {
      type: Boolean as PropType<VxeCollapsePropTypes.Border>,
      default: () => getConfig().collapse.border
    },
    expandConfig: Object as PropType<VxeCollapsePropTypes.ExpandConfig>,
    size: {
      type: String as PropType<VxeCollapsePropTypes.Size>,
      default: () => getConfig().collapse.size || getConfig().size
    }
  },
  emits: [
    'update:modelValue',
    'load',
    'change',
    'toggle-expand'
  ] as VxeCollapseEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive(createReactData())

    const internalData = createInternalData()

    const refMaps: CollapsePrivateRef = {
      refElem
    }

    const computeItemOptions = computed(() => {
      const { options } = props
      return (options || []).filter((item) => handleFilterItem(item))
    })

    const computeItemStaticOptions = computed(() => {
      const { staticPanes } = reactData
      return staticPanes.filter((item) => handleFilterItem(item))
    })

    const computeExpandOpts = computed(() => {
      return Object.assign({}, getConfig().collapse.expandConfig, props.expandConfig)
    })

    const computeMaps: VxeCollapsePrivateComputed = {
    }

    const $xeCollapse = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCollapseConstructor & VxeCollapsePrivateMethods

    const dispatchEvent = (type: ValueOf<VxeCollapseEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $collapse: $xeCollapse }, params))
    }

    const collapseMethods: CollapseMethods = {
      dispatchEvent
    }

    const emitModel = (value: any) => {
      emit('update:modelValue', value)
    }

    const handleFilterItem = (item: VxeCollapsePaneProps | VxeCollapsePaneDefines.CollapseConfig) => {
      const { permissionCode } = item
      if (permissionCode) {
        if (!permission.checkVisible(permissionCode)) {
          return false
        }
      }
      return true
    }

    const updateModel = () => {
      const { modelValue } = props
      const { openKeyMaps } = internalData
      const activeMaps: Record<string, boolean> = {}
      if (modelValue) {
        modelValue.forEach(name => {
          if (!openKeyMaps[name as string]) {
            openKeyMaps[name as string] = true
          }
          activeMaps[name as string] = true
        })
      }
      internalData.activeKeyMaps = activeMaps
      reactData.activeKeyFlag++
      reactData.openKeyFlag++
    }

    const handleOpen = (name: VxeCollapsePanePropTypes.Name | undefined) => {
      const { openKeyMaps } = internalData
      if (name && !openKeyMaps[name as string]) {
        openKeyMaps[name as string] = true
        dispatchEvent('load', { name }, null)
        return true
      }
      return false
    }

    const initDefaultName = (list?: VxeCollapsePropTypes.Options | VxeCollapsePaneDefines.CollapseConfig[]) => {
      const { activeKeyMaps } = internalData
      const nameMaps: Record<string, VxeCollapseDefines.CacheItemObj> = {}
      if (list && list.length) {
        list.forEach((item) => {
          const { name, preload } = item || {}
          if (name) {
            const isActive = activeKeyMaps[name as string]
            nameMaps[name as string] = {
              height: 0,
              loading: false
            }
            if (isActive || preload) {
              handleOpen(name)
            }
          }
        })
      }
      reactData.cachePaneMaps = nameMaps
      reactData.openKeyFlag++
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

    const handleClickEvent = (evnt: MouseEvent, item: VxeCollapsePaneDefines.CollapseConfig | VxeCollapsePaneProps) => {
      let { activeKeyMaps } = internalData
      const { esTime } = internalData
      const expandOpts = computeExpandOpts.value
      const { accordion } = expandOpts
      const { name } = item
      if (esTime) {
        clearTimeout(esTime)
      }
      if (name) {
        const headEl = evnt.currentTarget as HTMLDivElement
        const bodyEl = headEl.nextElementSibling as HTMLDivElement
        let expanded = false
        if (activeKeyMaps[name as string]) {
          delete activeKeyMaps[name as string]
        } else {
          if (accordion) {
            activeKeyMaps = {}
          }
          expanded = true
          activeKeyMaps[name as string] = true
        }

        const startAnimation = () => {
          const itemEl = bodyEl.firstElementChild as HTMLDivElement
          if (itemEl) {
            bodyEl.style.height = toCssUnit(itemEl.scrollHeight)
            if (expanded) {
              internalData.esTime = setTimeout(() => {
                bodyEl.style.height = ''
                internalData.esTime = undefined
              }, 200)
            } else {
              nextTick(() => {
                requestAnimationFrame(() => {
                  bodyEl.style.height = ''
                })
              })
            }
          }
        }

        const value = Object.keys(activeKeyMaps)
        internalData.activeKeyMaps = activeKeyMaps
        handleOpen(name)
        reactData.activeKeyFlag++
        reactData.openKeyFlag++

        if (bodyEl) {
          const itemEl = bodyEl.firstElementChild as HTMLDivElement
          if (itemEl) {
            startAnimation()
          } else {
            bodyEl.style.height = '0'
            nextTick(startAnimation)
          }
        }

        emitModel(value)
        dispatchEvent('change', { value, name }, evnt)
        dispatchEvent('toggle-expand', { value, name, expanded }, evnt)
      }
    }

    const collapsePrivateMethods: CollapsePrivateMethods = {
    }

    Object.assign($xeCollapse, collapseMethods, collapsePrivateMethods)

    const renderList = (itemList: VxeCollapsePropTypes.Options | VxeCollapsePaneDefines.CollapseConfig[]) => {
      const { activeKeyFlag, openKeyFlag } = reactData
      const { activeKeyMaps, openKeyMaps } = internalData
      const expandOpts = computeExpandOpts.value
      return itemList.map(item => {
        const { icon, name, title, slots } = item
        const titleSlot = slots ? slots.title : null
        const defaultSlot = slots ? slots.default : null
        const isActive = name && activeKeyFlag && activeKeyMaps[name as string]
        return h('div', {
          class: 'vxe-collapse-item'
        }, [
          h('div', {
            class: 'vxe-collapse--item-header',
            onClick (evnt) {
              handleClickEvent(evnt, item)
            }
          }, [
            expandOpts.showIcon
              ? h('span', {
                class: 'vxe-collapse--item-switch'
              }, [
                h('i', {
                  class: isActive ? getIcon().COLLAPSE_OPEN : getIcon().COLLAPSE_CLOSE
                })
              ])
              : renderEmptyElement($xeCollapse),
            icon
              ? h('span', {
                class: 'vxe-collapse--item-icon'
              }, [
                h('i', {
                  class: icon
                })
              ])
              : renderEmptyElement($xeCollapse),
            h('span', {
              class: 'vxe-collapse--item-name'
            }, titleSlot ? callSlot(titleSlot, { name, title }) : `${title}`)
          ]),
          h('div', {
            class: ['vxe-collapse--item-content', {
              'is--visible': isActive,
              'is--hidden': !isActive
            }]
          }, [
            name && openKeyFlag && openKeyMaps[name as string]
              ? h('div', {
                class: 'vxe-collapse--item-inner'
              }, [
                defaultSlot ? callSlot(defaultSlot, { name, title }) : ''
              ])
              : renderEmptyElement($xeCollapse)
          ])
        ])
      })
    }

    const renderVN = () => {
      const { padding, border } = props
      const vSize = computeSize.value
      const itemOptions = computeItemOptions.value
      const itemStaticOptions = computeItemStaticOptions.value
      const defaultSlot = slots.default
      const itemList = defaultSlot ? itemStaticOptions : itemOptions

      return h('div', {
        ref: refElem,
        class: ['vxe-collapse', {
          [`size--${vSize}`]: vSize,
          'is--padding': padding,
          'is--border': border
        }]
      }, [
        h('div', {
          class: 'vxe-collapse-slots'
        }, defaultSlot ? defaultSlot({}) : []),
        renderList(itemList)
      ])
    }

    const valFlag = ref(0)
    watch(() => props.modelValue ? props.modelValue.length : -1, () => {
      valFlag.value++
    })
    watch(() => props.modelValue, () => {
      valFlag.value++
    })
    watch(valFlag, () => {
      updateModel()
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
    })

    const stFlag = ref(0)
    watch(() => reactData.staticPanes ? reactData.staticPanes.length : -1, () => {
      stFlag.value++
    })
    watch(() => reactData.staticPanes, () => {
      stFlag.value++
    })
    watch(stFlag, () => {
      initDefaultName(reactData.staticPanes)
    })

    updateModel()
    initDefaultName(reactData.staticPanes.length ? reactData.staticPanes : props.options)

    onUnmounted(() => {
      const { esTime } = internalData
      if (esTime) {
        clearTimeout(esTime)
      }
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    provide('$xeCollapse', $xeCollapse)

    $xeCollapse.renderVN = renderVN

    return $xeCollapse
  },
  render () {
    return this.renderVN()
  }
})
