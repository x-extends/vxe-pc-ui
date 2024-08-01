import XEUtils from 'xe-utils'

export const browse = XEUtils.browse()

const reClsMap: { [key: string]: any } = {}

function getClsRE (cls: any) {
  if (!reClsMap[cls]) {
    reClsMap[cls] = new RegExp(`(?:^|\\s)${cls}(?!\\S)`, 'g')
  }
  return reClsMap[cls]
}

function getNodeOffset (elem: any, container: any, rest: any): any {
  if (elem) {
    const parentElem = elem.parentNode
    rest.top += elem.offsetTop
    rest.left += elem.offsetLeft
    if (parentElem && parentElem !== document.documentElement && parentElem !== document.body) {
      rest.top -= parentElem.scrollTop
      rest.left -= parentElem.scrollLeft
    }
    if (container && (elem === container || elem.offsetParent === container) ? 0 : elem.offsetParent) {
      return getNodeOffset(elem.offsetParent, container, rest)
    }
  }
  return rest
}

export function isPx (val: any) {
  return val && /^\d+(px)?$/.test(val)
}

export function isScale (val: any) {
  return val && /^\d+%$/.test(val)
}

export function hasClass (elem: any, cls: any) {
  return elem && elem.className && elem.className.match && elem.className.match(getClsRE(cls))
}

export function removeClass (elem: any, cls: any) {
  if (elem && hasClass(elem, cls)) {
    elem.className = elem.className.replace(getClsRE(cls), '')
  }
}

export function addClass (elem: any, cls: string) {
  if (elem && !hasClass(elem, cls)) {
    removeClass(elem, cls)
    elem.className = `${elem.className} ${cls}`
  }
}

export function toCssUnit (val?: number | string) {
  if (/^\d+$/.test(`${val}`)) {
    return `${val}px`
  }
  return `${val || ''}`
}

export function getDomNode () {
  const documentElement = document.documentElement
  const bodyElem = document.body
  return {
    scrollTop: documentElement.scrollTop || bodyElem.scrollTop,
    scrollLeft: documentElement.scrollLeft || bodyElem.scrollLeft,
    visibleHeight: documentElement.clientHeight || bodyElem.clientHeight,
    visibleWidth: documentElement.clientWidth || bodyElem.clientWidth
  }
}

/**
 * 检查触发源是否属于目标节点
 */
export function getEventTargetNode (evnt: any, container: any, queryCls?: string, queryMethod?: (target: Element) => boolean) {
  let targetElem
  let target = (evnt.target.shadowRoot && evnt.composed) ? (evnt.composedPath()[0] || evnt.target) : evnt.target
  while (target && target.nodeType && target !== document) {
    if (queryCls && hasClass(target, queryCls) && (!queryMethod || queryMethod(target))) {
      targetElem = target
    } else if (target === container) {
      return { flag: queryCls ? !!targetElem : true, container, targetElem: targetElem }
    }
    target = target.parentNode
  }
  return { flag: false }
}

/**
 * 获取元素相对于 document 的位置
 */
export function getOffsetPos (elem: any, container: any) {
  return getNodeOffset(elem, container, { left: 0, top: 0 })
}

export function getAbsolutePos (elem: any) {
  // 当页面作为子应用或者嵌套在iframe内时，计算tooltip边界值需要考虑body的边界距离，避免造成tooltip的位置偏离，其他组件不受影响
  const bodyBounding = document.body.getBoundingClientRect()
  const bounding = elem.getBoundingClientRect()
  const boundingTop = bounding.top - bodyBounding.top
  const boundingLeft = bounding.left - bodyBounding.left
  const { scrollTop, scrollLeft, visibleHeight, visibleWidth } = getDomNode()
  return { boundingTop, top: scrollTop + boundingTop, boundingLeft, left: scrollLeft + boundingLeft, visibleHeight, visibleWidth }
}

const scrollIntoViewIfNeeded = 'scrollIntoViewIfNeeded'
const scrollIntoView = 'scrollIntoView'

export function scrollToView (elem: any) {
  if (elem) {
    if (elem[scrollIntoViewIfNeeded]) {
      elem[scrollIntoViewIfNeeded]()
    } else if (elem[scrollIntoView]) {
      elem[scrollIntoView]()
    }
  }
}

export function triggerEvent (targetElem: Element, type: string) {
  if (targetElem) {
    targetElem.dispatchEvent(new Event(type))
  }
}

export function isNodeElement (elem: any): elem is HTMLElement {
  return elem && elem.nodeType === 1
}
