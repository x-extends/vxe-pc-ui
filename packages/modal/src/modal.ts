import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getI18n, getIcon, createEvent, globalEvents, globalMixins, renderEmptyElement, GLOBAL_EVENT_KEYS } from '../../ui'
import { getDomNode, getEventTargetNode, toCssUnit } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, getFuncText, handleBooleanDefaultValue } from '../../ui/src/utils'
import VxeButtonComponent from '../../button/src/button'
import VxeLoadingComponent from '../../loading/index'
import { getSlotVNs } from '../../ui/src/vn'
import { warnLog, errLog } from '../../ui/src/log'

import type { VxeModalConstructor, VxeModalPropTypes, ModalReactData, ModalInternalData, ModalEventTypes, VxeModalEmits, VxeComponentSizeType, VxeComponentPermissionInfo, ValueOf, VxeButtonConstructor } from '../../../types'

export const allActiveModals: VxeModalConstructor[] = []
const msgQueue: VxeModalConstructor[] = []
const notifyQueue: VxeModalConstructor[] = []

const lockScrollAttrKey = 'data-vxe-lock-scroll'
const lockScrollCssWidthKey = '--vxe-ui-modal-lock-scroll-view-width'

export default defineVxeComponent({
  name: 'VxeModal',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: Boolean as PropType<VxeModalPropTypes.ModelValue>,
    id: String as PropType<VxeModalPropTypes.ID>,
    type: {
      type: String as PropType<VxeModalPropTypes.Type>,
      default: 'modal'
    },
    loading: {
      type: Boolean as PropType<VxeModalPropTypes.Loading>,
      default: null
    },
    status: String as PropType<VxeModalPropTypes.Status>,
    iconStatus: String as PropType<VxeModalPropTypes.IconStatus>,
    className: String as PropType<VxeModalPropTypes.ClassName>,
    top: {
      type: [Number, String] as PropType<VxeModalPropTypes.Top>,
      default: () => getConfig().modal.top
    },
    position: [String, Object] as PropType<VxeModalPropTypes.Position>,
    title: String as PropType<VxeModalPropTypes.Title>,
    duration: {
      type: [Number, String] as PropType<VxeModalPropTypes.Duration>,
      default: () => getConfig().modal.duration
    },
    content: [Number, String] as PropType<VxeModalPropTypes.Content>,
    showCancelButton: {
      type: Boolean as PropType<VxeModalPropTypes.ShowCancelButton>,
      default: null
    },
    cancelButtonText: {
      type: String as PropType<VxeModalPropTypes.CancelButtonText>,
      default: () => getConfig().modal.cancelButtonText
    },
    showConfirmButton: {
      type: Boolean as PropType<VxeModalPropTypes.ShowConfirmButton>,
      default: () => getConfig().modal.showConfirmButton
    },
    confirmButtonText: {
      type: String as PropType<VxeModalPropTypes.ConfirmButtonText>,
      default: () => getConfig().modal.confirmButtonText
    },
    lockView: {
      type: Boolean as PropType<VxeModalPropTypes.LockView>,
      default: () => getConfig().modal.lockView
    },
    lockScroll: Boolean as PropType<VxeModalPropTypes.LockScroll>,
    mask: {
      type: Boolean as PropType<VxeModalPropTypes.Mask>,
      default: () => getConfig().modal.mask
    },
    maskClosable: {
      type: Boolean as PropType<VxeModalPropTypes.MaskClosable>,
      default: () => getConfig().modal.maskClosable
    },
    escClosable: {
      type: Boolean as PropType<VxeModalPropTypes.EscClosable>,
      default: () => getConfig().modal.escClosable
    },
    cancelClosable: {
      type: Boolean as PropType<VxeModalPropTypes.CancelClosable>,
      default: () => getConfig().modal.cancelClosable
    },
    confirmClosable: {
      type: Boolean as PropType<VxeModalPropTypes.ConfirmClosable>,
      default: () => getConfig().modal.confirmClosable
    },
    resize: Boolean as PropType<VxeModalPropTypes.Resize>,
    showHeader: {
      type: Boolean as PropType<VxeModalPropTypes.ShowHeader>,
      default: () => getConfig().modal.showHeader
    },
    showFooter: {
      type: Boolean as PropType<VxeModalPropTypes.ShowFooter>,
      default: () => getConfig().modal.showFooter
    },
    showZoom: Boolean as PropType<VxeModalPropTypes.ShowZoom>,
    zoomConfig: Object as PropType<VxeModalPropTypes.ZoomConfig>,
    showMaximize: {
      type: Boolean as PropType<VxeModalPropTypes.ShowMaximize>,
      default: () => handleBooleanDefaultValue(getConfig().modal.showMaximize)
    },
    showMinimize: {
      type: Boolean as PropType<VxeModalPropTypes.ShowMinimize>,
      default: () => handleBooleanDefaultValue(getConfig().modal.showMinimize)
    },
    showClose: {
      type: Boolean as PropType<VxeModalPropTypes.ShowClose>,
      default: () => getConfig().modal.showClose
    },
    dblclickZoom: {
      type: Boolean as PropType<VxeModalPropTypes.DblclickZoom>,
      default: () => getConfig().modal.dblclickZoom
    },
    width: [Number, String] as PropType<VxeModalPropTypes.Width>,
    height: [Number, String] as PropType<VxeModalPropTypes.Height>,
    minWidth: {
      type: [Number, String] as PropType<VxeModalPropTypes.MinWidth>,
      default: () => getConfig().modal.minWidth
    },
    minHeight: {
      type: [Number, String] as PropType<VxeModalPropTypes.MinHeight>,
      default: () => getConfig().modal.minHeight
    },
    zIndex: Number as PropType<VxeModalPropTypes.ZIndex>,
    marginSize: {
      type: [Number, String] as PropType<VxeModalPropTypes.MarginSize>,
      default: () => getConfig().modal.marginSize
    },
    fullscreen: Boolean as PropType<VxeModalPropTypes.Fullscreen>,
    draggable: {
      type: Boolean as PropType<VxeModalPropTypes.Draggable>,
      default: () => getConfig().modal.draggable
    },
    remember: { type: Boolean, default: () => getConfig().modal.remember },
    destroyOnClose: {
      type: Boolean as PropType<VxeModalPropTypes.DestroyOnClose>,
      default: () => getConfig().modal.destroyOnClose
    },
    showTitleOverflow: {
      type: Boolean as PropType<VxeModalPropTypes.ShowTitleOverflow>,
      default: () => getConfig().modal.showTitleOverflow
    },
    transfer: {
      type: Boolean as PropType<VxeModalPropTypes.Transfer>,
      default: () => getConfig().modal.transfer
    },
    storage: {
      type: Boolean as PropType<VxeModalPropTypes.Storage>,
      default: () => getConfig().modal.storage
    },
    storageKey: {
      type: String as PropType<VxeModalPropTypes.StorageKey>,
      default: () => getConfig().modal.storageKey
    },
    padding: {
      type: Boolean as PropType<VxeModalPropTypes.Padding>,
      default: () => getConfig().modal.padding
    },
    size: {
      type: String as PropType<VxeModalPropTypes.Size>,
      default: () => getConfig().modal.size || getConfig().size
    },
    beforeHideMethod: Function as PropType<VxeModalPropTypes.BeforeHideMethod>,
    slots: Object as PropType<VxeModalPropTypes.Slots>,

    /**
     * 已废弃
     * @deprecated
     */
    message: [Number, String] as PropType<VxeModalPropTypes.Message>,
    /**
     * 已废弃
     * @deprecated
     */
    animat: {
      type: Boolean as PropType<VxeModalPropTypes.Animat>,
      default: () => getConfig().modal.animat
    }
  },
  provide () {
    const $xeModal = this
    return {
      $xeModal
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: ModalReactData = {
      initialized: false,
      visible: false,
      contentVisible: false,
      modalTop: 0,
      modalZindex: 0,
      prevZoomStatus: '',
      zoomStatus: '',
      revertLocat: null,
      prevLocat: null,
      firstOpen: true
    }
    const internalData: ModalInternalData = {
      msgTimeout: undefined
    }
    return {
      xID,
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computePermissionInfo(): VxeComponentPermissionInfo
      computeSize(): VxeComponentSizeType
    }),
    computeIsMsg () {
      const $xeModal = this
      const props = $xeModal

      return props.type === 'message' || props.type === 'notification'
    },
    computeIsMinimizeStatus  () {
      const $xeModal = this
      const reactData = $xeModal.reactData as ModalReactData

      return reactData.zoomStatus === 'minimize'
    },
    computeIsMaximizeStatus  () {
      const $xeModal = this
      const reactData = $xeModal.reactData as ModalReactData

      return reactData.zoomStatus === 'maximize'
    },
    computeZoomOpts  () {
      const $xeModal = this
      const props = $xeModal

      return Object.assign({}, getConfig().modal.zoomConfig, props.zoomConfig)
    }
  },
  watch: {
    width () {
      const $xeModal = this

      $xeModal.recalculate()
    },
    height () {
      const $xeModal = this

      $xeModal.recalculate()
    },
    value (val) {
      const $xeModal = this

      if (val) {
        $xeModal.openModal()
      } else {
        $xeModal.closeModal('model')
      }
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeModalEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeModal = this
      $xeModal.$emit(type, createEvent(evnt, { $modal: $xeModal }, params))
    },
    emitModel  (value: any) {
      const $xeModal = this

      const { _events } = $xeModal as any
      $xeModal.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeModal.$emit('modelValue', value)
      } else {
        $xeModal.$emit('model-value', value)
      }
    },
    callSlot  (slotFunc: ((params: any, h: CreateElement) => any) | string | null, params: any, h: CreateElement) {
      const $xeModal = this
      const slots = $xeModal.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc.call($xeModal, params, h))
        }
      }
      return []
    },
    open () {
      const $xeModal = this

      return $xeModal.openModal()
    },
    close () {
      const $xeModal = this

      return $xeModal.closeModal('close')
    },
    getBox () {
      const $xeModal = this

      const boxElem = $xeModal.$refs.refModalBox as HTMLDivElement
      return boxElem
    },
    getPosition  () {
      const $xeModal = this

      const isMsg = $xeModal.computeIsMsg
      if (!isMsg) {
        const boxElem = $xeModal.getBox()
        if (boxElem) {
          return {
            top: boxElem.offsetTop,
            left: boxElem.offsetLeft
          }
        }
      }
      return null
    },
    setPosition  (top?: number, left?: number) {
      const $xeModal = this

      const isMsg = $xeModal.computeIsMsg
      if (!isMsg) {
        const boxElem = $xeModal.getBox()
        if (boxElem) {
          if (XEUtils.isNumber(top)) {
            boxElem.style.top = `${top}px`
          }
          if (XEUtils.isNumber(left)) {
            boxElem.style.left = `${left}px`
          }
        }
      }
      return $xeModal.$nextTick()
    },
    isMinimized  () {
      const $xeModal = this
      const reactData = $xeModal.reactData

      return reactData.zoomStatus === 'minimize'
    },
    isMaximized  () {
      const $xeModal = this
      const reactData = $xeModal.reactData

      return reactData.zoomStatus === 'maximize'
    },
    zoom () {
      const $xeModal = this

      return $xeModal.handleZoom()
    },
    minimize () {
      const $xeModal = this

      return $xeModal.handleMinimize()
    },
    maximize () {
      const $xeModal = this

      return $xeModal.handleMaximize()
    },
    revert () {
      const $xeModal = this

      return $xeModal.handleRevert()
    },
    recalculate  () {
      const $xeModal = this
      const props = $xeModal

      const { width, height } = props
      const boxElem = $xeModal.getBox()
      if (boxElem) {
        boxElem.style.width = toCssUnit(width)
        boxElem.style.height = toCssUnit(height)
      }
      return $xeModal.$nextTick()
    },
    updateZindex () {
      const $xeModal = this
      const props = $xeModal
      const reactData = $xeModal.reactData

      const { zIndex } = props
      const { modalZindex } = reactData
      if (zIndex) {
        reactData.modalZindex = zIndex
      } else if (modalZindex < getLastZIndex()) {
        reactData.modalZindex = nextZIndex()
      }
    },
    updatePosition  () {
      const $xeModal = this
      const props = $xeModal

      return $xeModal.$nextTick().then(() => {
        const { position } = props
        const marginSize = XEUtils.toNumber(props.marginSize)
        const boxElem = $xeModal.getBox()
        if (!boxElem) {
          return
        }
        const clientVisibleWidth = document.documentElement.clientWidth || document.body.clientWidth
        const clientVisibleHeight = document.documentElement.clientHeight || document.body.clientHeight
        const isPosCenter = position === 'center'
        const { top, left }: any = XEUtils.isString(position) ? { top: position, left: position } : Object.assign({}, position)
        const topCenter = isPosCenter || top === 'center'
        const leftCenter = isPosCenter || left === 'center'
        let posTop = ''
        let posLeft = ''
        if (left && !leftCenter) {
          posLeft = isNaN(left) ? left : `${left}px`
        } else {
          posLeft = `${Math.max(marginSize, clientVisibleWidth / 2 - boxElem.offsetWidth / 2)}px`
        }
        if (top && !topCenter) {
          posTop = isNaN(top) ? top : `${top}px`
        } else {
          posTop = `${Math.max(marginSize, clientVisibleHeight / 2 - boxElem.offsetHeight / 2)}px`
        }
        boxElem.style.top = posTop
        boxElem.style.left = posLeft
      })
    },
    updateStyle  () {
      const $xeModal = this
      const props = $xeModal

      $xeModal.$nextTick(() => {
        const { type } = props
        const queueList = type === 'notification' ? notifyQueue : msgQueue
        let offsetTop = 0
        queueList.forEach(comp => {
          const boxElem = comp.getBox()
          if (boxElem) {
            offsetTop += XEUtils.toNumber(comp.top)
            comp.reactData.modalTop = offsetTop
            offsetTop += boxElem.clientHeight
          }
        })
      })
    },
    removeMsgQueue  () {
      const $xeModal = this
      const props = $xeModal

      const { type } = props
      const queueList = type === 'notification' ? notifyQueue : msgQueue
      if (queueList.indexOf($xeModal as VxeModalConstructor) > -1) {
        XEUtils.remove(queueList, comp => comp === $xeModal)
      }
      $xeModal.updateStyle()
    },
    closeModal  (type: ModalEventTypes) {
      const $xeModal = this
      const props = $xeModal
      const reactData = $xeModal.reactData

      const { remember } = props
      const { visible } = reactData
      const isMsg = $xeModal.computeIsMsg
      const beforeHideFn = props.beforeHideMethod || getConfig().modal.beforeHideMethod
      const params = { type }
      if (visible) {
        Promise.resolve(beforeHideFn ? beforeHideFn(params) : null).then((rest) => {
          if (!XEUtils.isError(rest)) {
            if (isMsg) {
              $xeModal.removeMsgQueue()
            }
            reactData.contentVisible = false
            if (!remember) {
              $xeModal.handleRevert()
            }
            XEUtils.remove(allActiveModals, item => item === $xeModal)
            $xeModal.dispatchEvent('before-hide', params, null)
            setTimeout(() => {
              reactData.visible = false
              $xeModal.emitModel(false)
              $xeModal.dispatchEvent('hide', params, null)
            }, 200)
            $xeModal.removeBodyLockScroll()
          }
        }).catch(e => e)
      }
      return $xeModal.$nextTick()
    },
    closeEvent  (evnt: Event) {
      const $xeModal = this

      const type = 'close'
      $xeModal.dispatchEvent(type, { type }, evnt)
      $xeModal.closeModal(type)
    },
    confirmEvent (evnt: Event) {
      const $xeModal = this
      const props = $xeModal

      const { confirmClosable } = props
      const type = 'confirm'
      $xeModal.dispatchEvent(type, { type }, evnt)
      if (confirmClosable) {
        $xeModal.closeModal(type)
      }
    },
    cancelEvent  (evnt: Event) {
      const $xeModal = this
      const props = $xeModal

      const { cancelClosable } = props
      const type = 'cancel'
      $xeModal.dispatchEvent(type, { type }, evnt)
      if (cancelClosable) {
        $xeModal.closeModal(type)
      }
    },
    getStorageMap  (key: string) {
      const version = getConfig().version
      const rest = XEUtils.toStringJSON(localStorage.getItem(key) || '')
      return rest && rest._v === version ? rest : { _v: version }
    },
    hasPosStorage  () {
      const $xeModal = this
      const props = $xeModal

      const { id, remember, storage, storageKey } = props
      return !!(id && remember && storage && $xeModal.getStorageMap(storageKey)[id])
    },
    restorePosStorage () {
      const $xeModal = this
      const props = $xeModal
      const reactData = $xeModal.reactData

      const { id, remember, storage, storageKey } = props
      if (id && remember && storage) {
        const posStorage = $xeModal.getStorageMap(storageKey)[id]
        if (posStorage) {
          const boxElem = $xeModal.getBox()
          const [left, top, width, height, zoomLeft, zoomTop, zoomWidth, zoomHeight] = posStorage.split(',')
          if (boxElem) {
            if (left) {
              boxElem.style.left = `${left}px`
            }
            if (top) {
              boxElem.style.top = `${top}px`
            }
            if (width) {
              boxElem.style.width = `${width}px`
            }
            if (height) {
              boxElem.style.height = `${height}px`
            }
          }
          if (zoomLeft && zoomTop) {
            reactData.revertLocat = {
              left: zoomLeft,
              top: zoomTop,
              width: zoomWidth,
              height: zoomHeight
            }
          }
        }
      }
    },
    addMsgQueue  () {
      const $xeModal = this
      const props = $xeModal

      const { type } = props
      const queueList = type === 'notification' ? notifyQueue : msgQueue
      if (queueList.indexOf($xeModal as VxeModalConstructor) === -1) {
        queueList.push($xeModal as VxeModalConstructor)
      }
      $xeModal.updateStyle()
    },
    savePosStorage  () {
      const $xeModal = this
      const props = $xeModal
      const reactData = $xeModal.reactData

      const { id, remember, storage, storageKey } = props
      const { revertLocat } = reactData
      if (id && remember && storage) {
        const boxElem = $xeModal.getBox()
        if (!boxElem) {
          return
        }
        const posStorageMap = $xeModal.getStorageMap(storageKey)
        posStorageMap[id] = ([
          boxElem.style.left,
          boxElem.style.top,
          boxElem.style.width,
          boxElem.style.height
        ] as (string | number)[]).concat(revertLocat
          ? [
              revertLocat.left,
              revertLocat.top,
              revertLocat.width,
              revertLocat.height
            ]
          : []).map(val => val ? XEUtils.toNumber(val) : '').join(',')
        localStorage.setItem(storageKey, XEUtils.toJSONString(posStorageMap))
      }
    },
    handleMinimize  () {
      const $xeModal = this
      const reactData = $xeModal.reactData

      const zoomOpts = $xeModal.computeZoomOpts
      const { minimizeLayout, minimizeMaxSize, minimizeHorizontalOffset, minimizeVerticalOffset, minimizeOffsetMethod } = zoomOpts
      const isHorizontalLayout = minimizeLayout === 'horizontal'
      const prevZoomStatus = reactData.zoomStatus
      const hlMList: VxeModalConstructor[] = []
      const vlMList: VxeModalConstructor[] = []
      allActiveModals.forEach(item => {
        if (item.xID !== $xeModal.xID && item.type === 'modal' && item.reactData.zoomStatus === 'minimize') {
          const itemZoomOpts = item.computeZoomOpts
          if (itemZoomOpts.minimizeLayout === 'horizontal') {
            hlMList.push(item)
          } else {
            vlMList.push(item)
          }
        }
      })
      const mList = isHorizontalLayout ? hlMList : vlMList
      // 如果配置最小化最大数量
      if (minimizeMaxSize && mList.length >= minimizeMaxSize) {
        if (VxeUI.modal) {
          VxeUI.modal.message({
            status: 'error',
            content: getI18n('vxe.modal.miniMaxSize', [minimizeMaxSize])
          })
        }
        return $xeModal.$nextTick()
      }
      reactData.prevZoomStatus = prevZoomStatus
      reactData.zoomStatus = 'minimize'
      return $xeModal.$nextTick().then(() => {
        const boxElem = $xeModal.getBox()
        if (!boxElem) {
          return
        }
        const headerEl = $xeModal.$refs.refHeaderElem as HTMLDivElement
        if (!headerEl) {
          return
        }
        const { visibleHeight } = getDomNode()
        // 如果当前处于复原状态
        if (!prevZoomStatus) {
          reactData.revertLocat = {
            top: boxElem.offsetTop,
            left: boxElem.offsetLeft,
            width: boxElem.offsetWidth + (boxElem.style.width ? 0 : 1),
            height: boxElem.offsetHeight + (boxElem.style.height ? 0 : 1)
          }
        }
        const targetModal = XEUtils[isHorizontalLayout ? 'max' : 'min'](mList, ($modal) => {
          const boxElem = $modal.getBox()
          return boxElem ? XEUtils.toNumber(boxElem.style[isHorizontalLayout ? 'left' : 'top']) : 0
        })
        let targetTop = visibleHeight - headerEl.offsetHeight - 16
        let targetLeft = 16
        if (targetModal) {
          const minBoxElem = targetModal.getBox()
          if (minBoxElem) {
            const boxLeft = XEUtils.toNumber(minBoxElem.style.left)
            const boxTop = XEUtils.toNumber(minBoxElem.style.top)
            let offsetObj: {
              top?: number
              left?: number
            } = {}
            if (isHorizontalLayout) {
              offsetObj = Object.assign({}, minimizeHorizontalOffset)
            } else {
              offsetObj = Object.assign({}, minimizeVerticalOffset)
            }
            targetLeft = boxLeft + XEUtils.toNumber(offsetObj.left)
            targetTop = boxTop + XEUtils.toNumber(offsetObj.top)
            if (minimizeOffsetMethod) {
              offsetObj = minimizeOffsetMethod({
                $modal: $xeModal as VxeModalConstructor,
                left: targetLeft,
                top: targetTop
              })
              targetLeft = XEUtils.toNumber(offsetObj.left)
              targetTop = XEUtils.toNumber(offsetObj.top)
            }
          }
        }
        Object.assign(boxElem.style, {
          top: `${targetTop}px`,
          left: `${targetLeft}px`,
          width: '200px',
          height: `${headerEl.offsetHeight}px`
        })
        $xeModal.savePosStorage()
      })
    },
    handleMaximize () {
      const $xeModal = this
      const reactData = $xeModal.reactData

      const prevZoomStatus = reactData.zoomStatus
      reactData.prevZoomStatus = prevZoomStatus
      reactData.zoomStatus = 'maximize'
      return $xeModal.$nextTick().then(() => {
        const boxElem = $xeModal.getBox()
        if (boxElem) {
          // 如果当前处于复原状态
          if (!prevZoomStatus) {
            reactData.revertLocat = {
              top: boxElem.offsetTop,
              left: boxElem.offsetLeft,
              width: boxElem.offsetWidth + (boxElem.style.width ? 0 : 1),
              height: boxElem.offsetHeight + (boxElem.style.height ? 0 : 1)
            }
          }
          Object.assign(boxElem.style, {
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
          })
        }
        $xeModal.savePosStorage()
      })
    },
    handleMsgAutoClose () {
      const $xeModal = this
      const props = $xeModal
      const internalData = $xeModal.internalData

      const { duration } = props
      if (duration !== -1) {
        internalData.msgTimeout = setTimeout(() => $xeModal.closeModal('close'), XEUtils.toNumber(duration))
      }
    },
    removeBodyLockScroll  () {
      const $xeModal = this
      const xID = $xeModal.xID

      const htmlElem = document.documentElement
      const lockData = htmlElem.getAttribute(lockScrollAttrKey)
      if (lockData) {
        const lockList = lockData.split(',').filter(key => key !== xID)
        if (lockList.length) {
          htmlElem.setAttribute(lockScrollAttrKey, lockList.join(','))
        } else {
          htmlElem.removeAttribute(lockScrollAttrKey)
          htmlElem.style.removeProperty(lockScrollCssWidthKey)
        }
      }
    },
    addBodyLockScroll  () {
      const $xeModal = this
      const props = $xeModal
      const xID = $xeModal.xID

      const { lockScroll } = props
      const isMsg = $xeModal.computeIsMsg
      if (lockScroll && !isMsg) {
        const htmlElem = document.documentElement
        const clientWidth = document.body.clientWidth
        const lockData = htmlElem.getAttribute(lockScrollAttrKey)
        const lockList = lockData ? lockData.split(',') : []
        if (!lockList.includes(xID)) {
          lockList.push(xID)
          htmlElem.setAttribute(lockScrollAttrKey, lockList.join(','))
        }
        htmlElem.style.setProperty(lockScrollCssWidthKey, `${clientWidth}px`)
      }
    },
    openModal  () {
      const $xeModal = this
      const props = $xeModal
      const reactData = $xeModal.reactData

      const { remember, showFooter } = props
      const { initialized, visible } = reactData
      const isMsg = $xeModal.computeIsMsg
      if (!initialized) {
        reactData.initialized = true
        if (this.transfer) {
          const elem = $xeModal.$refs.refElem as HTMLDivElement
          document.body.appendChild(elem)
        }
      }
      if (!visible) {
        $xeModal.addBodyLockScroll()
        reactData.visible = true
        reactData.contentVisible = false
        $xeModal.updateZindex()
        allActiveModals.push($xeModal as VxeModalConstructor)
        if (!remember) {
          $xeModal.$nextTick(() => {
            $xeModal.recalculate()
          })
        }
        setTimeout(() => {
          reactData.contentVisible = true
          $xeModal.$nextTick(() => {
            if (showFooter) {
              const confirmBtn = $xeModal.$refs.refConfirmBtn as unknown as VxeButtonConstructor
              const cancelBtn = $xeModal.$refs.refCancelBtn as unknown as VxeButtonConstructor
              const operBtn = confirmBtn || cancelBtn
              if (operBtn) {
                operBtn.focus()
              }
            }
            const type = ''
            const params = { type }
            $xeModal.emitModel(true)
            $xeModal.dispatchEvent('show', params, null)
          })
        }, 10)
        if (isMsg) {
          $xeModal.addMsgQueue()
          $xeModal.handleMsgAutoClose()
        } else {
          $xeModal.$nextTick(() => {
            const { fullscreen } = props
            const { firstOpen } = reactData
            if (!remember || firstOpen) {
              $xeModal.updatePosition().then(() => {
                setTimeout(() => $xeModal.updatePosition(), 20)
              })
            }
            if (firstOpen) {
              reactData.firstOpen = false
              if ($xeModal.hasPosStorage()) {
                $xeModal.restorePosStorage()
              } else if (fullscreen) {
                $xeModal.$nextTick(() => $xeModal.handleMaximize())
              }
            } else {
              if (fullscreen) {
                $xeModal.$nextTick(() => $xeModal.handleMaximize())
              }
            }
          })
        }
      }
      return $xeModal.$nextTick()
    },
    selfClickEvent  (evnt: Event) {
      const $xeModal = this
      const props = $xeModal

      const el = $xeModal.$refs.refElem as HTMLDivElement
      if (props.maskClosable && evnt.target === el) {
        const type = 'mask'
        $xeModal.closeModal(type)
      }
    },
    selfMouseoverEvent  () {
      const $xeModal = this
      const internalData = $xeModal.internalData

      const { msgTimeout } = internalData
      if (!msgTimeout) {
        return
      }
      const isMsg = $xeModal.computeIsMsg
      if (isMsg) {
        clearTimeout(msgTimeout)
        internalData.msgTimeout = undefined
      }
    },
    selfMouseoutEvent  () {
      const $xeModal = this
      const internalData = $xeModal.internalData

      const { msgTimeout } = internalData
      if (!msgTimeout) {
        const isMsg = $xeModal.computeIsMsg
        if (isMsg) {
          $xeModal.handleMsgAutoClose()
        }
      }
    },
    handleGlobalKeydownEvent  (evnt: KeyboardEvent) {
      const $xeModal = this

      const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
      if (isEsc) {
        const lastModal = XEUtils.max(allActiveModals, (item) => item.reactData.modalZindex)
        // 多个时，只关掉最上层的窗口
        if (lastModal) {
          setTimeout(() => {
            if (lastModal === $xeModal && lastModal.escClosable) {
              const type = 'exit'
              $xeModal.dispatchEvent('close', { type }, evnt)
              $xeModal.closeModal(type)
            }
          }, 10)
        }
      }
    },
    handleRevert  () {
      const $xeModal = this
      const reactData = $xeModal.reactData

      reactData.prevZoomStatus = reactData.zoomStatus
      reactData.zoomStatus = ''
      return $xeModal.$nextTick().then(() => {
        const { revertLocat } = reactData
        if (revertLocat) {
          const boxElem = $xeModal.getBox()
          reactData.revertLocat = null
          if (boxElem) {
            Object.assign(boxElem.style, {
              top: `${revertLocat.top}px`,
              left: `${revertLocat.left}px`,
              width: `${revertLocat.width}px`,
              height: `${revertLocat.height}px`
            })
          }
          $xeModal.savePosStorage()
          return $xeModal.$nextTick()
        }
      })
    },
    handleZoom  (type?: 'minimize' | 'revert' | 'maximize') {
      const $xeModal = this
      const reactData = $xeModal.reactData

      const { zoomStatus } = reactData
      return new Promise(resolve => {
        if (type) {
          if (type === 'maximize') {
            resolve($xeModal.handleMaximize())
            return
          }
          if (type === 'minimize') {
            resolve($xeModal.handleMinimize())
            return
          }
          resolve($xeModal.handleRevert())
          return
        }
        resolve(zoomStatus ? $xeModal.handleRevert() : $xeModal.handleMaximize())
      }).then(() => {
        return reactData.zoomStatus || 'revert'
      })
    },
    toggleZoomMinEvent  (evnt: Event) {
      const $xeModal = this
      const reactData = $xeModal.reactData

      const { zoomStatus, prevZoomStatus } = reactData
      return $xeModal.handleZoom(zoomStatus === 'minimize' ? (prevZoomStatus || 'revert') : 'minimize').then((type) => {
        const params = { type }
        $xeModal.dispatchEvent('zoom', params, evnt)
      })
    },
    toggleZoomMaxEvent (evnt: Event) {
      const $xeModal = this

      return $xeModal.handleZoom().then((type) => {
        const params = { type }
        $xeModal.dispatchEvent('zoom', params, evnt)
      })
    },
    boxMousedownEvent  () {
      const $xeModal = this
      const reactData = $xeModal.reactData

      const { modalZindex } = reactData
      if (allActiveModals.some(comp => comp.reactData.visible && comp.reactData.modalZindex > modalZindex)) {
        $xeModal.updateZindex()
      }
    },
    mousedownEvent (evnt: MouseEvent) {
      const $xeModal = this
      const props = $xeModal
      const reactData = $xeModal.reactData

      const { remember, storage } = props
      const { zoomStatus } = reactData
      const marginSize = XEUtils.toNumber(props.marginSize)
      const boxElem = $xeModal.getBox()
      if (!boxElem) {
        return
      }
      if (zoomStatus !== 'maximize' && evnt.button === 0 && !getEventTargetNode(evnt, boxElem, 'trigger--btn').flag) {
        evnt.preventDefault()
        const domMousemove = document.onmousemove
        const domMouseup = document.onmouseup
        const disX = evnt.clientX - boxElem.offsetLeft
        const disY = evnt.clientY - boxElem.offsetTop
        const { visibleHeight, visibleWidth } = getDomNode()
        document.onmousemove = evnt => {
          evnt.preventDefault()
          const offsetWidth = boxElem.offsetWidth
          const offsetHeight = boxElem.offsetHeight
          const minX = marginSize
          const maxX = visibleWidth - offsetWidth - marginSize - 1
          const minY = marginSize
          const maxY = visibleHeight - offsetHeight - marginSize - 1
          let left = evnt.clientX - disX
          let top = evnt.clientY - disY
          if (left > maxX) {
            left = maxX
          }
          if (left < minX) {
            left = minX
          }
          if (top > maxY) {
            top = maxY
          }
          if (top < minY) {
            top = minY
          }
          boxElem.style.left = `${left}px`
          boxElem.style.top = `${top}px`
          boxElem.className = boxElem.className.replace(/\s?is--drag/, '') + ' is--drag'
          $xeModal.$emit('move', createEvent(evnt, { type: 'move' }))
        }
        document.onmouseup = () => {
          document.onmousemove = domMousemove
          document.onmouseup = domMouseup
          if (remember && storage) {
            $xeModal.$nextTick(() => {
              $xeModal.savePosStorage()
            })
          }
          setTimeout(() => {
            boxElem.className = boxElem.className.replace(/\s?is--drag/, '')
          }, 50)
        }
      }
    },
    dragEvent (evnt: MouseEvent) {
      const $xeModal = this
      const props = $xeModal
      const reactData = $xeModal.reactData

      evnt.preventDefault()
      const { remember, storage } = props
      const { visibleHeight, visibleWidth } = getDomNode()
      const marginSize = XEUtils.toNumber(props.marginSize)
      const targetElem = evnt.target as HTMLSpanElement
      const type = targetElem.getAttribute('type')
      const minWidth = XEUtils.toNumber(props.minWidth)
      const minHeight = XEUtils.toNumber(props.minHeight)
      const maxWidth = visibleWidth
      const maxHeight = visibleHeight
      const boxElem = $xeModal.getBox()
      const domMousemove = document.onmousemove
      const domMouseup = document.onmouseup
      const clientWidth = boxElem.clientWidth
      const clientHeight = boxElem.clientHeight
      const disX = evnt.clientX
      const disY = evnt.clientY
      const offsetTop = boxElem.offsetTop
      const offsetLeft = boxElem.offsetLeft
      const params = { type: 'resize' }
      document.onmousemove = evnt => {
        evnt.preventDefault()
        let dragLeft
        let dragTop
        let width
        let height
        switch (type) {
          case 'wl':
            dragLeft = disX - evnt.clientX
            width = dragLeft + clientWidth
            if (offsetLeft - dragLeft > marginSize) {
              if (width > minWidth) {
                boxElem.style.width = `${width < maxWidth ? width : maxWidth}px`
                boxElem.style.left = `${offsetLeft - dragLeft}px`
              }
            }
            break
          case 'swst':
            dragLeft = disX - evnt.clientX
            dragTop = disY - evnt.clientY
            width = dragLeft + clientWidth
            height = dragTop + clientHeight
            if (offsetLeft - dragLeft > marginSize) {
              if (width > minWidth) {
                boxElem.style.width = `${width < maxWidth ? width : maxWidth}px`
                boxElem.style.left = `${offsetLeft - dragLeft}px`
              }
            }
            if (offsetTop - dragTop > marginSize) {
              if (height > minHeight) {
                boxElem.style.height = `${height < maxHeight ? height : maxHeight}px`
                boxElem.style.top = `${offsetTop - dragTop}px`
              }
            }
            break
          case 'swlb':
            dragLeft = disX - evnt.clientX
            dragTop = evnt.clientY - disY
            width = dragLeft + clientWidth
            height = dragTop + clientHeight
            if (offsetLeft - dragLeft > marginSize) {
              if (width > minWidth) {
                boxElem.style.width = `${width < maxWidth ? width : maxWidth}px`
                boxElem.style.left = `${offsetLeft - dragLeft}px`
              }
            }
            if (offsetTop + height + marginSize < visibleHeight) {
              if (height > minHeight) {
                boxElem.style.height = `${height < maxHeight ? height : maxHeight}px`
              }
            }
            break
          case 'st':
            dragTop = disY - evnt.clientY
            height = clientHeight + dragTop
            if (offsetTop - dragTop > marginSize) {
              if (height > minHeight) {
                boxElem.style.height = `${height < maxHeight ? height : maxHeight}px`
                boxElem.style.top = `${offsetTop - dragTop}px`
              }
            }
            break
          case 'wr':
            dragLeft = evnt.clientX - disX
            width = dragLeft + clientWidth
            if (offsetLeft + width + marginSize < visibleWidth) {
              if (width > minWidth) {
                boxElem.style.width = `${width < maxWidth ? width : maxWidth}px`
              }
            }
            break
          case 'sest':
            dragLeft = evnt.clientX - disX
            dragTop = disY - evnt.clientY
            width = dragLeft + clientWidth
            height = dragTop + clientHeight
            if (offsetLeft + width + marginSize < visibleWidth) {
              if (width > minWidth) {
                boxElem.style.width = `${width < maxWidth ? width : maxWidth}px`
              }
            }
            if (offsetTop - dragTop > marginSize) {
              if (height > minHeight) {
                boxElem.style.height = `${height < maxHeight ? height : maxHeight}px`
                boxElem.style.top = `${offsetTop - dragTop}px`
              }
            }
            break
          case 'selb':
            dragLeft = evnt.clientX - disX
            dragTop = evnt.clientY - disY
            width = dragLeft + clientWidth
            height = dragTop + clientHeight
            if (offsetLeft + width + marginSize < visibleWidth) {
              if (width > minWidth) {
                boxElem.style.width = `${width < maxWidth ? width : maxWidth}px`
              }
            }
            if (offsetTop + height + marginSize < visibleHeight) {
              if (height > minHeight) {
                boxElem.style.height = `${height < maxHeight ? height : maxHeight}px`
              }
            }
            break
          case 'sb':
            dragTop = evnt.clientY - disY
            height = dragTop + clientHeight
            if (offsetTop + height + marginSize < visibleHeight) {
              if (height > minHeight) {
                boxElem.style.height = `${height < maxHeight ? height : maxHeight}px`
              }
            }
            break
        }
        boxElem.className = boxElem.className.replace(/\s?is--drag/, '') + ' is--drag'
        if (remember && storage) {
          $xeModal.savePosStorage()
        }
        $xeModal.dispatchEvent('resize', params, evnt)
      }
      document.onmouseup = () => {
        reactData.revertLocat = null
        document.onmousemove = domMousemove
        document.onmouseup = domMouseup
        setTimeout(() => {
          boxElem.className = boxElem.className.replace(/\s?is--drag/, '')
        }, 50)
      }
    },

    //
    // Render
    //
    renderTitles  (h: CreateElement) {
      const $xeModal = this
      const props = $xeModal
      const slots = $xeModal.$scopedSlots
      const reactData = $xeModal.reactData

      const { slots: propSlots = {}, showClose, showZoom, showMaximize, showMinimize, title } = props
      const { zoomStatus } = reactData
      const titleSlot = slots.title || propSlots.title
      const cornerSlot = slots.corner || propSlots.corner
      const isMinimizeStatus = $xeModal.computeIsMinimizeStatus
      const isMaximizeStatus = $xeModal.computeIsMaximizeStatus
      return [
        h('div', {
          class: 'vxe-modal--header-title'
        }, titleSlot
          ? $xeModal.callSlot(titleSlot, {
            $modal: $xeModal,
            minimized: isMinimizeStatus,
            maximized: isMaximizeStatus
          }, h)
          : (title ? getFuncText(title) : getI18n('vxe.alert.title'))),
        h('div', {
          class: 'vxe-modal--header-right'
        }, [
          cornerSlot && !isMinimizeStatus
            ? h('div', {
              class: 'vxe-modal--corner-wrapper'
            }, $xeModal.callSlot(cornerSlot, { $modal: $xeModal }, h))
            : renderEmptyElement($xeModal),
          (XEUtils.isBoolean(showMinimize) ? showMinimize : showZoom)
            ? h('div', {
              class: ['vxe-modal--zoom-btn', 'trigger--btn'],
              attrs: {
                title: getI18n(`vxe.modal.zoom${zoomStatus === 'minimize' ? 'Out' : 'Min'}`)
              },
              on: {
                click: $xeModal.toggleZoomMinEvent
              }
            }, [
              h('i', {
                class: zoomStatus === 'minimize' ? getIcon().MODAL_ZOOM_REVERT : getIcon().MODAL_ZOOM_MIN
              })
            ])
            : renderEmptyElement($xeModal),
          (XEUtils.isBoolean(showMaximize) ? showMaximize : showZoom) && zoomStatus !== 'minimize'
            ? h('div', {
              class: ['vxe-modal--zoom-btn', 'trigger--btn'],
              attrs: {
                title: getI18n(`vxe.modal.zoom${zoomStatus === 'maximize' ? 'Out' : 'In'}`)
              },
              on: {
                click: $xeModal.toggleZoomMaxEvent
              }
            }, [
              h('i', {
                class: zoomStatus === 'maximize' ? getIcon().MODAL_ZOOM_OUT : getIcon().MODAL_ZOOM_IN
              })
            ])
            : renderEmptyElement($xeModal),
          showClose
            ? h('div', {
              class: ['vxe-modal--close-btn', 'trigger--btn'],
              attrs: {
                title: getI18n('vxe.modal.close')
              },
              on: {
                click: $xeModal.closeEvent
              }
            }, [
              h('i', {
                class: getIcon().MODAL_CLOSE
              })
            ])
            : renderEmptyElement($xeModal)
        ])
      ]
    },
    renderHeader  (h: CreateElement) {
      const $xeModal = this
      const props = $xeModal
      const slots = $xeModal.$scopedSlots

      const { slots: propSlots = {}, showZoom, showMaximize, draggable } = props
      const isMsg = $xeModal.computeIsMsg
      const headerSlot = slots.header || propSlots.header
      if (props.showHeader) {
        const headerOns: Record<string, any> = {}
        if (draggable) {
          headerOns.mousedown = $xeModal.mousedownEvent
        }
        if ((XEUtils.isBoolean(showMaximize) ? showMaximize : showZoom) && props.dblclickZoom && props.type === 'modal') {
          headerOns.dblclick = $xeModal.toggleZoomMaxEvent
        }
        return h('div', {
          ref: 'refHeaderElem',
          class: ['vxe-modal--header', {
            'is--ellipsis': !isMsg && props.showTitleOverflow
          }],
          on: headerOns
        }, headerSlot ? $xeModal.callSlot(headerSlot, { $modal: $xeModal }, h) : $xeModal.renderTitles(h))
      }
      return renderEmptyElement($xeModal)
    },
    renderBody  (h: CreateElement) {
      const $xeModal = this
      const props = $xeModal
      const slots = $xeModal.$scopedSlots

      const { slots: propSlots = {}, status, message, iconStatus } = props
      const content = props.content || message
      const isMsg = $xeModal.computeIsMsg
      const defaultSlot = slots.default || propSlots.default
      const leftSlot = slots.left || propSlots.left
      const rightSlot = slots.right || propSlots.right
      const contVNs: VNode[] = []
      if (!isMsg && (status || iconStatus)) {
        contVNs.push(
          h('div', {
            class: 'vxe-modal--status-wrapper'
          }, [
            h('i', {
              class: ['vxe-modal--status-icon', iconStatus || getIcon()[`MODAL_${status}`.toLocaleUpperCase() as 'MODAL_SUCCESS' | 'MODAL_ERROR']]
            })
          ])
        )
      }
      contVNs.push(
        h('div', {
          class: 'vxe-modal--content'
        }, defaultSlot ? $xeModal.callSlot(defaultSlot, { $modal: $xeModal }, h) : getFuncText(content))
      )
      return h('div', {
        class: 'vxe-modal--body'
      }, [
        leftSlot
          ? h('div', {
            class: 'vxe-modal--body-left'
          }, $xeModal.callSlot(leftSlot, { $modal: $xeModal }, h))
          : renderEmptyElement($xeModal),
        h('div', {
          class: 'vxe-modal--body-default'
        }, contVNs),
        rightSlot
          ? h('div', {
            class: 'vxe-modal--body-right'
          }, $xeModal.callSlot(rightSlot, { $modal: $xeModal }, h))
          : renderEmptyElement($xeModal),
        isMsg
          ? renderEmptyElement($xeModal)
          : h(VxeLoadingComponent, {
            class: 'vxe-modal--loading',
            props: {
              value: props.loading
            }
          })
      ])
    },
    renderDefaultFooter  (h: CreateElement) {
      const $xeModal = this
      const props = $xeModal
      const slots = $xeModal.$scopedSlots

      const { slots: propSlots = {}, showCancelButton, showConfirmButton, type, loading } = props
      const lfSlot = slots.leftfoot || propSlots.leftfoot
      const rfSlot = slots.rightfoot || propSlots.rightfoot
      const btnVNs = []
      if (XEUtils.isBoolean(showCancelButton) ? showCancelButton : type === 'confirm') {
        btnVNs.push(
          h(VxeButtonComponent, {
            key: 1,
            ref: 'refCancelBtn',
            props: {
              content: props.cancelButtonText || getI18n('vxe.button.cancel')
            },
            on: {
              click: $xeModal.cancelEvent
            }
          })
        )
      }
      if (XEUtils.isBoolean(showConfirmButton) ? showConfirmButton : (type === 'confirm' || type === 'alert')) {
        btnVNs.push(
          h(VxeButtonComponent, {
            key: 2,
            ref: 'refConfirmBtn',
            props: {
              status: 'primary',
              loading: loading,
              content: props.confirmButtonText || getI18n('vxe.button.confirm')
            },
            on: {
              click: $xeModal.confirmEvent
            }
          })
        )
      }
      return h('div', {
        class: 'vxe-modal--footer-wrapper'
      }, [
        h('div', {
          class: 'vxe-modal--footer-left'
        }, lfSlot ? $xeModal.callSlot(lfSlot, { $modal: $xeModal }, h) : []),
        h('div', {
          class: 'vxe-modal--footer-right'
        }, rfSlot ? $xeModal.callSlot(rfSlot, { $modal: $xeModal }, h) : btnVNs)
      ])
    },
    renderFooter  (h: CreateElement) {
      const $xeModal = this
      const props = $xeModal
      const slots = $xeModal.$scopedSlots

      const { slots: propSlots = {} } = props
      const footerSlot = slots.footer || propSlots.footer
      if (props.showFooter) {
        return h('div', {
          class: 'vxe-modal--footer'
        }, footerSlot ? $xeModal.callSlot(footerSlot, { $modal: $xeModal }, h) : [$xeModal.renderDefaultFooter(h)])
      }
      return renderEmptyElement($xeModal)
    },
    renderVN (h: CreateElement): VNode {
      const $xeModal = this
      const props = $xeModal
      const slots = $xeModal.$scopedSlots
      const reactData = $xeModal.reactData

      const { slots: propSlots = {}, className, type, animat, draggable, iconStatus, position, loading, destroyOnClose, status, lockScroll, padding, lockView, mask, resize } = props
      const { initialized, modalTop, contentVisible, visible, zoomStatus } = reactData
      const asideSlot = slots.aside || propSlots.aside
      const vSize = $xeModal.computeSize
      const isMsg = $xeModal.computeIsMsg
      const isMinimizeStatus = $xeModal.computeIsMinimizeStatus
      const ons: Record<string, any> = {}
      if (isMsg) {
        ons.mouseover = $xeModal.selfMouseoverEvent
        ons.mouseout = $xeModal.selfMouseoutEvent
      }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-modal--wrapper', `type--${type}`, `zoom--${zoomStatus || 'revert'}`, className || '', position ? `pos--${position}` : '', {
          [`size--${vSize}`]: vSize,
          [`status--${status}`]: status,
          'is--padding': padding,
          'is--animat': animat,
          'lock--scroll': lockScroll,
          'lock--view': lockView,
          'is--draggable': draggable,
          'is--resize': resize,
          'is--mask': mask,
          'is--visible': contentVisible,
          'is--active': visible,
          'is--loading': loading
        }],
        style: {
          zIndex: reactData.modalZindex,
          top: modalTop ? `${modalTop}px` : null
        },
        on: {
          ...ons,
          click: $xeModal.selfClickEvent
        }
      }, initialized
        ? [
            h('div', {
              ref: 'refModalBox',
              class: 'vxe-modal--box',
              on: {
                mousedown: $xeModal.boxMousedownEvent
              }
            }, [
              (isMsg || asideSlot) && !isMinimizeStatus
                ? h('div', {
                  class: 'vxe-modal--aside'
                },
                asideSlot
                  ? $xeModal.callSlot(asideSlot, { $modal: $xeModal }, h)
                  : [
                      status || iconStatus
                        ? h('div', {
                          class: 'vxe-modal--status-wrapper'
                        }, [
                          h('i', {
                            class: ['vxe-modal--status-icon', iconStatus || getIcon()[`MODAL_${status}`.toLocaleUpperCase() as 'MODAL_SUCCESS' | 'MODAL_ERROR']]
                          })
                        ])
                        : renderEmptyElement($xeModal)
                    ]
                )
                : renderEmptyElement($xeModal),
              h('div', {
                class: 'vxe-modal--container'
              }, !reactData.initialized || (destroyOnClose && !reactData.visible)
                ? []
                : [
                    $xeModal.renderHeader(h),
                    $xeModal.renderBody(h),
                    $xeModal.renderFooter(h),
                    !isMsg && resize
                      ? h('span', {
                        class: 'vxe-modal--resize'
                      }, ['wl', 'wr', 'swst', 'sest', 'st', 'swlb', 'selb', 'sb'].map(type => {
                        return h('span', {
                          class: `${type}-resize`,
                          attrs: {
                            type: type
                          },
                          on: {
                            mousedown: $xeModal.dragEvent
                          }
                        })
                      }))
                      : renderEmptyElement($xeModal)
                  ])
            ])
          ]
        : [])
    }
  },
  mounted () {
    const $xeModal = this
    const slots = $xeModal.$scopedSlots
    const props = $xeModal

    if (process.env.VUE_APP_VXE_ENV === 'development') {
      if (props.type === 'modal' && props.showFooter && !(props.showConfirmButton || props.showCancelButton || slots.footer)) {
        warnLog('vxe.modal.footPropErr')
      }
    }
    $xeModal.$nextTick(() => {
      if (props.storage && !props.id) {
        errLog('vxe.error.reqProp', ['modal.id'])
      }
      if (props.value) {
        $xeModal.openModal()
      }
      $xeModal.recalculate()
    })
    if (props.escClosable) {
      globalEvents.on($xeModal, 'keydown', $xeModal.handleGlobalKeydownEvent)
    }
  },
  beforeDestroy () {
    const $xeModal = this

    const panelElem = $xeModal.$refs.refElem as HTMLDivElement
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeModal, 'keydown')
    $xeModal.removeMsgQueue()
    $xeModal.removeBodyLockScroll()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
