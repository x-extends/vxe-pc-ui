import { h } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeImagePreviewComponent from './preview'
import XEUtils from 'xe-utils'

import type { VxeImageDefines } from '../../../types'

export const openPreviewImage: VxeImageDefines.PreviewImageFunction = (options) => {
  if (VxeUI.modal) {
    const opts = Object.assign({}, options)
    const { url, urlList, activeIndex } = opts
    const modalId = XEUtils.uniqueId('image-preview')
    VxeUI.modal.open({
      id: modalId,
      title: '预览',
      width: '100%',
      height: '100%',
      showHeader: false,
      showFooter: false,
      escClosable: true,
      className: 'vxe-image-preview-popup-wrapper',
      slots: {
        default () {
          return h(VxeImagePreviewComponent, {
            modelValue: activeIndex,
            urlList,
            url,
            onClose () {
              VxeUI.modal.close(modalId)
            }
          })
        }
      }
    })
  }
  return Promise.resolve()
}
