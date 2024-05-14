import { h } from 'vue'
import XEUtils from 'xe-utils'
import { warnLog } from './log'

import { VxeGlobalRenderer, RendererOptions } from '../../../types'

const renderMap: Record<string, RendererOptions> = {
  input: {
    formDesignWidgetName: '输入框',
    formDesignWidgetIcon: 'vxe-icon-feedback',
    renderFormDesignWidgetView () {
      return h('input', {
        modelValue: ''
      })
    },
    formDesignWidgetSettingFormData () {
      return {}
    },
    formDesignWidgetSettingFormItems () {
      return [
        { title: 'inout', field: 'dd', itemRender: { name: 'input' } }
      ]
    }
  },
  textarea: {
    formDesignWidgetName: '文本域',
    formDesignWidgetIcon: 'vxe-icon-feedback',
    renderFormDesignWidgetView () {
      return h('textarea', {
        modelValue: ''
      })
    }
  }
}

/**
 * 全局渲染器
 */
export const renderer: VxeGlobalRenderer = {
  mixin (opts) {
    XEUtils.each(opts, (options, name) => renderer.add(name, options))
    return renderer
  },
  get (name: string) {
    return renderMap[name] || null
  },
  add (name, options) {
    if (name && options) {
      const renders: any = renderMap[name]
      if (renders) {
        // 检测是否覆盖
        if (process.env.VUE_APP_VXE_TABLE_ENV === 'development') {
          XEUtils.each(options, (val, key) => {
            if (!XEUtils.eqNull(renders[key]) && renders[key] !== val) {
              warnLog('vxe.error.coverProp', [`Renderer.${name}`, key])
            }
          })
        }

        Object.assign(renders, options)
      } else {
        renderMap[name] = options
      }
    }
    return renderer
  },
  delete (name) {
    delete renderMap[name]
    return renderer
  }
}
