import { h, resolveComponent, ComponentOptions } from 'vue'
import XEUtils from 'xe-utils'
import { renderer } from '../../ui'
import { getOnName, getModelEvent, getChangeEvent } from '../../ui/src/vn'
import { errLog } from '../../ui/src/log'

import type { VxeButtonComponent } from '../../../types/all'

const componentDefaultModelProp = 'modelValue'

const defaultCompProps = { transfer: true }

/**
 * 已废弃
 * @deprecated
 */
function getOldComponentName (name: string) {
  return `vxe-${name.replace('$', '')}`
}

function getDefaultComponent ({ name }: any) {
  return resolveComponent(name) as ComponentOptions
}

/**
 * 已废弃
 * @deprecated
 */
function getOldComponent ({ name }: any) {
  return resolveComponent(getOldComponentName(name)) as ComponentOptions
}

function getNativeAttrs (renderOpts: any) {
  let { name, attrs } = renderOpts
  if (name === 'input') {
    attrs = Object.assign({ type: 'text' }, attrs)
  }
  return attrs
}

function getComponentFormItemProps (renderOpts: any, params: any, value: any, defaultProps?: any) {
  return XEUtils.assign({}, defaultCompProps, defaultProps, renderOpts.props, { [componentDefaultModelProp]: value })
}

/**
 * 原生事件处理
 * @param renderOpts
 * @param params
 * @param modelFunc
 * @param changeFunc
 */
