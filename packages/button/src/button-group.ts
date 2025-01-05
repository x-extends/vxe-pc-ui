import { defineComponent, h, reactive, provide, PropType, createCommentVNode } from 'vue'
import { getConfig, createEvent, useSize, usePermission } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import VxeButtonComponent from './button'

import type { VxeButtonGroupPropTypes, VxeButtonGroupEmits, ButtonGroupReactData, VxeButtonGroupConstructor, VxeButtonGroupPrivateMethods, ButtonGroupMethods, ButtonPrivateComputed, ButtonGroupPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeButtonGroup',
  props: {
    options: Array as PropType<VxeButtonGroupPropTypes.Options>,
    mode: String as PropType<VxeButtonGroupPropTypes.Mode>,
    status: String as PropType<VxeButtonGroupPropTypes.Status>,
    round: Boolean as PropType<VxeButtonGroupPropTypes.Round>,
    vertical: Boolean as PropType<VxeButtonGroupPropTypes.Vertical>,
    circle: Boolean as PropType<VxeButtonGroupPropTypes.Circle>,
    align: String as PropType<VxeButtonGroupPropTypes.Align>,
    className: [String, Function] as PropType<VxeButtonGroupPropTypes.ClassName>,
    disabled: Boolean as PropType<VxeButtonGroupPropTypes.Disabled>,
    permissionCode: [String, Number] as PropType<VxeButtonGroupPropTypes.PermissionCode>,
    size: {
      type: String as PropType<VxeButtonGroupPropTypes.Size>,
      default: () => getConfig().buttonGroup.size || getConfig().size
    }
  },
  emits: [
    'click'
  ] as VxeButtonGroupEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const reactData = reactive<ButtonGroupReactData>({
    })

    const computeMaps: ButtonPrivateComputed = {}

    const $xeButtonGroup = {
      xID,
      props,
      context,
      reactData,

      getComputeMaps: () => computeMaps
    } as unknown as VxeButtonGroupConstructor & VxeButtonGroupPrivateMethods

    useSize(props)

    const { computePermissionInfo } = usePermission(props)

    const buttonGroupMethods: ButtonGroupMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $buttonGroup: $xeButtonGroup }, params))
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
      const { className, options, vertical } = props
      const permissionInfo = computePermissionInfo.value
      const defaultSlot = slots.default
      if (!permissionInfo.visible) {
        return createCommentVNode()
      }
      return h('div', {
        class: ['vxe-button-group', className ? (XEUtils.isFunction(className) ? className({ $buttonGroup: $xeButtonGroup }) : className) : '', {
          'is--vertical': vertical
        }]
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

    return $xeButtonGroup
  },
  render () {
    return this.renderVN()
  }
})
