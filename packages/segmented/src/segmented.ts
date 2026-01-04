import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'

import type { VxeSegmentedPropTypes, SegmentedReactData, VxeSegmentedEmits, VxeComponentSizeType, ValueOf, VxeComponentStyleType } from '../../../types'

function createReactData (): SegmentedReactData {
  return {
    groupName: XEUtils.uniqueId('xe_group_'),
    selectStyle: {
      display: '',
      left: '',
      width: ''
    }
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeSegmented',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number] as PropType<VxeSegmentedPropTypes.ModelValue>,
    name: [String, Number] as PropType<VxeSegmentedPropTypes.Name>,
    disabled: Boolean as PropType<VxeSegmentedPropTypes.Disabled>,
    options: Array as PropType<VxeSegmentedPropTypes.Options>,
    type: {
      type: String as PropType<VxeSegmentedPropTypes.Type>,
      default: () => getConfig().segmented.type
    },
    status: String as PropType<VxeSegmentedPropTypes.Status>,
    width: [String, Number] as PropType<VxeSegmentedPropTypes.Width>,
    height: [String, Number] as PropType<VxeSegmentedPropTypes.Height>,
    optionConfig: Object as PropType<VxeSegmentedPropTypes.OptionConfig>,
    size: {
      type: String as PropType<VxeSegmentedPropTypes.Size>,
      default: () => getConfig().segmented.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeItemType () {
      const $xeSegmented = this
      const props = $xeSegmented

      const { type } = props
      if (type === 'round') {
        return type
      }
      if (type === 'inside') {
        return type
      }
      return 'default'
    },
    computeWrapperStyle () {
      const $xeSegmented = this
      const props = $xeSegmented

      const { width } = props
      const stys: VxeComponentStyleType = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      return stys
    },
    computeOptionOpts () {
      const $xeSegmented = this
      const props = $xeSegmented

      return Object.assign({}, getConfig().segmented.optionConfig, props.optionConfig)
    },
    computeItemList () {
      const $xeSegmented = this
      const props = $xeSegmented

      return props.options || []
    },
    computeSelectIndex () {
      const $xeSegmented = this
      const props = $xeSegmented

      const { value: modelValue } = props
      const itemList = $xeSegmented.computeItemList
      return XEUtils.findIndexOf(itemList, item => item.value === modelValue)
    },
    comIsFullWidth () {
      const $xeSegmented = this

      const wrapperStyle = $xeSegmented.computeWrapperStyle as VxeComponentStyleType
      return wrapperStyle.width === '100%'
    }
  },
  watch: {
    computeSelectIndex () {
      const $xeSegmented = this

      $xeSegmented.updateStyle()
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeSegmentedEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSegmented = this
      $xeSegmented.$emit(type, createEvent(evnt, { $segmented: $xeSegmented }, params))
    },
    emitModel  (value: any) {
      const $xeSegmented = this

      const { _events } = $xeSegmented as any
      if (_events && _events.modelValue) {
        $xeSegmented.$emit('modelValue', value)
      } else {
        $xeSegmented.$emit('model-value', value)
      }
    },
    changeEvent (evnt: Event, item: VxeSegmentedPropTypes.Option) {
      const $xeSegmented = this

      const value = item.value
      $xeSegmented.emitModel(value)
      $xeSegmented.dispatchEvent('change', { value }, evnt)
      $xeSegmented.updateStyle()
    },
    updateStyle () {
      const $xeSegmented = this
      const reactData = $xeSegmented.reactData

      $xeSegmented.$nextTick(() => {
        const selectIndex = $xeSegmented.computeSelectIndex
        const wrapperElem = $xeSegmented.$refs.refWrapperElem as HTMLDivElement
        const atStyle = {
          display: '',
          left: '',
          width: ''
        }
        if (wrapperElem) {
          const itemEl = wrapperElem.children[selectIndex] as HTMLDivElement
          if (itemEl) {
            atStyle.display = 'block'
            atStyle.left = toCssUnit(itemEl.offsetLeft)
            atStyle.width = toCssUnit(itemEl.clientWidth)
          }
        }
        reactData.selectStyle = atStyle
      })
    },

    //
    // Render
    //
    renderItems (h: CreateElement) {
      const $xeSegmented = this
      const props = $xeSegmented
      const reactData = $xeSegmented.reactData
      const slots = $xeSegmented.$scopedSlots

      const { value: modelValue, name } = props
      const { groupName } = reactData
      const optionOpts = $xeSegmented.computeOptionOpts
      const itemList = $xeSegmented.computeItemList
      const isFullWidth = $xeSegmented.comIsFullWidth
      const fullItemWidth = isFullWidth ? Math.max(0, 100 / itemList.length) : 0
      const defaultSlot = slots.default
      const itemVNs: VNode[] = []
      itemList.forEach((item, i) => {
        const { icon, width } = item
        const itemWidth = width || optionOpts.width
        itemVNs.push(
          h('label', {
            key: i,
            class: ['vxe-segmented--item', {
              'is--checked': modelValue === item.value
            }],
            style: isFullWidth || itemWidth
              ? {
                  width: itemWidth ? toCssUnit(itemWidth) : (fullItemWidth ? `${fullItemWidth}%` : '')
                }
              : undefined
          }, [
            h('input', {
              class: 'vxe-segmented--input',
              attrs: {
                type: 'radio',
                name: name || groupName
              },
              on: {
                change (evnt: Event) {
                  $xeSegmented.changeEvent(evnt, item)
                }
              }
            }),
            h('div', {
              class: 'vxe-segmented--content'
            }, [
              icon
                ? h('div', {
                  class: 'vxe-segmented--icon'
                }, [
                  h('i', {
                    class: icon
                  })
                ])
                : renderEmptyElement($xeSegmented),
              h('div', {
                class: 'vxe-segmented--label'
              }, defaultSlot ? defaultSlot({ option: item }) : XEUtils.eqNull(item.label) ? '' : `${item.label}`)
            ])
          ])
        )
      })
      return itemVNs
    },
    renderVN (h: CreateElement): VNode {
      const $xeSegmented = this
      const props = $xeSegmented
      const reactData = $xeSegmented.reactData

      const { status } = props
      const { selectStyle } = reactData
      const itemType = $xeSegmented.computeItemType
      const wrapperStyle = $xeSegmented.computeWrapperStyle
      const vSize = $xeSegmented.computeSize
      return h('div', {
        ref: 'refElem',
        class: ['vxe-segmented', `type--${itemType}`, {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status
        }]
      }, [
        h('div', {
          class: 'vxe-segmented--group',
          style: wrapperStyle
        }, [
          h('div', {
            ref: 'refSelectedElem',
            class: 'vxe-segmented--selected',
            style: selectStyle
          }),
          h('div', {
            ref: 'refWrapperElem',
            class: 'vxe-segmented--inner'
          }, $xeSegmented.renderItems(h))
        ])
      ])
    }
  },
  beforeDestroy () {
    const $xeSegmented = this
    const reactData = $xeSegmented.reactData

    XEUtils.assign(reactData, createReactData())
  },
  mounted () {
    const $xeSegmented = this

    $xeSegmented.updateStyle()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
