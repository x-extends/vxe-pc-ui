import { defineComponent, h, computed } from 'vue'
import globalConfigStore from '../../ui/src/globalStore'
import iconConfigStore from '../../ui/src/iconStore'
import { getI18n } from '../../ui/src/i18n'

export default defineComponent({
  name: 'VxeLoading',
  props: {
    modelValue: Boolean,
    icon: String,
    text: String
  },
  setup (props, { slots }) {
    const computeLoadingIcon = computed(() => {
      return props.icon || iconConfigStore.LOADING
    })

    const computeLoadingText = computed(() => {
      const loadingText = globalConfigStore.loadingText
      return props.text || (loadingText === null ? loadingText : getI18n('vxe.loading.text'))
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
