import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, VxeComponentSize, ValueOf } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePager: defineVxeComponent<VxePagerProps, VxePagerEventProps>

export type VxePagerInstance = ComponentPublicInstance<VxePagerProps, VxePagerConstructor>

export interface VxePagerConstructor extends VxeComponentBase, VxePagerMethods {
  props: VxePagerProps
  context: SetupContext<VxePagerEmits>
  reactData: PagerReactData
  getRefMaps(): PagerPrivateRef
  getComputeMaps(): PagerPrivateComputed
  renderVN: RenderFunction
}

export interface PagerPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxePagerPrivateRef extends PagerPrivateRef { }

export type PageSizeItemType = number | {
  label?: number | string
  value?: number | string
}

export namespace VxePagerPropTypes {
  export type Size = VxeComponentSize
  export type Layouts = Array<'Home' | 'PrevJump' | 'PrevPage' | 'Number' | 'JumpNumber' | 'NextPage' | 'NextJump' | 'End' | 'Sizes' | 'Jump' | 'FullJump' | 'PageCount' | 'Total'>
  export type CurrentPage = number
  export type Loading = boolean
  export type PageSize = number
  export type Total = number
  export type PagerCount = number
  export type PageSizes = PageSizeItemType[]
  export type Align = string
  export type Border = boolean
  export type Background = boolean
  export type Perfect = boolean
  export type AutoHidden = boolean
  export type Transfer = boolean
  export type ClassName = string | ((params: {
    $pager: VxePagerConstructor
  }) => string)
  export type IconPrevPage = string
  export type IconJumpPrev = string
  export type IconJumpNext = string
  export type IconNextPage = string
  export type IconJumpMore = string
  export type IconHomePage = string
  export type IconEndPage = string
}

export type VxePagerProps = {
  size?: VxePagerPropTypes.Size
  /**
   * 自定义布局
   */
  layouts?: VxePagerPropTypes.Layouts
  /**
   * 当前页
   */
  currentPage?: VxePagerPropTypes.CurrentPage
  /**
   * 加载中
   */
  loading?: VxePagerPropTypes.Loading
  /**
   * 每页大小
   */
  pageSize?: VxePagerPropTypes.PageSize
  /**
   * 总条数
   */
  total?: VxePagerPropTypes.Total
  /**
   * 显示页码按钮的数量
   */
  pagerCount?: VxePagerPropTypes.PagerCount
  /**
   * 每页大小选项列表
   */
  pageSizes?: VxePagerPropTypes.PageSizes
  /**
   * 列对其方式
   */
  align?: VxePagerPropTypes.Align
  /**
   * 带边框
   */
  border?: VxePagerPropTypes.Border
  /**
   * 带背景颜色
   */
  background?: VxePagerPropTypes.Background
  /**
   * 配套的样式
   */
  perfect?: VxePagerPropTypes.Perfect
  /**
   * 当只有一页时隐藏
   */
  autoHidden?: VxePagerPropTypes.AutoHidden
  transfer?: VxePagerPropTypes.Transfer
  className?: VxePagerPropTypes.ClassName
  /**
   * 自定义图标
   */
  iconPrevPage?: VxePagerPropTypes.IconPrevPage
  iconJumpPrev?: VxePagerPropTypes.IconJumpPrev
  iconJumpNext?: VxePagerPropTypes.IconJumpNext
  iconNextPage?: VxePagerPropTypes.IconNextPage
  iconJumpMore?: VxePagerPropTypes.IconJumpMore
  iconHomePage?: VxePagerPropTypes.IconHomePage
  iconEndPage?: VxePagerPropTypes.IconEndPage
}

export interface PagerPrivateComputed {
}
export interface VxePagerPrivateComputed extends PagerPrivateComputed { }

export interface PagerReactData {
  inpCurrPage: string | number
}

export interface PagerMethods {
  dispatchEvent(type: ValueOf<VxePagerEmits>, params: any, evnt?: Event): void
  /**
   * 首页
   */
  homePage(): Promise<any>
  /**
   * 末页
   */
  endPage(): Promise<any>
  /**
   * 上一页
   */
  prevPage(): Promise<any>
  /**
   * 下一页
   */
  nextPage(): Promise<any>
  /**
   * 向上翻页
   */
  prevJump(): Promise<any>
  /**
   * 向下翻页
   */
  nextJump(): Promise<any>
}
export interface VxePagerMethods extends PagerMethods { }

export interface PagerPrivateMethods {
  handlePrevPage(evnt: Event): void
  handleNextPage(evnt: Event): void
  handlePrevJump(evnt: Event): void
  handleNextJump(evnt: Event): void
}
export interface VxePagerPrivateMethods extends PagerPrivateMethods { }

export type VxePagerEmits = [
  'update:pageSize',
  'update:currentPage',
  'page-change'
]

export namespace VxePagerDefines {
  export interface PagerEventParams extends VxeComponentEvent {
    $pager: VxePagerConstructor
  }

  export type PageChangeParams = {
    type: 'current' | 'size'
    pageSize: number
    currentPage: number
  }
  export interface PageChangeEventParams extends PagerEventParams, PageChangeParams { }
}

export type VxePagerEventProps = {
  onPageChange?: VxePagerEvents.PageChange
}

export interface VxePagerListeners {
  pageChange?: VxePagerEvents.PageChange
}

export namespace VxePagerEvents {
  export type PageChange = (params: VxePagerDefines.PageChangeEventParams) => void
}

export namespace VxePagerSlotTypes {
  export interface DefaultSlotParams {
    [key: string]: any
  }
}

export interface VxePagerSlots {
  left: (params: VxePagerSlotTypes.DefaultSlotParams) => any
  right: (params: VxePagerSlotTypes.DefaultSlotParams) => any
}

export const Pager: typeof VxePager
export default VxePager
