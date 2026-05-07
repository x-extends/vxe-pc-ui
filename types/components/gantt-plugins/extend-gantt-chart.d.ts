import { VNode } from 'vue'
import { VxeGanttConstructor, VxeGanttPropTypes, VxeGanttDefines, VxeGanttPrivateMethods } from '../gantt'
import { VxeGanttViewConstructor, VxeGanttViewPrivateMethods } from '../gantt-module/gantt-view'
import { VxeTableConstructor, VxeTablePrivateMethods } from '../table'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/no-unused-vars */

export interface VxeGanttExtendChartMethods<D = any> {
  /**
   * 设置任务依赖线
   */
  setTaskLinks(links: VxeGanttPropTypes.Links): Promise<void>
  /**
   * 获取任务依赖线
   */
  getTaskLinks(): VxeGanttDefines.LinkConfObj<D>[]
  /**
   * 清除所有任务依赖线
   */
  clearTaskLinks(): Promise<void>
  /**
   * 添加任务依赖线
   */
  addTaskLink(link: VxeGanttPropTypes.Link | VxeGanttPropTypes.Links): Promise<{ links: VxeGanttDefines.LinkConfObj<D>[] }>
  /**
   * 移除任务依赖线
   */
  removeTaskLink(fromOrLink: string | number | Partial<VxeGanttPropTypes.Link> | Partial<VxeGanttPropTypes.Link>[]): Promise<{ links: VxeGanttDefines.LinkConfObj<D>[] }>
  /**
   * 获取该任务已关联依赖线的任务关系信息
   */
  getTaskLinkInfo (rowOrRowid: any): {
    toLinks: VxeGanttPropTypes.Link[]
    fromLinks: VxeGanttPropTypes.Link[]
    toRows: D[]
    fromRows: D[]
  }
}

export interface VxeGanttExtendChartPrivateMethods<D = any> {
  /**
   * 内部方法
   * @private
   */
  handleTaskBarMousedownEvent(evnt: MouseEvent, params: {
    $gantt: VxeGanttConstructor<D> & VxeGanttPrivateMethods<D>
    row: D
    scaleType: VxeGanttDefines.ColumnScaleType
  }): void
  /**
   * 内部方法
   * @private
   */
  renderGanttTaskBarContent(params: {
    $gantt: VxeGanttConstructor<D> & VxeGanttPrivateMethods<D>
    source: string
    type: string
    scaleType: VxeGanttDefines.ColumnScaleType
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
  }, renderParams: {
    $gantt: VxeGanttConstructor<D> & VxeGanttPrivateMethods<D>
    $table: VxeTableConstructor<D> & VxeTablePrivateMethods<D>
    rowid: string
  }): VNode[]
  /**
   * 内部方法
   * @private
   */
  handleTaskBarResizeStartMousedownEvent(evnt: MouseEvent): void
  /**
   * 内部方法
   * @private
   */
  handleTaskBarResizeEndMousedownEvent(evnt: MouseEvent): void
  /**
   * 内部方法
   * @private
   */
  handleTaskCreateLinkStartMousedownEvent(evnt: MouseEvent): void
  /**
   * @private
   */
  handleTaskCreateLinkEndMousedownEvent(evnt: MouseEvent): void
  /**
   * 内部方法
   * @private
   */
  handleTaskCreateLinkPointMouseoverEvent(evnt: MouseEvent): void
  /**
   * 内部方法
   * @private
   */
  handleTaskCreateLinkPointMouseoutEvent(evnt: MouseEvent): void
  /**
   * 内部方法
   * @private
   */
  renderGanttTaskChartBefores(): VNode[]
  /**
   * 内部方法
   * @private
   */
  renderGanttTaskChartAfters(): VNode[]
  /**
   * 内部方法
   * @private
   */
  handleUpdateTaskLinkData(): void
  /**
   * 内部方法
   * @private
   */
  handleUpdateTaskLinkStyle($xeGanttView: VxeGanttViewConstructor & VxeGanttViewPrivateMethods): void
  /**
   * 内部方法
   * @private
   */
  handleTableLinks(): void
  /**
   * 内部方法
   * @private
   */
  handleTaskLoadLinks(links: VxeGanttPropTypes.Links): Promise<void>
}

declare module '../gantt' {
  export interface GanttInternalData {
    trialElem?: HTMLElement | null
  }

  export interface VxeGanttMethods<D = any> extends VxeGanttExtendChartMethods<D> { }
  export interface VxeGanttPrivateMethods<D = any> extends VxeGanttExtendChartPrivateMethods<D> { }
}
