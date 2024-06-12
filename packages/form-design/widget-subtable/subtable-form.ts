import { PropType, defineComponent, h, inject } from 'vue'
import { getI18n } from '@vxe-ui/core'
import { useKebabCaseName } from '../render/hooks'
import { WidgetSubtableFormObjVO } from './subtable-data'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeInputComponent from '../../input/src/input'

import type { VxeGlobalRendererHandles, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

export const WidgetSubtableFormComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<WidgetSubtableFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return () => []
    }

    const computeKebabCaseName = useKebabCaseName(props)

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: `vxe-form-design--widget-${kebabCaseName}-form`,
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
