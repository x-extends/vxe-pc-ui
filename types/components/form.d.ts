import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, ComputedRef, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf, VxeComponentSlotType } from '@vxe-ui/core'
import { VxeFormItemPropTypes, VxeFormItemProps } from './form-item'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeForm: defineVxeComponent<VxeFormProps, VxeFormEventProps, VxeFormSlots>
export type VxeFormComponent<D = any> = DefineComponent<VxeFormProps<D> & VxeFormEventProps>

export type VxeFormInstance<D = any> = ComponentPublicInstance<VxeFormProps<D>, VxeFormConstructor<D>>

export interface VxeFormConstructor<D = any> extends VxeComponentBaseOptions, VxeFormMethods<D> {
  props: VxeFormProps<D>
  context: SetupContext<VxeFormEmits>
  reactData: FormReactData
  internalData: FormInternalData
  getRefMaps(): FormPrivateRef
  getComputeMaps(): FormPrivateComputed
  renderVN: RenderFunction

  xegrid: any
}

export interface FormPrivateRef {
  refElem: Ref<HTMLFormElement | undefined>
}
export interface VxeFormPrivateRef extends FormPrivateRef { }

export namespace VxeFormPropTypes {
  export type Size = VxeComponentSizeType
  export type CollapseStatus = boolean
  export type Loading = boolean
  export type Data = any
  export type Span = string | number
  export type Align = 'left' | 'center' | 'right' | '' | null
  export type TitleBold = boolean
  export type TitleAlign = Align
  export type TitleWidth = string | number
  export type TitleColon = boolean
  export type TitleAsterisk = boolean
  export type TitleOverflow = boolean | 'ellipsis' | 'title' | 'tooltip' | '' | null
  export type Vertical = boolean
  export type Padding = boolean

  interface ClassNameParams {
    $form: VxeFormConstructor
    data: any
    items: VxeFormDefines.ItemInfo[]
  }
  export type ClassName = string | ((params: ClassNameParams) => string)

  export type Items = VxeFormItemProps[]

  export type Readonly = boolean
  export type Disabled = boolean

  /**
   * 校验规则配置项
   */
  export interface Rules<D = any> {
    [field: string]: VxeFormDefines.FormRule<D>[]
  }

  export type PreventSubmit = boolean
  export type ValidConfig = {
    autoPos?: boolean
    showMessage?: boolean
  }
  export interface ValidOpts extends ValidConfig { }

  /**
   * 提示信息配置项
   */
  export interface TooltipConfig {
    theme?: 'dark' | 'light'
    enterable?: boolean
    leaveDelay?: number
    leaveMethod?: (params: { $event: Event }) => boolean
  }
  export interface TooltipOpts extends TooltipConfig { }

  export type CustomLayout = boolean
}

export type VxeFormProps<D = any> = {
  size?: VxeFormPropTypes.Size
  collapseStatus?: VxeFormPropTypes.CollapseStatus
  loading?: VxeFormPropTypes.Loading
  data?: D
  span?: VxeFormPropTypes.Span
  align?: VxeFormPropTypes.Align
  titleBold?: VxeFormPropTypes.TitleBold
  titleAlign?: VxeFormPropTypes.TitleAlign
  titleWidth?: VxeFormPropTypes.TitleWidth
  titleColon?: VxeFormPropTypes.TitleColon
  titleAsterisk?: VxeFormPropTypes.TitleAsterisk
  titleOverflow?: VxeFormPropTypes.TitleOverflow
  vertical?: VxeFormPropTypes.Vertical
  padding?: VxeFormPropTypes.Padding
  className?: VxeFormPropTypes.ClassName
  readonly?: VxeFormPropTypes.Readonly
  disabled?: VxeFormPropTypes.Disabled
  items?: VxeFormPropTypes.Items
  rules?: VxeFormPropTypes.Rules<D>
  preventSubmit?: VxeFormPropTypes.PreventSubmit
  validConfig?: VxeFormPropTypes.ValidConfig
  tooltipConfig?: VxeFormPropTypes.TooltipConfig
  customLayout?: VxeFormPropTypes.CustomLayout
}

export interface FormPrivateComputed {
  computeSize: ComputedRef<VxeFormPropTypes.Size>
  computeValidOpts: ComputedRef<VxeFormPropTypes.ValidOpts>
  computeTooltipOpts: ComputedRef<VxeFormPropTypes.TooltipOpts>
}
export interface VxeFormPrivateComputed extends FormPrivateComputed { }

