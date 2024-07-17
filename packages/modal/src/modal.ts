import { defineComponent, h, Teleport, ref, Ref, computed, reactive, nextTick, watch, PropType, VNode, onMounted, onUnmounted, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { getDomNode, getEventTargetNode } from '../../ui/src/dom'
import { getLastZIndex, nextZIndex, getFuncText, handleBooleanDefaultValue } from '../../ui/src/utils'
import { VxeUI, getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, useSize } from '../../ui'
import VxeButtonComponent from '../../button/src/button'
import VxeLoadingComponent from '../../loading/index'
import { getSlotVNs } from '../../ui/src/vn'
import { errLog } from '../../ui/src/log'

import type { VxeModalConstructor, VxeModalPropTypes, ModalReactData, VxeModalEmits, VxeModalPrivateComputed, ModalEventTypes, VxeButtonInstance, ModalMethods, ModalPrivateRef, VxeModalMethods } from '../../../types'

export const allActiveModals: VxeModalConstructor[] = []
const msgQueue: VxeModalConstructor[] = []
const notifyQueue: VxeModalConstructor[] = []

export default defineComponent({
  name: 'VxeModal',
  props: {
    modelValue: Boolean as PropType<VxeModalPropTypes.ModelValue>,
    id: String as PropType<VxeModalPropTypes.ID>,
    type: { type: String as PropType<VxeModalPropTypes.Type>, default: 'modal' },
    loading: { type: Boolean as PropType<VxeModalPropTypes.Loading>, default: null },
    status: String as PropType<VxeModalPropTypes.Status>,
    iconStatus: String as PropType<VxeModalPropTypes.IconStatus>,
    className: String as PropType<VxeModalPropTypes.ClassName>,
    top: { type: [Number, String] as PropType<VxeModalPropTypes.Top>, default: () => getConfig().modal.top },
    position: [String, Object] as PropType<VxeModalPropTypes.Position>,
    title: String as PropType<VxeModalPropTypes.Title>,
    duration: { type: [Number, String] as PropType<VxeModalPropTypes.Duration>, default: () => getConfig().modal.duration },
    message: [Number, String] as PropType<VxeModalPropTypes.Message>,
    content: [Number, String] as PropType<VxeModalPropTypes.Content>,
    showCancelButton: { type: Boolean as PropType<VxeModalPropTypes.ShowCancelButton>, default: null },
    cancelButtonText: { type: String as PropType<VxeModalPropTypes.CancelButtonText>, default: () => getConfig().modal.cancelButtonText },
    showConfirmButton: { type: Boolean as PropType<VxeModalPropTypes.ShowConfirmButton>, default: () => getConfig().modal.showConfirmButton },
    confirmButtonText: { type: String as PropType<VxeModalPropTypes.ConfirmButtonText>, default: () => getConfig().modal.confirmButtonText },
    lockView: { type: Boolean as PropType<VxeModalPropTypes.LockView>, default: () => getConfig().modal.lockView },
    lockScroll: Boolean as PropType<VxeModalPropTypes.LockScroll>,
    mask: { type: Boolean as PropType<VxeModalPropTypes.Mask>, default: () => getConfig().modal.mask },
    maskClosable: { type: Boolean as PropType<VxeModalPropTypes.MaskClosable>, default: () => getConfig().modal.maskClosable },
    escClosable: { type: Boolean as PropType<VxeModalPropTypes.EscClosable>, default: () => getConfig().modal.escClosable },
    resize: Boolean as PropType<VxeModalPropTypes.Resize>,
    showHeader: { type: Boolean as PropType<VxeModalPropTypes.ShowHeader>, default: () => getConfig().modal.showHeader },
    showFooter: { type: Boolean as PropType<VxeModalPropTypes.ShowFooter>, default: () => getConfig().modal.showFooter },
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
    showClose: { type: Boolean as PropType<VxeModalPropTypes.ShowClose>, default: () => getConfig().modal.showClose },
    dblclickZoom: { type: Boolean as PropType<VxeModalPropTypes.DblclickZoom>, default: () => getConfig().modal.dblclickZoom },
    width: [Number, String] as PropType<VxeModalPropTypes.Width>,
    height: [Number, String] as PropType<VxeModalPropTypes.Height>,
    minWidth: { type: [Number, String] as PropType<VxeModalPropTypes.MinWidth>, default: () => getConfig().modal.minWidth },
    minHeight: { type: [Number, String] as PropType<VxeModalPropTypes.MinHeight>, default: () => getConfig().modal.minHeight },
    zIndex: Number as PropType<VxeModalPropTypes.ZIndex>,
    marginSize: { type: [Number, String] as PropType<VxeModalPropTypes.MarginSize>, default: () => getConfig().modal.marginSize },
    fullscreen: Boolean as PropType<VxeModalPropTypes.Fullscreen>,
    draggable: { type: Boolean as PropType<VxeModalPropTypes.Draggable>, default: () => getConfig().modal.draggable },
    remember: { type: Boolean, default: () => getConfig().modal.remember },
    destroyOnClose: { type: Boolean as PropType<VxeModalPropTypes.DestroyOnClose>, default: () => getConfig().modal.destroyOnClose },
    showTitleOverflow: { type: Boolean as PropType<VxeModalPropTypes.ShowTitleOverflow>, default: () => getConfig().modal.showTitleOverflow },
    transfer: { type: Boolean as PropType<VxeModalPropTypes.Transfer>, default: () => getConfig().modal.transfer },
    storage: { type: Boolean as PropType<VxeModalPropTypes.Storage>, default: () => getConfig().modal.storage },
    storageKey: { type: String as PropType<VxeModalPropTypes.StorageKey>, default: () => getConfig().modal.storageKey },
    padding: { type: Boolean as PropType<VxeModalPropTypes.Padding>, default: () => getConfig().modal.padding },
    size: { type: String as PropType<VxeModalPropTypes.Size>, default: () => getConfig().modal.size || getConfig().size },
    beforeHideMethod: Function as PropType<VxeModalPropTypes.BeforeHideMethod>,
    slots: Object as PropType<VxeModalPropTypes.Slots>,

    /**
     * 已废弃
     */
    animat: { type: Boolean as PropType<VxeModalPropTypes.Animat>, default: () => getConfig().modal.animat }
  },
  emits: [
    'update:modelValue',
    'show',
    'hide',
    'before-hide',
    'close',
    'confirm',
    'cancel',
    'zoom',
    'resize',
    'move'
  ] as VxeModalEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive<ModalReactData>({
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
    })

    const refElem = ref<HTMLDivElement>()
    const refModalBox = ref() as Ref<HTMLDivElement>
    const refHeaderElem = ref() as Ref<HTMLDivElement>
    const refConfirmBtn = ref<VxeButtonInstance>()
    const refCancelBtn = ref<VxeButtonInstance>()

    const refMaps: ModalPrivateRef = {
      refElem
    }

    const computeIsMsg = computed(() => {
      return props.type === 'message' || props.type === 'notification'
    })

    const computeZoomOpts = computed(() => {
      return Object.assign({}, getConfig().modal.zoomConfig, props.zoomConfig)
    })

    const computeMaps: VxeModalPrivateComputed = {
      computeSize,
      computeZoomOpts
    }

    const $xeModal = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeModalConstructor & VxeModalMethods

    let modalMethods = {} as ModalMethods

    const getBox = () => {
      const boxElem = refModalBox.value
      return boxElem
    }

    const recalculate = () => {
      const { width, height } = props
      const boxElem = getBox()
      boxElem.style.width = `${width ? (isNaN(width as number) ? width : `${width}px`) : ''}`
      boxElem.style.height = `${height ? (isNaN(height as number) ? height : `${height}px`) : ''}`
      return nextTick()
    }

    const updateZindex = () => {
      const { zIndex } = props
      const { modalZindex } = reactData
      if (zIndex) {
        reactData.modalZindex = zIndex
      } else if (modalZindex < getLastZIndex()) {
        reactData.modalZindex = nextZIndex()
      }
    }

    const updatePosition = () => {
      return nextTick().then(() => {
        const { position } = props
        const marginSize = XEUtils.toNumber(props.marginSize)
        const boxElem = getBox()
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
    }

    const updateStyle = () => {
      nextTick(() => {
        const { type } = props
        const queueList = type === 'notification' ? notifyQueue : msgQueue
        let offsetTop = 0
        queueList.forEach(comp => {
          const boxElem = comp.getBox()
          offsetTop += XEUtils.toNumber(comp.props.top)
          comp.reactData.modalTop = offsetTop
          offsetTop += boxElem.clientHeight
        })
      })
    }

    const removeMsgQueue = () => {
      const { type } = props
      const queueList = type === 'notification' ? notifyQueue : msgQueue
      if (queueList.indexOf($xeModal) > -1) {
        XEUtils.remove(queueList, comp => comp === $xeModal)
      }
      updateStyle()
    }

    const closeModal = (type: ModalEventTypes) => {
      const { remember } = props
      const { visible } = reactData
      const isMsg = computeIsMsg.value
      const beforeHideFn = props.beforeHideMethod || getConfig().modal.beforeHideMethod
      const params = { type }
      if (visible) {
        Promise.resolve(beforeHideFn ? beforeHideFn(params) : null).then((rest) => {
          if (!XEUtils.isError(rest)) {
            if (isMsg) {
              removeMsgQueue()
            }
            reactData.contentVisible = false
            if (!remember) {
              handleRevert()
            }
            XEUtils.remove(allActiveModals, item => item === $xeModal)
            modalMethods.dispatchEvent('before-hide', params, null)
            setTimeout(() => {
              reactData.visible = false
              emit('update:modelValue', false)
              modalMethods.dispatchEvent('hide', params, null)
            }, 200)
          }
        }).catch(e => e)
      }
      return nextTick()
    }

    const closeEvent = (evnt: Event) => {
      const type = 'close'
      modalMethods.dispatchEvent(type, { type }, evnt)
      closeModal(type)
    }

    const confirmEvent = (evnt: Event) => {
      const type = 'confirm'
      modalMethods.dispatchEvent(type, { type }, evnt)
      closeModal(type)
    }

    const cancelEvent = (evnt: Event) => {
      const type = 'cancel'
      modalMethods.dispatchEvent(type, { type }, evnt)
      closeModal(type)
    }

    const getStorageMap = (key: string) => {
      const version = getConfig().version
      const rest = XEUtils.toStringJSON(localStorage.getItem(key) || '')
      return rest && rest._v === version ? rest : { _v: version }
    }

    const hasPosStorage = () => {
      const { id, remember, storage, storageKey } = props
      return !!(id && remember && storage && getStorageMap(storageKey)[id])
    }

    const restorePosStorage = () => {
      const { id, remember, storage, storageKey } = props
      if (id && remember && storage) {
        const posStorage = getStorageMap(storageKey)[id]
        if (posStorage) {
          const boxElem = getBox()
          const [left, top, width, height, zoomLeft, zoomTop, zoomWidth, zoomHeight] = posStorage.split(',')
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
    }

    const addMsgQueue = () => {
      const { type } = props
      const queueList = type === 'notification' ? notifyQueue : msgQueue
      if (queueList.indexOf($xeModal) === -1) {
        queueList.push($xeModal)
      }
      updateStyle()
    }

    const savePosStorage = () => {
      const { id, remember, storage, storageKey } = props
      const { revertLocat } = reactData
      if (id && remember && storage) {
        const boxElem = getBox()
        const posStorageMap = getStorageMap(storageKey)
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
    }

    const handleMinimize = () => {
      const zoomOpts = computeZoomOpts.value
      const { minimizeLayout, minimizeMaxSize, minimizeHorizontalOffset, minimizeVerticalOffset, minimizeOffsetMethod } = zoomOpts
      const isHorizontalLayout = minimizeLayout === 'horizontal'
      const prevZoomStatus = reactData.zoomStatus
      const hlMList: VxeModalConstructor[] = []
      const vlMList: VxeModalConstructor[] = []
      allActiveModals.forEach(item => {
        if (item.xID !== $xeModal.xID && item.props.type === 'modal' && item.reactData.zoomStatus === 'minimize') {
          const itemZoomOpts = item.getComputeMaps().computeZoomOpts.value
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
        return nextTick()
      }
      reactData.prevZoomStatus = prevZoomStatus
      reactData.zoomStatus = 'minimize'
      return nextTick().then(() => {
        const boxElem = getBox()
        const headerEl = refHeaderElem.value
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
                $modal: $xeModal,
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
        savePosStorage()
      })
    }

    const handleMaximize = () => {
      const prevZoomStatus = reactData.zoomStatus
      reactData.prevZoomStatus = prevZoomStatus
      reactData.zoomStatus = 'maximize'
      return nextTick().then(() => {
        const boxElem = getBox()
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
        savePosStorage()
      })
    }

    let msgTimeout: any = null

    const handleMsgAutoClose = () => {
      const { duration } = props
      if (duration !== -1) {
        msgTimeout = setTimeout(() => closeModal('close'), XEUtils.toNumber(duration))
      }
    }

    const openModal = () => {
      const { remember, showFooter } = props
      const { initialized, visible } = reactData
      const isMsg = computeIsMsg.value
      if (!initialized) {
        reactData.initialized = true
      }
      if (!visible) {
        if (!remember) {
          recalculate()
        }
        reactData.visible = true
        reactData.contentVisible = false
        updateZindex()
        allActiveModals.push($xeModal)
        setTimeout(() => {
          reactData.contentVisible = true
          nextTick(() => {
            if (showFooter) {
              const confirmBtn = refConfirmBtn.value
              const cancelBtn = refCancelBtn.value
              const operBtn = confirmBtn || cancelBtn
              if (operBtn) {
                operBtn.focus()
              }
            }
            const type = ''
            const params = { type }
            emit('update:modelValue', true)
            modalMethods.dispatchEvent('show', params, null)
          })
        }, 10)
        if (isMsg) {
          addMsgQueue()
          handleMsgAutoClose()
        } else {
          nextTick(() => {
            const { fullscreen } = props
            const { firstOpen } = reactData
            if (!remember || firstOpen) {
              updatePosition().then(() => {
                setTimeout(() => updatePosition(), 20)
              })
            }
            if (firstOpen) {
              reactData.firstOpen = false
              if (hasPosStorage()) {
                restorePosStorage()
              } else if (fullscreen) {
                nextTick(() => handleMaximize())
              }
            } else {
              if (fullscreen) {
                nextTick(() => handleMaximize())
              }
            }
          })
        }
      }
      return nextTick()
    }

    const selfClickEvent = (evnt: Event) => {
      const el = refElem.value
      if (props.maskClosable && evnt.target === el) {
        const type = 'mask'
        closeModal(type)
      }
    }

    const selfMouseoverEvent = () => {
      if (msgTimeout === null) {
        return
      }
      const isMsg = computeIsMsg.value
      if (isMsg) {
        clearTimeout(msgTimeout)
        msgTimeout = null
      }
    }

    const selfMouseoutEvent = () => {
      if (msgTimeout === null) {
        const isMsg = computeIsMsg.value
        if (isMsg) {
          handleMsgAutoClose()
        }
      }
    }

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
      if (isEsc) {
        const lastModal = XEUtils.max(allActiveModals, (item) => item.reactData.modalZindex)
        // 多个时，只关掉最上层的窗口
        if (lastModal) {
          setTimeout(() => {
            if (lastModal === $xeModal && (lastModal as VxeModalConstructor).props.escClosable) {
              closeModal('exit')
            }
          }, 10)
        }
      }
    }

    const isMinimized = () => {
      return reactData.zoomStatus === 'minimize'
    }

    const isMaximized = () => {
      return reactData.zoomStatus === 'maximize'
    }

    const handleRevert = () => {
      reactData.prevZoomStatus = reactData.zoomStatus
      reactData.zoomStatus = ''
      return nextTick().then(() => {
        const { revertLocat } = reactData
        if (revertLocat) {
          const boxElem = getBox()
          reactData.revertLocat = null
          Object.assign(boxElem.style, {
            top: `${revertLocat.top}px`,
            left: `${revertLocat.left}px`,
            width: `${revertLocat.width}px`,
            height: `${revertLocat.height}px`
          })
          savePosStorage()
          return nextTick()
        }
      })
    }

    const handleZoom = (type?: 'minimize' | 'revert' | 'maximize') => {
      const { zoomStatus } = reactData
      return new Promise(resolve => {
        if (type) {
          if (type === 'maximize') {
            resolve(handleMaximize())
            return
          }
          if (type === 'minimize') {
            resolve(handleMinimize())
            return
          }
          resolve(handleRevert())
          return
        }
        resolve(zoomStatus ? handleRevert() : handleMaximize())
      }).then(() => {
        return reactData.zoomStatus || 'revert'
      })
    }

    const toggleZoomMinEvent = (evnt: Event) => {
      const { zoomStatus, prevZoomStatus } = reactData
      return handleZoom(zoomStatus === 'minimize' ? (prevZoomStatus || 'revert') : 'minimize').then((type) => {
        const params = { type }
        modalMethods.dispatchEvent('zoom', params, evnt)
      })
    }

    const toggleZoomMaxEvent = (evnt: Event) => {
      return handleZoom().then((type) => {
        const params = { type }
        modalMethods.dispatchEvent('zoom', params, evnt)
      })
    }

    const getPosition = () => {
      const isMsg = computeIsMsg.value
      if (!isMsg) {
        const boxElem = getBox()
        if (boxElem) {
          return {
            top: boxElem.offsetTop,
            left: boxElem.offsetLeft
          }
        }
      }
      return null
    }

    const setPosition = (top?: number, left?: number) => {
      const isMsg = computeIsMsg.value
      if (!isMsg) {
        const boxElem = getBox()
        if (XEUtils.isNumber(top)) {
          boxElem.style.top = `${top}px`
        }
        if (XEUtils.isNumber(left)) {
          boxElem.style.left = `${left}px`
        }
      }
      return nextTick()
    }

    const boxMousedownEvent = () => {
      const { modalZindex } = reactData
      if (allActiveModals.some(comp => comp.reactData.visible && comp.reactData.modalZindex > modalZindex)) {
        updateZindex()
      }
    }

    const mousedownEvent = (evnt: MouseEvent) => {
      const { remember, storage } = props
      const { zoomStatus } = reactData
      const marginSize = XEUtils.toNumber(props.marginSize)
      const boxElem = getBox()
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
          emit('move', createEvent(evnt, { type: 'move' }))
        }
        document.onmouseup = () => {
          document.onmousemove = domMousemove
          document.onmouseup = domMouseup
          if (remember && storage) {
            nextTick(() => {
              savePosStorage()
            })
          }
          setTimeout(() => {
            boxElem.className = boxElem.className.replace(/\s?is--drag/, '')
          }, 50)
        }
      }
    }

    const dragEvent = (evnt: MouseEvent) => {
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
      const boxElem = getBox()
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
          savePosStorage()
        }
        modalMethods.dispatchEvent('resize', params, evnt)
      }
      document.onmouseup = () => {
        reactData.revertLocat = null
        document.onmousemove = domMousemove
        document.onmouseup = domMouseup
        setTimeout(() => {
          boxElem.className = boxElem.className.replace(/\s?is--drag/, '')
        }, 50)
      }
    }

    modalMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $modal: $xeModal }, params))
      },
      open: openModal,
      close () {
        return closeModal('close')
      },
      getBox,
      getPosition,
      setPosition,
      isMinimized,
      isMaximized,
      zoom: handleZoom,
      minimize: handleMinimize,
      maximize: handleMaximize,
      revert: handleRevert
    }

    Object.assign($xeModal, modalMethods)

    const renderTitles = () => {
      const { slots: propSlots = {}, showClose, showZoom, showMaximize, showMinimize, title } = props
      const { zoomStatus } = reactData
      const titleSlot = slots.title || propSlots.title
      const cornerSlot = slots.corner || propSlots.corner
      return [
        h('div', {
          class: 'vxe-modal--header-title'
        }, titleSlot ? getSlotVNs(titleSlot({ $modal: $xeModal })) : (title ? getFuncText(title) : getI18n('vxe.alert.title'))),
        h('div', {
          class: 'vxe-modal--header-right'
        }, [
          cornerSlot
            ? h('div', {
              class: 'vxe-modal--corner-wrapper'
            }, getSlotVNs(cornerSlot({ $modal: $xeModal })))
            : createCommentVNode(),
          (XEUtils.isBoolean(showMinimize) ? showMinimize : showZoom)
            ? h('div', {
              class: ['vxe-modal--zoom-btn', 'trigger--btn'],
              title: getI18n(`vxe.modal.zoom${zoomStatus === 'minimize' ? 'Out' : 'Min'}`),
              onClick: toggleZoomMinEvent
            }, [
              h('i', {
                class: zoomStatus === 'minimize' ? getIcon().MODAL_ZOOM_REVERT : getIcon().MODAL_ZOOM_MIN
              })
            ])
            : createCommentVNode(),
          (XEUtils.isBoolean(showMaximize) ? showMaximize : showZoom) && zoomStatus !== 'minimize'
            ? h('div', {
              class: ['vxe-modal--zoom-btn', 'trigger--btn'],
              title: getI18n(`vxe.modal.zoom${zoomStatus === 'maximize' ? 'Out' : 'In'}`),
              onClick: toggleZoomMaxEvent
            }, [
              h('i', {
                class: zoomStatus === 'maximize' ? getIcon().MODAL_ZOOM_OUT : getIcon().MODAL_ZOOM_IN
              })
            ])
            : createCommentVNode(),
          showClose
            ? h('div', {
              class: ['vxe-modal--close-btn', 'trigger--btn'],
              title: getI18n('vxe.modal.close'),
              onClick: closeEvent
            }, [
              h('i', {
                class: getIcon().MODAL_CLOSE
              })
            ])
            : createCommentVNode()
        ])
      ]
    }

    const renderHeader = () => {
      const { slots: propSlots = {}, showZoom, showMaximize, draggable } = props
      const isMsg = computeIsMsg.value
      const headerSlot = slots.header || propSlots.header
      if (props.showHeader) {
        const headerOns: Record<string, any> = {}
        if (draggable) {
          headerOns.onMousedown = mousedownEvent
        }
        if ((XEUtils.isBoolean(showMaximize) ? showMaximize : showZoom) && props.dblclickZoom && props.type === 'modal') {
          headerOns.onDblclick = toggleZoomMaxEvent
        }
        return h('div', {
          ref: refHeaderElem,
          class: ['vxe-modal--header', {
            'is--ellipsis': !isMsg && props.showTitleOverflow
          }],
          ...headerOns
        }, headerSlot ? getSlotVNs(headerSlot({ $modal: $xeModal })) : renderTitles())
      }
      return createCommentVNode()
    }

    const renderBody = () => {
      const { slots: propSlots = {}, status, message, iconStatus } = props
      const content = props.content || message
      const isMsg = computeIsMsg.value
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
        }, defaultSlot ? getSlotVNs(defaultSlot({ $modal: $xeModal })) : getFuncText(content))
      )
      return h('div', {
        class: 'vxe-modal--body'
      }, [
        leftSlot
          ? h('div', {
            class: 'vxe-modal--body-left'
          }, getSlotVNs(leftSlot({ $modal: $xeModal })))
          : createCommentVNode(),
        h('div', {
          class: 'vxe-modal--body-default'
        }, contVNs),
        rightSlot
          ? h('div', {
            class: 'vxe-modal--body-right'
          }, getSlotVNs(rightSlot({ $modal: $xeModal })))
          : createCommentVNode(),
        isMsg
          ? createCommentVNode()
          : h(VxeLoadingComponent, {
            class: 'vxe-modal--loading',
            modelValue: props.loading
          })
      ])
    }

    const renderDefaultFooter = () => {
      const { slots: propSlots = {}, showCancelButton, showConfirmButton, type } = props
      const lfSlot = slots.leftfoot || propSlots.leftfoot
      const rfSlot = slots.rightfoot || propSlots.rightfoot
      const btnVNs = []
      if (XEUtils.isBoolean(showCancelButton) ? showCancelButton : type === 'confirm') {
        btnVNs.push(
          h(VxeButtonComponent, {
            key: 1,
            ref: refCancelBtn,
            content: props.cancelButtonText || getI18n('vxe.button.cancel'),
            onClick: cancelEvent
          })
        )
      }
      if (XEUtils.isBoolean(showConfirmButton) ? showConfirmButton : (type === 'confirm' || type === 'alert')) {
        btnVNs.push(
          h(VxeButtonComponent, {
            key: 2,
            ref: refConfirmBtn,
            status: 'primary',
            content: props.confirmButtonText || getI18n('vxe.button.confirm'),
            onClick: confirmEvent
          })
        )
      }
      return h('div', {
        class: 'vxe-modal--footer-wrapper'
      }, [
        h('div', {
          class: 'vxe-modal--footer-left'
        }, lfSlot ? getSlotVNs(lfSlot({ $modal: $xeModal })) : []),
        h('div', {
          class: 'vxe-modal--footer-right'
        }, rfSlot ? getSlotVNs(rfSlot({ $modal: $xeModal })) : btnVNs)
      ])
    }

    const renderFooter = () => {
      const { slots: propSlots = {} } = props
      const footerSlot = slots.footer || propSlots.footer
      if (props.showFooter) {
        return h('div', {
          class: 'vxe-modal--footer'
        }, footerSlot ? getSlotVNs(footerSlot({ $modal: $xeModal })) : [renderDefaultFooter()])
      }
      return createCommentVNode()
    }

    const renderVN = () => {
      const { slots: propSlots = {}, className, type, animat, draggable, iconStatus, position, loading, destroyOnClose, status, lockScroll, padding, lockView, mask, resize } = props
      const { initialized, revertLocat, modalTop, contentVisible, visible, zoomStatus } = reactData
      const asideSlot = slots.aside || propSlots.aside
      const vSize = computeSize.value
      const isMsg = computeIsMsg.value
      const ons: Record<string, any> = {}
      if (isMsg) {
        ons.onMouseover = selfMouseoverEvent
        ons.onMouseout = selfMouseoutEvent
      }
      return h(Teleport, {
        to: 'body',
        disabled: props.transfer ? !initialized : true
      }, [
        h('div', {
          ref: refElem,
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
            'is--maximize': revertLocat,
            'is--visible': contentVisible,
            'is--active': visible,
            'is--loading': loading
          }],
          style: {
            zIndex: reactData.modalZindex,
            top: modalTop ? `${modalTop}px` : null
          },
          onClick: selfClickEvent,
          ...ons
        }, [
          h('div', {
            ref: refModalBox,
            class: 'vxe-modal--box',
            onMousedown: boxMousedownEvent
          }, [
            isMsg || asideSlot
              ? h('div', {
                class: 'vxe-modal--aside'
              },
              asideSlot
                ? getSlotVNs(asideSlot({ $modal: $xeModal }))
                : [
                    status || iconStatus
                      ? h('div', {
                        class: 'vxe-modal--status-wrapper'
                      }, [
                        h('i', {
                          class: ['vxe-modal--status-icon', iconStatus || getIcon()[`MODAL_${status}`.toLocaleUpperCase() as 'MODAL_SUCCESS' | 'MODAL_ERROR']]
                        })
                      ])
                      : createCommentVNode()
                  ]
              )
              : createCommentVNode(),
            h('div', {
              class: 'vxe-modal--container'
            }, !reactData.initialized || (destroyOnClose && !reactData.visible)
              ? []
              : [
                  renderHeader(),
                  renderBody(),
                  renderFooter(),
                  !isMsg && resize
                    ? h('span', {
                      class: 'vxe-modal--resize'
                    }, ['wl', 'wr', 'swst', 'sest', 'st', 'swlb', 'selb', 'sb'].map(type => {
                      return h('span', {
                        class: `${type}-resize`,
                        type: type,
                        onMousedown: dragEvent
                      })
                    }))
                    : createCommentVNode()
                ])
          ])
        ])
      ])
    }

    $xeModal.renderVN = renderVN

    watch(() => props.width, recalculate)
    watch(() => props.height, recalculate)

    watch(() => props.modelValue, (value) => {
      if (value) {
        openModal()
      } else {
        closeModal('model')
      }
    })

    onMounted(() => {
      nextTick(() => {
        if (props.storage && !props.id) {
          errLog('vxe.error.reqProp', ['modal.id'])
        }
        if (props.modelValue) {
          openModal()
        }
        recalculate()
      })
      if (props.escClosable) {
        globalEvents.on($xeModal, 'keydown', handleGlobalKeydownEvent)
      }
    })

    onUnmounted(() => {
      globalEvents.off($xeModal, 'keydown')
      removeMsgQueue()
    })

    return $xeModal
  },
  render () {
    return this.renderVN()
  }
})
