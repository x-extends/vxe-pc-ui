import { DefineVxeComponentInstance } from '@vxe-ui/core'
import { VxeTableConstructor, VxeTableMethods, VxeTablePrivateMethods } from '../table'
import { VxeGanttPropTypes, VxeGanttDefines, VxeGanttConstructor } from '../gantt'

/* eslint-disable no-use-before-define */

export type VxeGanttViewInstance = DefineVxeComponentInstance<{
  reactData: GanttViewReactData
  internalData: GanttViewInternalData

  $xeGantt: VxeGanttConstructor
}, VxeGanttViewProps, GanttViewPrivateComputed, VxeGanttViewMethods>

export type VxeGanttViewConstructor = VxeGanttViewInstance

interface VxeGanttViewProps {
}

export interface GanttViewReactData {
  // 是否启用了横向 X 可视渲染方式加载
  scrollXLoad: boolean
  // 是否启用了纵向 Y 可视渲染方式加载
  scrollYLoad: boolean
  // 是否存在纵向滚动条
  overflowY: boolean
  // 是否存在横向滚动条
  overflowX: boolean
  // 纵向滚动条的宽度
  scrollbarWidth: number
  // 横向滚动条的高度
  scrollbarHeight: number

  lazScrollLoading: boolean

  scrollVMLoading: boolean
  scrollYHeight: number
  scrollYTop: number
  isScrollYBig: boolean
  scrollXLeft: number
  scrollXWidth: number
  isScrollXBig: boolean

  minViewDate: Date | null
  maxViewDate: Date | null
  tableData: any[]
  tableColumn: VxeGanttPropTypes.Column[]
  headerGroups: VxeGanttPropTypes.Column[][]

  viewCellWidth: number

  rowHeightStore: {
    large: number
    default: number
    medium: number
    small: number
    mini: number
  }
}

export interface GanttViewInternalData {
  xeTable: (VxeTableConstructor & VxeTableMethods & VxeTablePrivateMethods) | null
  startMaps: Record<string, any>
  endMaps: Record<string, any>
  chartMaps: Record<string, VxeGanttDefines.RowCacheItem>
  elemStore: {
    [key: string]: HTMLElement | null
  }
  // 存放横向 X 虚拟滚动相关的信息
  scrollXStore: {
    preloadSize: number
    offsetSize: number
    visibleSize: number
    visibleStartIndex: number
    visibleEndIndex: number
    startIndex: number
    endIndex: number
  }
  // 存放纵向 Y 虚拟滚动相关信息
  scrollYStore: {
    adaptive?: boolean
    preloadSize: number
    offsetSize: number
    visibleSize: number
    visibleStartIndex: number
    visibleEndIndex: number
    startIndex: number
    endIndex: number
  }

  // 滚动属性
  intoRunScroll?: boolean
  inVirtualScroll?: boolean
  inWheelScroll?: boolean

  inHeaderScroll?: boolean
  inBodyScroll?: boolean
  inFooterScroll?: boolean
  scrollRenderType?: '' | 'left' | 'right'
  // 同步滚动
  lcsTimeout?: undefined | number
  lcsRunTime?: undefined | number

  // 横向虚拟
  lxRunTime?: undefined | number
  lxTimeout?: undefined | number
  // 纵向虚拟
  lyRunTime?: undefined | number
  lyTimeout?: undefined | number
}

export interface GanttViewPrivateRef {
}

export interface GanttViewPrivateComputed {
}

export interface VxeGanttViewPrivateMethods {
  /**
   * @private
   */
  handleUpdateStyle(): void
  /**
   * @private
   */
  handleUpdateCurrentRow(row?: any): void
  /**
   * @private
   */
  handleUpdateHoverRow(row?: any): void
  /**
   * @private
   */
  handleLazyRecalculate(): Promise<void>
  /**
   * @private
   */
  triggerHeaderScrollEvent(evnt: Event): void
  /**
   * @private
   */
  triggerBodyScrollEvent(evnt: Event): void
  /**
   * @private
   */
  triggerFooterScrollEvent(evnt: Event): void
  /**
   * @private
   */
  triggerVirtualScrollXEvent(evnt: Event): void
  /**
   * @private
   */
  triggerVirtualScrollYEvent(evnt: Event): void
  /**
   * @private
   */
  handleUpdateSXSpace(): void
  /**
   * @private
   */
  handleUpdateSYSpace(): void
  /**
   * @private
   */
  handleUpdateSYStatus(scrollYLoad: boolean): void
}

export interface VxeGanttViewMethods {
  refreshData(): Promise<void>
  updateViewData(): Promise<void>
  connectUpdate(params: {
    $table: VxeTableConstructor & VxeTableMethods & VxeTablePrivateMethods
  }): Promise<void>
}

type VxeGanttViewEmits = []
