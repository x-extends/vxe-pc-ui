import { defineComponent, h } from 'vue'

export default defineComponent({
  props: {},
  emits: [],
  setup () {
    return () => {
      return h('div', {
        class: 'vxe-design-form--setting'
      })
    }
  }
})
