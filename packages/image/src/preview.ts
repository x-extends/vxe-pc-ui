import { defineComponent, h, provide, PropType, ref, reactive, computed, watch, onMounted, onUnmounted, createCommentVNode, onBeforeUnmount } from 'vue'
import { VxeUI, getConfig, createEvent, getIcon, globalEvents, GLOBAL_EVENT_KEYS } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { getDomNode, addClass, removeClass } from '../..//ui/src/dom'

import type { VxeImagePreviewConstructor, ImagePreviewReactData, ImagePreviewPrivateRef, VxeGlobalIcon, VxeImagePreviewEmits, VxeImagePreviewPrivateMethods, ImagePreviewPrivateMethods, ImagePreviewPrivateComputed, ImagePreviewMethods, VxeImagePreviewPropTypes } from '../../../types'

export default defineComponent({
  name: 'VxeImagePreview',
  props: {
    modelValue: Number as PropType<VxeImagePreviewPropTypes.ModelValue>,
    urlList: Array as PropType<VxeImagePreviewPropTypes.UrlList>,
    urlField: {
      type: String as PropType<VxeImagePreviewPropTypes.UrlField>,
      default: () => getConfig().imagePreview.urlField
    },
    maskClosable: {
      type: Boolean as PropType<VxeImagePreviewPropTypes.MaskClosable>,
      default: () => getConfig().imagePreview.maskClosable
    },
    escClosable: {
      type: Boolean as PropType<VxeImagePreviewPropTypes.EscClosable>,
      default: () => getConfig().imagePreview.escClosable
    },
    marginSize: {
      type: String as PropType<VxeImagePreviewPropTypes.MarginSize>,
      default: () => getConfig().imagePreview.marginSize
    }
  },
  emits: [
    'update:modelValue',
    'change',
    'close'
  ] as VxeImagePreviewEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()
    const refElem = ref<HTMLDivElement>()

    const refMaps: ImagePreviewPrivateRef = {
      refElem
    }

    const reactData = reactive<ImagePreviewReactData>({
      activeIndex: props.modelValue || 0,
      offsetPct11: false,
      offsetScale: 0,
      offsetRotate: 0,
      offsetLeft: 0,
      offsetTop: 0
    })

    const computeUrlProp = computed(() => {
      return props.urlField || 'url'
    })

    const computeMarginSize = computed(() => {
      return XEUtils.toNumber(props.marginSize || 0) || 16
    })

    const computeImgList = computed(() => {
      const { urlList } = props
      const urlProp = computeUrlProp.value
      if (urlList && urlList.length) {
        return urlList.map(item => {
          if (XEUtils.isString(item)) {
            return item
          }
          if (item[urlProp]) {
            return item[urlProp]
          }
          return ''
        })
      }
      return []
    })

    const computeImgTransform = computed(() => {
      let { offsetScale, offsetRotate, offsetLeft, offsetTop } = reactData
      const stys: string[] = []
      let targetScale = 1
      if (offsetScale) {
        targetScale = 1 + offsetScale
        stys.push(`scale(${targetScale})`)
      }
      if (offsetRotate) {
        stys.push(`rotate(${offsetRotate}deg)`)
      }
      if (offsetLeft || offsetTop) {
        // 缩放与位移
        offsetLeft /= targetScale
        offsetTop /= targetScale

        let targetOffsetLeft = offsetLeft
        let targetOffsetTop = offsetTop
        if (offsetRotate) {
          // 转向与位移
          switch (offsetRotate % 360) {
            case 90:
            case -270:
              targetOffsetLeft = offsetTop
              targetOffsetTop = -offsetLeft
              break
            case 180:
            case -180:
              targetOffsetLeft = -offsetLeft
              targetOffsetTop = -offsetTop
              break
            case 270:
            case -90:
              targetOffsetLeft = -offsetTop
              targetOffsetTop = offsetLeft
              break
          }
        }
        stys.push(`translate(${targetOffsetLeft}px, ${targetOffsetTop}px)`)
      }
      return stys.length ? stys.join(' ') : ''
    })

    const computeMaps: ImagePreviewPrivateComputed = {
      computeImgList
    }

    const $xeImagePreview = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeImagePreviewConstructor & VxeImagePreviewPrivateMethods

    const imagePreviewMethods: ImagePreviewMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $imagePreview: $xeImagePreview }, params))
      }
    }

    const emitModel = (value: VxeImagePreviewPropTypes.ModelValue) => {
      reactData.activeIndex = value
      emit('update:modelValue', value)
    }

    const handleCloseEvent = (evnt: MouseEvent) => {
      imagePreviewMethods.dispatchEvent('close', {}, evnt)
    }

    const imagePreviewPrivateMethods: ImagePreviewPrivateMethods = {
    }

    const resetStyle = () => {
      const elem = refElem.value
      removeClass(elem, 'is--move')
      Object.assign(reactData, {
        offsetPct11: false,
        offsetScale: 0,
        offsetRotate: 0,
        offsetLeft: 0,
        offsetTop: 0
      })
    }

    const handleZoom = (isAdd: boolean) => {
      const { offsetScale } = reactData
      let stepNum = 0.02
      if (offsetScale >= -0.6) {
        stepNum = 0.04
        if (offsetScale >= -0.4) {
          stepNum = 0.07
          if (offsetScale >= 0) {
            stepNum = 0.1
            if (offsetScale >= 3) {
              stepNum = 0.2
              if (offsetScale >= 8) {
                stepNum = 0.3
                if (offsetScale >= 18) {
                  stepNum = 0.4
                  if (offsetScale >= 38) {
                    stepNum = 0.5
                  }
                }
              }
            }
          }
        }
      }
      if (isAdd) {
        reactData.offsetScale = Number(Math.min(50, offsetScale + stepNum).toFixed(2))
      } else {
        reactData.offsetScale = Number(Math.max(-0.9, offsetScale - stepNum).toFixed(2))
      }
    }

    const handleChange = (isNext: boolean) => {
      let activeIndex = reactData.activeIndex || 0
      const imgList = computeImgList.value
      if (isNext) {
        if (activeIndex >= imgList.length - 1) {
          activeIndex = 0
        } else {
          activeIndex++
        }
      } else {
        if (activeIndex <= 0) {
          activeIndex = imgList.length - 1
        } else {
          activeIndex--
        }
      }
      resetStyle()
      reactData.activeIndex = activeIndex
      emitModel(activeIndex)
    }

    const handleRotateImg = (isRight: boolean) => {
      let offsetRotate = reactData.offsetRotate
      if (isRight) {
        offsetRotate += 90
      } else {
        offsetRotate -= 90
      }
      reactData.offsetRotate = offsetRotate
    }

    const handlePct11 = () => {
      resetStyle()
      reactData.offsetPct11 = true
    }

    const handlePrintImg = () => {
      const { activeIndex } = reactData
      const imgList = computeImgList.value
      const imgUrl = imgList[activeIndex || 0]
      if (VxeUI.print) {
        VxeUI.print({
          customStyle: '@page {size: auto;margin: 0mm;}html,body{height:100%;}body{display: flex;flex-direction: row;align-items: center;justify-content: center;}',
          content: `<img src="${imgUrl}" style="display: block;max-width:90%;max-height:90%;">`
        })
      }
    }

    const handleOperationBtn = (code: string) => {
      const { activeIndex } = reactData
      const imgList = computeImgList.value
      const imgUrl = imgList[activeIndex || 0]
      if (imgUrl) {
        switch (code) {
          case 'zoomOut':
            handleZoom(false)
            break
          case 'zoomIn':
            handleZoom(true)
            break
          case 'pctFull':
            resetStyle()
            break
          case 'pct11':
            handlePct11()
            break
          case 'rotateLeft':
            handleRotateImg(false)
            break
          case 'rotateRight':
            handleRotateImg(true)
            break
          case 'print':
            handlePrintImg()
            break
        }
      }
    }

    const wheelEvent = (evnt: WheelEvent) => {
      const delta = evnt.deltaY
      if (delta > 0) {
        handleZoom(false)
      } else if (delta < 0) {
        handleZoom(true)
      }
    }

    const moveEvent = (evnt: MouseEvent) => {
      const { offsetTop, offsetLeft } = reactData
      const elem = refElem.value
      evnt.preventDefault()
      const domMousemove = document.onmousemove
      const domMouseup = document.onmouseup
      const startX = evnt.pageX
      const startY = evnt.pageY
      const marginSize = computeMarginSize.value
      document.onmousemove = et => {
        const { pageX, pageY } = et
        const { visibleHeight, visibleWidth } = getDomNode()
        et.preventDefault()
        addClass(elem, 'is--move')
        // 限制边界值
        if (pageX > marginSize && pageY > marginSize && pageX < (visibleWidth - marginSize) && pageY < (visibleHeight - marginSize)) {
          reactData.offsetLeft = offsetLeft + pageX - startX
          reactData.offsetTop = offsetTop + pageY - startY
        }
      }
      document.onmouseup = () => {
        document.onmousemove = domMousemove
        document.onmouseup = domMouseup
        removeClass(elem, 'is--move')
      }
    }

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const hasCtrlKey = evnt.ctrlKey
      const hasShiftKey = evnt.shiftKey
      const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
      const isDownArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
      const isLeftArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_LEFT)
      const isRightArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_RIGHT)
      const isR = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.R)
      const isP = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.P)
      if (isUpArrow) {
        evnt.preventDefault()
        if (hasShiftKey) {
          reactData.offsetTop -= 1
        } else {
          handleZoom(true)
        }
      } else if (isDownArrow) {
        evnt.preventDefault()
        if (hasShiftKey) {
          reactData.offsetTop += 1
        } else {
          handleZoom(false)
        }
      } else if (isLeftArrow) {
        evnt.preventDefault()
        if (hasShiftKey) {
          reactData.offsetLeft -= 1
        } else {
          handleChange(false)
        }
      } else if (isRightArrow) {
        evnt.preventDefault()
        if (hasShiftKey) {
          reactData.offsetLeft += 1
        } else {
          handleChange(true)
        }
      } else if (isR && hasCtrlKey) {
        evnt.preventDefault()
        if (hasShiftKey) {
          handleRotateImg(false)
        } else {
          handleRotateImg(true)
        }
      } else if (isP && hasCtrlKey) {
        evnt.preventDefault()
        handlePrintImg()
      }
    }

    const handleClickMaskEvent = (evnt: MouseEvent) => {
      if (props.maskClosable) {
        if (evnt.target === evnt.currentTarget) {
          imagePreviewMethods.dispatchEvent('close', {}, evnt)
        }
      }
    }

    Object.assign($xeImagePreview, imagePreviewMethods, imagePreviewPrivateMethods)

    const renderImgWrapper = () => {
      const { activeIndex } = reactData
      const imgList = computeImgList.value
      const imgTransform = computeImgTransform.value
      return h('div', {
        class: 'vxe-image-preview--img-list',
        onClick: handleClickMaskEvent
      }, imgList.map((url, index) => {
        const isActive = activeIndex === index
        return h('img', {
          class: ['vxe-image-preview--img-item', {
            'is--active': isActive
          }],
          src: url,
          style: isActive
            ? {
                transform: imgTransform
              }
            : null,
          onMousedown (evnt) {
            moveEvent(evnt)
          }
        })
      }))
    }

    const renderOperationBtn = (code: string, icon: keyof VxeGlobalIcon) => {
      return h('div', {
        class: 'vxe-image-preview--operation-btn',
        onClick () {
          handleOperationBtn(code)
        }
      }, [
        h('i', {
          class: getIcon()[icon]
        })
      ])
    }

    const renderBtnWrapper = () => {
      const { activeIndex } = reactData
      const imgList = computeImgList.value

      return h('div', {
        class: 'vxe-image-preview--btn-wrapper'
      }, [
        h('div', {
          class: 'vxe-image-preview--close-wrapper'
        }, [
          h('div', {
            class: 'vxe-image-preview--close-btn',
            onClick: handleCloseEvent
          }, [
            h('i', {
              class: getIcon().IMAGE_PREVIEW_CLOSE
            })
          ]),
          h('div', {
            class: 'vxe-image-preview--close-bg'
          })
        ]),
        imgList.length > 1
          ? h('div', {
            class: 'vxe-image-preview--previous-btn',
            onClick () {
              handleChange(false)
            }
          }, [
            h('i', {
              class: getIcon().IMAGE_PREVIEW_PREVIOUS
            })
          ])
          : createCommentVNode(),
        imgList.length > 1
          ? h('div', {
            class: 'vxe-image-preview--next-btn',
            onClick () {
              handleChange(true)
            }
          }, [
            h('i', {
              class: getIcon().IMAGE_PREVIEW_NEXT
            })
          ])
          : createCommentVNode(),
        h('div', {
          class: 'vxe-image-preview--operation-wrapper'
        }, [
          h('div', {
            class: 'vxe-image-preview--operation-active-count'
          }, `${(activeIndex || 0) + 1}/${imgList.length}`),
          renderOperationBtn('zoomOut', 'IMAGE_PREVIEW_ZOOM_OUT'),
          renderOperationBtn('zoomIn', 'IMAGE_PREVIEW_ZOOM_IN'),
          renderOperationBtn('pctFull', 'IMAGE_PREVIEW_PCT_FULL'),
          renderOperationBtn('pct11', 'IMAGE_PREVIEW_PCT_1_1'),
          renderOperationBtn('rotateLeft', 'IMAGE_PREVIEW_ROTATE_LEFT'),
          renderOperationBtn('rotateRight', 'IMAGE_PREVIEW_ROTATE_RIGHT'),
          renderOperationBtn('print', 'IMAGE_PREVIEW_PRINT')
        ])
      ])
    }

    const renderVN = () => {
      const { offsetPct11 } = reactData
      return h('div', {
        ref: refElem,
        class: ['vxe-image-preview', {
          'is--pct11': offsetPct11
        }],
        onWheel: wheelEvent
      }, [
        renderImgWrapper(),
        renderBtnWrapper()
      ])
    }

    $xeImagePreview.renderVN = renderVN

    watch(() => props.modelValue, val => {
      reactData.activeIndex = val
      resetStyle()
    })

    onMounted(() => {
      globalEvents.on($xeImagePreview, 'keydown', handleGlobalKeydownEvent)
    })

    onBeforeUnmount(() => {
      const elem = refElem.value
      removeClass(elem, 'is--move')
    })

    onUnmounted(() => {
      globalEvents.off($xeImagePreview, 'keydown')
    })

    provide('$xeImagePreview', $xeImagePreview)

    return renderVN
  }
})
