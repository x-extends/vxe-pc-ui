import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeContextMenuPropTypes, VxeContextMenuDefines } from './context-menu'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types,@typescript-eslint/no-unused-vars */

export declare const VxeList: DefineVxeComponentApp<VxeListProps, VxeListEventProps, VxeListSlots, VxeListMethods>
export type VxeListComponent = DefineVxeComponentOptions<VxeListProps>

export type VxeListInstance<D = any> = DefineVxeComponentInstance<{
  reactData: ListReactData
}, VxeListProps, VxeListPrivateComputed, VxeListMethods<D>>

export type VxeListConstructor<D = any> = VxeListInstance<D>

export interface ListPrivateRef {
}
export interface VxeListPrivateRef extends ListPrivateRef { }

export namespace VxeListPropTypes {
  export type Size = VxeComponentSizeType
  export type Data = any[]
  export type Height = number | string
  export type MaxHeight = number | string
  export type Loading = boolean
  export type AutoResize = boolean
  export type ClassName = string | ((params: { $list: VxeListConstructor }) => string)
  export type SyncResize = boolean | string | number

  export type ShowSeq = boolean
  export type ShowRadio = boolean
  export type CheckRowKey = string | number | null
  export interface RadioConfig<D = any> {
    strict?: boolean
    visibleMethod?: (params: {
      $list: VxeListConstructor
      row: D
    }) => boolean
    checkMethod?: (params: {
      $list: VxeListConstructor
      row: D
    }) => boolean
    highlight?: boolean
    showIcon?: boolean
    trigger?: '' | 'default' | 'row'
  }
  export type CheckRowKeys = (string | number | null)[]
  export type ShowCheckbox = boolean
  export interface CheckboxConfig<D = any> {
    showHeader?: boolean
    headerTitle?: string | number
    highlight?: boolean
    visibleMethod?: (params: {
      $list: VxeListConstructor
      row: D
    }) => boolean
    checkMethod?: (params: {
      $list: VxeListConstructor
      row: D
    }) => boolean
    showIcon?: boolean
    trigger?: '' | 'default' | 'row'
  }

  export interface RowConfig<D = any> {
    /**
     * 是否需要为每一行的 VNode 设置 key 属性
     */
    useKey?: boolean
    /**
     * 自定义行数据唯一主键的字段名（默认自动生成）
     */
    keyField?: string
    /**
     * 显示字段
     */
    contentField?: string
    /**
     * 每一行的高度
     */
    height?: number | string
    /**
     * 给每一行的附加 className
     */
    className?: string | ((params: { row: D, $list: VxeListConstructor }) => string)
    /**
     * 当鼠标移到每一行时，是否要高亮当前头
     */
    isHover?: boolean
    isCurrent?: boolean
    padding?: boolean
    currentMethod?: (params: { row: D }) => boolean
  }

  /**
   * 拖拽排序配置项
   */
  export interface DragConfig<D = any>{
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 自定义图标
     */
    icon?: string
    /**
     * 是否显示拖拽按钮图标
     */
    showIcon?: boolean
    /**
     * 显示拖拽提示，拖拽过程中显示信息
     */
    showDragTip?: boolean
    /**
     * 触发拖拽方式
     */
    trigger?: 'default' | 'row' | '' | null
    /**
     * 是否允许在不同列表之间进行拖拽
     */
    isCrossListDrag?: boolean
    /**
     * 是否显示拖拽辅助状态显示
     */
    showGuidesStatus?: boolean
    /**
     * 是否显示拖拽动画，启用后由数据量的大小来影响渲染性能
     */
    animation?: boolean
    /**
     * 是否禁用拖拽按钮
     */
    disabledMethod?(params: {
      $list: VxeListConstructor
      row: D
    }): boolean
    /**
     * 是否显示拖拽按钮
     */
    visibleMethod?(params: {
      $list: VxeListConstructor
      row: D
    }): boolean
    /**
     * 自定义提示内容
     */
    tooltipMethod?(params: {
      $list: VxeListConstructor
      row: D
    }): string | number | null
    /**
     * 拖拽开始时是否允许行拖拽调整顺序的方法，该方法的返回值用来决定是否允许被拖拽
     */
    dragStartMethod?(params: VxeListDefines.RowDragstartEventParams<D>): boolean
    /**
     * 拖拽结束时是否允许行拖拽调整顺序的方法，该方法的返回值用来决定是否允许被拖拽调整顺序
     */
    dragEndMethod?(params: Omit<VxeListDefines.RowDragendEventParams<D>, '_index'>): Promise<boolean> | boolean
  }

