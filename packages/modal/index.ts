import Vue, { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import VxeModalComponent, { allActiveModals } from './src/modal'
import { dynamicApp, dynamicStore, checkDynamic } from '../dynamics'

import { VxeModalPropTypes, ModalEventTypes, VxeModalListeners, VxeModalDefines } from '../../types'

function handleModal (options: VxeModalDefines.ModalOptions): Promise<ModalEventTypes> {
  // 使用动态组件渲染动态弹框
  checkDynamic()
  return new Promise(resolve => {
    const opts = Object.assign({}, options)
    if (opts.id && allActiveModals.some(comp => comp.id === opts.id)) {
      resolve('exist')
    } else {
      const events = Object.assign({}, opts.events)
      const modalOpts: {
        key: number | string
        props: VxeModalDefines.ModalOptions
        on: VxeModalListeners
      } = {
        key: XEUtils.uniqueId(),
        props: Object.assign(opts, {
          value: true
        }),
        on: {
          ...events,
          hide (params) {
            const modalList = dynamicStore.modals
            if (events.hide) {
              events.hide.call(this, params)
            }
            dynamicStore.modals = modalList.filter(item => item.key !== modalOpts.key)
            resolve(params.type)
          }
        }
      }
      dynamicStore.modals.push(modalOpts)
    }
  })
}

function getModal (id: VxeModalPropTypes.ID) {
  return XEUtils.find(allActiveModals, $modal => $modal.id === id)
}

/**
 * 全局关闭动态的活动窗口（只能用于关闭动态的创建的活动窗口）
 * 如果传 id 则关闭指定的窗口
 * 如果不传则关闭所有窗口
 */
function closeModal (id?: VxeModalPropTypes.ID) {
  const modals = id ? [getModal(id)] : allActiveModals
  const restPromises: any[] = []
  modals.forEach($modal => {
    if ($modal) {
      restPromises.push($modal.close())
    }
  })
  return Promise.all(restPromises)
}

function handleOpen (defOpts: VxeModalDefines.ModalOptions, content: VxeModalPropTypes.Content | VxeModalDefines.ModalOptions, title?: VxeModalPropTypes.Title, options?: VxeModalDefines.ModalOptions) {
  let opts
  if (XEUtils.isObject(content)) {
    opts = content
  } else {
    opts = { content: XEUtils.toValueString(content), title }
  }
  return handleModal({ ...defOpts, ...options, ...opts })
}

function openModal (options: VxeModalDefines.ModalOptions) {
  return handleOpen({
    type: 'modal'
  }, options)
}

function openAlert (content: VxeModalPropTypes.Content | VxeModalDefines.ModalOptions, title?: VxeModalPropTypes.Title, options?: VxeModalDefines.ModalOptions) {
  return handleOpen({
    type: 'alert',
    lockScroll: true,
    showHeader: true,
    showFooter: true
  }, content, title, options)
}

function openConfirm (content: VxeModalPropTypes.Content | VxeModalDefines.ModalOptions, title?: VxeModalPropTypes.Title, options?: VxeModalDefines.ModalOptions) {
  return handleOpen({
    type: 'confirm',
    status: 'question',
    lockScroll: true,
    showHeader: true,
    showFooter: true
  }, content, title, options)
}

function openMessage (content: VxeModalPropTypes.Content | VxeModalDefines.ModalOptions, options?: VxeModalDefines.ModalOptions) {
  return handleOpen({
    type: 'message',
    mask: false,
    lockView: false,
    lockScroll: false,
    showHeader: false
  }, content, '', options)
}

function openNotification (content: VxeModalPropTypes.Content | VxeModalDefines.ModalOptions, title?: VxeModalPropTypes.Title, options?: VxeModalDefines.ModalOptions) {
  return handleOpen({
    type: 'notification',
    mask: false,
    lockView: false,
    lockScroll: false,
    showHeader: true,
    draggable: false,
    position: 'top-right',
    width: 320
  }, content, title, options)
}

export const ModalController = {
  get: getModal,
  close: closeModal,
  open: openModal,
  alert: openAlert,
  confirm: openConfirm,
  message: openMessage,
  notification: openNotification
}

export const VxeModal = Object.assign(VxeModalComponent, {
  install: function (app: VueConstructor) {
    app.component(VxeModalComponent.name as string, VxeModalComponent)
    // 兼容老版本
    if (!Vue.prototype.$vxe) {
      Vue.prototype.$vxe = { modal: ModalController }
    } else {
      Vue.prototype.$vxe.modal = ModalController
    }
  }
})

VxeUI.modal = ModalController

dynamicApp.use(VxeModal)
VxeUI.component(VxeModalComponent)

export const Modal = VxeModal
export default VxeModal
