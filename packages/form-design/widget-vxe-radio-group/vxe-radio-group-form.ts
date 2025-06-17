import { PropType, h } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getI18n } from '@vxe-ui/core'
import { WidgetVxeRadioGroupFormObjVO } from './vxe-radio-group-data'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeInputComponent from '../../input/src/input'
import VxeSwitchComponent from '../../switch/src/switch'
import { useWidgetName, useWidgetPropDataSource } from '../../form-design/src/use'

import type { VxeGlobalRendererHandles } from '../../../types'

export const WidgetVxeRadioGroupFormComponent = defineVxeComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<WidgetVxeRadioGroupFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const { renderDataSourceFormItem } = useWidgetPropDataSource(props, {
      isSubOption: false
    })

    const { computeKebabCaseName } = useWidgetName(props)

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: ['vxe-form-design--widget-render-form-wrapper', `widget-${kebabCaseName}`],
        vertical: true,
        span: 24,
        titleBold: true,
        titleOverflow: true,
        data: widget.options
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
              title: getI18n('vxe.formDesign.widgetProp.placeholder'),
              field: 'placeholder',
              itemRender: { name: 'VxeInput' }
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
            }),
            renderDataSourceFormItem()
          ]
        }
      })
    }
  }
})
