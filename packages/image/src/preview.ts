import { defineComponent, h, provide, PropType, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { VxeUI, createEvent, getIcon, globalEvents, GLOBAL_EVENT_KEYS } from '@vxe-ui/core'
import XEUtils from 'xe-utils'

import type { VxeImagePreviewConstructor, ImagePreviewReactData, VxeGlobalIcon, VxeImagePreviewEmits, VxeImagePreviewPrivateMethods, ImagePreviewPrivateMethods, ImagePreviewPrivateComputed, ImagePreviewMethods, VxeImagePreviewPropTypes } from '../../../types'

export default defineComponent({
  name: 'VxeImagePreview',
  props: {
    modelValue: Number as PropType<VxeImagePreviewPropTypes.ModelValue>,
    url: String as PropType<VxeImagePreviewPropTypes.Url>,
    urlList: Array as PropType<VxeImagePreviewPropTypes.UrlList>
  },
  emits: [
    'update:modelValue',
    'change',
    'close'
  ] as VxeImagePreviewEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const reactData = reactive<ImagePreviewReactData>({
      activeIndex: props.modelValue,
      offsetPct11: false,
      offsetScale: 0,
      offsetRotate: 0,
      offsetLeft: 0,
      offsetTop: 0
    })

    const computeImgList = computed(() => {
      const { url, urlList } = props
      let list: string[] = []
      if (urlList && urlList.length) {
        list = urlList
      } else if (url) {
        list = [url]
      }
      return list
    })

    const computeImgTransform = computed(() => {
      const { offsetScale, offsetRotate } = reactData
      const stys: string[] = []
      if (offsetScale) {
        stys.push(`scale(${1 + offsetScale})`)
      }
      if (offsetRotate) {
        stys.push(`rotate(${offsetRotate}deg)`)
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
      reactData.offsetPct11 = false
      reactData.offsetScale = 0
      reactData.offsetRotate = 0
      reactData.offsetTop = 0
      reactData.offsetLeft = 0
    }

    const handleZoom = (isAdd: boolean) => {
      const { offsetScale } = reactData
      if (isAdd) {
        reactData.offsetScale = Number(Math.min(10, offsetScale + 0.1).toFixed(2))
      } else {
        reactData.offsetScale = Number(Math.max(-0.6, offsetScale - 0.1).toFixed(2))
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

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const isLeftArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_LEFT)
      const isRightArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_RIGHT)
      if (isLeftArrow) {
        handleChange(false)
      } else if (isRightArrow) {
        handleChange(true)
      }
    }

    Object.assign($xeImagePreview, imagePreviewMethods, imagePreviewPrivateMethods)

    const renderImgWrapper = () => {
      const { activeIndex } = reactData
      const imgList = computeImgList.value
      const imgTransform = computeImgTransform.value
      return h('div', {
        class: 'vxe-image-preview--img-list'
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
            : null
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
        h('div', {
          class: 'vxe-image-preview--previous-btn',
          onClick () {
            handleChange(false)
          }
        }, [
          h('i', {
            class: getIcon().IMAGE_PREVIEW_PREVIOUS
          })
        ]),
        h('div', {
          class: 'vxe-image-preview--next-btn',
          onClick () {
            handleChange(true)
          }
        }, [
          h('i', {
            class: getIcon().IMAGE_PREVIEW_NEXT
          })
        ]),
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
        class: ['vxe-image-preview', {
          'is--pct11': offsetPct11
        }]
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

    onUnmounted(() => {
      globalEvents.off($xeImagePreview, 'keydown')
    })

    provide('$xeImagePreview', $xeImagePreview)

    return renderVN
  }
})
