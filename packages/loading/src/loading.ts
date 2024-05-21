import { defineComponent, h, computed, PropType } from 'vue'
import { getConfig, getIcon, getI18n } from '@vxe-ui/core'
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
    }
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
      const loadingIcon = computeLoadingIcon.value
      const loadingText = computeLoadingText.value
      return h('div', {
        class: ['vxe-loading', {
          'is--visible': props.modelValue
        }]
      }, slots.default
        ? [
            h('div', {
              class: 'vxe-loading--wrapper'
            }, slots.default({}))
          ]
        : [
            h('div', {
              class: 'vxe-loading--chunk'
            }, [
              loadingIcon
                ? h('i', {
                  class: loadingIcon
                })
                : h('div', {
                  class: 'vxe-loading--spinner'
                }),
              loadingText
                ? h('div', {
                  class: 'vxe-loading--text'
                }, `${loadingText}`)
                : null
            ])
          ])
    }
  }
})
