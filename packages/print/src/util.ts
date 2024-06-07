import XEUtils from 'xe-utils'

import type { VxePrintProps, VxePrintDefines, VxePrintConstructor, VxePrintPrivateMethods } from '../../../types'

// 打印
let printFrame: any

// 默认导出或打印的 HTML 样式
const defaultHtmlStyle = 'body{margin:0;padding:0;color:#000000;font-size:14px;font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu}body *{-webkit-box-sizing:border-box;box-sizing:border-box}.vxe-table{border-collapse:collapse;text-align:left;border-spacing:0}.vxe-table:not(.is--print){table-layout:fixed}.vxe-table,.vxe-table th,.vxe-table td,.vxe-table td{border-color:#D0D0D0;border-style:solid;border-width:0}.vxe-table.is--print{width:100%}.border--default,.border--full,.border--outer{border-top-width:1px}.border--default,.border--full,.border--outer{border-left-width:1px}.border--outer,.border--default th,.border--default td,.border--full th,.border--full td,.border--outer th,.border--inner th,.border--inner td{border-bottom-width:1px}.border--default,.border--outer,.border--full th,.border--full td{border-right-width:1px}.border--default th,.border--full th,.border--outer th{background-color:#f8f8f9}.vxe-table td>div,.vxe-table th>div{padding:.5em .4em}.col--center{text-align:center}.col--right{text-align:right}.vxe-table:not(.is--print) .col--ellipsis>div{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all}.vxe-table--tree-node{text-align:left}.vxe-table--tree-node-wrapper{position:relative}.vxe-table--tree-icon-wrapper{position:absolute;top:50%;width:1em;height:1em;text-align:center;-webkit-transform:translateY(-50%);transform:translateY(-50%);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer}.vxe-table--tree-unfold-icon,.vxe-table--tree-fold-icon{position:absolute;width:0;height:0;border-style:solid;border-width:.5em;border-right-color:transparent;border-bottom-color:transparent}.vxe-table--tree-unfold-icon{left:.3em;top:0;border-left-color:#939599;border-top-color:transparent}.vxe-table--tree-fold-icon{left:0;top:.3em;border-left-color:transparent;border-top-color:#939599}.vxe-table--tree-cell{display:block;padding-left:1.5em}.vxe-table input[type="checkbox"]{margin:0}.vxe-table input[type="checkbox"],.vxe-table input[type="radio"],.vxe-table input[type="checkbox"]+span,.vxe-table input[type="radio"]+span{vertical-align:middle;padding-left:0.4em}'

export function createPrintFrame () {
  const frame = document.createElement('iframe')
  frame.className = 'vxe-table--print-frame'
  return frame
}

function appendPrintFrame () {
  if (!printFrame.parentNode) {
    document.body.appendChild(printFrame)
  }
}

function afterPrintEvent () {
  requestAnimationFrame(removeFrame)
}

function removeFrame () {
  if (printFrame) {
    if (printFrame.parentNode) {
      try {
        printFrame.contentDocument.write('')
      } catch (e) {}
      printFrame.parentNode.removeChild(printFrame)
    }
    printFrame = null
  }
}

function getExportBlobByString (str: string, type: string) {
  return new Blob([str], { type: `text/${type};charset=utf-8;` })
}

const printMargin = 80

function createHtmlPage (opts: VxePrintProps & { _pageBreaks: boolean }, printHtml: string): string {
  const { customStyle } = opts
  return [
    '<!DOCTYPE html><html>',
    '<head>',
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">',
    `<title>${opts.title}</title>`,
    opts._pageBreaks || (opts.pageBreaks && opts.pageBreaks.length) ? '<style media="print">@page {size: auto;margin: 0mm;}</style>' : '',
    `<style>.vxe-print-slots{display: none;}.vxe-print-page-break.align--center{text-align:center;}.vxe-print-page-break.align--left{text-align:left;}.vxe-print-page-break.align--right{text-align:right;}.vxe-print-page-break--header-title{font-size:1.8em;text-align:center;line-height:${printMargin}px;}.vxe-print-page-break{page-break-before:always;display:flex;flex-direction:column;height:100vh;overflow:hidden;}.vxe-print-page-break--body{display:flex;flex-direction:row;flex-grow:1;overflow: hidden;}.vxe-print-page-break--left,.vxe-print-page-break--right{flex-shrink:0;width:${printMargin}px;height:100%;}.vxe-print-page-break--header,.vxe-print-page-break--footer{flex-shrink:0;height:${printMargin}px;width:100%;}.vxe-print-page-break--content{flex-grow: 1;overflow: hidden;}.vxe-print-page-break--footer-page-number{line-height:${printMargin}px;text-align:center;}</style>`,
    `<style>${defaultHtmlStyle}</style>`,
    customStyle ? `<style>${customStyle}</style>` : '',
    '</head>',
    '<body>',
    `${printHtml}`,
    '</body>',
    '</html>'
  ].join('')
}

