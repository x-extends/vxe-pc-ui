import { PropType, createCommentVNode, defineComponent, h, ref } from 'vue'
import { getI18n } from '@vxe-ui/core'
import { WidgetVxeUploadImageFormObjVO } from './vxe-upload-image-data'
import { getLimitSizeOptions } from '../widget-vxe-upload-file/vxe-upload-file-data'
import { useKebabCaseName } from '../render/hooks'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeInputComponent from '../../input/src/input'
import VxeSwitchComponent from '../../switch/src/switch'

import type { VxeGlobalRendererHandles } from '../../../types'

export const WidgetVxeUploadImageFormComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<WidgetVxeUploadImageFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    const limitSizeOptions = ref(getLimitSizeOptions())

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: ['vxe-form-design--widget-render-form-wrapper', `widget-${kebabCaseName}`],
        vertical: true,
        span: 24,
        titleBold: true,
        titleOverflow: true,
        data: options
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.name')
            }, {
              default () {
                return h(VxeInputComponent, {
                  modelValue: widget.title,
                  'onUpdate:modelValue' (val) {
                    widget.title = val
                  }
                })
              }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.uploadProp.multiImg'),
              field: 'multiple',
              itemRender: { name: 'VxeSwitch' }
            }),
            options.multiple
              ? h(VxeFormItemComponent, {
                title: getI18n('vxe.formDesign.widgetProp.uploadProp.limitImgCount'),
                field: 'limitCount',
                itemRender: { name: 'VxeInput', props: { type: 'integer', min: 1, clearable: true } }
              })
              : createCommentVNode(),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.uploadProp.limitImgSize'),
              field: 'limitSize',
              itemRender: { name: 'VxeSelect', options: limitSizeOptions.value }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.required')
            }, {
              default () {
                return h(VxeSwitchComponent, {
                  modelValue: widget.required,
                  'onUpdate:modelValue' (val) {
                    widget.required = val
                  }
                })
              }
            })
          ]
        }
      })
    }
  }
})