export interface FormReactData {
  collapseAll: boolean
  staticItems: any[]
  formItems: VxeFormDefines.ItemInfo[]
}

export interface FormInternalData {
  tooltipTimeout: any
  tooltipStore: {
    item: VxeFormDefines.ItemInfo | null
    visible: boolean
  }
}

export interface FormMethods<D = any> {
  dispatchEvent(type: ValueOf<VxeFormEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 重置表单
   */
  reset(): Promise<any>
  /**
   * 对表单进行校验，参数为一个回调函数。该回调函数会在校验结束后被调用 callback(errMap)。若不传入回调函数，则会返回一个 promise
   * @param callback 回调函数
   */
  validate(callback?: (errMap?: VxeFormDefines.ValidateErrorMapParams) => void): Promise<VxeFormDefines.ValidateErrorMapParams>
  /**
   * 对表单指定项进行校验，参数为一个回调函数。该回调函数会在校验结束后被调用 callback(errMap)。若不传入回调函数，则会返回一个 promise
   * @param field 字段名
   * @param callback 回调函数
   */
  validateField(field: VxeFormItemPropTypes.Field | VxeFormItemPropTypes.Field[] | VxeFormDefines.ItemInfo | VxeFormDefines.ItemInfo[] | null, callback?: (errMap?: VxeFormDefines.ValidateErrorMapParams) => void): Promise<VxeFormDefines.ValidateErrorMapParams>
  /**
   * 手动清除校验状态，如果指定 field 则清除指定的项，否则清除整个表单
   * @param field 字段名
   */
  clearValidate(field?: VxeFormItemPropTypes.Field | VxeFormItemPropTypes.Field[] | VxeFormDefines.ItemInfo | VxeFormDefines.ItemInfo[] | null): Promise<any>
  /**
   * 更新项状态
   * 当使用自定义渲染时可能会用到
   * @param params 插槽对象
   */
  updateStatus(
    params: {
      field: VxeFormItemPropTypes.Field
    },
    itemValue?: any
  ): void
  /**
   * 获取表单项列表
   */
  getItems(): VxeFormDefines.ItemInfo[]
  /**
   * 根据列的字段名获取表单项
   * @param field 字段名
   *
   */
  getItemByField(field: VxeFormItemPropTypes.Field): VxeFormDefines.ItemInfo | null
  /**
   * 关闭 tooltip 提示
   */
  closeTooltip(): Promise<any>
  /**
   * 手动切换折叠状态
   */
  toggleCollapse(): Promise<any>
}
export interface VxeFormMethods<D = any> extends FormMethods<D> { }

export interface FormPrivateMethods {
  callSlot<T>(slotFunc: ((params: T) => VxeComponentSlotType | VxeComponentSlotType[]) | string | null, params: T): VxeComponentSlotType[]
  triggerItemEvent(evnt: Event | { type: string }, field: string, itemValue?: any): Promise<any>
  toggleCollapseEvent(evnt: Event): void
  triggerTitleTipEvent(evnt: MouseEvent, params: {
    item: VxeFormDefines.ItemInfo
  }): void
  handleTitleTipLeaveEvent(): void
}
export interface VxeFormPrivateMethods extends FormPrivateMethods { }

export type VxeFormEmits = [
  'update:collapseStatus',
  'collapse',
  'toggle-collapse',
  'submit',
  'submit-invalid',
  'reset'
]

export namespace VxeFormDefines {
  export class ItemInfo {
    id: string

    title: VxeFormItemPropTypes.Title
    field: VxeFormItemPropTypes.Field
    span: VxeFormItemPropTypes.Span
    align: VxeFormItemPropTypes.Align
    titleBold: VxeFormItemPropTypes.TitleBold
    titleAlign: VxeFormItemPropTypes.TitleAlign
    titleWidth: VxeFormItemPropTypes.TitleWidth
    titleColon: VxeFormItemPropTypes.TitleColon
    titleAsterisk: VxeFormItemPropTypes.TitleAsterisk
    titlePrefix: VxeFormItemPropTypes.TitlePrefix
    titleSuffix: VxeFormItemPropTypes.TitleSuffix
    titleOverflow: VxeFormItemPropTypes.TitleOverflow
    showTitle: VxeFormItemPropTypes.ShowTitle
    vertical: VxeFormItemPropTypes.Vertical
    padding: VxeFormItemPropTypes.Padding
    resetValue: VxeFormItemPropTypes.ResetValue
    visibleMethod: VxeFormItemPropTypes.VisibleMethod
    visible: VxeFormItemPropTypes.Visible
    folding: VxeFormItemPropTypes.Folding
    collapseNode: VxeFormItemPropTypes.CollapseNode
    className: VxeFormItemPropTypes.ClassName
    contentClassName: VxeFormItemPropTypes.ContentClassName
    contentStyle: VxeFormItemPropTypes.ContentStyle
    titleClassName: VxeFormItemPropTypes.TitleClassName
    titleStyle: VxeFormItemPropTypes.TitleStyle
    readonly: VxeFormItemPropTypes.Readonly
    itemRender: VxeFormItemPropTypes.ItemRender
    rules: VxeFormItemPropTypes.Rules
    // 渲染属性
    showError: boolean
    errRule: any
    slots: VxeFormItemPropTypes.Slots
    children: ItemInfo[]
  }

