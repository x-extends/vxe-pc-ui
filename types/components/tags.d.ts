import { VxeTagInstance, VxeTagProps, VxeTagPropTypes } from './tag'
import { ComponentPublicInstance, Ref, RenderFunction, SetupContext, VNode } from 'vue'
import { ValueOf, VXEComponent, VxeComponentBase, VxeEvent } from './component'

export namespace VxeTagsPropTypes {
  export type modelValue = Array<string | number | VxeTagProps>
  export type color = VxeTagPropTypes.color
  export type size = VxeTagPropTypes.size
  export type closable = VxeTagPropTypes.closable
  export type round = VxeTagPropTypes.round
  export type tagStyle = VxeTagPropTypes.tagStyle
  export type icon = VxeTagPropTypes.icon
  export type iconSet = VxeTagPropTypes.iconSet
  export type align = VxeTagPropTypes.align
  export type creator = boolean | ((exist?: Array<string | number | VxeTagProps>) => VxeTagProps)
}
export type VxeTagsProps = {
  modelValue?: VxeTagsPropTypes.modelValue
  color?: VxeTagsPropTypes.color
  size?: VxeTagsPropTypes.size
  closable?: VxeTagsPropTypes.closable
  round?: VxeTagsPropTypes.round
  tagStyle?: VxeTagsPropTypes.tagStyle
  icon?: VxeTagsPropTypes.icon
  iconSet?: VxeTagsPropTypes.iconSet
  align?: VxeTagsPropTypes.align
  creator?: VxeTagsPropTypes.creator
}

export interface TagsReactData {
  inited: boolean,
  innerTags: Array<VxeTagProps | string | number>
}

export interface TagsPrivateRef {
  refElem: Ref<HTMLSpanElement>;
  refTags: Ref<VxeTagInstance[]>;
  activeTag: Ref<VxeTagInstance>;
}

export interface VxeTagsPrivateRef extends TagsPrivateRef {}

export type VxeTagsEmits = [
  'update:modelValue',
  'close',
  'edit',
  'icon-click',
  'tag-created',
]

export interface TagsMethods {
  dispatchEvent (type: ValueOf<VxeTagsEmits>, params: any, evnt: Event): void

  /**
   * 关闭其中一个标签
   */
  close (index: number): Promise<any>

  /**
   * 创建标签
   */
  create (tag: VxeTagProps, index?: number): void
}

export interface VxeTagsMethods extends TagsMethods {}

export interface VxeTagsConstructor extends VxeComponentBase, VxeTagsMethods {
  props: VxeTagsProps;
  context: SetupContext<VxeTagsEmits>
  reactData: TagsReactData

  getRefMaps (): VxeTagsPrivateRef

  renderVN: RenderFunction
}

export namespace VxeTagsDefines {
  export interface TagsEventParams extends VxeEvent {
    $tags: VxeTagsConstructor
  }

  export interface CloseParams {
    index: number
  }

  export interface IconClickParams {
    index: number
  }

  export interface TagCreatedParams {
    tag: string | VxeTagProps
  }

  export interface EditParams {
    index: number
    content: string
  }
}
export namespace VxeTagsEvents {
  export type Close = (params: VxeTagsDefines.TagsEventParams & VxeTagsDefines.CloseParams) => void;
  export type IconClick = (params: VxeTagsDefines.TagsEventParams & VxeTagsDefines.IconClickParams) => void;
  export type TagCreated = (params: VxeTagsDefines.TagsEventParams & VxeTagsDefines.TagCreatedParams) => void;
  export type Edit = (params: VxeTagsDefines.TagsEventParams & VxeTagsDefines.EditParams) => void;
}

export interface VxeTagsEventProps {
  onClose?: VxeTagsEvents.Close;
  onIconClick?: VxeTagsEvents.IconClick;
  onTagCreated?: VxeTagsEvents.TagCreated;
  onEdit?: VxeTagsEvents.Edit;
}

export interface VxeTagsSlots {
  /**
   * 间隔插槽
   */
  separator: () => string | VNode
}

export type VxeTagsInstance = ComponentPublicInstance<VxeTagsProps, VxeTagsConstructor>
export const VxeTags: VXEComponent<VxeTagsProps, VxeTagsEventProps, VxeTagsSlots>

/**
 * 组件 - 标签集
 * @example import { VxeTags } from 'vxe-components'
 */
export const Tags: typeof VxeTags
