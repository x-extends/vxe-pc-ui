import XEUtils from 'xe-utils'
import DomZIndex from 'dom-zindex'
import globalConfigStore from './globalStore'

export function isEnableConf (conf: any): boolean {
  return conf && conf.enabled !== false
}

export function isEmptyValue (cellValue: any) {
  return cellValue === null || cellValue === undefined || cellValue === ''
}

export function nextZIndex () {
  return DomZIndex.getNext()
}

export function getLastZIndex () {
  return DomZIndex.getCurrent()
}

export function getFuncText (content?: string | number | boolean | null) {
  return content ? XEUtils.toValueString(content) : ''
}

export function formatText (value: any, placeholder?: any) {
  return '' + (isEmptyValue(value) ? (placeholder ? globalConfigStore.emptyCell : '') : value)
}

/**
 * 判断值为：'' | null | undefined 时都属于空值
 */
export function eqEmptyValue (cellValue: any) {
  return cellValue === '' || XEUtils.eqNull(cellValue)
}
