import { PropType, defineComponent, h } from 'vue'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeInputComponent from '../../input/src/input'
import VxeSwitchComponent from '../../switch/src/switch'
import { WidgetInputFormObjVO } from './input-data'
import { useKebabCaseName } from '../render/hooks'

import type { VxeGlobalRendererHandles } from '../../../types'

export const WidgetInputFormComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<WidgetInputFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: `vxe-design-form--widget-${kebabCaseName}-form`,
        vertical: true,
        span: 24,
        data: widget.options
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '控件名称'
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
              title: '控件提示',
              field: 'placeholder',
              itemRender: { name: 'VxeInput' }
            }),
            h(VxeFormItemComponent, {
              title: '是否必填'
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