function handlePrint (opts: VxePrintProps & { _pageBreaks: boolean }, printHtml = '') {
  const { beforeMethod } = opts
  if (beforeMethod) {
    printHtml = beforeMethod({ content: printHtml, html: printHtml, options: opts }) || ''
  }
  printHtml = createHtmlPage(opts, printHtml)
  const blob = getExportBlobByString(printHtml, 'html')
  if (XEUtils.browse().msie) {
    removeFrame()
    printFrame = createPrintFrame()
    appendPrintFrame()
    printFrame.contentDocument.write(printHtml)
    printFrame.contentDocument.execCommand('print')
  } else {
    if (!printFrame) {
      printFrame = createPrintFrame()
      printFrame.onload = (evnt: any) => {
        if (evnt.target.src) {
          evnt.target.contentWindow.onafterprint = afterPrintEvent
          evnt.target.contentWindow.print()
        }
      }
    }
    appendPrintFrame()
    printFrame.src = URL.createObjectURL(blob)
  }
  return Promise.resolve()
}

function createPageBreak (opts: VxePrintProps) {
  const { title, showPageNumber, align, headerAlign, footerAlign, showAllPageTitle } = opts
  const pageBreaks = opts.pageBreaks || []
  const pageCount = pageBreaks.length
  return pageBreaks.map((item, index) => {
    const bodyHtml = item.bodyHtml
    const headerHtml = item.headerHtml || opts.headerHtml
    const footerHtml = item.footerHtml || opts.footerHtml
    const leftHtml = item.leftHtml || opts.leftHtml
    const rightHtml = item.rightHtml || opts.rightHtml
    const currentPage = index + 1
    const params = {
      currentPage,
      pageCount
    }
    return [
      `<div class="${['vxe-print-page-break', align ? `align--${align}` : ''].join(' ')}">`,
      `<div class="${['vxe-print-page-break--header', headerAlign ? `align--${headerAlign}` : ''].join(' ')}">`,
      headerHtml
        ? `${XEUtils.isFunction(headerHtml) ? headerHtml(params) : (headerHtml || '')}`
        : (
            title && (showAllPageTitle || !index) ? `<div class="vxe-print-page-break--header-title">${title || ''}</div>` : ''
          ),
      '</div>',
      '<div class="vxe-print-page-break--body">',
      `<div class="vxe-print-page-break--left">${XEUtils.isFunction(leftHtml) ? leftHtml(params) : (leftHtml || '')}</div>`,
      `<div class="vxe-print-page-break--content">${XEUtils.isFunction(bodyHtml) ? bodyHtml(params) : (bodyHtml || '')}</div>`,
      `<div class="vxe-print-page-break--right">${XEUtils.isFunction(rightHtml) ? rightHtml(params) : (rightHtml || '')}</div>`,
      '</div>',
      `<div class="${['vxe-print-page-break--footer', footerAlign ? `align--${footerAlign}` : ''].join(' ')}">`,
      footerHtml
        ? `${XEUtils.isFunction(footerHtml) ? footerHtml(params) : (footerHtml || '')}`
        : (
            showPageNumber ? `<div class="vxe-print-page-break--footer-page-number">${currentPage}/${pageCount}</div>` : ''
          ),
      '</div>',
      '</div>'
    ].join('')
  }).join('')
}

export const printHtml: VxePrintDefines.PrintFunction = (options) => {
  const opts = Object.assign({ _pageBreaks: false, customLayout: true }, options)
  if (opts.sheetName) {
    opts.title = opts.title || opts.sheetName
  }
  if (opts.style) {
    opts.customStyle = opts.customStyle || opts.style
  }
  if (opts.beforePrintMethod) {
    opts.beforeMethod = opts.beforeMethod || opts.beforePrintMethod
  }
  if (opts.pageBreaks && opts.pageBreaks.length) {
    return handlePrint(opts, createPageBreak(opts))
  }
  const printHtml = opts.html || opts.content
  return handlePrint(opts, printHtml)
}

export function assemblePageBreak ($xePageBreak: VxePrintConstructor & VxePrintPrivateMethods, elem: HTMLElement, pageBreakConfig: VxePrintDefines.PageBreakConfig) {
  const staticPageBreaks = $xePageBreak.reactData.staticPageBreaks
  const parentElem = elem.parentNode
  if (parentElem && staticPageBreaks) {
    staticPageBreaks.splice(XEUtils.arrayIndexOf(parentElem.children, elem), 0, pageBreakConfig)
    $xePageBreak.reactData.staticPageBreaks = staticPageBreaks.slice(0)
  }
}

export function destroyPageBreak ($xePageBreak: VxePrintConstructor & VxePrintPrivateMethods, pageBreakConfig: VxePrintDefines.PageBreakConfig) {
  $xePageBreak.reactData.staticPageBreaks = $xePageBreak.reactData.staticPageBreaks.filter(item => item.id !== pageBreakConfig.id)
}