  export interface MenuConfig<D = any> {
    /**
     * 是否启用
     */
    enabled?: boolean
    /**
     * 菜单配置
     */
    options: VxeContextMenuPropTypes.Options
    /**
     * 该函数的返回值用来决定是否允许显示右键菜单（对于需要对菜单进行权限控制时可能会用到）
     */
    visibleMethod?(params: {
      $list: VxeListConstructor
      options: VxeContextMenuPropTypes.Options
      row: D
    }): boolean
  }

  export interface VirtualYConfig {
    /**
     * 指定大于指定行时自动启动纵向虚拟滚动，如果为 0 则总是启用，如果为 -1 则关闭
     */
    gt?: number
    /**
     * 指定每次渲染的数据额外数据，额外数据越大渲染次数就越少，但每次渲染耗时就越久
     */
    oSize?: number
    /**
     * 指定行的 className
     */
    sItem?: string
    /**
     * 是否启用
     */
    enabled?: boolean
  }

  /**
   * 已被 VirtualYConfig 替换
   * @deprecated
   */
  export interface ScrollY {
    /**
     * 指定大于指定行时自动启动纵向虚拟滚动，如果为 0 则总是启用，如果为 -1 则关闭
     */
    gt?: number
    /**
     * 指定每次渲染的数据额外数据，额外数据越大渲染次数就越少，但每次渲染耗时就越久
     */
    oSize?: number
    /**
     * 指定行的 className
     */
    sItem?: string
    /**
     * 是否启用
     */
    enabled?: boolean
  }
}

export interface VxeListProps<D = any> {
  size?: VxeListPropTypes.Size
  data?: D[]
  height?: VxeListPropTypes.Height
  maxHeight?: VxeListPropTypes.MaxHeight
  loading?: VxeListPropTypes.Loading
  autoResize?: VxeListPropTypes.AutoResize
  syncResize?: VxeListPropTypes.SyncResize
  className?: VxeListPropTypes.ClassName
  showSeq?: VxeListPropTypes.ShowSeq
  showRadio?: VxeListPropTypes.ShowRadio
  checkRowKey?: VxeListPropTypes.CheckRowKey
  radioConfig?: VxeListPropTypes.RadioConfig
  showCheckbox?: VxeListPropTypes.ShowCheckbox
  checkRowKeys?: VxeListPropTypes.CheckRowKeys
  checkboxConfig?: VxeListPropTypes.CheckboxConfig
  rowConfig?: VxeListPropTypes.RowConfig
  dragConfig?: VxeListPropTypes.DragConfig
  menuConfig?: VxeListPropTypes.MenuConfig
  virtualYConfig?: VxeListPropTypes.VirtualYConfig

  /**
   * 已废弃，被 virtual-y-config 替换
   * @deprecated
   */
  scrollY?: VxeListPropTypes.ScrollY
}

export interface ListPrivateComputed {
}
export interface VxeListPrivateComputed extends ListPrivateComputed { }

export interface ListReactData {
  scrollYLoad: boolean
  bodyHeight: number
  headHeight: number
  footHeight: number
  customHeight: number
  customMaxHeight: number
  parentHeight: number
  topSpaceHeight: number
  rowList: any[]
  selectRadioRow: any
  currRowFlag: number
  updateCheckboxFlag: number
  isAllChecked: boolean
  isAllIndeterminate: boolean

  insertRowFlag: number
  removeRowFlag: number

  dragRow: any
  dragTipText: string
  isCrossDragRow: boolean
}

