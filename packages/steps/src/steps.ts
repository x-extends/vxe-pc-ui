import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'
import { getText } from '../../ui/src/utils'
import { handleEmitModelVal } from '../../ui/src/vn'

import type { StepsReactData, StepsInternalData, VxeStepsPropTypes, VxeStepsEmits, ValueOf, VxeComponentSizeType } from '../../../types'

const { getConfig, getIcon, globalMixins, createEvent } = VxeUI

function createInternalData(): StepsInternalData {
  return {
    fullData: []
  }
}

function createReactData(): StepsReactData {
  return {
    itemList: [],
    staticItems: [],
    isOptConf: false
  }
}
export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeSteps',
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  mixins: [globalMixins.sizeMixin],
  props: {
    value: [Number, String] as PropType<VxeStepsPropTypes.ModelValue>,
    size: {
      type: String as PropType<VxeStepsPropTypes.Size>,
      default: () => getConfig().steps.size
    },
    options: Array as PropType<VxeStepsPropTypes.Options>,
    type: {
      type: String as PropType<VxeStepsPropTypes.Type>,
      default: () => getConfig().steps.type
    },
    vertical: {
      type: Boolean as PropType<VxeStepsPropTypes.Vertical>,
      default: () => getConfig().steps.vertical
    },
    optionProps: Object as PropType<VxeStepsPropTypes.OptionProps>,
    separator: {
      type: [String, Number] as PropType<VxeStepsPropTypes.Separator>,
      default: () => getConfig().steps.separator
    },
    showNumber: {
      type: Boolean as PropType<VxeStepsPropTypes.ShowNumber>,
      default: () => getConfig().steps.showNumber
    },
    showIcon: {
      type: Boolean as PropType<VxeStepsPropTypes.ShowIcon>,
      default: () => getConfig().steps.showIcon
    }
  },
  provide() {
    const $xeSteps = this
    return {
      $xeSteps
    }
  },
  data() {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()

    return {
      ...({} as {
        internalData: StepsInternalData
      }),
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computePropsOpts () {
      const $xeSteps = this
      const props = $xeSteps

      return Object.assign({}, getConfig().steps.optionProps, props.optionProps)
    },
    computeTitleField () {
      const $xeSteps = this

      const propsOpts = $xeSteps.computePropsOpts as VxeStepsPropTypes.OptionProps
      return propsOpts.title || 'title'
    },
    computeContentField () {
      const $xeSteps = this

      const propsOpts = $xeSteps.computePropsOpts as VxeStepsPropTypes.OptionProps
      return propsOpts.content || 'content'
    },
    computeStatusField () {
      const $xeSteps = this

      const propsOpts = $xeSteps.computePropsOpts as VxeStepsPropTypes.OptionProps
      return propsOpts.status || 'status'
    },
    computeSeparatorText () {
      const $xeSteps = this
      const props = $xeSteps

      const { separator } = props
      return XEUtils.toValueString(separator) || '>'
    },
    computeCurrentNum () {
      const $xeSteps = this
      const props = $xeSteps

      const { value: modelValue } = props
      return modelValue ? XEUtils.toNumber(modelValue) : 0
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent(type: ValueOf<VxeStepsEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSteps = this
      $xeSteps.$emit(type, createEvent(evnt, { $steps: $xeSteps }, params))
    },
    emitModel(value: any) {
      const $xeSwitch = this

      handleEmitModelVal($xeSwitch, value)
    },
    loadData (opts: any[], isOptConf: boolean) {
      const $xeSteps = this
      const reactData = $xeSteps.reactData
      const internalData = $xeSteps.internalData

      reactData.isOptConf = isOptConf
      internalData.fullData = opts || []
      $xeSteps.updateItems()
    },
    updateItems () {
      const $xeSteps = this
      const reactData = $xeSteps.reactData
      const internalData = $xeSteps.internalData

      const { fullData } = internalData
      reactData.itemList = fullData.slice(0)
    },

    //
    // Render
    //
    renderIcon (h: CreateElement, itemStatus: string, isCurrent: boolean, isFinish: boolean, index: number) {
      const $xeSteps = this
      const props = $xeSteps

      const { showNumber, showIcon } = props
      if (!showNumber) {
        return h('span', {
          class: 'vxe-steps--item-icon-dot'
        })
      }
      if (showIcon && (isFinish || itemStatus === 'finish' || itemStatus === 'error')) {
        return h('span', {
          class: 'vxe-steps--item-icon-status'
        }, [
          h('i', {
            class: itemStatus === 'error' ? (isCurrent ? getIcon().STEPS_STATUS_ERROR_CURRENT : getIcon().STEPS_STATUS_ERROR) : (isCurrent ? getIcon().STEPS_STATUS_FINISH_CURRENT : getIcon().STEPS_STATUS_FINISH)
          })
        ])
      }
      return h('span', {
        class: 'vxe-steps--item-icon-num'
      }, `${index + 1}`)
    },
    renderItem (h: CreateElement, item: any, index: number) {
      const $xeSteps = this
      const reactData = $xeSteps.reactData
      const slots = $xeSteps.$scopedSlots

      const { itemList, isOptConf } = reactData
      const titleField = $xeSteps.computeTitleField
      const contentField = $xeSteps.computeContentField
      const currentNum = $xeSteps.computeCurrentNum
      const statusField = $xeSteps.computeStatusField
      const titleVal = getText(isOptConf ? item[titleField] : item.title)
      const contentVal = getText(isOptConf ? item[contentField] : item.content)
      const customStatus = getText(isOptConf ? item[statusField] : item.status)
      const titleSlot = slots.title
      const contentSlot = slots.content
      const isFinish = currentNum > index
      const isCurrent = currentNum === index
      return h('div', {
        key: index,
        class: [
          'vxe-steps--item',
          {
            [`status--${customStatus}`]: customStatus,
            'is--finish': isFinish,
            'is--current': isCurrent,
            'is--last': index === itemList.length - 1
          }
        ]
      },
      [
        h('div', {
          class: 'vxe-steps--item-line'
        }),
        h(
          'div', {
            class: 'vxe-steps--item-icon'
          }, [
            $xeSteps.renderIcon(h, customStatus, isCurrent, isFinish, index)
          ]),
        h('div', {
          class: 'vxe-steps--item-wrapper'
        },
        [
          h('div', {
            class: 'vxe-steps--item-title'
          }, titleSlot ? titleSlot({ item }) : titleVal),
          h('div', {
            class: 'vxe-steps--item-content'
          }, contentSlot ? contentSlot({ item }) : contentVal)
        ])
      ])
    },
    renderSeparator (h: CreateElement, index: number) {
      const $xeSteps = this
      const slots = $xeSteps.$scopedSlots

      const separatorText = $xeSteps.computeSeparatorText
      const separatorSlot = slots.separator
      return h('div', {
        key: `s${index}`,
        class: 'vxe-steps--item-separator'
      }, separatorSlot
        ? separatorSlot({})
        : [
            separatorText
              ? h('span', {
                key: 'st'
              }, separatorText)
              : h('span', {
                key: 'si',
                class: getIcon().STEPS_SEPARATOR
              })
          ]
      )
    },
    renderItems (h: CreateElement) {
      const $xeSteps = this
      const props = $xeSteps
      const reactData = $xeSteps.reactData

      const { type, vertical } = props
      const { itemList } = reactData
      const isSimple = type === 'simple'
      const list: any[] = []
      itemList.forEach((item, index) => {
        list.push($xeSteps.renderItem(h, item, index))
        if (isSimple && !vertical && index < itemList.length - 1) {
          list.push($xeSteps.renderSeparator(h, index))
        }
      })
      return list
    },
    renderVN(h: CreateElement): VNode {
      const $xeSteps = this
      const props = $xeSteps
      const slots = $xeSteps.$scopedSlots

      const { showNumber, vertical, type } = props
      const vSize = $xeSteps.computeSize
      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: [
          'vxe-steps',
          {
            [`size--${vSize}`]: vSize,
            'is--number': showNumber,
            'is--vertical': vertical,
            'is--horizontal': !vertical,
            'is--simple': type === 'simple'
          }
        ]
      },
      [
        h('div', {
          class: 'vxe-steps--slots'
        }, defaultSlot ? defaultSlot({}) : []),
        h('div', {
          class: 'vxe-steps--body'
        }, $xeSteps.renderItems(h))
      ])
    }
  },
  watch: {
    'reactData.staticItems' (val: any) {
      const $xeSteps = this

      $xeSteps.loadData(val, false)
    },
    options (val: any) {
      const $xeSteps = this

      $xeSteps.loadData(val || [], true)
    },
    reverse () {
      const $xeSteps = this

      $xeSteps.updateItems()
    }
  },
  created() {
    const $xeSteps = this

    $xeSteps.internalData = createInternalData()
  },
  mounted() {
    const $xeSteps = this
    const props = $xeSteps
    const reactData = $xeSteps.reactData

    const { staticItems } = reactData
    if (staticItems.length) {
      $xeSteps.loadData(staticItems, false)
    } else {
      $xeSteps.loadData(props.options || [], true)
    }
  },
  destroyed() {
    const $xeSteps = this
    const reactData = $xeSteps.reactData
    const internalData = $xeSteps.internalData

    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render(this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
