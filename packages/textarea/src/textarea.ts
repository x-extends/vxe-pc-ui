import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getI18n, createEvent, globalMixins } from '../../ui'
import { getFuncText } from '../../ui/src/utils'

import type { VxeTextareaPropTypes, TextareaReactData, VxeComponentSizeType, VxeTextareaEmits, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf } from '../../../types'

let autoTxtElem: HTMLDivElement

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTextarea',
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: [String, Number] as PropType<VxeTextareaPropTypes.ModelValue>,
    className: String as PropType<VxeTextareaPropTypes.ClassName>,
    immediate: {
      type: Boolean as PropType<VxeTextareaPropTypes.Immediate>,
      default: true
    },
    name: String as PropType<VxeTextareaPropTypes.Name>,
    readonly: {
      type: Boolean as PropType<VxeTextareaPropTypes.Readonly>,
      default: null
    },
    editable: {
      type: Boolean as PropType<VxeTextareaPropTypes.Readonly>,
      default: true
    },
    disabled: {
      type: Boolean as PropType<VxeTextareaPropTypes.Disabled>,
      default: null
    },
    placeholder: String as PropType<VxeTextareaPropTypes.Placeholder>,
    maxLength: [String, Number] as PropType<VxeTextareaPropTypes.MaxLength>,
    rows: {
      type: [String, Number] as PropType<VxeTextareaPropTypes.Rows>,
      default: null
    },
    cols: {
      type: [String, Number] as PropType<VxeTextareaPropTypes.Cols>,
      default: null
    },
    showWordCount: Boolean as PropType<VxeTextareaPropTypes.ShowWordCount>,
    countMethod: Function as PropType<VxeTextareaPropTypes.CountMethod>,
    autosize: [Boolean, Object] as PropType<VxeTextareaPropTypes.Autosize>,
    form: String as PropType<VxeTextareaPropTypes.Form>,
    resize: {
      type: String as PropType<VxeTextareaPropTypes.Resize>,
      default: () => getConfig().textarea.resize
    },
    size: {
      type: String as PropType<VxeTextareaPropTypes.Size>,
      default: () => getConfig().textarea.size || getConfig().size
    },
    // 已废弃
    maxlength: [String, Number] as PropType<VxeTextareaPropTypes.Maxlength>
  },
  inject: {
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    }
  },
  data () {
    const reactData: TextareaReactData = {
      inputValue: ''
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeFormReadonly () {
      const $xeTextarea = this
      const props = $xeTextarea
      const $xeForm = $xeTextarea.$xeForm

      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.readonly
        }
        return false
      }
      return readonly
    },
    computeIsDisabled () {
      const $xeTextarea = this
      const props = $xeTextarea
      const $xeForm = $xeTextarea.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeInputReadonly () {
      const $xeTextarea = this
      const props = $xeTextarea

      const { editable } = props
      const formReadonly = $xeTextarea.computeFormReadonly
      return formReadonly || !editable
    },
    computeInpPlaceholder () {
      const $xeTextarea = this
      const props = $xeTextarea

      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().textarea.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseInput')
    },
    computeInpMaxLength () {
      const $xeTextarea = this
      const props = $xeTextarea

      const { maxLength, maxlength } = props
      return maxLength || maxlength
    },
    computeInputCount () {
      const $xeTextarea = this
      const reactData = $xeTextarea.reactData as TextareaReactData

      return XEUtils.getSize(reactData.inputValue)
    },
    computeIsCountError () {
      const $xeTextarea = this

      const inputCount = $xeTextarea.computeInputCount as number
      const inpMaxLength = $xeTextarea.computeInpMaxLength
      return inpMaxLength && inputCount > XEUtils.toNumber(inpMaxLength)
    },
    computeSizeOpts () {
      const $xeTextarea = this
      const props = $xeTextarea

      return Object.assign({ minRows: 1, maxRows: 10 }, getConfig().textarea.autosize, props.autosize)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTextareaEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTextarea = this
      $xeTextarea.$emit(type, createEvent(evnt, { $textarea: $xeTextarea }, params))
    },
    emitModel  (value: any) {
      const $xeTextarea = this

      const { _events } = $xeTextarea as any
      if (_events && _events.modelValue) {
        $xeTextarea.$emit('modelValue', value)
      } else {
        $xeTextarea.$emit('model-value', value)
      }
    },
    focus () {
      const $xeTextarea = this

      const textElem = $xeTextarea.$refs.refTextarea as HTMLTextAreaElement
      textElem.focus()
      return $xeTextarea.$nextTick()
    },
    blur () {
      const $xeTextarea = this

      const textElem = $xeTextarea.$refs.refTextarea as HTMLTextAreaElement
      textElem.blur()
      return $xeTextarea.$nextTick()
    },
    updateAutoTxt  () {
      const $xeTextarea = this
      const props = $xeTextarea
      const reactData = $xeTextarea.reactData

      const { size, autosize } = props
      const { inputValue } = reactData
      if (autosize) {
        if (!autoTxtElem) {
          autoTxtElem = document.createElement('div')
        }
        if (!autoTxtElem.parentNode) {
          document.body.appendChild(autoTxtElem)
        }
        const textElem = $xeTextarea.$refs.refTextarea as HTMLTextAreaElement
        if (!textElem) {
          return
        }
        const textStyle = getComputedStyle(textElem)
        autoTxtElem.className = ['vxe-textarea--autosize', size ? `size--${size}` : ''].join(' ')
        autoTxtElem.style.width = `${textElem.clientWidth}px`
        autoTxtElem.style.padding = textStyle.padding
        autoTxtElem.innerText = ('' + (inputValue || '　')).replace(/\n$/, '\n　')
      }
    },
    handleResize () {
      const $xeTextarea = this
      const props = $xeTextarea

      if (props.autosize) {
        $xeTextarea.$nextTick(() => {
          const sizeOpts = $xeTextarea.computeSizeOpts
          const { minRows, maxRows } = sizeOpts
          const textElem = $xeTextarea.$refs.refTextarea as HTMLTextAreaElement
          if (!textElem) {
            return
          }
          const sizeHeight = autoTxtElem.clientHeight
          const textStyle = getComputedStyle(textElem)
          const lineHeight = XEUtils.toNumber(textStyle.lineHeight)
          const paddingTop = XEUtils.toNumber(textStyle.paddingTop)
          const paddingBottom = XEUtils.toNumber(textStyle.paddingBottom)
          const borderTopWidth = XEUtils.toNumber(textStyle.borderTopWidth)
          const borderBottomWidth = XEUtils.toNumber(textStyle.borderBottomWidth)
          const intervalHeight = paddingTop + paddingBottom + borderTopWidth + borderBottomWidth
          const rowNum = (sizeHeight - intervalHeight) / lineHeight
          const textRows = rowNum && /[0-9]/.test('' + rowNum) ? rowNum : Math.floor(rowNum) + 1
          let vaildRows = textRows
          if (textRows < minRows) {
            vaildRows = minRows
          } else if (textRows > maxRows) {
            vaildRows = maxRows
          }
          textElem.style.height = `${(vaildRows * lineHeight) + intervalHeight}px`
        })
      }
    },
    triggerEvent (evnt: Event & { type: 'focus' | 'blur' | 'change' }) {
      const $xeTextarea = this
      const reactData = $xeTextarea.reactData

      const value = reactData.inputValue
      $xeTextarea.dispatchEvent(evnt.type, { value }, evnt)
    },
    handleChange (value: string, evnt: Event) {
      const $xeTextarea = this
      const props = $xeTextarea
      const reactData = $xeTextarea.reactData
      const $xeForm = $xeTextarea.$xeForm
      const formItemInfo = $xeTextarea.formItemInfo

      reactData.inputValue = value
      $xeTextarea.emitModel(value)
      if (XEUtils.toValueString(props.value) !== value) {
        $xeTextarea.dispatchEvent('change', { value }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    inputEvent (evnt: InputEvent) {
      const $xeTextarea = this
      const props = $xeTextarea
      const reactData = $xeTextarea.reactData

      const { immediate } = props
      const textElem = evnt.target as HTMLTextAreaElement
      const value = textElem.value
      reactData.inputValue = value
      if (immediate) {
        $xeTextarea.handleChange(value, evnt)
      }
      $xeTextarea.dispatchEvent('input', { value }, evnt)
      $xeTextarea.handleResize()
    },
    changeEvent  (evnt: Event & { type: 'change' }) {
      const $xeTextarea = this
      const props = $xeTextarea
      const reactData = $xeTextarea.reactData

      const { immediate } = props
      if (immediate) {
        $xeTextarea.triggerEvent(evnt)
      } else {
        $xeTextarea.handleChange(reactData.inputValue, evnt)
      }
      $xeTextarea.dispatchEvent('lazy-change', { value: reactData.inputValue }, evnt)
    },
    blurEvent (evnt: Event & { type: 'blur' }) {
      const $xeTextarea = this
      const props = $xeTextarea
      const reactData = $xeTextarea.reactData

      const { immediate } = props
      const { inputValue } = reactData
      if (!immediate) {
        $xeTextarea.handleChange(inputValue, evnt)
      }
      $xeTextarea.dispatchEvent('blur', { value: inputValue }, evnt)
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeTextarea = this
      const props = $xeTextarea
      const reactData = $xeTextarea.reactData

      const { className, resize, autosize, showWordCount, countMethod, rows, cols } = props
      const { inputValue } = reactData
      const vSize = $xeTextarea.computeSize
      const isDisabled = $xeTextarea.computeIsDisabled
      const isCountError = $xeTextarea.computeIsCountError
      const inputCount = $xeTextarea.computeInputCount
      const inputReadonly = $xeTextarea.computeInputReadonly
      const formReadonly = $xeTextarea.computeFormReadonly
      const inpPlaceholder = $xeTextarea.computeInpPlaceholder
      const inpMaxLength = $xeTextarea.computeInpMaxLength
      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-textarea--readonly', className]
        }, inputValue)
      }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-textarea', className, {
          [`size--${vSize}`]: vSize,
          'is--autosize': autosize,
          'is--count': showWordCount,
          'is--disabled': isDisabled,
          'is--rows': !XEUtils.eqNull(rows),
          'is--cols': !XEUtils.eqNull(cols)
        }],
        attrs: {
          spellcheck: false
        }
      }, [
        h('textarea', {
          ref: 'refTextarea',
          class: 'vxe-textarea--inner',
          domProps: {
            value: inputValue
          },
          attrs: {
            name: props.name,
            placeholder: inpPlaceholder,
            maxlength: inpMaxLength,
            readonly: inputReadonly,
            disabled: isDisabled,
            rows,
            cols
          },
          style: resize
            ? {
                resize
              }
            : {},
          on: {
            input: $xeTextarea.inputEvent,
            change: $xeTextarea.changeEvent,
            keydown: $xeTextarea.triggerEvent,
            keyup: $xeTextarea.triggerEvent,
            click: $xeTextarea.triggerEvent,
            focus: $xeTextarea.triggerEvent,
            blur: $xeTextarea.blurEvent
          }
        }),
        showWordCount
          ? h('span', {
            class: ['vxe-textarea--count', {
              'is--error': isCountError
            }]
          }, countMethod ? `${countMethod({ value: inputValue })}` : `${inputCount}${inpMaxLength ? `/${inpMaxLength}` : ''}`)
          : null
      ])
    }
  },
  watch: {
    value (val) {
      const $xeTextarea = this
      const reactData = $xeTextarea.reactData

      reactData.inputValue = val
      $xeTextarea.updateAutoTxt()
    },
    computeSizeOpts () {
      const $xeTextarea = this

      $xeTextarea.updateAutoTxt()
      $xeTextarea.handleResize()
    }
  },
  created () {
    const $xeTextarea = this
    const props = $xeTextarea
    const reactData = $xeTextarea.reactData

    reactData.inputValue = props.value
    $xeTextarea.$nextTick(() => {
      const { autosize } = props
      if (autosize) {
        $xeTextarea.updateAutoTxt()
        $xeTextarea.handleResize()
      }
    })
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