export interface ListInternalData {
  resizeObserver: ResizeObserver | undefined
  fullData: any[]
  afterList: any[]
  fullKeyMaps: Record<string, any>
  rowMaps: Record<string, VxeListDefines.RowCacheItem>
  lastScrollLeft: number
  lastScrollTop: number
  scrollYStore: {
    startIndex: number
    endIndex: number
    visibleSize: number
    offsetSize: number
    rowHeight: number
  }
  currentRow: any
  selectCheckboxMaps: Record<string, any>

  insertRowMaps: Record<string, any>
  removeRowMaps: Record<string, any>

  prevDragRow?: any
  prevDragPos?: 'top' | 'bottom' | ''
}

export interface ListMethods<D = any> {
  dispatchEvent(type: ValueOf<VxeListEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 加载数据
   * @param data 列表数据
   */
  loadData(data: any[]): Promise<any>
  /**
   * 加载数据
   * @param data 列表数据
   */
  reloadData(data: any[]): Promise<any>
  /**
   * 获取列表的全量数据
   */
  getFullData(): D[]
  /**
   * 重新计算列表
   */
  recalculate(): Promise<void>
  /**
   * 如果有滚动条，则滚动到对应的位置
   */
  scrollTo(x: {
    top?: number | null
    left?: number | null
  } | number | null | undefined, y?: number | null): Promise<void>
  /**
   * 刷新滚动操作，手动同步滚动相关位置
   */
  refreshScroll(): Promise<void>
  /**
   * 手动清除滚动相关信息，还原到初始状态
   */
  clearScroll(): Promise<void>
  /**
   * 刷新滚动操作，手动同步滚动相关位置
   */
  refreshScroll(): Promise<void>
  /**
   * 手动清除滚动相关信息，还原到初始状态
   */
  clearScroll(): Promise<void>
  /**
   * 获取主键
   */
  getRowKey(row: D): string
  /**
   * 判断主键是否相同
   */
  eqRowKey(rowKey1: string | number | null | undefined, rowKey2: string | number | null | undefined): boolean
  /**
   * 判断行是否相同
   */
  eqRow(row1: D, row2: D): boolean
  /**
   * 根据行判断主键是否相同
   */
  eqRowByKey(row1: D, rowKey2: string | number | null | undefined): boolean
  /**
   * 根据行查找
   */
  findRow(list: D[], row: D): D
  /**
   * 根据主键查找
   */
  findRowByKey(list: D[], rowKey: string | number | null | undefined): D
  /**
   * 根据行查找索引
   */
  findRowIndexOf(list: D[], row: D): number
  /**
   * 根据主键查找索引
   */
  findRowIndexOfByKey(list: D[], rowKey: string | number | null | undefined): number
  /**
   * 根据主键判断单选框行是否选中
   */
  isCheckedByRadioRowKey(rowKey: string | number | null | undefined): boolean
  /**
   * 判断单选框行是否选中
   */
  isCheckedByRadioRow(row: D): boolean
  /**
   * 根据主键判断复选框行是否选中
   */
  isCheckedByCheckboxRowKey(rowKey: string | number | null | undefined): boolean
  /**
   * 判断复选框行是否选中
   */
  isCheckedByCheckboxRow(row: D): boolean
  /**
   * 只对 row-config.isCurrent 有效，设置已选的当前行
   */
  setCurrentRow(row: D): Promise<void>
  /**
   * 只对 show-radio 有效，根据主键设置当前行
   */
  setCurrentRowByKey(rowKey: string | number | null | undefined): Promise<void>
  /**
   * 只对 show-radio 有效，获取当前行已选的行
   */
  getCurrentRow(): D | null
  /**
   * 只对 show-radio 有效，获取当前行已选的主键
   */
  getCurrentRowKey(): string | number | null
  /**
   * 只对 show-radio 有效，手动清空当前行
   */
  clearCurrentRow(): Promise<void>
  /**
   * 只对 show-radio 有效，设置单选框已选的行
   */
  setRadioRow(row: D): Promise<void>
  /**
   * 只对 show-radio 有效，根据主键设置单选
   */
  setRadioRowByKey(rowKey: string | number | null | undefined): Promise<void>
  /**
   * 只对 show-radio 有效，获取单选框已选的行
   */
  getRadioRow(): D | null
  /**
   * 只对 show-radio 有效，获取单选框已选的主键
   */
  getRadioRowKey(): string | number | null
  /**
   * 只对 show-radio 有效，手动清空单选框
   */
  clearRadioRow(): Promise<void>
  /**
   * 只对 show-checkbox 有效，设置复选框选中的行
   */
  setCheckboxRow(rows: D | D[], checked: boolean): Promise<void>
  /**
   * 只对 show-checkbox 有效，根据主键设置复选框
   */
  setCheckboxRowByKey(rowKeys: string | number | null | undefined | (string | number | null | undefined)[], checked: boolean): Promise<void>
  /**
   * 只对 show-checkbox 有效，获取复选框已选的行
   */
  getCheckboxRows(): D[]
  /**
   * 只对 show-checkbox 有效，获取复选框已选的主键
   */
  getCheckboxRowKeys(): (string | number)[]
  /**
   * 只对 show-checkbox 有效，手动清空复选框
   */
  clearCheckboxRow(): Promise<void>
  /**
   * 只对 show-checkbox 有效，设置所有行的选中状态
   */
  setAllCheckboxRow(checked: boolean): Promise<void>

  /**
   * 往列表插入临时数据，从第一个行新增一个行或多个行新数据
   */
  insert(records: any): Promise<{ row: D, rows: D[] }>
  /**
   * 往列表指定行中插入临时数据
   * 如果 row 为空则从插入到顶部，如果为树结构，则插入到目标行顶部
   * 如果 row 为 -1 则从插入到底部，如果为树结构，则插入到目标行底部
   * 如果 row 为有效行则插入到该行的位置
   */
  insertAt(records: any, targetRowOrRowKey?: any | -1 | null): Promise<{ row: D, rows: D[] }>
  /**
   * 用于 transform 模式，与 insertAt 行为一致，区别就是会插入指定目标的到下一行
   */
  insertNextAt(records: any, targetRowOrRowKey?: any | -1 | null): Promise<{ row: D, rows: D[] }>
  /**
   * 判断行是否为新增的临时数据
   */
  isInsertByRow(row: any | null): boolean
  /**
   * 用于 transform 模式，删除指定行数据，指定 row 或 [row, ...] 删除多条数据，如果为空则删除所有数据
   */
  remove(rows?: any | any[]): Promise<{ row: D, rows: D[] }>
  /**
   * 用于 transform 模式，获取新增的临时数据
   */
  getInsertRecords(): D[]
  /**
   * 用于 transform 模式，获取已删除的数据
   */
  getRemoveRecords(): D[]
  /**
   * 判断数据是否被删除
   */
  isRemoveByRow(row: any | null): boolean
}
export interface VxeListMethods<D = any> extends ListMethods<D> { }

export interface ListPrivateMethods<D = any> {
  /**
   * @private
   */
  handleCrossListRowDragInsertEvent(evnt: DragEvent): void
  /**
   * @private
   */
  handleCrossListRowDragCancelEvent(evnt: DragEvent): void
  /**
   * @private
   */
  handleCrossListRowDragFinishEvent(evnt: DragEvent): void
  /**
   * @private
   */
  handleCrossListRowDragoverEmptyEvent(evnt: DragEvent): void
  /**
   * @private
   */
  hideCrossListRowDropClearStatus(): void
}
export interface VxeListPrivateMethods<D = any> extends ListPrivateMethods<D> { }

export type VxeListEmits = [
  'update:checkRowKey',
  'update:checkRowKeys',
  'row-click',
  'row-dblclick',
  'current-change',
  'radio-change',
  'checkbox-change',
  'checkbox-all',
  'scroll',
  'row-dragstart',
  'row-dragover',
  'row-dragend',
  'row-remove-dragend',
  'row-insert-dragend',
  'row-menu',
  'menu-click'
]

export namespace VxeListDefines {

