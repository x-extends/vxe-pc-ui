import { VxeUI } from '@vxe-ui/core'
import VxeImagePreviewComponent from './preview'
import XEUtils from 'xe-utils'

import type { VxeImageDefines, VxeImagePreviewDefines } from '../../../types'

export const openPreviewImage: VxeImageDefines.PreviewImageFunction = (options) => {
  if (VxeUI.modal) {
    const opts = Object.assign({
      escClosable: true
    }, options)
    const { urlList, activeIndex } = opts
    const { rotate, change } = opts.events || {}
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
              },
              change (eventParams: VxeImagePreviewDefines.ChangeEventParams) {
                if (change) {
                  change.call(this, eventParams)
                }
              },
              rotate (eventParams: VxeImagePreviewDefines.RotateEventParams) {
                if (rotate) {
                  rotate.call(this, eventParams)
                }
              }
            }
          })
        }
      }
    })
  }
  return Promise.resolve()
}
