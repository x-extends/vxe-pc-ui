import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, getIcon, createEvent, permission, renderEmptyElement, globalMixins } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import XEUtils from 'xe-utils'

import type { CollapseReactData, VxeCollapseEmits, VxeCollapsePropTypes, VxeCollapsePanePropTypes, VxeCollapsePaneProps, VxeCollapsePaneDefines, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeCollapse',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    modelValue: Array as PropType<VxeCollapsePropTypes.ModelValue>,
    options: Array as PropType<VxeCollapsePropTypes.Options>,
    padding: {
      type: Boolean as PropType<VxeCollapsePropTypes.Padding>,
      default: () => getConfig().collapse.padding
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
    const reactData: CollapseReactData = {
      staticPanes: [],
      activeNames: [],
      initNames: [],
      cachePaneMaps: {}
    }
    return {
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
      const reactData = $xeCollapse.reactData

      const { staticPanes } = reactData
      return staticPanes.filter((item: any) => $xeCollapse.handleFilterItem(item))
    },
    computeExpandOpts () {
      const $xeCollapse = this
      const props = $xeCollapse

      return Object.assign({}, getConfig().collapse.expandConfig, props.expandConfig)
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
    handleFilterItem  (item: VxeCollapsePaneProps | VxeCollapsePaneDefines.CollapseConfig) {
      const { permissionCode } = item
      if (permissionCode) {
        if (!permission.checkVisible(permissionCode)) {
          return false
        }
      }
      return true
    },
    addInitName  (name: VxeCollapsePanePropTypes.Name | undefined) {
      const $xeCollapse = this
      const reactData = $xeCollapse.reactData

      const { initNames } = reactData
      if (name && !initNames.includes(name)) {
        initNames.push(name)
        return true
      }
      return false
    },
    initDefaultName (list?: VxeCollapsePropTypes.Options | VxeCollapsePaneDefines.CollapseConfig[]) {
      const $xeCollapse = this
      const reactData = $xeCollapse.reactData

      const { activeNames } = reactData
      const nameMaps: Record<string, {
        loading: boolean
      }> = {}
      if (list && list.length) {
        list.forEach((item) => {
          const { name, preload } = item || {}
          if (name) {
            const isActive = activeNames.includes(name)
            nameMaps[`${name}`] = {
              loading: false
            }
            if (isActive) {
              $xeCollapse.addInitName(name)
            }
            if (preload) {
              if (!isActive) {
                activeNames.push(name)
              }
            }
          }
        })
      }
      reactData.activeNames = activeNames ? activeNames.slice(0) : []
      reactData.cachePaneMaps = nameMaps
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
      const reactData = $xeCollapse.reactData

      const { activeNames } = reactData
      const { name } = item
      if (name) {
        const aIndex = activeNames.indexOf(name)
        if (aIndex === -1) {
          activeNames.push(name)
        } else {
          activeNames.splice(aIndex, 1)
        }
        $xeCollapse.addInitName(name)
      }
    },

    //
    // Render
    //
    renderList (h:CreateElement, itemList: VxeCollapsePropTypes.Options | VxeCollapsePaneDefines.CollapseConfig[]) {
      const $xeCollapse = this
      const reactData = $xeCollapse.reactData

      const { activeNames, initNames } = reactData
      const expandOpts = $xeCollapse.computeExpandOpts
      return itemList.map(item => {
        const { icon, name, title, slots } = item
        const titleSlot = slots ? slots.title : null
        const defaultSlot = slots ? slots.default : null
        const isActive = name && activeNames.includes(name)
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
              'is--visible': isActive
            }]
          }, [
            name && initNames.includes(name)
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

      const { padding } = props
      const vSize = $xeCollapse.computeSize
      const itemOptions = $xeCollapse.computeItemOptions
      const itemStaticOptions = $xeCollapse.computeItemStaticOptions
      const defaultSlot = slots.default
      const itemList = defaultSlot ? itemStaticOptions : itemOptions

      return h('div', {
        ref: 'refElem',
        class: ['vxe-collapse', {
          [`size--${vSize}`]: vSize,
          'is--padding': padding
        }]
      }, [
        h('div', {
          class: 'vxe-collapse-slots'
        }, defaultSlot ? defaultSlot({}) : []),
        $xeCollapse.renderList(h, itemList)
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