  export interface FormRule<D = any> {
    /**
     * 是否必填
     */
    required?: boolean
    /**
     * 最小长度/值
     */
    min?: number
    /**
     * 最大长度/值
     */
    max?: number
    /**
     * 数据类型
     */
    type?: 'number' | 'string' | 'array' | '' | null
    /**
     * 使用正则表达式校验
     */
    pattern?: string | RegExp
    /**
     * 使用自定义校验函数，接收一个 Promise
     * @param params 参数
     */
    validator?: string | ((params: RuleValidatorParams<D>) => void | Error | Promise<any>)
    /**
     * 提示消息
     */
    content?: string
    trigger?: 'change' | '' | null
    maxWidth?: number
    /**
     * @deprecated 已废弃，请使用 content
     */
    message?: string
  }

  export interface RuleValidatorParams<D = any> {
    $form: VxeFormConstructor
    itemValue: any
    rule: VxeFormDefines.FormRule<D>
    rules: VxeFormDefines.FormRule<D>[]
    data: D
    field: string
  }
  export interface ValidateErrorParams<D = any> {
    $form: VxeFormConstructor,
    rule: VxeFormDefines.FormRule<D>
    data: any
    field: string
    /**
     * @deprecated
     */
    property: string
  }

  export interface ProvideItemInfo {
    itemConfig: ItemInfo
  }

  export interface ValidateErrorMapParams {
    [field: string]: ValidateErrorParams[]
  }

  interface FormEventParams<D = any> extends VxeComponentEventParams {
    $form: VxeFormConstructor
  }

  interface FormBaseParams<D = any> {
    data: D
  }

  export interface CollapseParams<D = any> extends FormBaseParams<D> { }
  export interface CollapseEventParams<D = any> extends FormEventParams<D>, CollapseParams<D> { }

  export interface SubmitParams<D = any> extends FormBaseParams<D> { }
  export interface SubmitEventParams<D = any> extends FormEventParams<D>, SubmitParams<D> { }

  export interface SubmitInvalidParams<D = any> extends FormBaseParams<D> { }
  export interface SubmitInvalidEventParams<D = any> extends FormEventParams<D>, SubmitInvalidParams<D> { }

  export interface ResetParams<D = any> extends FormBaseParams<D> { }
  export interface ResetEventParams<D = any> extends FormEventParams<D>, ResetParams<D> { }
}

export type VxeFormEventProps = {
  onCollapse?: VxeFormEvents.Collapse
  onSubmit?: VxeFormEvents.Submit
  onSubmitInvalid?: VxeFormEvents.SubmitInvalid
  onReset?: VxeFormEvents.Reset
}

export interface VxeFormListeners<D = any> {
  collapse?: VxeFormEvents.Collapse<D>
  submit?: VxeFormEvents.Submit<D>
  submitInvalid?: VxeFormEvents.SubmitInvalid<D>
  reset?: VxeFormEvents.Reset<D>
}

export namespace VxeFormEvents {
  export type Collapse<D = any> = (params: VxeFormDefines.CollapseEventParams<D>) => void
  export type Submit<D = any> = (params: VxeFormDefines.SubmitEventParams<D>) => void
  export type SubmitInvalid<D = any> = (params: VxeFormDefines.SubmitInvalidEventParams<D>) => void
  export type Reset<D = any> = (params: VxeFormDefines.ResetEventParams<D>) => void
}

export namespace VxeFormSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeFormSlots {
  /**
   * 自定义插槽模板
   */
  [key: string]: ((params: {
    $form: VxeFormConstructor

    [key: string]: any
  }) => any) | undefined

  default: (params: VxeFormSlotTypes.DefaultSlotParams) => any
}

export const Form: typeof VxeForm
export default VxeForm
