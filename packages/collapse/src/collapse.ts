import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, getIcon, createEvent, permission, renderEmptyElement, globalMixins } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import XEUtils from 'xe-utils'

import type { CollapseReactData, VxeCollapseEmits, CollapseInternalData, VxeCollapsePropTypes, VxeCollapsePanePropTypes, VxeCollapsePaneProps, VxeCollapsePaneDefines, VxeCollapseDefines, VxeComponentSizeType, ValueOf } from '../../../types'

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

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCollapse',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: Array as PropType<VxeCollapsePropTypes.ModelValue>,
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
  provide () {
    const $xeCollapse = this

    return {
      $xeCollapse
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: CollapseInternalData
      }),
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeItemOptions (this: any) {
      const $xeCollapse = this
      const props = $xeCollapse

      const { options } = props
      return (options || []).filter((item: any) => $xeCollapse.handleFilterItem(item))
    },
    computeItemStaticOptions (this: any) {
      const $xeCollapse = this
      const reactData = $xeCollapse.reactData as CollapseReactData

      const { staticPanes } = reactData
      return staticPanes.filter((item) => $xeCollapse.handleFilterItem(item))
    },
    computeExpandOpts () {
      const $xeCollapse = this
      const props = $xeCollapse

      return Object.assign({}, getConfig().collapse.expandConfig, props.expandConfig)
    },
    computeSpFlag () {
      const $xeCollapse = this
      const reactData = $xeCollapse.reactData as CollapseReactData

      return reactData.staticPanes
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCollapseEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCollapse = this
      $xeCollapse.$emit(type, createEvent(evnt, { $collapse: $xeCollapse }, params))
    },
    emitModel (value: any) {
      const $xeCollapse = this

      $xeCollapse.$emit('input', value)
    },
    handleFilterItem  (item: VxeCollapsePaneProps | VxeCollapsePaneDefines.CollapseConfig) {
      const { permissionCode } = item
      if (permissionCode) {
        if (!permission.checkVisible(permissionCode)) {
          return false
        }
      }
      return true
    },
    updateModel () {
      const $xeCollapse = this
      const props = $xeCollapse
      const internalData = $xeCollapse.internalData
      const reactData = $xeCollapse.reactData

      const { value: modelValue } = props
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
    },
    handleOpen  (name: VxeCollapsePanePropTypes.Name | undefined) {
      const $xeCollapse = this
      const internalData = $xeCollapse.internalData

      const { openKeyMaps } = internalData
      if (name && !openKeyMaps[name as string]) {
        openKeyMaps[name as string] = true
        $xeCollapse.dispatchEvent('load', { name }, null)
        return true
      }
      return false
    },
    initDefaultName (list?: VxeCollapsePropTypes.Options | VxeCollapsePaneDefines.CollapseConfig[]) {
      const $xeCollapse = this
      const reactData = $xeCollapse.reactData
      const internalData = $xeCollapse.internalData

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
              $xeCollapse.handleOpen(name)
            }
          }
        })
      }
      reactData.cachePaneMaps = nameMaps
      reactData.openKeyFlag++
    },
    callSlot  (slotFunc: any, params: any, h: CreateElement) {
      const $xeCollapse = this
      const slots = $xeCollapse.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc.call($xeCollapse, params, h))
        }
      }
      return []
    },
    handleClickEvent (evnt: MouseEvent, item: VxeCollapsePaneDefines.CollapseConfig | VxeCollapsePaneProps) {
      const $xeCollapse = this
      const internalData = $xeCollapse.internalData
      const reactData = $xeCollapse.reactData

      let { activeKeyMaps } = internalData
      const { esTime } = internalData
      const expandOpts = $xeCollapse.computeExpandOpts
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
              $xeCollapse.$nextTick(() => {
                requestAnimationFrame(() => {
                  bodyEl.style.height = ''
                })
              })
            }
          }
        }

        const value = Object.keys(activeKeyMaps)
        internalData.activeKeyMaps = activeKeyMaps
        $xeCollapse.handleOpen(name)
        reactData.activeKeyFlag++
        reactData.openKeyFlag++

        if (bodyEl) {
          const itemEl = bodyEl.firstElementChild as HTMLDivElement
          if (itemEl) {
            startAnimation()
          } else {
            bodyEl.style.height = '0'
            $xeCollapse.$nextTick(startAnimation)
          }
        }

        $xeCollapse.emitModel(value)
        $xeCollapse.dispatchEvent('change', { value, name }, evnt)
        $xeCollapse.dispatchEvent('toggle-expand', { value, name, expanded }, evnt)
      }
    },

    //
    // Render
    //
    renderList (h:CreateElement, itemList: VxeCollapsePropTypes.Options | VxeCollapsePaneDefines.CollapseConfig[]) {
      const $xeCollapse = this
      const reactData = $xeCollapse.reactData
      const internalData = $xeCollapse.internalData

      const { activeKeyFlag, openKeyFlag } = reactData
      const { activeKeyMaps, openKeyMaps } = internalData
      const expandOpts = $xeCollapse.computeExpandOpts
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
            on: {
              click (evnt: MouseEvent) {
                $xeCollapse.handleClickEvent(evnt, item)
              }
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
            }, titleSlot ? $xeCollapse.callSlot(titleSlot, { name, title }, h) : `${title}`)
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
                defaultSlot ? $xeCollapse.callSlot(defaultSlot, { name, title }, h) : ''
              ])
              : renderEmptyElement($xeCollapse)
          ])
        ])
      })
    },
    renderVN (h: CreateElement): VNode {
      const $xeCollapse = this
      const props = $xeCollapse
      const slots = $xeCollapse.$scopedSlots

      const { padding, border } = props
      const vSize = $xeCollapse.computeSize
      const itemOptions = $xeCollapse.computeItemOptions
      const itemStaticOptions = $xeCollapse.computeItemStaticOptions
      const defaultSlot = slots.default
      const itemList = defaultSlot ? itemStaticOptions : itemOptions

      return h('div', {
        ref: 'refElem',
        class: ['vxe-collapse', {
          [`size--${vSize}`]: vSize,
          'is--padding': padding,
          'is--border': border
        }]
      }, [
        h('div', {
          class: 'vxe-collapse-slots'
        }, defaultSlot ? defaultSlot({}) : []),
        $xeCollapse.renderList(h, itemList)
      ])
    }
  },
  watch: {
    value () {
      const $xeCollapse = this

      $xeCollapse.updateModel()
    },
    options () {
      const $xeCollapse = this
      const props = $xeCollapse

      $xeCollapse.initDefaultName(props.options)
    },
    computeSpFlag () {
      const $xeCollapse = this
      const reactData = $xeCollapse.reactData

      $xeCollapse.initDefaultName(reactData.staticPanes)
    }
  },
  created () {
    const $xeCollapse = this
    const props = $xeCollapse
    const reactData = $xeCollapse.reactData

    $xeCollapse.internalData = createInternalData()

    $xeCollapse.updateModel()
    $xeCollapse.initDefaultName(reactData.staticPanes.length ? reactData.staticPanes : props.options)
  },
  destroyed () {
    const $xeCollapse = this
    const reactData = $xeCollapse.reactData
    const internalData = $xeCollapse.internalData

    const { esTime } = internalData
    if (esTime) {
      clearTimeout(esTime)
    }
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
