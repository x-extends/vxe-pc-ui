import { ref, h, reactive, PropType, computed, watch, provide, onMounted, onBeforeUnmount } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'
import { getText } from '../../ui/src/utils'

import type { StepsReactData, StepsInternalData, VxeStepsEmits, VxeStepsPropTypes, StepsMethods, StepsPrivateMethods, StepsPrivateRef, StepsPrivateComputed, VxeStepsConstructor, VxeStepsPrivateMethods, ValueOf } from '../../../types'

const { getConfig, getIcon, useFns, createEvent } = VxeUI

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
  props: {
    modelValue: [Number, String] as PropType<VxeStepsPropTypes.ModelValue>,
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
  emits: [
    'update:modelValue'
  ] as VxeStepsEmits,
  setup(props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useFns.useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive(createReactData())
    const internalData = createInternalData()

    const refMaps: StepsPrivateRef = {
      refElem
    }

    const computeMaps: StepsPrivateComputed = {}

    const $xeSteps = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeStepsConstructor & VxeStepsPrivateMethods

    const computePropsOpts = computed(() => {
      return Object.assign({}, getConfig().steps.optionProps, props.optionProps)
    })

    const computeTitleField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.title || 'title'
    })

    const computeContentField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.content || 'content'
    })

    const computeStatusField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.status || 'status'
    })

    const computeSeparatorText = computed(() => {
      const { separator } = props
      return XEUtils.toValueString(separator) || ''
    })

    const computeCurrentNum = computed(() => {
      const { modelValue } = props
      return modelValue ? XEUtils.toNumber(modelValue) : 0
    })

    const dispatchEvent = (type: ValueOf<VxeStepsEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $steps: $xeSteps }, params))
    }

    const loadData = (opts: any[], isOptConf: boolean) => {
      reactData.isOptConf = isOptConf
      internalData.fullData = opts || []
      updateItems()
    }

    const updateItems = () => {
      const { fullData } = internalData
      reactData.itemList = fullData.slice(0)
    }

    const stepsMethods: StepsMethods = {
      dispatchEvent
    }

    const stepsPrivateMethods: StepsPrivateMethods = {}

    Object.assign($xeSteps, stepsMethods, stepsPrivateMethods)

    const renderIcon = (itemStatus: string, isCurrent: boolean, isFinish: boolean, index: number) => {
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
    }

    const renderItem = (item: any, index: number) => {
      const { itemList, isOptConf } = reactData
      const titleField = computeTitleField.value
      const contentField = computeContentField.value
      const currentNum = computeCurrentNum.value
      const statusField = computeStatusField.value
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
            'is--current': currentNum === index,
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
            renderIcon(customStatus, isCurrent, isFinish, index)
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
    }

    const renderSeparator = (index: number) => {
      const separatorText = computeSeparatorText.value
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
    }

    const renderItems = () => {
      const { type, vertical } = props
      const { itemList } = reactData
      const isSimple = type === 'simple'
      const list: any[] = []
      itemList.forEach((item, index) => {
        list.push(renderItem(item, index))
        if (isSimple && !vertical && index < itemList.length - 1) {
          list.push(renderSeparator(index))
        }
      })
      return list
    }

    const renderVN = () => {
      const { showNumber, vertical, type } = props
      const vSize = computeSize.value
      const defaultSlot = slots.default
      return h(
        'div',
        {
          ref: refElem,
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
          h(
            'div',
            {
              class: 'vxe-steps--slots'
            },
            defaultSlot ? defaultSlot({}) : []
          ),
          h(
            'div',
            {
              class: 'vxe-steps--body'
            },
            renderItems()
          )
        ]
      )
    }

    watch(
      () => reactData.staticItems,
      (val) => {
        loadData(val, false)
      }
    )

    const refOptsFlag = ref(0)
    watch(
      () => props.options,
      () => {
        refOptsFlag.value++
      }
    )
    watch(
      () => (props.options ? props.options.length : -1),
      () => {
        refOptsFlag.value++
      }
    )
    watch(refOptsFlag, () => {
      loadData(props.options || [], true)
    })

    onMounted(() => {
      const { staticItems } = reactData
      if (staticItems.length) {
        loadData(staticItems, false)
      } else {
        loadData(props.options || [], true)
      }
    })

    onBeforeUnmount(() => {
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    provide('$xeSteps', $xeSteps)

    $xeSteps.renderVN = renderVN

    return $xeSteps
  },
  render() {
    return this.renderVN()
  }
}) /* define-vxe-component end */
