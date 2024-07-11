import { PropType, defineComponent, h } from 'vue'
import { getI18n } from '@vxe-ui/core'
import { WidgetVxeSwitchFormObjVO } from './vxe-switch-data'
import { useWidgetName } from '../../form-design/src/use'
import VxeFormComponent from '../../form/src/form'
import VxeInputComponent from '../../input/src/input'
import VxeFormItemComponent from '../../form/src/form-item'

import type { VxeGlobalRendererHandles } from '../../../types'

export const WidgetVxeSwitchFormComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<WidgetVxeSwitchFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
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
            })
          ]
        }
      })
    }
  }
})
