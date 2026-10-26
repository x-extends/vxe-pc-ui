// 打包时间戳
exports.buildTime = Date.now()

/* ======================== 目录配置 ======================== */
// 源码目录（相对项目根）
exports.src = 'packages'
// 临时工作目录（复制 src 后用，编译完删除）
exports.srcTmpl = 'packages_temp'
// 输出目录
exports.outEs = 'es'
exports.outLib = 'lib'
exports.outDist = 'dist'
// 构建前是否清空输出目录
exports.doClean = true
// 组件目录前缀，用于生成 vxe-${name} 别名入口
exports.componentPrefix = 'vxe'
// 是否移除 DefineVxeComponent 包裹
exports.doStripDefineWrapper = true
/* ========================================================= */

/* ======================== 图标资源 ======================== */
// 是否复制 styles/icon 到 outEs / outLib 根目录
exports.doIcon = true
/* ========================================================= */

// 语言包目录
exports.localeDir = 'language'
// 语言包输出目录
exports.localeOut = 'lib/locale'
// 是否编译语言包
exports.doLocale = true

/* ======================== UMD 配置 ======================== */
// 是否编译 UMD 产物
exports.doUmd = true

exports.exportModuleName = 'VxeUI'

exports.externalGlobals = {
  vue: 'Vue',
  'xe-utils': 'XEUtils'
}

// UMD 入口（相对 packages 目录）
exports.umdEntry = 'index.ts'
// UMD 输出文件名（输出到 outLib 下）
exports.umdFile = 'index.umd.js'
exports.umdMinFile = 'index.umd.min.js'
/* ========================================================= */

// 组件列表（用于样式编译 + 生成 vxe-${name} 别名入口）
exports.componentList = [
  'ui',

  'alert',
  'anchor',
  'anchor-link',
  'avatar',
  'backtop',
  'badge',
  'breadcrumb',
  'breadcrumb-item',
  'button',
  'button-group',
  'calendar',
  'card',
  'carousel',
  'carousel-item',
  'cascader',
  'checkbox',
  'checkbox-button',
  'checkbox-group',
  'col',
  'collapse',
  'collapse-pane',
  'color-picker',
  'context-menu',
  'countdown',
  'date-panel',
  'date-picker',
  'date-range-picker',
  'divider',
  'drawer',
  'empty',
  'form',
  'form-gather',
  'form-group',
  'form-item',
  'icon',
  'icon-picker',
  'image',
  'image-group',
  'image-preview',
  'input',
  'layout-aside',
  'layout-body',
  'layout-container',
  'layout-footer',
  'layout-header',
  'link',
  'list',
  'loading',
  'mention',
  'menu',
  'modal',
  'notice-bar',
  'number-input',
  'optgroup',
  'option',
  'pager',
  'password-input',
  'print-page-break',
  'print',
  'pulldown',
  'radio',
  'radio-button',
  'radio-group',
  'rate',
  'result',
  'row',
  'scrollbar',
  'segmented',
  'select',
  'splitter',
  'splitter-panel',
  'split',
  'split-pane',
  'slider',
  'space',
  'steps',
  'switch',
  'tab-pane',
  'table-select',
  'table-transfer',
  'tabs',
  'tag',
  'text-ellipsis',
  'text',
  'textarea',
  'timeline',
  'timeline-item',
  'tip',
  'tooltip',
  'tour',
  'transfer',
  'tree',
  'tree-select',
  'upload',
  'watermark'
]
