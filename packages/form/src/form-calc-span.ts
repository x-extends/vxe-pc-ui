import type { ComputedRef, Ref } from 'vue'
import type { VxeFormProps, VxeFormItemProps, VxeFormConstructor, VxeFormPrivateMethods, VxeFormPropTypes } from '../../../types'
import { useWindowSize, useDebounceFn } from '@vueuse/core'
import { watch, unref, computed } from 'vue'
import XEUtils from 'xe-utils'

interface UseFormCalcContext {
  isCollapse: ComputedRef<boolean>;
  getProps: ComputedRef<VxeFormProps>;
  schemas: Ref<VxeFormItemProps[]>
  $xeForm: VxeFormConstructor & VxeFormPrivateMethods
  updateSchemas: (items: VxeFormItemProps[]) => void
}

const BASIC_COL_LEN = 24
const DEFAULTSPAN: VxeFormPropTypes.DynamicSpanConfig = {
  colProps: {
    span: BASIC_COL_LEN,
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0
  },
  actionColProps: {
    span: BASIC_COL_LEN,
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0
  }
}

export default function ({ isCollapse, getProps, schemas, $xeForm, updateSchemas }: UseFormCalcContext) {
  const { useDynamicSpan, dynamicSpan, isMicroApp } = getProps.value

  if (!useDynamicSpan) return false
  const formItems = unref(schemas.value)
  const { width } = useWindowSize()
  const showAdvancedButton = computed(() => {
    const actionItem = formItems.find(schema => schema.hasOwnProperty('collapseNode'))
    if (actionItem) {
      const { visible, visibleMethod, field } = actionItem
      let isShow = true
      if (visible) {
        isShow = true
      }

      if (visibleMethod && typeof visibleMethod === 'function') {
        const { data } = $xeForm.props
        isShow = visibleMethod({ data, field: `${field}`, property: `${field}`, item: actionItem as any, $form: $xeForm, $grid: $xeForm.xegrid })
      }
      return isShow
    }
    return false
  })
  const { alwaysShowLines, colProps, actionColProps, autoAction } = XEUtils.merge(DEFAULTSPAN, dynamicSpan || {})
  let rowSpan = BASIC_COL_LEN
  let lastSpan = BASIC_COL_LEN

  function updateAdvanced () {
    let itemColSum = 0
    const windowW = isMicroApp ? window.parent.innerWidth : width.value
    const xsWidth = parseInt(colProps.xs as string) || (colProps.span as number) || BASIC_COL_LEN
    const smWidth = parseInt(colProps.sm as string) || xsWidth
    const mdWidth = parseInt(colProps.md as string) || smWidth
    const lgWidth = parseInt(colProps.lg as string) || mdWidth
    const xlWidth = parseInt(colProps.xl as string) || lgWidth

    const xsAcWidth = parseInt(actionColProps.xs as string) || (actionColProps.span as number) || BASIC_COL_LEN
    const smAcWidth = parseInt(actionColProps.sm as string) || xsAcWidth
    const mdAcWidth = parseInt(actionColProps.md as string) || smAcWidth
    const lgAcWidth = parseInt(actionColProps.lg as string) || mdAcWidth
    const xlAcWidth = parseInt(actionColProps.xl as string) || lgAcWidth

    if (windowW < 768) {
      rowSpan = xsWidth
      if (!autoAction) {
        lastSpan = xsAcWidth
      }
    } else if (windowW >= 768 && windowW < 992) {
      rowSpan = smWidth
      if (!autoAction) {
        lastSpan = smAcWidth
      }
    } else if (windowW >= 992 && windowW < 1200) {
      rowSpan = mdWidth
      if (!autoAction) {
        lastSpan = mdAcWidth
      }
    } else if (windowW >= 1200 && windowW < 1920) {
      rowSpan = lgWidth
      if (!autoAction) {
        lastSpan = lgAcWidth
      }
    } else {
      rowSpan = xlWidth
      if (!autoAction) {
        lastSpan = xlAcWidth
      }
    }

    formItems.forEach(schema => {
      const { visible, visibleMethod, field } = schema
      let isShow = true
      if (visible) {
        isShow = true
      }

      if (visibleMethod && typeof visibleMethod === 'function') {
        const { data } = $xeForm.props
        isShow = visibleMethod({ data, field: `${field}`, property: `${field}`, item: schema as any, $form: $xeForm, $grid: $xeForm.xegrid })
      }
      if (schema.hasOwnProperty('collapseNode')) {
        if (autoAction) {
          lastSpan = isCollapse.value ? rowSpan : BASIC_COL_LEN - (itemColSum % BASIC_COL_LEN)
        }
        schema.span = lastSpan
        itemColSum += isShow ? schema.span : 0
        schema.collapseNode = itemColSum > (BASIC_COL_LEN * (alwaysShowLines || 1))
      } else {
        schema.span = rowSpan
        itemColSum += isShow ? schema.span : 0
        if (isCollapse.value) {
          schema.folding = itemColSum > (BASIC_COL_LEN * (alwaysShowLines || 1) - (autoAction ? rowSpan : 0))
        } else {
          schema.folding = false
        }
      }
    })
    updateSchemas(formItems)
  }

  const debounceUpdateAdvanced = useDebounceFn(updateAdvanced, 50)

  function handlerAdvanced () {
    if (showAdvancedButton.value) {
      debounceUpdateAdvanced()
    }
  }

  watch(
    [() => isCollapse.value, () => schemas.value, () => width.value],
    () => {
      handlerAdvanced()
    },
    { immediate: true }
  )

  return { handlerAdvanced }
}
