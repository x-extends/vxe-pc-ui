import { formats } from '../../ui'
import XEUtils from 'xe-utils'
import { errLog } from '../../ui/src/log'

export class ItemInfo {
  constructor ($xeForm: any, item: any) {
    const { formatter } = item
    if (formatter) {
      if (XEUtils.isString(formatter)) {
        const gFormatOpts = formats.get(formatter)
        if (!gFormatOpts || !gFormatOpts.formItemFormatMethod) {
          errLog('vxe.error.notFormats', [formatter])
        }
      } else if (XEUtils.isArray(formatter)) {
        const gFormatOpts = formats.get(formatter[0])
        if (!gFormatOpts || !gFormatOpts.formItemFormatMethod) {
          errLog('vxe.error.notFormats', [formatter[0]])
        }
      }
    }

    Object.assign(this, {
      id: XEUtils.uniqueId('item_'),
      title: item.title,
      field: item.field,
      span: item.span,
      align: item.align,
      verticalAlign: item.verticalAlign,
      titleBackground: item.titleBackground,
      titleBold: item.titleBold,
      titleAlign: item.titleAlign,
      titleWidth: item.titleWidth,
      titleColon: item.titleColon,
      vertical: item.vertical,
      padding: item.padding,
      titleAsterisk: item.titleAsterisk,
      titlePrefix: item.titlePrefix,
      titleSuffix: item.titleSuffix,
      titleOverflow: item.titleOverflow,
      showTitle: item.showTitle,
      resetValue: item.resetValue,
      visibleMethod: item.visibleMethod,
      visible: item.visible,
      showContent: item.showContent,
      folding: item.folding,
      collapseNode: item.collapseNode,
      className: item.className,
      contentClassName: item.contentClassName,
      contentStyle: item.contentStyle,
      titleClassName: item.titleClassName,
      titleStyle: item.titleStyle,
      itemRender: item.itemRender,
      rules: item.rules,
      formatter: item.formatter,
      // 渲染属性
      showError: false,
      errRule: null,
      slots: item.slots,
      children: []
    })
  }

  update (name: string, value: any) {
    this[name] = value
  }

  [key: string]: any;
}
