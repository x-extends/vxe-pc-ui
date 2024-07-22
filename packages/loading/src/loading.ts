import { defineComponent, h, computed, PropType } from 'vue'
import { getConfig, getIcon, getI18n } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import XEUtils from 'xe-utils'

import type { VxeLoadingPropTypes } from '../../../types'

export default defineComponent({
  name: 'VxeLoading',
  props: {
    modelValue: Boolean as PropType<VxeLoadingPropTypes.ModelValue>,
    icon: String as PropType<VxeLoadingPropTypes.Icon>,
    text: {
      type: String as PropType<VxeLoadingPropTypes.Text>,
      default: () => getConfig().loading.text
    },
    status: String as PropType<VxeLoadingPropTypes.Status>
  },
  setup (props, { slots }) {
    const computeLoadingIcon = computed(() => {
      return props.icon || getIcon().LOADING
    })

    const computeLoadingText = computed(() => {
      const { text } = props
      return XEUtils.isString(text) ? text : getI18n('vxe.loading.text')
    })

    return () => {
      const { status } = props
      const defaultSlot = slots.default
      const textSlot = slots.text
      const iconSlot = slots.icon
      const loadingIcon = computeLoadingIcon.value
      const loadingText = computeLoadingText.value

      return h('div', {
        class: ['vxe-loading', {
          [`theme--${status}`]: status,
          'is--visible': props.modelValue
        }]
      }, defaultSlot
        ? [
            h('div', {
              class: 'vxe-loading--wrapper'
            }, getSlotVNs(defaultSlot({})))
          ]
        : [
            h('div', {
              class: 'vxe-loading--chunk'
            }, [
              iconSlot || loadingIcon
                ? h('div', {
                  class: 'vxe-loading--icon'
                }, iconSlot
                  ? getSlotVNs(iconSlot({}))
                  : [
                      h('i', {
                        class: loadingIcon
                      })
                    ])
                : h('div', {
                  class: 'vxe-loading--spinner'
                }),
              textSlot || loadingText
                ? h('div', {
                  class: 'vxe-loading--text'
                }, textSlot ? getSlotVNs(textSlot({})) : `${loadingText}`)
                : null
            ])
          ])
    }
  }
})
