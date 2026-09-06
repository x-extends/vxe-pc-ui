import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeIcon: DefineVxeComponentApp<VxeIconProps, VxeIconEventProps, VxeIconSlots, VxeIconMethods>
export type VxeIconComponent = DefineVxeComponentOptions<VxeIconProps>

export type VxeIconInstance = DefineVxeComponentInstance<{
  reactData: IconReactData
}, VxeIconProps, VxeIconPrivateComputed, VxeIconMethods>

export type VxeIconConstructor = VxeIconInstance

export interface IconPrivateRef {
}
export interface VxeIconPrivateRef extends IconPrivateRef { }

export namespace VxeIconPropTypes {
  export type Name = 'play' | 'pause' | 'stop' | 'style' | 'form' | 'doc-search' | 'more-fill' | 'more' | 'chart-gantt' | 'modal' | 'tools' | 'code' | 'service' | 'bottom' | 'top' | 'tag' | 'radio-unchecked-fill' | 'checkbox-unchecked-fill' | 'grouping' | 'values' | 'dropper' | 'no-drop' | 'rich-text' | 'slider' | 'empty' | 'notice-right-fill' | 'notice-left-fill' | 'github-fill' | 'gitee-fill' | 'language-switch' | 'carousel' | 'menu-unfold' | 'menu-fold' | 'arrows-right' | 'arrows-left' | 'arrows-up' | 'arrows-down' | 'add-sub' | 'tree-select' | 'align-left' | 'align-right' | 'rmb' | 'usd' | 'recover' | 'drag-handle' | 'print-batch' | 'pct-full' | 'rotate-right' | 'rotate-left' | 'search-zoom-out' | 'pct-1-1' | 'radio-checked' | 'checkbox-checked' | 'mobile' | 'align-center' | 'pc' | 'layout' | 'click-button' | 'select' | 'textarea' | 'file' | 'signature' | 'input' | 'text' | 'switch' | 'add-user' | 'row-col' | 'tabs' | 'subtable' | 'add-users' | 'number' | 'association-form' | 'sort' | 'sort-desc' | 'sort-asc' | 'end-page' | 'home-page' | 'time' | 'feedback' | 'lightning' | 'cloudy' | 'heavy-rain' | 'moon' | 'sunny' | 'location' | 'location-fill' | 'microphone-fill' | 'microphone' | 'share' | 'share-fill' | 'flag' | 'flag-fill' | 'platform' | 'goods-fill' | 'goods' | 'funnel-clear' | 'envelope' | 'envelope-open-fill' | 'envelope-open' | 'envelope-fill' | 'message-fill' | 'chat' | 'chat-fill' | 'send' | 'send-fill' | 'user' | 'user-fill' | 'wechat' | 'alipay' | 'indicator' | 'file-excel' | 'file-pdf' | 'file-image' | 'file-markdown' | 'file-ppt' | 'file-word' | 'file-zip' | 'file-txt' | 'refresh' | 'checkbox-unchecked' | 'information' | 'info-circle-fill' | 'info-circle' | 'chart-radar' | 'chart-bar-x' | 'repeat' | 'voice-fill' | 'voice' | 'flow-branch' | 'comment' | 'folder' | 'folder-open' | 'picture' | 'picture-fill' | 'bell' | 'bell-fill' | 'undo' | 'home' | 'home-fill' | 'checkbox-checked-fill' | 'checkbox-indeterminate-fill' | 'fullscreen' | 'minimize' | 'print' | 'upload' | 'download' | 'cloud-download' | 'cloud-upload' | 'spinner' | 'close' | 'custom-column' | 'edit' | 'zoom-in' | 'caret-down' | 'caret-up' | 'caret-right' | 'caret-left' | 'square-checked-fill' | 'square-close' | 'square-down' | 'square-left' | 'square-caret-right' | 'square-minus' | 'square-plus' | 'square-right' | 'square-up' | 'square-checked' | 'square-down-fill' | 'square-minus-fill' | 'square-close-fill' | 'square-left-fill' | 'square-caret-right-fill' | 'square-up-fill' | 'square-right-fill' | 'square-plus-fill' | 'square-plus-square' | 'square-fill' | 'square-square' | 'sort-alpha-desc' | 'sort-alpha-asc' | 'sort-numeric-asc' | 'sort-numeric-desc' | 'star-fill' | 'star' | 'star-half' | 'lock-fill' | 'unlock-fill' | 'question' | 'exclamation' | 'ellipsis-h' | 'ellipsis-v' | 'save' | 'setting' | 'setting-fill' | 'link' | 'chart-pie' | 'chart-line' | 'swap' | 'num-list' | 'copy' | 'company' | 'swap-right' | 'swap-left' | 'table' | 'merge-cells' | 'paste' | 'cut' | 'lock' | 'unlock' | 'chart-bar-y' | 'fixed-left-fill' | 'fixed-left' | 'fixed-right-fill' | 'fixed-right' | 'swap-down' | 'swap-up' | 'square' | 'check' | 'question-circle-fill' | 'error-circle-fill' | 'delete' | 'dot' | 'success-circle' | 'delete-fill' | 'minus' | 'maximize' | 'question-circle' | 'warning-circle' | 'warning-circle-fill' | 'eye-fill' | 'search' | 'funnel' | 'eye-fill-close' | 'search-zoom-in' | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'calendar' | 'arrow-down' | 'warning-triangle' | 'add' | 'arrow-double-left' | 'arrow-double-right' | 'menu' | 'warning-triangle-fill' | 'error-circle' | 'zoom-out' | 'success-circle-fill' | 'radio-checked-fill' | 'radio-unchecked'
  export type ClassName = string
  export type Roll = boolean
  export type Status = string
  export type Size = VxeComponentSizeType
}

export interface VxeIconProps {
  name?: VxeIconPropTypes.Name | undefined | null
  className?: VxeIconPropTypes.Name
  roll?: VxeIconPropTypes.Roll
  status?: VxeIconPropTypes.Status
  size?: VxeIconPropTypes.Size
}

export interface IconPrivateComputed {
}
export interface VxeIconPrivateComputed extends IconPrivateComputed { }

export interface IconReactData {
}

export interface IconMethods {
  dispatchEvent(type: ValueOf<VxeIconEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeIconMethods extends IconMethods { }

export interface IconPrivateMethods { }
export interface VxeIconPrivateMethods extends IconPrivateMethods { }

export type VxeIconEmits = [
  'click'
]

export namespace VxeIconDefines {
  export interface IconEventParams extends VxeComponentEventParams {
    $icon: VxeIconConstructor
  }

  export interface ClickParams {}
  export interface ClickEventParams extends IconEventParams, ClickParams { }
}

export type VxeIconEventProps = {
  onClick?: VxeIconEvents.Click
}

export interface VxeIconListeners {
  onClick?: VxeIconEvents.Click
}

export namespace VxeIconEvents {
  export type Click = (params: VxeIconDefines.ClickEventParams) => void
 }

export namespace VxeIconSlotTypes {}

export interface VxeIconSlots {
}

export const Icon: typeof VxeIcon
export default VxeIcon
