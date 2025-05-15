import { VxeUI } from '@vxe-ui/core'
import VxeImagePreviewComponent from './preview'
import XEUtils from 'xe-utils'

import type { VxeImageDefines } from '../../../types'

export const openPreviewImage: VxeImageDefines.PreviewImageFunction = (options) => {
  if (VxeUI.modal) {
    const opts = Object.assign({
      escClosable: true
    }, options)
    const { urlList, activeIndex } = opts
    const modalId = XEUtils.uniqueId('image-preview')
    VxeUI.modal.open({
      id: modalId,
      title: '预览',
      width: '100%',
      height: '100%',
      showHeader: false,
      showFooter: false,
      padding: false,
      escClosable: opts.escClosable,
      className: 'vxe-image-preview-popup-wrapper',
      slots: {
        default (params, h) {
          return h(VxeImagePreviewComponent, {
            props: {
              value: activeIndex,
              urlList,
              urlField: opts.urlField,
              marginSize: opts.marginSize,
              maskClosable: opts.maskClosable,
              toolbarConfig: opts.toolbarConfig,
              showPrintButton: opts.showPrintButton,
              showDownloadButton: opts.showDownloadButton,
              beforeDownloadMethod: opts.beforeDownloadMethod,
              downloadMethod: opts.downloadMethod
            },
            on: {
              close () {
                VxeUI.modal.close(modalId)
              }
            }
          })
        }
      }
    })
  }
  return Promise.resolve()
}