  export interface RowCacheItem {
    item: any
    index: number
    $index: number
    _index: number
  }

  export interface ListEventParams<D = any> extends VxeComponentEventParams {
    $list: VxeListConstructor<D>
  }

  export interface RowClickParams<D = any> {
    row: D
  }
  export interface RowClickEventParams<D = any> extends ListEventParams, RowClickParams<D> { }

  export interface RowDblclickEventParams<D = any> extends RowClickEventParams<D> { }

  export interface RowDragstartEventParams<D = any> {
    row: D
  }

  export interface RowDragoverEventParams<D = any> {
    oldRow: D
    targetRow: D
    dragRow: D
    dragPos: 'top' | 'bottom'
    offsetIndex: 0 | 1
  }

  export interface RowDragendEventParams<D = any> {
    newRow: D
    oldRow: D
    dragRow: D
    dragPos: 'top' | 'bottom'
    offsetIndex: 0 | 1
    _index: {
      newIndex: number
      oldIndex: number
    }
  }

  export interface ScrollParams { }
  export interface ScrollEventParams extends ListEventParams, ScrollParams { }

  export interface MenuClickEventParams<D = any> extends ListEventParams<D> {
    row: D
    menu: VxeContextMenuDefines.MenuFirstOption | VxeContextMenuDefines.MenuChildOption
  }

}

export type VxeListEventProps<D = any> = {
  onRowClick?: VxeListEvents.RowClick<D>
  onRowDblclick?: VxeListEvents.RowDblclick<D>
  onScroll?: VxeListEvents.Scroll
  onRowDragstart?: VxeListEvents.RowDragstart<D>
  onRowDragover?: VxeListEvents.RowDragover<D>
  onRowDragend?: VxeListEvents.RowDragend<D>
  onMenuClick?: VxeListEvents.MenuClick<D>
}

export interface VxeListListeners<D = any> {
  rowClick?: VxeListEvents.RowClick<D>
  rowDblclick?: VxeListEvents.RowDblclick<D>
  scroll?: VxeListEvents.Scroll
  rowDragstart?: VxeListEvents.RowDragstart<D>
  rowDragover?: VxeListEvents.RowDragover<D>
  rowDragend?: VxeListEvents.RowDragend<D>
  menuClick?: VxeListEvents.MenuClick<D>
}

export namespace VxeListEvents {
  export type RowClick<D = any> = (params: VxeListDefines.RowClickEventParams<D>) => void
  export type RowDblclick<D = any> = (params: VxeListDefines.RowDblclickEventParams<D>) => void
  export type Scroll = (params: VxeListDefines.ScrollEventParams) => void
  export type RowDragstart<D = any> = (params: VxeListDefines.RowDragstartEventParams<D>) => void
  export type RowDragover<D = any> = (params: VxeListDefines.RowDragoverEventParams<D>) => void
  export type RowDragend<D = any> = (params: VxeListDefines.RowDragendEventParams<D>) => void
  export type MenuClick<D = any> = (params: VxeListDefines.MenuClickEventParams<D>) => void
}

export namespace VxeListSlotTypes {
  export interface DefaultSlotParams {
    $list: VxeListConstructor
    items: any[]
  }
  export interface HeaderSlotParams extends DefaultSlotParams {}
  export interface FooterSlotParams extends DefaultSlotParams {}

  export interface ContentSlotParams<D = any> {
    row: D
  }
  export interface ExtraSlotParams<D = any> extends ContentSlotParams<D> {}
  export interface DragSlotParams<D = any> {
    row: D
  }
}

export interface VxeListSlots {
  default?: (params: VxeListSlotTypes.DefaultSlotParams) => any
  header?:(params: VxeListSlotTypes.HeaderSlotParams) => any
  footer?:(params: VxeListSlotTypes.FooterSlotParams) => any
  content?:(params: VxeListSlotTypes.ContentSlotParams) => any
  extra?:(params: VxeListSlotTypes.ExtraSlotParams) => any
  tip?:(params: VxeListSlotTypes.DragSlotParams) => any
}

export const List: typeof VxeList
export default VxeList
