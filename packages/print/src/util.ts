import XEUtils from 'xe-utils'

import type { VxePrintProps, VxePrintDefines } from '../../../types'

// 打印
let printFrame: any

// 默认导出或打印的 HTML 样式
const defaultHtmlStyle = 'body{margin:0;padding: 0 1px;color:#333333;font-size:14px;font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu}body *{-webkit-box-sizing:border-box;box-sizing:border-box}.vxe-table{border-collapse:collapse;text-align:left;border-spacing:0}.vxe-table:not(.is--print){table-layout:fixed}.vxe-table,.vxe-table th,.vxe-table td,.vxe-table td{border-color:#D0D0D0;border-style:solid;border-width:0}.vxe-table.is--print{width:100%}.border--default,.border--full,.border--outer{border-top-width:1px}.border--default,.border--full,.border--outer{border-left-width:1px}.border--outer,.border--default th,.border--default td,.border--full th,.border--full td,.border--outer th,.border--inner th,.border--inner td{border-bottom-width:1px}.border--default,.border--outer,.border--full th,.border--full td{border-right-width:1px}.border--default th,.border--full th,.border--outer th{background-color:#f8f8f9}.vxe-table td>div,.vxe-table th>div{padding:.5em .4em}.col--center{text-align:center}.col--right{text-align:right}.vxe-table:not(.is--print) .col--ellipsis>div{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all}.vxe-table--tree-node{text-align:left}.vxe-table--tree-node-wrapper{position:relative}.vxe-table--tree-icon-wrapper{position:absolute;top:50%;width:1em;height:1em;text-align:center;-webkit-transform:translateY(-50%);transform:translateY(-50%);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer}.vxe-table--tree-unfold-icon,.vxe-table--tree-fold-icon{position:absolute;width:0;height:0;border-style:solid;border-width:.5em;border-right-color:transparent;border-bottom-color:transparent}.vxe-table--tree-unfold-icon{left:.3em;top:0;border-left-color:#939599;border-top-color:transparent}.vxe-table--tree-fold-icon{left:0;top:.3em;border-left-color:transparent;border-top-color:#939599}.vxe-table--tree-cell{display:block;padding-left:1.5em}.vxe-table input[type="checkbox"]{margin:0}.vxe-table input[type="checkbox"],.vxe-table input[type="radio"],.vxe-table input[type="checkbox"]+span,.vxe-table input[type="radio"]+span{vertical-align:middle;padding-left:0.4em}'

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

function getExportBlobByContent (content: string, type: string) {
  return new Blob([content], { type: `text/${type};charset=utf-8;` })
}

function createHtmlPage (opts: VxePrintProps, content: string): string {
  const { customStyle } = opts
  return [
    '<!DOCTYPE html><html>',
    '<head>',
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">',
    `<title>${opts.title}</title>`,
    '<style media="print">.vxe-page-break-before{page-break-before:always;}.vxe-page-break-after{page-break-after:always;}</style>',
    `<style>${defaultHtmlStyle}</style>`,
    customStyle ? `<style>${customStyle}</style>` : '',
    '</head>',
    `<body>${content}</body>`,
    '</html>'
  ].join('')
}

function handlePrint (opts: VxePrintProps, content = '') {
  const { beforeMethod } = opts
  if (beforeMethod) {
    content = beforeMethod({ content, options: opts }) || ''
  }
  content = createHtmlPage(opts, content)
  const blob = getExportBlobByContent(content, 'html')
  if (XEUtils.browse().msie) {
    removeFrame()
    printFrame = createPrintFrame()
    appendPrintFrame()
    printFrame.contentDocument.write(content)
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

export const printHtml: VxePrintDefines.PrintFunction = (options) => {
  const opts = Object.assign({}, options)
  if (opts.sheetName) {
    opts.title = opts.title || opts.sheetName
  }
  if (opts.style) {
    opts.customStyle = opts.customStyle || opts.style
  }
  if (opts.beforePrintMethod) {
    opts.beforeMethod = opts.beforeMethod || opts.beforePrintMethod
  }
  return handlePrint(opts, opts.content)
}
