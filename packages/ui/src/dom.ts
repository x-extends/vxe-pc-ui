import XEUtils from 'xe-utils'

let tpImgEl: HTMLImageElement | undefined

export function initTpImg () {
  if (!tpImgEl) {
    tpImgEl = new Image()
    tpImgEl.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  }
  return tpImgEl
}

export function getTpImg () {
  if (!tpImgEl) {
    return initTpImg()
  }
  return tpImgEl
}

export function getPropClass (property: any, params: any) {
  return property ? (XEUtils.isFunction(property) ? property(params) : property) || '' : ''
}

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
  return val && /^\d+(\.\d+)?(px)?$/.test(val)
}

export function isScale (val: any) {
  return val && /^\d+(\.\d+)?%$/.test(val)
}

export function hasClass (elem: any, cls: any) {
  if (elem) {
    if (elem.classList) {
      return elem.classList.contains(cls)
    }
    return !!(elem.className && elem.className.match && elem.className.match(getClsRE(cls)))
  }
  return false
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

export function hasControlKey (evnt: KeyboardEvent | MouseEvent | DragEvent) {
  return evnt.ctrlKey || evnt.metaKey
}

export function toCssUnit (val?: number | string | null, unit = 'px') {
  if (XEUtils.isNumber(val) || /^\d+$/.test(`${val}`)) {
    return `${val}${unit}`
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
  const bounding = elem.getBoundingClientRect()
  const boundingTop = bounding.top
  const boundingLeft = bounding.left
  const { scrollTop, scrollLeft, visibleHeight, visibleWidth } = getDomNode()
  return { boundingTop, top: scrollTop + boundingTop, boundingLeft, left: scrollLeft + boundingLeft, visibleHeight, visibleWidth }
}

export function getPaddingTopBottomSize (elem: HTMLElement) {
  if (elem) {
    const computedStyle = getComputedStyle(elem)
    const paddingTop = XEUtils.toNumber(computedStyle.paddingTop)
    const paddingBottom = XEUtils.toNumber(computedStyle.paddingBottom)
    return paddingTop + paddingBottom
  }
  return 0
}

export function getPaddingLeftRightSize (elem: HTMLElement) {
  if (elem) {
    const computedStyle = getComputedStyle(elem)
    const paddingLeft = XEUtils.toNumber(computedStyle.paddingLeft)
    const paddingRight = XEUtils.toNumber(computedStyle.paddingRight)
    return paddingLeft + paddingRight
  }
  return 0
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

interface PanelPlacementOptions {
  defaultTop?: number
  defaultLeft?: number
  placement?: '' | 'top' | 'bottom' | null
  defaultPlacement?: '' | 'top' | 'bottom' | null
  teleportTo?: boolean
  marginSize?: number
  isMinWidth?: boolean
}

/**
 * 通用定位计算
 */
export function updatePanelPlacement (targetElem: HTMLElement | null | undefined, panelElem: HTMLElement | null | undefined, options: PanelPlacementOptions) {
  const { defaultTop, defaultLeft, placement, defaultPlacement, teleportTo, marginSize, isMinWidth } = Object.assign({
    teleportTo: false,
    marginSize: 18,
    isMinWidth: true
  }, options)
  let panelPlacement: 'top' | 'bottom' = 'bottom'
  let top: number | '' = ''
  let bottom: number | '' = ''
  let left = 0
  let minWidth: number | '' = ''
  let arrowLeft: number | '' = ''
  const stys: Record<string, string> = {}
  if (panelElem && targetElem) {
    const bodyEl = document.body
    const parentWrapperEl = getPopupWrapperElement(panelElem)
    if (parentWrapperEl) {
      const targetWidth = targetElem.offsetWidth
      const targetHeight = targetElem.offsetHeight
      const panelWidth = panelElem.offsetWidth
      const panelHeight = panelElem.offsetHeight

      const parentWrapperRect = parentWrapperEl.getBoundingClientRect()
      const panelRect = panelElem.getBoundingClientRect()
      const targetRect = targetElem.getBoundingClientRect()
      const visibleHeight = bodyEl.clientHeight
      const visibleWidth = bodyEl.clientWidth

      const offsetLeft = parentWrapperRect.left
      const offsetTop = parentWrapperRect.top
      const targetLeft = targetRect.left
      const targetTop = targetRect.top

      minWidth = targetElem.offsetWidth

      if (teleportTo) {
        left = defaultLeft || (targetLeft - (panelWidth - targetWidth) / 2)
        top = defaultTop || (targetTop + targetHeight)
        if (placement === 'top') {
          panelPlacement = 'top'
          top = targetTop - panelHeight
        } else if (!placement) {
          if (defaultPlacement === 'top') {
            panelPlacement = 'top'
            if (!defaultTop) {
              top = targetTop - panelHeight
            }
            // 如果上面不够放，则向下
            if (top < marginSize) {
              panelPlacement = 'bottom'
              top = targetTop + targetHeight
            }
            // 如果下面不够放，则向上（优先）
            if (top + panelHeight + marginSize > visibleHeight) {
              panelPlacement = 'top'
              top = targetTop - panelHeight
            }
          } else {
            // 如果下面不够放，则向上
            if (top + panelHeight + marginSize > visibleHeight) {
              panelPlacement = 'top'
              top = targetTop - panelHeight
            }
            // 如果上面不够放，则向下（优先）
            if (top < marginSize) {
              panelPlacement = 'bottom'
              top = targetTop + targetHeight
            }
          }
        }
        // 如果溢出右边
        if (left + panelWidth + marginSize > visibleWidth) {
          left -= left + panelWidth + marginSize - visibleWidth
        }
        // 如果溢出左边
        if (left < marginSize) {
          left = marginSize
        }

        // 偏移
        top -= offsetTop
        left -= offsetLeft
      } else {
        if (placement === 'top') {
          panelPlacement = 'top'
          bottom = targetHeight
        } else if (!placement) {
          // 如果下面不够放，则向上
          top = targetHeight
          if (targetTop + targetHeight + panelHeight + marginSize > visibleHeight) {
            // 如果上面不够放，则向下（优先）
            if (targetTop - targetHeight - panelHeight > marginSize) {
              panelPlacement = 'top'
              top = ''
              bottom = targetHeight
            }
          }
        }
        // 是否超出右侧
        if (panelRect.left + panelRect.width + marginSize > visibleWidth) {
          left = -(panelRect.left + panelRect.width + marginSize - visibleWidth)
        }
      }
      if (XEUtils.isNumber(top)) {
        stys.top = toCssUnit(top)
      }
      if (XEUtils.isNumber(bottom)) {
        stys.bottom = toCssUnit(bottom)
      }
      if (XEUtils.isNumber(left)) {
        stys.left = toCssUnit(left)
      }
      if (isMinWidth && XEUtils.isNumber(minWidth)) {
        stys.minWidth = toCssUnit(minWidth)
      }

      // 箭头
      if (left === targetLeft) {
        if (targetWidth <= panelWidth) {
          arrowLeft = targetWidth / 2
        }
      } else if (left < targetLeft) {
        if (left + panelWidth > targetLeft + targetWidth) {
          arrowLeft = (targetLeft - left) + targetWidth / 2
        } else {
          arrowLeft = (targetLeft - left) + (panelWidth - (targetLeft - left)) / 2
        }
      }
    }
  }
  return {
    top: top || 0,
    bottom: bottom || 0,
    left: left || 0,
    arrowLeft: arrowLeft || 0,
    style: stys,
    placement: panelPlacement
  }
}

export function getPopupWrapperElement (panelElem: HTMLElement | null | undefined) {
  if (!panelElem) {
    return null
  }
  const bodyEl = document.body
  const parentEl = panelElem.parentElement
  return (parentEl === bodyEl ? document.documentElement : parentEl) || null
}

export function getPopupContainer (appendTo: string | HTMLElement | ((params: any) => string | HTMLElement) | undefined) {
  const selectElem = appendTo && XEUtils.isFunction(appendTo) ? appendTo({}) : appendTo
  return selectElem || 'body'
}

export function getPopupAppendElement (appendTo: string | HTMLElement | ((params: any) => string | HTMLElement) | undefined) {
  const selectElem = getPopupContainer(appendTo)
  if (XEUtils.isString(selectElem)) {
    return document.querySelector<HTMLElement>(selectElem) || document.body
  }
  return selectElem
}
