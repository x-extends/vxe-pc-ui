import { DefineVxeComponentInstance } from '@vxe-ui/core'
import { VxeTableDefines, VxeTableConstructor, VxeTableMethods, VxeTablePrivateMethods } from '../table'

/* eslint-disable @typescript-eslint/no-empty-interface,@typescript-eslint/no-unused-vars,no-use-before-define */

export type VxeTableCustomPanelInstance = DefineVxeComponentInstance<{
  reactData: TableCustomPanelReactData
  internalData: TableCustomPanelInternalData

  $xeTable: VxeTableConstructor & VxeTableMethods & VxeTablePrivateMethods
}, VxeTableCustomPanelProps, TableCustomPanelPrivateComputed, VxeTableCustomPanelMethods>

export type VxeTableCustomPanelConstructor = VxeTableCustomPanelInstance

interface VxeTableCustomPanelProps {
  customStore: VxeTableDefines.VxeTableCustomStoreObj
}

export interface TableCustomPanelReactData {
  dragCol: VxeTableDefines.ColumnInfo | null
  dragGroupField: string | null | undefined
  dragAggFnCol?: VxeTableDefines.ColumnInfo | null
  dragTipText: string
}

export interface TableCustomPanelInternalData {
  prevDragCol?: VxeTableDefines.ColumnInfo | null | undefined
  prevDragGroupField?: string | null | undefined
  prevDragAggFnColid?: string | null | undefined
  prevDragToChild?: boolean
  prevDragPos?: any
}

export interface TableCustomPanelPrivateRef {
}

export interface TableCustomPanelPrivateComputed {
}

export interface VxeTableCustomPanelMethods {

}

type VxeTableCustomPanelEmits = []

export interface VxeCustomPanel {
}

export interface TableCustomMethods<D = any> {
  /**
   * 获取个性化列面板显示状态
   */
  getCustomVisible(): boolean
  /**
   * 打开个性化列面板
   */
  openCustom(): Promise<void>
  /**
   * 关闭个性化列面板
   */
  closeCustom(): Promise<void>
  /**
   * 切换个性化列面板打开与关闭
   */
  toggleCustom(): Promise<void>
  /**
   * 重置个性化列操作
   * 支持只重置指定的操作（列可视、列宽、冻结列、列顺序）
   */
  resetCustom(options?: boolean | {
    visible?: boolean
    resizable?: boolean
    fixed?: boolean
    order?: boolean
  }): Promise<void>
  /**
   * 保存个性化列操作
   */
  saveCustom(): Promise<void>
  /**
   * 取消个性化列操作
   */
  cancelCustom(): Promise<void>
  /**
   * 切换个性化列全选状态
   */
  toggleCustomAllCheckbox(): Promise<void>
  /**
   * 设置个性化列全选状态
   */
  setCustomAllCheckbox(checked: boolean): Promise<void>
}

export interface TableCustomPrivateMethods<D = any> {
  checkCustomStatus(): void
  emitCustomEvent(type: string, evnt: Event): void
  triggerCustomEvent(evnt: MouseEvent): void
  customOpenEvent (evnt: Event): void
  customCloseEvent (evnt: Event): void
  customOpenEvent (evnt: Event): void
  handleUpdateCustomColumn (): void
}

declare module '../grid' {
  export interface VxeGridMethods<D = any> extends TableCustomMethods<D> { }
}

declare module '../table' {
  export interface VxeTableMethods<D = any> extends TableCustomMethods<D> { }
  export interface VxeTablePrivateMethods<D = any> extends TableCustomPrivateMethods<D> { }
}
