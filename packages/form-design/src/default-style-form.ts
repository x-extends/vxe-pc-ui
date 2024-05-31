import { h, defineComponent, ref, PropType, inject, createCommentVNode } from 'vue'
import { getI18n } from '@vxe-ui/core'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeInputComponent from '../../input/src/input'
import VxeRadioGroupComponent from '../../radio/src/group'
import VxeSelectGroupComponent from '../../select/src/select'

import type { VxeFormDesignDefines, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

const getBoldOptions = () => {
  return [
    { label: getI18n('vxe.formDesign.styleSetting.fontNormal'), value: false },
    { label: getI18n('vxe.formDesign.styleSetting.fontBold'), value: true }
  ]
}

const getColonOptions = () => {
  return [
    { label: getI18n('vxe.formDesign.styleSetting.colonVisible'), value: true },
    { label: getI18n('vxe.formDesign.styleSetting.colonHidden'), value: false }
  ]
}

const getAlignOptions = () => {
  return [
    { label: getI18n('vxe.formDesign.styleSetting.alignLeft'), value: '' },
    { label: getI18n('vxe.formDesign.styleSetting.alignRight'), value: 'right' }
  ]
}

const getWidthUnitOptions = () => {
  return [
    { label: getI18n('vxe.formDesign.styleSetting.unitPx'), value: '' },
    { label: getI18n('vxe.formDesign.styleSetting.unitPct'), value: '%' }
  ]
}

const renderLayoutOption = (
  formData: VxeFormDesignDefines.DefaultSettingFormDataObjVO,
  field: 'pcVertical' | 'mobileVertical',
  type: 'vertical' | 'horizontal',
  changeEvent: () => void
) => {
  const isVertical = type === 'vertical'
  return h('div', {
    class: ['vxe-form-design--widget-form-item-option', `is--${type}`, {
      'is--active': isVertical ? formData[field] : !formData[field]
    }],
    onClick () {
      formData[field] = isVertical
      changeEvent()
    }
  }, [
    h('div', {
      class: 'vxe-form-design--widget-form-item-option-row'
    }),
    h('div', {
      class: 'vxe-form-design--widget-form-item-option-row'
    }),
    h('div', {}, isVertical ? getI18n('vxe.formDesign.styleSetting.verticalLayout') : getI18n('vxe.formDesign.styleSetting.horizontalLayout'))
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

    const refBoldOpts = ref(getBoldOptions())
    const refColonOpts = ref(getColonOptions())
    const refAlignOpts = ref(getAlignOptions())
    const refWidthUnitOpts = ref(getWidthUnitOptions())

    const refreshPreview = () => {
      if ($xeFormDesign) {
        $xeFormDesign.refreshPreviewView()
      }
    }

    const changeLayoutEvent = () => {
      const { formData } = props
      if (!formData.pcTitleWidth) {
        formData.pcTitleWidth = 100
      }
      refreshPreview()
    }

    return () => {
      const { formData } = props

      return h(VxeFormComponent, {
        data: formData,
        span: 24,
        vertical: true,
        titleBold: true
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.styleSetting.layoutTitle'),
              field: verticalField
            }, {
              default () {
                return [
                  h('div', {
                    class: 'vxe-form-design--widget-form-item-layout'
                  }, [
                    renderLayoutOption(formData, verticalField, 'vertical', changeLayoutEvent),
                    renderLayoutOption(formData, verticalField, 'horizontal', changeLayoutEvent)
                  ])
                ]
              }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.styleSetting.styleTitle')
            }, {
              default () {
                return [
                  h('div', {
                    class: 'vxe-form-design--widget-form-item-prop-list'
                  }, [
                    h('span', {}, getI18n('vxe.formDesign.styleSetting.boldTitle')),
                    h(VxeRadioGroupComponent, {
                      modelValue: formData.pcTitleBold,
                      options: refBoldOpts.value,
                      onChange: refreshPreview,
                      'onUpdate:modelValue' (val) {
                        formData.pcTitleBold = val
                      }
                    })
                  ]),
                  h('div', {
                    class: 'vxe-form-design--widget-form-item-prop-list'
                  }, [
                    h('span', {}, getI18n('vxe.formDesign.styleSetting.colonTitle')),
                    h(VxeRadioGroupComponent, {
                      modelValue: formData.pcTitleColon,
                      options: refColonOpts.value,
                      onChange: refreshPreview,
                      'onUpdate:modelValue' (val) {
                        formData.pcTitleColon = val
                      }
                    })
                  ]),
                  formData.pcVertical
                    ? createCommentVNode()
                    : h('div', {
                      class: 'vxe-form-design--widget-form-item-prop-list'
                    }, [
                      h('span', {}, getI18n('vxe.formDesign.styleSetting.alignTitle')),
                      h(VxeRadioGroupComponent, {
                        modelValue: formData.pcTitleAlign,
                        options: refAlignOpts.value,
                        onChange: refreshPreview,
                        'onUpdate:modelValue' (val) {
                          formData.pcTitleAlign = val
                        }
                      })
                    ]),
                  formData.pcVertical
                    ? createCommentVNode()
                    : h('div', {
                      class: 'vxe-form-design--widget-form-item-prop-list'
                    }, [
                      h('span', {}, getI18n('vxe.formDesign.styleSetting.widthTitle')),
                      h(VxeInputComponent, {
                        class: 'vxe-form-design--widget-form-item-prop-width',
                        modelValue: formData.pcTitleWidth,
                        type: 'integer',
                        onChange: refreshPreview,
                        'onUpdate:modelValue' (val) {
                          formData.pcTitleWidth = val
                        }
                      }),
                      h(VxeSelectGroupComponent, {
                        class: 'vxe-form-design--widget-form-item-prop-unit',
                        modelValue: formData.pcTitleWidthUnit,
                        options: refWidthUnitOpts.value,
                        transfer: true,
                        onChange: refreshPreview,
                        'onUpdate:modelValue' (val) {
                          formData.pcTitleWidthUnit = val
                        }
                      })
                    ])
                ]
              }
            })
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

    const refBoldOpts = ref(getBoldOptions())
    const refColonOpts = ref(getColonOptions())
    const refAlignOpts = ref(getAlignOptions())
    const refWidthUnitOpts = ref(getWidthUnitOptions())

    const refreshPreview = () => {
      if ($xeFormDesign) {
        $xeFormDesign.refreshPreviewView()
      }
    }

    const changeLayoutEvent = () => {
      const { formData } = props
      if (!formData.mobileTitleWidth) {
        formData.mobileTitleWidth = 100
      }
      refreshPreview()
    }

    return () => {
      const { formData } = props

      return h(VxeFormComponent, {
        data: formData,
        span: 24,
        vertical: true,
        titleBold: true
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.styleSetting.layoutTitle'),
              field: verticalField
            }, {
              default () {
                return [
                  h('div', {
                    class: 'vxe-form-design--widget-form-item-layout'
                  }, [
                    renderLayoutOption(formData, verticalField, 'vertical', changeLayoutEvent),
                    renderLayoutOption(formData, verticalField, 'horizontal', changeLayoutEvent)
                  ])
                ]
              }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.styleSetting.styleTitle')
            }, {
              default () {
                return [
                  h('div', {
                    class: 'vxe-form-design--widget-form-item-prop-list'
                  }, [
                    h('span', {}, getI18n('vxe.formDesign.styleSetting.boldTitle')),
                    h(VxeRadioGroupComponent, {
                      modelValue: formData.mobileTitleBold,
                      options: refBoldOpts.value,
                      onChange: refreshPreview,
                      'onUpdate:modelValue' (val) {
                        formData.mobileTitleBold = val
                      }
                    })
                  ]),
                  h('div', {
                    class: 'vxe-form-design--widget-form-item-prop-list'
                  }, [
                    h('span', {}, getI18n('vxe.formDesign.styleSetting.colonTitle')),
                    h(VxeRadioGroupComponent, {
                      modelValue: formData.mobileTitleColon,
                      options: refColonOpts.value,
                      onChange: refreshPreview,
                      'onUpdate:modelValue' (val) {
                        formData.mobileTitleColon = val
                      }
                    })
                  ]),
                  formData.mobileVertical
                    ? createCommentVNode()
                    : h('div', {
                      class: 'vxe-form-design--widget-form-item-prop-list'
                    }, [
                      h('span', {}, getI18n('vxe.formDesign.styleSetting.alignTitle')),
                      h(VxeRadioGroupComponent, {
                        modelValue: formData.mobileTitleAlign,
                        options: refAlignOpts.value,
                        onChange: refreshPreview,
                        'onUpdate:modelValue' (val) {
                          formData.mobileTitleAlign = val
                        }
                      })
                    ]),
                  formData.mobileVertical
                    ? createCommentVNode()
                    : h('div', {
                      class: 'vxe-form-design--widget-form-item-prop-list'
                    }, [
                      h('span', {}, getI18n('vxe.formDesign.styleSetting.widthTitle')),
                      h(VxeInputComponent, {
                        class: 'vxe-form-design--widget-form-item-prop-width',
                        modelValue: formData.mobileTitleWidth,
                        type: 'integer',
                        onChange: refreshPreview,
                        'onUpdate:modelValue' (val) {
                          formData.mobileTitleWidth = val
                        }
                      }),
                      h(VxeSelectGroupComponent, {
                        class: 'vxe-form-design--widget-form-item-prop-unit',
                        modelValue: formData.mobileTitleWidthUnit,
                        options: refWidthUnitOpts.value,
                        transfer: true,
                        onChange: refreshPreview,
                        'onUpdate:modelValue' (val) {
                          formData.mobileTitleWidthUnit = val
                        }
                      })
                    ])
                ]
              }
            })
          ]
        }
      })
    }
  }
})
