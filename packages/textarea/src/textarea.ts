import { defineComponent, h, ref, Ref, computed, nextTick, watch, PropType, reactive, inject } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, getI18n } from '@vxe-ui/core'
import { getFuncText } from '../../ui/src/utils'
import { useSize } from '../../hooks/size'

import { VxeTextareaPropTypes, TextareaReactData, TextareaMethods, VxeTextareaConstructor, VxeTextareaEmits, TextareaPrivateRef, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

let autoTxtElem: HTMLDivElement

export default defineComponent({
  name: 'VxeTextarea',
  props: {
    modelValue: [String, Number] as PropType<VxeTextareaPropTypes.ModelValue>,
    className: String as PropType<VxeTextareaPropTypes.ClassName>,
    immediate: { type: Boolean as PropType<VxeTextareaPropTypes.Immediate>, default: true },
    name: String as PropType<VxeTextareaPropTypes.Name>,
    readonly: Boolean as PropType<VxeTextareaPropTypes.Readonly>,
    disabled: Boolean as PropType<VxeTextareaPropTypes.Disabled>,
    placeholder: {
      type: String as PropType<VxeTextareaPropTypes.Placeholder>,
      default: () => XEUtils.eqNull(getConfig().textarea.placeholder) ? getI18n('vxe.base.pleaseInput') : getConfig().textarea.placeholder
    },
    maxlength: [String, Number] as PropType<VxeTextareaPropTypes.Maxlength>,
    rows: { type: [String, Number] as PropType<VxeTextareaPropTypes.Rows>, default: 2 },
    cols: { type: [String, Number] as PropType<VxeTextareaPropTypes.Cols>, default: null },
    showWordCount: Boolean as PropType<VxeTextareaPropTypes.ShowWordCount>,
    countMethod: Function as PropType<VxeTextareaPropTypes.CountMethod>,
    autosize: [Boolean, Object] as PropType<VxeTextareaPropTypes.Autosize>,
    form: String as PropType<VxeTextareaPropTypes.Form>,
    resize: { type: String as PropType<VxeTextareaPropTypes.Resize>, default: () => getConfig().textarea.resize },
    size: { type: String as PropType<VxeTextareaPropTypes.Size>, default: () => getConfig().textarea.size || getConfig().size }
  },
  emits: [
    'update:modelValue',
    'input',
    'keydown',
    'keyup',
    'click',
    'change',
    'focus',
    'blur'
  ] as VxeTextareaEmits,
  setup (props, context) {
    const { emit } = context
    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const computeSize = useSize(props)

    const reactData = reactive<TextareaReactData>({
      inputValue: props.modelValue
    })

    const refElem = ref() as Ref<HTMLDivElement>
    const refTextarea = ref() as Ref<HTMLTextAreaElement>

    const refMaps: TextareaPrivateRef = {
      refElem,
      refTextarea
    }

    const $xeTextarea = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps
    } as unknown as VxeTextareaConstructor

    let textareaMethods = {} as TextareaMethods

    const computeInputCount = computed(() => {
      return XEUtils.getSize(reactData.inputValue)
    })

    const computeIsCountError = computed(() => {
      const inputCount = computeInputCount.value
      return props.maxlength && inputCount > XEUtils.toNumber(props.maxlength)
    })

    const computeSizeOpts = computed(() => {
      return Object.assign({ minRows: 1, maxRows: 10 }, getConfig().textarea.autosize, props.autosize)
    })

    const updateAutoTxt = () => {
      const { size, autosize } = props
      const { inputValue } = reactData
      if (autosize) {
        if (!autoTxtElem) {
          autoTxtElem = document.createElement('div')
        }
        if (!autoTxtElem.parentNode) {
          document.body.appendChild(autoTxtElem)
        }
        const textElem = refTextarea.value
        const textStyle = getComputedStyle(textElem)
        autoTxtElem.className = ['vxe-textarea--autosize', size ? `size--${size}` : ''].join(' ')
        autoTxtElem.style.width = `${textElem.clientWidth}px`
        autoTxtElem.style.padding = textStyle.padding
        autoTxtElem.innerText = ('' + (inputValue || '　')).replace(/\n$/, '\n　')
      }
    }

    const handleResize = () => {
      if (props.autosize) {
        nextTick(() => {
          const sizeOpts = computeSizeOpts.value
          const { minRows, maxRows } = sizeOpts
          const textElem = refTextarea.value
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
    }

    const triggerEvent = (evnt: Event & { type: 'focus' | 'blur' | 'change' }) => {
      const value = reactData.inputValue
      $xeTextarea.dispatchEvent(evnt.type, { value }, evnt)
    }

    const emitUpdate = (value: string, evnt: Event) => {
      reactData.inputValue = value
      emit('update:modelValue', value)
      if (XEUtils.toValueString(props.modelValue) !== value) {
        textareaMethods.dispatchEvent('change', { value }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    }

    const inputEvent = (evnt: InputEvent) => {
      const { immediate } = props
      const textElem = evnt.target as HTMLTextAreaElement
      const value = textElem.value
      reactData.inputValue = value
      if (immediate) {
        emitUpdate(value, evnt)
      }
      $xeTextarea.dispatchEvent('input', { value }, evnt)
      handleResize()
    }

    const changeEvent = (evnt: Event & { type: 'change' }) => {
      const { immediate } = props
      if (immediate) {
        triggerEvent(evnt)
      } else {
        emitUpdate(reactData.inputValue, evnt)
      }
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { immediate } = props
      const { inputValue } = reactData
      if (!immediate) {
        emitUpdate(inputValue, evnt)
      }
      $xeTextarea.dispatchEvent('blur', { value: inputValue }, evnt)
    }

    textareaMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, Object.assign({ $textarea: $xeTextarea, $event: evnt }, params))
      },

      focus () {
        const textElem = refTextarea.value
        textElem.focus()
        return nextTick()
      },

      blur () {
        const textElem = refTextarea.value
        textElem.blur()
        return nextTick()
      }
    }

    Object.assign($xeTextarea, textareaMethods)

    watch(() => props.modelValue, (val) => {
      reactData.inputValue = val
      updateAutoTxt()
    })

    nextTick(() => {
      const { autosize } = props
      if (autosize) {
        updateAutoTxt()
        handleResize()
      }
    })

    const renderVN = () => {
      const { className, resize, placeholder, disabled, maxlength, autosize, showWordCount, countMethod, rows, cols } = props
      const { inputValue } = reactData
      const vSize = computeSize.value
      const isCountError = computeIsCountError.value
      const inputCount = computeInputCount.value
      return h('div', {
        ref: refElem,
        class: ['vxe-textarea', className, {
          [`size--${vSize}`]: vSize,
          'is--autosize': autosize,
          'is--count': showWordCount,
          'is--disabled': disabled,
          'def--rows': !XEUtils.eqNull(rows),
          'def--cols': !XEUtils.eqNull(cols)
        }]
      }, [
        h('textarea', {
          ref: refTextarea,
          class: 'vxe-textarea--inner',
          value: inputValue,
          name: props.name,
          placeholder: placeholder ? getFuncText(placeholder) : null,
          maxlength,
          readonly: props.readonly,
          disabled,
          rows,
          cols,
          style: resize
            ? {
                resize
              }
            : null,
          onInput: inputEvent,
          onChange: changeEvent,
          onKeydown: triggerEvent,
          onKeyup: triggerEvent,
          onClick: triggerEvent,
          onFocus: triggerEvent,
          onBlur: blurEvent
        }),
        showWordCount
          ? h('span', {
            class: ['vxe-textarea--count', {
              'is--error': isCountError
            }]
          }, countMethod ? `${countMethod({ value: inputValue })}` : `${inputCount}${maxlength ? `/${maxlength}` : ''}`)
          : null
      ])
    }

    $xeTextarea.renderVN = renderVN

    return $xeTextarea
  },
  render () {
    return this.renderVN()
  }
})
