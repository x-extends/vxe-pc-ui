import { ref, defineComponent, h, computed, PropType, watch, createCommentVNode } from 'vue'
import { getConfig, getIcon, getI18n } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import XEUtils from 'xe-utils'

import type { VxeLoadingPropTypes } from '../../../types'

export default defineComponent({
  name: 'VxeLoading',
  props: {
    modelValue: Boolean as PropType<VxeLoadingPropTypes.ModelValue>,
    icon: {
      type: String as PropType<VxeLoadingPropTypes.Icon>,
      default: () => getConfig().loading.icon
    },
    showIcon: {
      type: Boolean as PropType<VxeLoadingPropTypes.ShowIcon>,
      default: () => getConfig().loading.showIcon
    },
    text: {
      type: String as PropType<VxeLoadingPropTypes.Text>,
      default: () => getConfig().loading.text
    },
    showText: {
      type: Boolean as PropType<VxeLoadingPropTypes.ShowText>,
      default: () => getConfig().loading.showText
    },
    status: String as PropType<VxeLoadingPropTypes.Status>
  },
  setup (props, { slots }) {
    const refInitialized = ref(false)

    const computeLoadingIcon = computed(() => {
      return props.icon || getIcon().LOADING
    })

    const computeLoadingText = computed(() => {
      const { text } = props
      return XEUtils.isString(text) ? text : getI18n('vxe.loading.text')
    })

    const handleInit = () => {
      if (!refInitialized.value) {
        refInitialized.value = !!props.modelValue
      }
    }

    watch(() => props.modelValue, () => {
      handleInit()
    })

    handleInit()

    return () => {
      const { modelValue, showIcon, status } = props
      const defaultSlot = slots.default
      const textSlot = slots.text
      const iconSlot = slots.icon
      const initialized = refInitialized.value
      const loadingIcon = computeLoadingIcon.value
      const loadingText = computeLoadingText.value

      if (!initialized && !modelValue) {
        return createCommentVNode()
      }

      return h('div', {
        class: ['vxe-loading', {
          [`theme--${status}`]: status,
          'is--visible': modelValue
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
              showIcon && (iconSlot || loadingIcon)
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