function getElementOns (renderOpts: any, params: any, modelFunc?: any, changeFunc?: any) {
  const { events } = renderOpts
  const modelEvent = getModelEvent(renderOpts.name)
  const changeEvent = getChangeEvent(renderOpts.name)
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
function getComponentOns (renderOpts: any, params: any, modelFunc?: any, changeFunc?: any) {
  const { events } = renderOpts
  const modelEvent = getModelEvent(renderOpts.name)
  const changeEvent = getChangeEvent(renderOpts.name)
  const ons: any = {}
  XEUtils.objectEach(events, (func, key: any) => {
    ons[getOnName(key)] = function (...args: any[]) {
      if (process.env.VUE_APP_VXE_ENV === 'development') {
        if (!XEUtils.isFunction(func)) {
          errLog('vxe.error.errFunc', [func])
        }
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
  return ons
}

function getItemOns (renderOpts: any, params: any) {
  const { $form, data, property } = params
  return getComponentOns(renderOpts, params, (value: any) => {
    // 处理 model 值双向绑定
    XEUtils.set(data, property, value)
  }, () => {
    // 处理 change 事件相关逻辑
    $form.updateStatus(params)
  })
}

function getNativeItemOns (renderOpts: any, params: any) {
  const { $form, data, property } = params
  return getElementOns(renderOpts, params, (evnt: any) => {
    // 处理 model 值双向绑定
    const itemValue = evnt.target.value
    XEUtils.set(data, property, itemValue)
  }, () => {
    // 处理 change 事件相关逻辑
    $form.updateStatus(params)
  })
}

function renderNativeOptgroup (renderOpts: any, params: any, renderOptionsMethods: any) {
  const { optionGroups, optionGroupProps = {} } = renderOpts
  const groupOptions = optionGroupProps.options || 'options'
  const groupLabel = optionGroupProps.label || 'label'
  return optionGroups.map((group: any, gIndex: any) => {
    return h('optgroup', {
      key: gIndex,
      label: group[groupLabel]
    }, renderOptionsMethods(group[groupOptions], renderOpts, params))
  })
}

/**
 * 渲染表单-项
 * 用于渲染原生的标签
 */
function nativeItemRender (renderOpts: any, params: any) {
  const { data, property } = params
  const { name } = renderOpts
  const attrs = getNativeAttrs(renderOpts)
  const itemValue = XEUtils.get(data, property)
  return [
    h(name, {
      class: `vxe-default-${name}`,
      ...attrs,
      value: attrs && name === 'input' && (attrs.type === 'submit' || attrs.type === 'reset') ? null : itemValue,
      ...getNativeItemOns(renderOpts, params)
    })
  ]
}

function defaultItemRender (renderOpts: any, params: any) {
  const { data, property } = params
  const itemValue = XEUtils.get(data, property)
  return [
    h(getDefaultComponent(renderOpts), {
      ...getComponentFormItemProps(renderOpts, params, itemValue),
      ...getItemOns(renderOpts, params)
    })
  ]
}

/**
 * 已废弃
 * @deprecated
 */
function oldItemRender (renderOpts: any, params: any) {
  const { data, property } = params
  const itemValue = XEUtils.get(data, property)
  return [
    h(getOldComponent(renderOpts), {
      ...getComponentFormItemProps(renderOpts, params, itemValue),
      ...getItemOns(renderOpts, params)
    })
  ]
}

/**
 * 已废弃
 * @deprecated
 */
function oldButtonItemRender (renderOpts: any, params: any) {
  return [
    h(resolveComponent('vxe-button') as VxeButtonComponent, {
      ...getComponentFormItemProps(renderOpts, params, null),
      ...getComponentOns(renderOpts, params)
    })
  ]
}

/**
 * 已废弃
 * @deprecated
 */
function oldButtonsItemRender (renderOpts: any, params: any) {
  return renderOpts.children.map((childRenderOpts: any) => oldButtonItemRender(childRenderOpts, params)[0])
}

/**
 * 渲染原生的 select 标签
 */
function renderNativeFormOptions (options: any, renderOpts: any, params: any) {
  const { data, property } = params
  const { optionProps = {} } = renderOpts
  const labelProp = optionProps.label || 'label'
  const valueProp = optionProps.value || 'value'
  const disabledProp = optionProps.disabled || 'disabled'
  const cellValue = XEUtils.get(data, property)
  return options.map((item: any, oIndex: any) => {
    return h('option', {
      key: oIndex,
      value: item[valueProp],
      disabled: item[disabledProp],
      /* eslint-disable eqeqeq */
      selected: item[valueProp] == cellValue
    }, item[labelProp])
  })
}

/**
 * 渲染表单-项
 */
function defaultFormItemRender (renderOpts: any, params: any) {
  const { data, property } = params
  const itemValue = XEUtils.get(data, property)
  return [
    h(getDefaultComponent(renderOpts), {
      ...getComponentFormItemProps(renderOpts, params, itemValue),
      ...getItemOns(renderOpts, params)
    })
  ]
}

function formItemRadioAndCheckboxRender (renderOpts: any, params: any) {
  const { options, optionProps } = renderOpts
  const { data, property } = params
  const itemValue = XEUtils.get(data, property)
  return [
    h(getDefaultComponent(renderOpts), {
      options,
      optionProps,
      ...getComponentFormItemProps(renderOpts, params, itemValue),
      ...getItemOns(renderOpts, params)
    })
  ]
}

/**
 * 已废弃
 * @deprecated
 */
function oldFormItemRadioAndCheckboxRender (renderOpts: any, params: any) {
  const { name, options, optionProps = {} } = renderOpts
  const { data, property } = params
  const labelProp = optionProps.label || 'label'
  const valueProp = optionProps.value || 'value'
  const disabledProp = optionProps.disabled || 'disabled'
  const itemValue = XEUtils.get(data, property)
  const compName = getOldComponentName(name)
  // 如果是分组
  if (options) {
    return [
      h(resolveComponent(`${compName}-group`) as ComponentOptions, {
        ...getComponentFormItemProps(renderOpts, params, itemValue),
        ...getItemOns(renderOpts, params)
      }, {
        default: () => {
          return options.map((item: any, index: any) => {
            return h(resolveComponent(compName) as ComponentOptions, {
              key: index,
              label: item[valueProp],
              content: item[labelProp],
              disabled: item[disabledProp]
            })
          })
        }
      })
    ]
  }
  return [
    h(resolveComponent(compName) as ComponentOptions, {
      ...getComponentFormItemProps(renderOpts, params, itemValue),
      ...getItemOns(renderOpts, params)
    })
  ]
}

/**
 * 表单 - 渲染器
 */
renderer.mixin({
  input: {
    renderItemContent: nativeItemRender
  },
  textarea: {
    renderItemContent: nativeItemRender
  },
  select: {
    renderItemContent (renderOpts: any, params: any) {
      return [
        h('select', {
          class: 'vxe-default-select',
          ...getNativeAttrs(renderOpts),
          ...getNativeItemOns(renderOpts, params)
        },
        renderOpts.optionGroups ? renderNativeOptgroup(renderOpts, params, renderNativeFormOptions) : renderNativeFormOptions(renderOpts.options, renderOpts, params))
      ]
    }
  },
  VxeInput: {
    renderItemContent: defaultItemRender
  },
  VxeNumberInput: {
    renderItemContent: defaultItemRender
  },
  VxeTextarea: {
    renderItemContent: defaultItemRender
  },
  VxeDatePicker: {
    renderItemContent: defaultItemRender
  },
  VxeButton: {
    renderItemContent: defaultFormItemRender
  },
  VxeButtonGroup: {
    renderItemContent (renderOpts: any, params: any) {
      const { options } = renderOpts
      const { data, property } = params
      const itemValue = XEUtils.get(data, property)
      return [
        h(getDefaultComponent(renderOpts), {
          options,
          ...getComponentFormItemProps(renderOpts, params, itemValue),
          ...getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeSelect: {
    renderItemContent (renderOpts: any, params: any) {
      const { data, property } = params
      const { options, optionProps, optionGroups, optionGroupProps } = renderOpts
      const itemValue = XEUtils.get(data, property)
      return [
        h(getDefaultComponent(renderOpts), {
          ...getComponentFormItemProps(renderOpts, params, itemValue, { options, optionProps, optionGroups, optionGroupProps }),
          ...getItemOns(renderOpts, params)
        })
      ]
    }
  },
  VxeRadio: {
    renderItemContent: defaultFormItemRender
  },
  VxeRadioGroup: {
    renderItemContent: formItemRadioAndCheckboxRender
  },
  VxeCheckbox: {
    renderItemContent: defaultFormItemRender
  },
  VxeCheckboxGroup: {
    renderItemContent: formItemRadioAndCheckboxRender
  },
  VxeSwitch: {
    renderItemContent: defaultItemRender
  },

  // 以下已废弃
  $input: {
    renderItemContent: oldItemRender
  },
  $textarea: {
    renderItemContent: oldItemRender
  },
  $button: {
    renderItemContent: oldButtonItemRender
  },
  $buttons: {
    renderItemContent: oldButtonsItemRender
  },
  $select: {
    renderItemContent (renderOpts: any, params: any) {
      const { data, property } = params
      const { options, optionProps, optionGroups, optionGroupProps } = renderOpts
      const itemValue = XEUtils.get(data, property)
      return [
        h(getOldComponent(renderOpts), {
          ...getComponentFormItemProps(renderOpts, params, itemValue, { options, optionProps, optionGroups, optionGroupProps }),
          ...getItemOns(renderOpts, params)
        })
      ]
    }
  },
  $radio: {
    renderItemContent: oldFormItemRadioAndCheckboxRender
  },
  $checkbox: {
    renderItemContent: oldFormItemRadioAndCheckboxRender
  },
  $switch: {
    renderItemContent: oldItemRender
  }
  // 以上已废弃
})
