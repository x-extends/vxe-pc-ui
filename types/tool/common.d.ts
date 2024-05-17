import { App, VNode } from 'vue'

/**
 * 定义组件
 */
export type defineVxeComponent<
  P = { [key: string]: any },
  E = { [key: string]: any },
  S = { [key: string]: (...args: any[]) => any }
> = ({
  new (): {
    $props: P & E,
    $slots: S
  }
} & {
  install(app: App): void
})

/**
 * 组件通用的基础参数
 */
export interface VxeComponentBase {
  xID: string
}

/**
 * 组件事件参数
 */
export interface VxeComponentEvent {
  $event: Event
  [key: string]: any
}

/**
 * 组件尺寸类型
 */
export type VxeComponentSize = null | '' | 'medium' | 'small' | 'mini'

/**
 * 组件对齐方式
 */
export type VxeComponentAlign = null | '' | 'left' | 'right' | 'center'

/**
 * 组件状态
 */
export type VxeComponentStatus = null | '' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'error'

/**
 * 组件样式类型
 */
export type VxeComponentStyle = Record<string, string | number>

/**
 * 组件 className 类型
 */
export type VxeComponentClassName = Record<string, boolean>

/**
 * 组件插槽类型
 */
export type VxeComponentSlot = VNode | string | number
