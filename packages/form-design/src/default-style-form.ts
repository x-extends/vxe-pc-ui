import { h, defineComponent, ref, PropType, computed, inject } from 'vue'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'

import type { VxeFormDesignDefines, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

const getBoldOptions = () => {
  return [
    { label: '常规', value: false },
    { label: '加粗', value: true }
  ]
}

const renderLayoutOption = (
  formData: VxeFormDesignDefines.DefaultSettingFormDataObjVO,
  field: keyof VxeFormDesignDefines.DefaultSettingFormDataObjVO,
  type: 'vertical' | 'horizontal',
  changeEvent: () => void
) => {
  return h('div', {
    class: ['vxe-design-form--widget-form-item-option', `is--${type}`, {
      'is--active': type === 'vertical' ? formData[field] : !formData[field]
    }],
    onClick () {
      formData[field] = type === 'vertical'
      changeEvent()
    }
  }, [
    h('div', {
      class: 'vxe-design-form--widget-form-item-option-row'
    }),
    h('div', {
      class: 'vxe-design-form--widget-form-item-option-row'
    }),
    h('div', {}, '上下布局')
  ])
}

export const DefaultPCStyleFormComponent = defineComponent({
  name: 'DefaultPCStyleForm',
  props: {
    formData: {
      type: Object as PropType<VxeFormDesignDefines.DefaultSettingFormDataObjVO>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    const verticalField = 'pcVertical'

    const boldOpsRef = ref(getBoldOptions())

    const computeTitleBold = computed(() => {
      return {
        title: '标题加粗',
        field: 'pcTitleBold',
        itemRender: {
          name: 'VxeRadioGroup',
          options: boldOpsRef.value,
          props: {
            type: 'button'
          },
          events: {
            change: refreshPreview
          }
        }
      }
    })

    const refreshPreview = () => {
      if ($xeFormDesign) {
        $xeFormDesign.refreshPreviewView()
      }
    }

    return () => {
      const { formData } = props

      return h(VxeFormComponent, {
        data: formData,
        span: 24,
        vertical: true
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '控件布局',
              field: verticalField
            }, {
              default () {
                return [
                  h('div', {
                    class: 'vxe-design-form--widget-form-item-layout'
                  }, [
                    renderLayoutOption(formData, verticalField, 'vertical', refreshPreview),
                    renderLayoutOption(formData, verticalField, 'horizontal', refreshPreview)
                  ])
                ]
              }
            }),
            h(VxeFormItemComponent, computeTitleBold.value)
          ]
        }
      })
    }
  }
})

export const DefaultMobileStyleFormComponent = defineComponent({
  name: 'DefaultMobileStyleForm',
  props: {
    formData: {
      type: Object as PropType<VxeFormDesignDefines.DefaultSettingFormDataObjVO>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    const verticalField = 'mobileVertical'

    const boldOpsRef = ref(getBoldOptions())

    const computeTitleBold = computed(() => {
      return {
        title: '标题加粗',
        field: 'mobileTitleBold',
        itemRender: {
          name: 'VxeRadioGroup',
          options: boldOpsRef.value,
          props: {
            type: 'button'
          }
        },
        events: {
          change: refreshPreview
        }
      }
    })

    const refreshPreview = () => {
      if ($xeFormDesign) {
        $xeFormDesign.refreshPreviewView()
      }
    }

    return () => {
      const { formData } = props

      return h(VxeFormComponent, {
        data: formData,
        span: 24,
        vertical: true
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '控件布局',
              field: verticalField
            }, {
              default () {
                return [
                  h('div', {
                    class: 'vxe-design-form--widget-form-item-layout'
                  }, [
                    renderLayoutOption(formData, verticalField, 'vertical', refreshPreview),
                    renderLayoutOption(formData, verticalField, 'horizontal', refreshPreview)
                  ])
                ]
              }
            }),
            h(VxeFormItemComponent, computeTitleBold.value)
          ]
        }
      })
    }
  }
})
