import { defineComponent, h, provide, PropType } from 'vue'
import { getConfig } from '../../ui/src/core'
import XEUtils from 'xe-utils'
import VxeButtonComponent from '../../button/src/button'
import { useSize } from '../../hooks/size'

import { VxeButtonGroupPropTypes, VxeButtonGroupEmits, VxeButtonGroupConstructor, VxeButtonGroupPrivateMethods, ButtonGroupMethods, ButtonPrivateComputed, ButtonGroupPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeButtonGroup',
  props: {
    options: Array as PropType<VxeButtonGroupPropTypes.Options>,
    mode: String as PropType<VxeButtonGroupPropTypes.Mode>,
    status: String as PropType<VxeButtonGroupPropTypes.Status>,
    round: Boolean as PropType<VxeButtonGroupPropTypes.Round>,
    circle: Boolean as PropType<VxeButtonGroupPropTypes.Circle>,
    className: [String, Function] as PropType<VxeButtonGroupPropTypes.ClassName>,
    disabled: Boolean as PropType<VxeButtonGroupPropTypes.Disabled>,
    size: { type: String as PropType<VxeButtonGroupPropTypes.Size>, default: () => getConfig('buttonGroup.size') || getConfig('size') }
  },
  emits: [
    'click'
  ] as VxeButtonGroupEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const computeMaps: ButtonPrivateComputed = {}

    const $xeButtonGroup = {
      xID,
      props,
      context,

      getComputeMaps: () => computeMaps
    } as unknown as VxeButtonGroupConstructor & VxeButtonGroupPrivateMethods

    useSize(props)

    const buttonGroupMethods: ButtonGroupMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, Object.assign({ $buttonGroup: $xeButtonGroup, $event: evnt }, params))
      }
    }

    const buttonGroupPrivateMethods: ButtonGroupPrivateMethods = {
      handleClick (params, evnt) {
        const { options } = props
        const { name } = params
        const option = options ? options.find(item => item.name === name) : null
        buttonGroupMethods.dispatchEvent('click', { ...params, option }, evnt)
      }
    }

    Object.assign($xeButtonGroup, buttonGroupMethods, buttonGroupPrivateMethods)

    const renderVN = () => {
      const { className, options } = props
      const defaultSlot = slots.default
      return h('div', {
        class: ['vxe-button-group', className ? (XEUtils.isFunction(className) ? className({ $buttonGroup: $xeButtonGroup }) : className) : '']
      }, defaultSlot
        ? defaultSlot({})
        : (options
            ? options.map((item, index) => {
              return h(VxeButtonComponent, {
                key: index,
                ...item
              })
            })
            : []))
    }

    $xeButtonGroup.renderVN = renderVN

    provide('$xeButtonGroup', $xeButtonGroup)

    return renderVN
  }
})
