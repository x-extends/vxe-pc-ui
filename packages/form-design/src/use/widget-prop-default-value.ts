import { h, ref } from 'vue'
import VxeFormItemComponent from '../../../form/src/form-item'
import VxeSelectComponent from '../../../select/src/select'
import VxeInputComponent from '../../../input/src/input'

import type { VxeGlobalRendererHandles } from '../../../../types'

export interface WidgetDefaultValueObjVO<V = any> {
  type: string
  value: V
}

export function useWidgetPropDefaultValue (props: {
  readonly renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions
  readonly renderParams: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<{
    defaultValue: WidgetDefaultValueObjVO
  }>
}) {
  const defValOptions = ref([
    { value: 'custom', label: '自定义' }
    // { value: 'linkage', label: '数据联动' }
  ])

  return {
    renderDefaultValueFormItem () {
      const { renderParams } = props
      const { widget } = renderParams
      const { defaultValue } = widget.options
      return h(VxeFormItemComponent, {
        title: '默认值'
      }, {
        default () {
          return [
            h(VxeSelectComponent, {
              modelValue: defaultValue.type,
              options: defValOptions.value,
              'onUpdate:modelValue' (val) {
                defaultValue.type = val
              }
            }),
            h(VxeInputComponent, {
              modelValue: defaultValue.value,
              'onUpdate:modelValue' (val) {
                defaultValue.value = val
              }
            })
          ]
        }
      })
    }
  }
}
