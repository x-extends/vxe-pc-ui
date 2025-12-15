import { CreateElement, VNode } from 'vue'
import { VxeComponentStyleType } from '@vxe-ui/core'
import { VxeGanttConstructor, VxeGanttDefines, VxeGanttPrivateMethods } from '../gantt'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/no-unused-vars */

export interface VxeGanttExtendChartMethods<D = any> {
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
}

declare module '../gantt' {
  export interface GanttInternalData {
    trialElem?: HTMLElement | null
  }

  export interface VxeGanttMethods<D = any> extends VxeGanttExtendChartMethods<D> { }
  export interface VxeGanttPrivateMethods<D = any> extends VxeGanttExtendChartPrivateMethods<D> { }
}
