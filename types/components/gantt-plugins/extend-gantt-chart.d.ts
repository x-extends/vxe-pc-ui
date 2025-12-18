import { CreateElement, VNode } from 'vue'
import { VxeComponentStyleType } from '@vxe-ui/core'
import { VxeGanttConstructor, VxeGanttPropTypes, VxeGanttDefines, VxeGanttPrivateMethods } from '../gantt'
import { VxeGanttViewConstructor, VxeGanttViewPrivateMethods } from '../gantt-module/gantt-view'

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
}

export interface VxeGanttExtendChartPrivateMethods<D = any> {
  /**
   * @private
   */
  handleTaskBarMousedownEvent(evnt: MouseEvent, params: {
    $gantt: VxeGanttConstructor<D>
    row: D
    scaleType: VxeGanttDefines.ColumnScaleType
  }): void
  /**
   * @private
   */
  renderGanttTaskBarContent(h: CreateElement, params: {
    $gantt: VxeGanttConstructor<D> & VxeGanttPrivateMethods<D>
    source: string
    type: string
    scaleType: VxeGanttDefines.ColumnScaleType
    row: D
    rowIndex: number
    $rowIndex: number
    _rowIndex: number
  }, renderParams: {
    title: string
    vbStyle: VxeComponentStyleType
    vpStyle: VxeComponentStyleType
  }): VNode[]
  /**
   * @private
   */
  handleTaskBarResizeStartMousedownEvent(evnt: MouseEvent): void
  /**
   * @private
   */
  handleTaskBarResizeEndMousedownEvent(evnt: MouseEvent): void
  /**
   * @private
   */
  renderGanttTaskLines(h: CreateElement): VNode[]
  /**
   * @private
   */
  handleUpdateTaskLink($xeGanttView: VxeGanttViewConstructor & VxeGanttViewPrivateMethods): void
}

declare module '../gantt' {
  export interface GanttInternalData {
    trialElem?: HTMLElement | null
  }

  export interface VxeGanttMethods<D = any> extends VxeGanttExtendChartMethods<D> { }
  export interface VxeGanttPrivateMethods<D = any> extends VxeGanttExtendChartPrivateMethods<D> { }
}
