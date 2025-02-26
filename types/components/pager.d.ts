import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeSelectPropTypes } from './select'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePager: DefineVxeComponentApp<VxePagerProps, VxePagerEventProps, VxePagerSlots>
export type VxePagerComponent = DefineVxeComponentOptions<VxePagerProps, VxePagerEventProps>

export type VxePagerInstance = DefineVxeComponentInstance<VxePagerProps, VxePagerConstructor>

export interface VxePagerConstructor extends VxeComponentBaseOptions, VxePagerMethods {
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
  export type Size = VxeComponentSizeType
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
  export type PageSizePlacement = VxeSelectPropTypes.Placement
  export type IconPrevPage = string
  export type IconJumpPrev = string
  export type IconJumpNext = string
  export type IconNextPage = string
  export type IconJumpMore = string
  export type IconHomePage = string
  export type IconEndPage = string
}

export interface VxePagerProps {
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
  pageSizePlacement?: VxePagerPropTypes.PageSizePlacement
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
  dispatchEvent(type: ValueOf<VxePagerEmits>, params: Record<string, any>, evnt: Event | null): void
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
  export interface PagerEventParams extends VxeComponentEventParams {
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
  export interface HomePageSlotParams {
    currentPage: number
  }
  export interface PrevPageSlotParams {
    currentPage: number
  }
  export interface JumpPrevSlotParams {
    currentPage: number
  }
  export interface JumpNextSlotParams {
    currentPage: number
  }
  export interface NextPageSlotParams {
    currentPage: number
  }
  export interface EndPageSlotParams {
    currentPage: number
  }
  export interface JumpNumberSlotParams {
    numList: number[]
    currentPage: number
    pageCount: number
  }
  export interface SizesSlotParams {
    currentPage: number
    options: {
      label: number | string
      value: number | string
    }[]
  }
  export interface FullJumpSlotParams {
    currentPage: number
    pageCount: number
  }
  export interface PageCountSlotParams {
    currentPage: number
    pageCount: number
  }
  export interface TotalSlotParams {
    currentPage: number
    total: number
  }
}

export interface VxePagerSlots {
  left?: (params: VxePagerSlotTypes.DefaultSlotParams) => any

  right?: (params: VxePagerSlotTypes.DefaultSlotParams) => any

  homePage?: (params: VxePagerSlotTypes.HomePageSlotParams) => any
  'home-page'?: (params: VxePagerSlotTypes.HomePageSlotParams) => any

  prevPage?: (params: VxePagerSlotTypes.PrevPageSlotParams) => any
  'prev-page'?: (params: VxePagerSlotTypes.PrevPageSlotParams) => any

  jumpPrev?: (params: VxePagerSlotTypes.JumpPrevSlotParams) => any
  'jump-prev'?: (params: VxePagerSlotTypes.JumpPrevSlotParams) => any

  jumpNext?: (params: VxePagerSlotTypes.JumpNextSlotParams) => any
  'jump-next'?: (params: VxePagerSlotTypes.JumpNextSlotParams) => any

  nextPage?: (params: VxePagerSlotTypes.NextPageSlotParams) => any
  'next-page'?: (params: VxePagerSlotTypes.NextPageSlotParams) => any

  endPage?: (params: VxePagerSlotTypes.EndPageSlotParams) => any
  'end-page'?: (params: VxePagerSlotTypes.EndPageSlotParams) => any

  number?: (params: VxePagerSlotTypes.JumpNumberSlotParams) => any
  jumpNumber?: (params: VxePagerSlotTypes.JumpNumberSlotParams) => any
  'jump-number'?: (params: VxePagerSlotTypes.JumpNumberSlotParams) => any

  sizes?: (params: VxePagerSlotTypes.SizesSlotParams) => any

  fullJump?: (params: VxePagerSlotTypes.FullJumpSlotParams) => any
  'full-jump'?: (params: VxePagerSlotTypes.FullJumpSlotParams) => any
  jump?: (params: VxePagerSlotTypes.FullJumpSlotParams) => any

  pageCount?: (params: VxePagerSlotTypes.PageCountSlotParams) => any
  'page-count'?: (params: VxePagerSlotTypes.PageCountSlotParams) => any

  total?: (params: VxePagerSlotTypes.TotalSlotParams) => any
}

export const Pager: typeof VxePager
export default VxePager
