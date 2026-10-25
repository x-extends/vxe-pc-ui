import XEUtils from 'xe-utils'
import { getConfig, zIndex } from '@vxe-ui/core'

export function isEnableConf (conf: any): boolean {
  return conf && conf.enabled !== false
}

/**
 * 用于开关类型的配置项
 * 局部启用规则：conf={}
 * 局部禁用规则：conf={enabled:false}
 * 全局默认启用规则：conf.enabled=true
 */
export function hasEnableConf (conf: any, opts: any): boolean {
  return opts && (conf ? opts.enabled !== false : opts.enabled)
}

export function nextZIndex () {
  return zIndex.next()
}

export function getLastZIndex () {
  return zIndex.getLast()
}

export function nextSubZIndex () {
  return zIndex.nextSub()
}

export function getSubLastZIndex () {
  return zIndex.getSubLast()
}

export function getGlobalDefaultConfig (value: any, globalValue: any) {
  if (XEUtils.eqNull(value)) {
    return globalValue
  }
  return value
}

export function getFuncText (content: string | number | boolean | null | undefined, args?: any) {
  if (XEUtils.eqNull(content)) {
    return ''
  }
  const translate = getConfig().translate
  return `${translate ? translate('' + content, args) : content}`
}

export function getText (content: string | number | boolean | null | undefined) {
  if (XEUtils.eqNull(content)) {
    return ''
  }
  return '' + content
}

/**
 * 判断值为：'' | null | undefined 时都属于空值
 */
export function eqEmptyValue (cellValue: any) {
  return cellValue === null || cellValue === undefined || cellValue === ''
}

export function handleBooleanDefaultValue (value: boolean | undefined | null) {
  return XEUtils.isBoolean(value) ? value : null
}

export function enModelValue (nodeid: string | number | null | undefined) {
  return XEUtils.eqNull(nodeid) ? '' : encodeURIComponent(`${nodeid}`)
}

export function deModelValue (nodeid: string | number | null) {
  return nodeid ? decodeURIComponent(`${nodeid}`) : nodeid
}

export function getDefaultConfig <T = any, D = any> (val1: T, def1: D): (T | D) {
  return XEUtils.eqNull(val1) ? def1 : val1
}
