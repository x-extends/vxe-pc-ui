import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, createEvent, getIcon, globalEvents, GLOBAL_EVENT_KEYS, getI18n, renderEmptyElement } from '../../ui'
import { getDomNode, addClass, removeClass, hasControlKey } from '../../ui/src/dom'

import type { ImagePreviewReactData, VxeGlobalIcon, VxeImagePreviewEmits, VxeComponentSizeType, VxeImagePreviewPropTypes, ValueOf, VxeImagePreviewDefines } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeImagePreview',
  props: {
    value: Number as PropType<VxeImagePreviewPropTypes.ModelValue>,
    urlList: Array as PropType<VxeImagePreviewPropTypes.UrlList>,
    urlField: {
      type: String as PropType<VxeImagePreviewPropTypes.UrlField>,
      default: () => getConfig().imagePreview.urlField
    },
    maskClosable: {
      type: Boolean as PropType<VxeImagePreviewPropTypes.MaskClosable>,
      default: () => getConfig().imagePreview.maskClosable
    },
    marginSize: {
      type: String as PropType<VxeImagePreviewPropTypes.MarginSize>,
      default: () => getConfig().imagePreview.marginSize
    },
    showPrintButton: {
      type: Boolean as PropType<VxeImagePreviewPropTypes.ShowPrintButton>,
      default: () => getConfig().imagePreview.showPrintButton
    },
    showDownloadButton: {
      type: Boolean as PropType<VxeImagePreviewPropTypes.ShowDownloadButton>,
      default: () => getConfig().imagePreview.showDownloadButton
    },
    zIndex: Number as PropType<VxeImagePreviewPropTypes.ZIndex>,
    toolbarConfig: Object as PropType<VxeImagePreviewPropTypes.ToolbarConfig>,
    beforeDownloadMethod: Function as PropType<VxeImagePreviewPropTypes.BeforeDownloadMethod>,
    downloadMethod: Function as PropType<VxeImagePreviewPropTypes.DownloadMethod>
  },
  provide () {
    const $xeImagePreview = this
    return {
      $xeImagePreview
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: ImagePreviewReactData = {
      activeIndex: 0,
      offsetPct11: false,
      offsetScale: 0,
      offsetRotate: 0,
      offsetLeft: 0,
      offsetTop: 0
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeUrlProp () {
      const $xeImagePreview = this
      const props = $xeImagePreview

      return props.urlField || 'url'
    },
    computeMarginSize () {
      const $xeImagePreview = this
      const props = $xeImagePreview

      return XEUtils.toNumber(props.marginSize || 0) || 16
    },
    computeToolbarOpts () {
      const $xeImagePreview = this
      const props = $xeImagePreview

      return Object.assign({}, getConfig().imagePreview.toolbarConfig, props.toolbarConfig)
    },
    computeRotateText () {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData as ImagePreviewReactData

      const { offsetRotate } = reactData
      if (offsetRotate) {
        return `${offsetRotate}°`
      }
      return '0°'
    },
    computeScaleText () {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData as ImagePreviewReactData

      const { offsetScale } = reactData
      if (offsetScale) {
        return `${XEUtils.ceil((1 + offsetScale) * 100)}%`
      }
      return '100%'
    },
    computeImgList () {
      const $xeImagePreview = this
      const props = $xeImagePreview

      const { urlList } = props
      const urlProp = $xeImagePreview.computeUrlProp as string
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
    },
    computeImgTransform () {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

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
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeImagePreviewEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeImagePreview = this
      $xeImagePreview.$emit(type, createEvent(evnt, { $imagePreview: $xeImagePreview }, params))
    },
    emitModel  (value: VxeImagePreviewPropTypes.ModelValue) {
      const $xeImagePreview = this

      const { _events } = $xeImagePreview as any
      $xeImagePreview.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeImagePreview.$emit('modelValue', value)
      } else {
        $xeImagePreview.$emit('model-value', value)
      }
    },
    handleCloseEvent  (evnt: MouseEvent) {
      const $xeImagePreview = this

      $xeImagePreview.dispatchEvent('close', {}, evnt)
    },
    resetStyle  () {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const elem = $xeImagePreview.$refs.refElem as HTMLDivElement
      removeClass(elem, 'is--move')
      Object.assign(reactData, {
        offsetPct11: false,
        offsetScale: 0,
        offsetRotate: 0,
        offsetLeft: 0,
        offsetTop: 0
      })
    },
    getOffsetZoomStep  () {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const { offsetScale } = reactData
      let stepNum = 0.02
      if (offsetScale >= -0.6) {
        stepNum = 0.04
        if (offsetScale >= -0.4) {
          stepNum = 0.07
          if (offsetScale >= 0) {
            stepNum = 0.1
            if (offsetScale >= 3) {
              stepNum = 0.25
              if (offsetScale >= 8) {
                stepNum = 0.4
                if (offsetScale >= 16) {
                  stepNum = 0.6
                  if (offsetScale >= 24) {
                    stepNum = 0.9
                    if (offsetScale >= 32) {
                      stepNum = 1.3
                      if (offsetScale >= 39) {
                        stepNum = 1.9
                        if (offsetScale >= 45) {
                          stepNum = 2.5
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return stepNum
    },
    handleZoom  (isAdd: boolean) {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const { offsetScale } = reactData
      const stepNum = $xeImagePreview.getOffsetZoomStep()
      if (isAdd) {
        reactData.offsetScale = Number(Math.min(49, offsetScale + stepNum).toFixed(2))
      } else {
        reactData.offsetScale = Number(Math.max(-0.9, offsetScale - stepNum).toFixed(2))
      }
    },
    handleChangeEvent (evnt: Event, isNext: boolean) {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      let activeIndex = reactData.activeIndex || 0
      const imgList = $xeImagePreview.computeImgList
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
      const imgUrl = imgList[activeIndex || 0]
      reactData.activeIndex = activeIndex
      $xeImagePreview.resetStyle()
      $xeImagePreview.emitModel(activeIndex)
      $xeImagePreview.dispatchEvent('change', { url: imgUrl, activeIndex }, evnt)
    },
    handleRotateImgEvent (evnt: Event, isRight: boolean) {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const imgList = $xeImagePreview.computeImgList
      const { activeIndex } = reactData
      const imgUrl = imgList[activeIndex || 0]
      let offsetRotate = reactData.offsetRotate
      if (isRight) {
        offsetRotate += 90
      } else {
        offsetRotate -= 90
      }
      reactData.offsetRotate = offsetRotate
      $xeImagePreview.dispatchEvent('rotate', { url: imgUrl, rotateValue: offsetRotate }, evnt)
    },
    handlePct11  () {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      $xeImagePreview.resetStyle()
      reactData.offsetPct11 = true
    },
    handlePrintImg () {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const { activeIndex } = reactData
      const imgList = $xeImagePreview.computeImgList
      const imgUrl = imgList[activeIndex || 0]
      if (VxeUI.print) {
        VxeUI.print({
          align: 'center',
          pageBreaks: [
            {
              bodyHtml: `<img src="${imgUrl}" style="max-width:100%;max-height:100%;">`
            }
          ]
        })
      }
    },
    handleDownloadEvent  (evnt: MouseEvent, imgUrl: string) {
      const $xeImagePreview = this

      $xeImagePreview.dispatchEvent('download', { url: imgUrl }, evnt)
    },
    handleDefaultDownload  (evnt: MouseEvent, imgUrl: string) {
      const $xeImagePreview = this

      if (VxeUI.saveFile) {
        fetch(imgUrl).then(res => {
          return res.blob().then(blob => {
            VxeUI.saveFile({
              filename: imgUrl,
              content: blob
            })
            $xeImagePreview.handleDownloadEvent(evnt, imgUrl)
          })
        }).catch(() => {
          if (VxeUI.modal) {
            VxeUI.modal.message({
              content: getI18n('vxe.error.downErr'),
              status: 'error'
            })
          }
        })
      }
    },
    handleDownloadImg (evnt: MouseEvent) {
      const $xeImagePreview = this
      const props = $xeImagePreview
      const reactData = $xeImagePreview.reactData

      const { activeIndex } = reactData
      const toolbarOpts = $xeImagePreview.computeToolbarOpts
      const btnConf = toolbarOpts.download
      const btnOpts = XEUtils.isBoolean(btnConf) ? {} : (btnConf ? Object.assign({}, btnConf) : {})
      const imgList = $xeImagePreview.computeImgList
      const imgUrl = imgList[activeIndex || 0]
      const beforeDownloadFn = props.beforeDownloadMethod || btnOpts.beforeDownloadMethod || getConfig().imagePreview.beforeDownloadMethod
      const downloadFn = props.downloadMethod || btnOpts.downloadMethod || getConfig().imagePreview.downloadMethod
      Promise.resolve(
        beforeDownloadFn
          ? beforeDownloadFn({
            $imagePreview: $xeImagePreview,
            url: imgUrl,
            index: activeIndex || 0
          })
          : true
      ).then(status => {
        if (status) {
          if (downloadFn) {
            Promise.resolve(
              downloadFn({
                $imagePreview: $xeImagePreview,
                url: imgUrl,
                index: activeIndex || 0
              })
            ).then(() => {
              $xeImagePreview.handleDownloadEvent(evnt, imgUrl)
            }).catch(e => e)
          } else {
            $xeImagePreview.handleDefaultDownload(evnt, imgUrl)
          }
        }
      })
    },
    handleOperationBtn  (evnt: MouseEvent, code: VxeImagePreviewDefines.ToolbarCode) {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const { activeIndex } = reactData
      const imgList = $xeImagePreview.computeImgList
      const imgUrl = imgList[activeIndex || 0]
      if (imgUrl) {
        switch (code) {
          case 'zoomOut':
            $xeImagePreview.handleZoom(false)
            break
          case 'zoomIn':
            $xeImagePreview.handleZoom(true)
            break
          case 'pctFull':
            $xeImagePreview.resetStyle()
            break
          case 'pct11':
            $xeImagePreview.handlePct11()
            break
          case 'rotateLeft':
            $xeImagePreview.handleRotateImgEvent(evnt, false)
            break
          case 'rotateRight':
            $xeImagePreview.handleRotateImgEvent(evnt, true)
            break
          case 'print':
            $xeImagePreview.handlePrintImg()
            break
          case 'download':
            $xeImagePreview.handleDownloadImg(evnt)
            break
        }
      }
    },
    wheelEvent  (evnt: WheelEvent) {
      const $xeImagePreview = this

      const delta = evnt.deltaY
      if (delta > 0) {
        evnt.preventDefault()
        $xeImagePreview.handleZoom(false)
      } else if (delta < 0) {
        evnt.preventDefault()
        $xeImagePreview.handleZoom(true)
      }
    },
    moveEvent  (evnt: MouseEvent) {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const { offsetTop, offsetLeft } = reactData
      const elem = $xeImagePreview.$refs.refElem as HTMLDivElement
      evnt.preventDefault()
      const domMousemove = document.onmousemove
      const domMouseup = document.onmouseup
      const startX = evnt.pageX
      const startY = evnt.pageY
      const marginSize = $xeImagePreview.computeMarginSize
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
    },
    handleGlobalKeydownEvent (evnt: KeyboardEvent) {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const isControlKey = hasControlKey(evnt)
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
          $xeImagePreview.handleZoom(true)
        }
      } else if (isDownArrow) {
        evnt.preventDefault()
        if (hasShiftKey) {
          reactData.offsetTop += 1
        } else {
          $xeImagePreview.handleZoom(false)
        }
      } else if (isLeftArrow) {
        evnt.preventDefault()
        if (hasShiftKey) {
          reactData.offsetLeft -= 1
        } else {
          $xeImagePreview.handleChangeEvent(evnt, false)
        }
      } else if (isRightArrow) {
        evnt.preventDefault()
        if (hasShiftKey) {
          reactData.offsetLeft += 1
        } else {
          $xeImagePreview.handleChangeEvent(evnt, true)
        }
      } else if (isR && isControlKey) {
        evnt.preventDefault()
        if (hasShiftKey) {
          $xeImagePreview.handleRotateImgEvent(evnt, false)
        } else {
          $xeImagePreview.handleRotateImgEvent(evnt, true)
        }
      } else if (isP && isControlKey) {
        evnt.preventDefault()
        $xeImagePreview.handlePrintImg()
      }
    },
    handleClickMaskEvent (evnt: MouseEvent) {
      const $xeImagePreview = this
      const props = $xeImagePreview

      if (props.maskClosable) {
        if (evnt.target === evnt.currentTarget) {
          $xeImagePreview.dispatchEvent('close', {}, evnt)
        }
      }
    },

    //
    // Render
    //
    renderImgWrapper  (h: CreateElement) {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const { activeIndex } = reactData
      const imgList = $xeImagePreview.computeImgList
      const imgTransform = $xeImagePreview.computeImgTransform
      return h('div', {
        class: 'vxe-image-preview--img-list',
        on: {
          click: $xeImagePreview.handleClickMaskEvent
        }
      }, imgList.map((url, index) => {
        const isActive = activeIndex === index
        return h('img', {
          class: ['vxe-image-preview--img-item', {
            'is--active': isActive
          }],
          style: isActive
            ? {
                transform: imgTransform
              }
            : {},
          attrs: {
            src: url
          },
          on: {
            mousedown (evnt: MouseEvent) {
              $xeImagePreview.moveEvent(evnt)
            }
          }
        })
      }))
    },
    renderOperationBtn  (h: CreateElement, code: VxeImagePreviewDefines.ToolbarCode, icon: keyof VxeGlobalIcon) {
      const $xeImagePreview = this

      const toolbarOpts = $xeImagePreview.computeToolbarOpts
      const btnConf = toolbarOpts[code]
      const btnOpts = XEUtils.isBoolean(btnConf) ? {} : (btnConf ? Object.assign({}, btnConf) : {})
      const showBtn = btnConf !== false
      return showBtn
        ? h('div', {
          class: 'vxe-image-preview--operation-btn',
          attrs: {
            title: getI18n(`vxe.imagePreview.operBtn.${code}`)
          },
          on: {
            click (evnt: MouseEvent) {
              $xeImagePreview.handleOperationBtn(evnt, code)
            }
          }
        }, [
          h('i', {
            class: btnOpts.icon || getIcon()[icon]
          })
        ])
        : renderEmptyElement($xeImagePreview)
    },
    renderBtnWrapper  (h: CreateElement) {
      const $xeImagePreview = this
      const props = $xeImagePreview
      const reactData = $xeImagePreview.reactData

      const { showPrintButton, showDownloadButton } = props
      const { activeIndex } = reactData
      const imgList = $xeImagePreview.computeImgList
      const rotateText = $xeImagePreview.computeRotateText
      const scaleText = $xeImagePreview.computeScaleText
      const toolbarOpts = $xeImagePreview.computeToolbarOpts

      return h('div', {
        class: 'vxe-image-preview--btn-wrapper'
      }, [
        h('div', {
          class: 'vxe-image-preview--close-wrapper'
        }, [
          h('div', {
            class: 'vxe-image-preview--close-btn',
            on: {
              click: $xeImagePreview.handleCloseEvent
            }
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
            on: {
              click (evnt: KeyboardEvent) {
                $xeImagePreview.handleChangeEvent(evnt, false)
              }
            }
          }, [
            h('i', {
              class: getIcon().IMAGE_PREVIEW_PREVIOUS
            })
          ])
          : renderEmptyElement($xeImagePreview),
        imgList.length > 1
          ? h('div', {
            class: 'vxe-image-preview--next-btn',
            on: {
              click (evnt: KeyboardEvent) {
                $xeImagePreview.handleChangeEvent(evnt, true)
              }
            }
          }, [
            h('i', {
              class: getIcon().IMAGE_PREVIEW_NEXT
            })
          ])
          : renderEmptyElement($xeImagePreview),
        h('div', {
          class: 'vxe-image-preview--operation-info'
        }, [
          h('div', {
            class: 'vxe-image-preview--operation-deg'
          }, rotateText),
          h('div', {
            class: 'vxe-image-preview--operation-pct'
          }, scaleText)
        ]),
        h('div', {
          class: 'vxe-image-preview--operation-wrapper'
        }, [
          h('div', {
            class: 'vxe-image-preview--operation-active-count'
          }, [
            h('span', {
              class: 'vxe-image-preview--operation-active-current'
            }, `${(activeIndex || 0) + 1}`),
            h('span', {
              class: 'vxe-image-preview--operation-active-total'
            }, `/${imgList.length}`)
          ]),
          $xeImagePreview.renderOperationBtn(h, 'zoomOut', 'IMAGE_PREVIEW_ZOOM_OUT'),
          $xeImagePreview.renderOperationBtn(h, 'zoomIn', 'IMAGE_PREVIEW_ZOOM_IN'),
          $xeImagePreview.renderOperationBtn(h, 'pctFull', 'IMAGE_PREVIEW_PCT_FULL'),
          $xeImagePreview.renderOperationBtn(h, 'pct11', 'IMAGE_PREVIEW_PCT_1_1'),
          $xeImagePreview.renderOperationBtn(h, 'rotateLeft', 'IMAGE_PREVIEW_ROTATE_LEFT'),
          $xeImagePreview.renderOperationBtn(h, 'rotateRight', 'IMAGE_PREVIEW_ROTATE_RIGHT'),
          showPrintButton || toolbarOpts.print ? $xeImagePreview.renderOperationBtn(h, 'print', 'IMAGE_PREVIEW_PRINT') : renderEmptyElement($xeImagePreview),
          showDownloadButton || toolbarOpts.download ? $xeImagePreview.renderOperationBtn(h, 'download', 'IMAGE_PREVIEW_DOWNLOAD') : renderEmptyElement($xeImagePreview)
        ])
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      const { offsetPct11 } = reactData
      return h('div', {
        ref: 'refElem',
        class: ['vxe-image-preview', {
          'is--pct11': offsetPct11
        }]
      }, [
        $xeImagePreview.renderImgWrapper(h),
        $xeImagePreview.renderBtnWrapper(h)
      ])
    }
  },
  watch: {
    value (val) {
      const $xeImagePreview = this
      const reactData = $xeImagePreview.reactData

      reactData.activeIndex = val
      $xeImagePreview.resetStyle()
    }
  },
  created () {
    const $xeImagePreview = this
    const props = $xeImagePreview
    const reactData = $xeImagePreview.reactData

    reactData.activeIndex = props.value || 0
  },
  mounted () {
    const $xeImagePreview = this

    const elem = $xeImagePreview.$refs.refElem as HTMLDivElement
    if (elem) {
      elem.addEventListener('wheel', $xeImagePreview.wheelEvent, { passive: false })
    }
    globalEvents.on($xeImagePreview, 'keydown', $xeImagePreview.handleGlobalKeydownEvent)
  },
  beforeDestroy () {
    const $xeImagePreview = this

    const elem = $xeImagePreview.$refs.refElem as HTMLDivElement
    if (elem) {
      elem.removeEventListener('wheel', $xeImagePreview.wheelEvent)
      removeClass(elem, 'is--move')
    }
    globalEvents.off($xeImagePreview, 'keydown')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
