import { CreateElement } from 'vue'
import XEUtils from 'xe-utils'
import { renderer, getComponent } from '../../ui'
import { getOnName, getModelEvent, getChangeEvent } from '../../ui/src/vn'
import { errLog } from '../../ui/src/log'

import type { VxeGlobalRendererHandles, VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'

const componentDefaultModelProp = 'value'

/**
 * 已废弃
 * @deprecated
 */
function getOldComponentName (name: string | undefined) {
  return `vxe-${`${name || ''}`.replace('$', '')}`
}

/**
 * 已废弃
 * @deprecated
 */
function getOldComponent ({ name }: VxeGlobalRendererHandles.RenderFormItemContentOptions) {
  return getOldComponentName(name)
}

function getDefaultComponent ({ name }: VxeGlobalRendererHandles.RenderFormItemContentOptions) {
  return getComponent(name as any) || name
}

function getNativeAttrs (renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions) {
  let { name, attrs } = renderOpts
  if (name === 'input') {
    attrs = Object.assign({ type: 'text' }, attrs)
  }
  return attrs
}

function getComponentFormItemProps (renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams, value: any, defaultProps?: any) {
  return XEUtils.assign({}, defaultProps, renderOpts.props, { [componentDefaultModelProp]: value })
}

/**
 * 原生事件处理
 * @param renderOpts
 * @param params
 * @param modelFunc
 * @param changeFunc
 */
function getElementOns (renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: any, modelFunc?: any, changeFunc?: any) {
  const { events } = renderOpts
  const modelEvent = getModelEvent(renderOpts)
  const changeEvent = getChangeEvent(renderOpts)
  const isSameEvent = changeEvent === modelEvent
  const ons: any = {}
  if (events) {
    XEUtils.objectEach(events, (func, key: any) => {
      ons[getOnName(key)] = function (...args: any[]) {
        func(params, ...args)
      }
    })
  }
  if (modelFunc) {
    ons[getOnName(modelEvent)] = function (targetEvnt: any) {
      modelFunc(targetEvnt)
      if (isSameEvent && changeFunc) {
        changeFunc(targetEvnt)
      }
      if (events && events[modelEvent]) {
        events[modelEvent](params, targetEvnt)
      }
    }
  }
  if (!isSameEvent && changeFunc) {
    ons[getOnName(changeEvent)] = function (...args: any[]) {
      changeFunc(...args)
      if (events && events[changeEvent]) {
        events[changeEvent](params, ...args)
      }
    }
  }
  return ons
}

/**
 * 组件事件处理
 * @param renderOpts
 * @param params
 * @param modelFunc
 * @param changeFunc
 */
function getComponentOns (renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams, eFns?: {
  model: (cellValue: any) => void
  change?: (...args: any[]) => void
}, eventOns?: Record<string, any>) {
  const { events } = renderOpts
  const { model: modelFunc, change: changeFunc } = eFns || {}
  const modelEvent = getModelEvent(renderOpts)
  const changeEvent = getChangeEvent(renderOpts)
  const ons: any = {}
  XEUtils.objectEach(events, (func, key: any) => {
    ons[getOnName(key)] = function (...args: any[]) {
      if (!XEUtils.isFunction(func)) {
        errLog('vxe.error.errFunc', [`[form] ${func}`])
      }
      func(params, ...args)
    }
  })
  if (modelFunc) {
    ons[getOnName(modelEvent)] = function (targetEvnt: any) {
      modelFunc(targetEvnt)
      if (events && events[modelEvent]) {
        events[modelEvent](params, targetEvnt)
      }
    }
  }
  if (changeFunc) {
    ons[getOnName(changeEvent)] = function (...args: any[]) {
      changeFunc(...args)
      if (events && events[changeEvent]) {
        events[changeEvent](params, ...args)
      }
    }
  }
  return eventOns ? Object.assign(ons, eventOns) : ons
}

function getItemOns (renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { $form, data, field } = params
  return getComponentOns(renderOpts, params, {
    model (value: any) {
      // 处理 model 值双向绑定
      XEUtils.set(data, field, value)
    },
    change () {
      // 处理 change 事件相关逻辑
      $form.updateStatus(params)
      if (renderOpts.changeToSubmit) {
        ($form as VxeFormConstructor & VxeFormPrivateMethods).handleSubmitEvent(new Event('change'))
      }
    }
  })
}

function getNativeItemOns (renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { $form, data, field } = params
  return getElementOns(renderOpts, params, (evnt: any) => {
    // 处理 model 值双向绑定
    const itemValue = evnt.target.value
    XEUtils.set(data, field, itemValue)
  }, () => {
    // 处理 change 事件相关逻辑
    $form.updateStatus(params)
  })
}

function renderNativeOptgroup (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams, renderOptionsMethods: any) {
  const { optionGroups, optionGroupProps = {} } = renderOpts
  const groupOptions = optionGroupProps.options || 'options'
  const groupLabel = optionGroupProps.label || 'label'
  if (optionGroups) {
    return optionGroups.map((group: any, gIndex: any) => {
      return h('optgroup', {
        key: gIndex,
        attrs: {
          label: group[groupLabel]
        }
      }, renderOptionsMethods(group[groupOptions], renderOpts, params))
    })
  }
  return []
}

/**
 * 渲染表单-项
 * 用于渲染原生的标签
 */
function nativeItemRender (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { data, field } = params
  const { name } = renderOpts
  const attrs = getNativeAttrs(renderOpts)
  const itemValue = XEUtils.get(data, field)
  return [
    h(`${name}`, {
      class: `vxe-default-${name}`,
      attrs,
      domProps: {
        value: attrs && name === 'input' && (attrs.type === 'submit' || attrs.type === 'reset') ? null : itemValue
      },
      on: getNativeItemOns(renderOpts, params)
    })
  ]
}

function defaultItemRender (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { data, field } = params
  const itemValue = XEUtils.get(data, field)
  return [
    h(getDefaultComponent(renderOpts), {
      props: getComponentFormItemProps(renderOpts, params, itemValue),
      on: getItemOns(renderOpts, params)
    })
  ]
}

/**
 * 已废弃
 * @deprecated
 */
function oldItemRender (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { data, field } = params
  const itemValue = XEUtils.get(data, field)
  return [
    h(getOldComponent(renderOpts), {
      props: getComponentFormItemProps(renderOpts, params, itemValue),
      on: getItemOns(renderOpts, params)
    })
  ]
}

/**
 * 已废弃
 * @deprecated
 */
function oldButtonItemRender (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  return [
    h('vxe-button', {
      props: getComponentFormItemProps(renderOpts, params, null),
      on: getComponentOns(renderOpts, params)
    })
  ]
}

/**
 * 已废弃
 * @deprecated
 */
function oldButtonsItemRender (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { children } = renderOpts
  return children ? children.map((childRenderOpts: any) => oldButtonItemRender(h, childRenderOpts, params)[0]) : []
}

/**
 * 渲染原生的 select 标签
 */
function renderNativeFormOptions (h: CreateElement, options: any, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { data, field } = params
  const { optionProps = {} } = renderOpts
  const labelProp = optionProps.label || 'label'
  const valueProp = optionProps.value || 'value'
  const disabledProp = optionProps.disabled || 'disabled'
  const cellValue = XEUtils.get(data, field)
  if (options) {
    return options.map((item: any, oIndex: any) => {
      return h('option', {
        key: oIndex,
        props: {
          value: item[valueProp],
          disabled: item[disabledProp],
          /* eslint-disable eqeqeq */
          selected: item[valueProp] == cellValue
        }
      }, item[labelProp])
    })
  }
  return []
}

/**
 * 渲染表单-项
 */
function defaultFormItemRender (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { data, field } = params
  const itemValue = XEUtils.get(data, field)
  return [
    h(getDefaultComponent(renderOpts), {
      props: getComponentFormItemProps(renderOpts, params, itemValue),
      on: getItemOns(renderOpts, params)
    })
  ]
}

function formItemRadioAndCheckboxRender (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { options, optionProps } = renderOpts
  const { data, field } = params
  const itemValue = XEUtils.get(data, field)
  return [
    h(getDefaultComponent(renderOpts), {
      props: {
        options,
        optionProps,
        ...getComponentFormItemProps(renderOpts, params, itemValue)
      },
      on: getItemOns(renderOpts, params)
    })
  ]
}

/**
 * 已废弃
 * @deprecated
 */
function oldFormItemRadioAndCheckboxRender (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
  const { name, options, optionProps = {} } = renderOpts
  const { data, field } = params
  const labelProp = optionProps.label || 'label'
  const valueProp = optionProps.value || 'value'
  const disabledProp = optionProps.disabled || 'disabled'
  const itemValue = XEUtils.get(data, field)
  const compName = getOldComponentName(name)
  // 如果是分组
  if (options) {
    return [
      h(`${compName}-group`, {
        props: getComponentFormItemProps(renderOpts, params, itemValue),
        on: getItemOns(renderOpts, params),
        scopedSlots: {
          default: () => {
            return options.map((item: any, index: any) => {
              return h(compName, {
                key: index,
                props: {
                  label: item[valueProp],
                  content: item[labelProp],
                  disabled: item[disabledProp]
                }
              })
            })
          }
        }
      })
    ]
  }
  return [
    h(compName, {
      props: getComponentFormItemProps(renderOpts, params, itemValue),
      on: getItemOns(renderOpts, params)
    })
  ]
}

/**
 * 表单 - 渲染器
 */
renderer.mixin({
  input: {
    formItemAutoFocus: 'input',
    renderFormItemContent: nativeItemRender
  },
  textarea: {
    formItemAutoFocus: 'textarea',
    renderFormItemContent: nativeItemRender
  },
  select: {
    formItemAutoFocus: 'input',
    renderFormItemContent (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
      return [
        h('select', {
          class: 'vxe-default-select',
          attrs: {
            ...getNativeAttrs(renderOpts)
          },
          on: getNativeItemOns(renderOpts, params)
        },
        renderOpts.optionGroups ? renderNativeOptgroup(h, renderOpts, params, renderNativeFormOptions) : renderNativeFormOptions(h, renderOpts.options, renderOpts, params))
      ]
    }
  },
  VxeInput: {
    formItemAutoFocus: 'input',
    renderFormItemContent: defaultItemRender
  },
  VxeNumberInput: {
    formItemAutoFocus: 'input',
    renderFormItemContent: defaultItemRender
  },
  VxePasswordInput: {
    formItemAutoFocus: 'input',
    renderFormItemContent: defaultItemRender
  },
  VxeTextarea: {
    formItemAutoFocus: 'textarea',
    renderFormItemContent: defaultItemRender
  },
  VxeDatePicker: {
    formItemAutoFocus: 'input',
    renderFormItemContent: defaultItemRender
  },
  VxeDateRangePicker: {
    formItemAutoFocus: 'input',
    renderFormItemContent (h, renderOpts, params) {
      const { startField, endField } = renderOpts
      const { $form, data, field } = params
      const itemValue = XEUtils.get(data, field)
      const seProps: Record<string, any> = {}
      const seOs: Record<string, any> = {}
      if (startField && endField) {
        seProps.startValue = XEUtils.get(data, startField)
        seProps.endValue = XEUtils.get(data, endField)
        seOs['update:startValue'] = (value: any) => {
          if (startField) {
            XEUtils.set(data, startField, value)
          }
        }
        seOs['update:endValue'] = (value: any) => {
          if (endField) {
            XEUtils.set(data, endField, value)
          }
        }
      }
      return [
        h(getDefaultComponent(renderOpts), {
          props: getComponentFormItemProps(renderOpts, params, itemValue, seProps),
          on: getComponentOns(renderOpts, params, {
            model (value: any) {
              // 处理 model 值双向绑定
              XEUtils.set(data, field, value)
            },
            change ({ $event, isFinish }) {
              // 处理 change 事件相关逻辑
              $form.updateStatus(params)
              if (renderOpts.changeToSubmit && isFinish) {
                ($form as VxeFormConstructor & VxeFormPrivateMethods).handleSubmitEvent($event)
              }
            }
          }, seOs)

        })
      ]
    }
  },
  VxeButton: {
    renderFormItemContent: defaultFormItemRender
  },
  VxeButtonGroup: {
    renderFormItemContent (h: CreateElement, renderOpts, params) {
      const { options } = renderOpts
      const { data, field } = params
      const itemValue = XEUtils.get(data, field)
      return [
        h(getDefaultComponent(renderOpts), {
          props: {
            options,
            ...getComponentFormItemProps(renderOpts, params, itemValue)
          },
          on: getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeSelect: {
    formItemAutoFocus: 'input',
    renderFormItemContent (h: CreateElement, renderOpts, params) {
      const { data, field } = params
      const { options, optionProps, optionGroups, optionGroupProps } = renderOpts
      const itemValue = XEUtils.get(data, field)
      return [
        h(getDefaultComponent(renderOpts), {
          props: getComponentFormItemProps(renderOpts, params, itemValue, { options, optionProps, optionGroups, optionGroupProps }),
          on: getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeTreeSelect: {
    formItemAutoFocus: 'input',
    renderFormItemContent (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
      const { data, field } = params
      const { options, optionProps } = renderOpts
      const itemValue = XEUtils.get(data, field)
      return [
        h(getDefaultComponent(renderOpts), {
          props: getComponentFormItemProps(renderOpts, params, itemValue, { options, optionProps }),
          on: getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeTableSelect: {
    formItemAutoFocus: 'input',
    renderFormItemContent (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
      const { data, field } = params
      const { options, optionProps } = renderOpts
      const itemValue = XEUtils.get(data, field)
      return [
        h(getDefaultComponent(renderOpts), {
          props: getComponentFormItemProps(renderOpts, params, itemValue, { options, optionProps }),
          on: getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeColorPicker: {
    formItemAutoFocus: 'input',
    renderFormItemContent (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
      const { data, field } = params
      const { options } = renderOpts
      const itemValue = XEUtils.get(data, field)
      return [
        h(getDefaultComponent(renderOpts), {
          props: getComponentFormItemProps(renderOpts, params, itemValue, { colors: options }),
          on: getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeIconPicker: {
    formItemAutoFocus: 'input',
    renderFormItemContent (h: CreateElement, renderOpts: VxeGlobalRendererHandles.RenderFormItemContentOptions, params: VxeGlobalRendererHandles.RenderFormItemContentParams) {
      const { data, field } = params
      const { options } = renderOpts
      const itemValue = XEUtils.get(data, field)
      return [
        h(getDefaultComponent(renderOpts), {
          props: getComponentFormItemProps(renderOpts, params, itemValue, { icons: options }),
          on: getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeRadio: {
    renderFormItemContent: defaultFormItemRender
  },
  VxeRadioGroup: {
    renderFormItemContent: formItemRadioAndCheckboxRender
  },
  VxeCheckbox: {
    renderFormItemContent: defaultFormItemRender
  },
  VxeCheckboxGroup: {
    renderFormItemContent: formItemRadioAndCheckboxRender
  },
  VxeSwitch: {
    renderFormItemContent: defaultItemRender
  },
  VxeRate: {
    renderFormItemContent: defaultItemRender
  },
  VxeSlider: {
    renderFormItemContent: defaultItemRender
  },
  VxeImage: {
    renderFormItemContent (h, renderOpts, params) {
      const { data, field } = params
      const { props } = renderOpts
      const itemValue = XEUtils.get(data, field)
      return [
        h(getDefaultComponent(renderOpts), {
          props: {
            ...props,
            src: itemValue
          },
          on: getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeImageGroup: {
    renderFormItemContent (h, renderOpts, params) {
      const { data, field } = params
      const { props } = renderOpts
      const itemValue = XEUtils.get(data, field)
      return [
        h(getDefaultComponent(renderOpts), {
          props: {
            ...props,
            urlList: itemValue
          },
          on: getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeUpload: {
    renderFormItemContent: defaultItemRender
  },

  // 以下已废弃
  $input: {
    formItemAutoFocus: 'input',
    renderFormItemContent: oldItemRender
  },
  $textarea: {
    formItemAutoFocus: 'textarea',
    renderFormItemContent: oldItemRender
  },
  $button: {
    renderFormItemContent: oldButtonItemRender
  },
  $buttons: {
    renderFormItemContent: oldButtonsItemRender
  },
  $select: {
    formItemAutoFocus: 'input',
    renderFormItemContent (h, renderOpts, params) {
      const { data, field } = params
      const { options, optionProps, optionGroups, optionGroupProps } = renderOpts
      const itemValue = XEUtils.get(data, field)
      return [
        h(getOldComponent(renderOpts), {
          props: getComponentFormItemProps(renderOpts, params, itemValue, { options, optionProps, optionGroups, optionGroupProps }),
          on: getItemOns(renderOpts, params)
        })
      ]
    }
  },
  $radio: {
    renderFormItemContent: oldFormItemRadioAndCheckboxRender
  },
  $checkbox: {
    renderFormItemContent: oldFormItemRadioAndCheckboxRender
  },
  $switch: {
    renderFormItemContent: oldItemRender
  }
  // 以上已废弃
})
