import {
  RenderFunction,
  SetupContext,
  Ref,
  ComponentPublicInstance,
  DefineComponent,
  VNode,
  VNodeArrayChildren
} from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentStatusType } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTag: defineVxeComponent<VxeTagProps, VxeTagEventProps>
export type VxeTagComponent = DefineComponent<VxeTagProps, VxeTagEmits>

export type VxeTagInstance = ComponentPublicInstance<VxeTagProps, VxeTagConstructor>

export interface VxeTagConstructor extends VxeComponentBaseOptions, VxeTagMethods {
  props: VxeTagProps
  context: SetupContext<VxeTagEmits>
  reactData: TagReactData
  getRefMaps(): TagPrivateRef
  getComputeMaps(): TagPrivateComputed
  renderVN: RenderFunction
}

export interface TagPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTagPrivateRef extends TagPrivateRef { }

export namespace VxeTagPropTypes {
  export type content = string
  export type color = 'info' | 'primary' | 'success' | 'warning' | 'danger' | 'error' | 'perfect' | string
  export type closable = boolean
  export type editable = boolean
  export type round = boolean
  export type tagStyle = 'default' | 'outline' | 'flag' | 'dashed' | 'mark' | 'arrow'
  export type size = 'medium' | 'small' | 'mini' | 'large'
  export type icon = string
  export type iconSet = string
  export type align = 'top' | 'middle' | 'bottom'
}

export type VxeTagProps = {
  /**
   * 内容
   */
  content?: VxeTagPropTypes.content
  /**
   * 颜色
   */
  color?: VxeTagPropTypes.color
  /**
   * 尺寸
   */
  size?: VxeTagPropTypes.size
  /**
   * 是否可关闭
   */
  closable?: VxeTagPropTypes.closable
  /**
   * 是否可编辑
   */
  editable?: VxeTagPropTypes.editable
  /**
   * 是否圆角
   */
  round?: VxeTagPropTypes.round
  /**
   * 标签风格样式
   */
  tagStyle?: VxeTagPropTypes.tagStyle
  /**
   * 图标
   */
  icon?: VxeTagPropTypes.icon
  /**
   * 图标库类名 默认是vxe本身图标
   */
  iconSet?: VxeTagPropTypes.iconSet
  /**
   * 内容对齐方式
   */
  align?: VxeTagPropTypes.align
}

export interface TagPrivateComputed {
}
export interface VxeTagPrivateComputed extends TagPrivateComputed { }

export interface TagReactData {
  inited: boolean,
  editing: boolean
}

export interface TagMethods {
  dispatchEvent (type: ValueOf<VxeTagEmits>, params: any, evnt: Event): void

  /**
   * 关闭
   */
  close (event: Event): Promise<any>

  /**
   * 开始编辑
   */
  startEditing (): Promise<any>
}
export interface VxeTagMethods extends TagMethods { }

export interface TagPrivateMethods { }
export interface VxeTagPrivateMethods extends TagPrivateMethods { }

export type VxeTagEmits = [
  'close',
  'update:content',
  'icon-click',
  'edit',
]

export namespace VxeTagDefines {
  export interface TagEventParams extends VxeComponentEventParams {
    $tag: VxeTagConstructor
  }
}

export type VxeTagEventProps = {
  onClose?: VxeTagEvents.Close;
  onIconClick?: VxeTagEvents.IconClick;
}

export interface VxeTagListeners { }

export namespace VxeTagEvents {
  export type Close = (params: VxeTagDefines.CloseEventParams) => void;
  export type IconClick = (params: VxeTagDefines.IconClickEventParams) => void;
}

export namespace VxeTagSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTagSlots {
  default: (params: VxeTagSlotTypes.DefaultSlotParams) => string | number | boolean | VNode | VNodeArrayChildren
  /**
   * 头像
   */
  avatar: () => string | VNode
  /**
   * 图标
   */
  icon: () => string | VNode
}

export const Tag: typeof VxeTag
export default VxeTag
