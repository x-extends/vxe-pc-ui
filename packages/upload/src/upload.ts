import { defineComponent, ref, h, reactive, watch, computed, PropType, inject, createCommentVNode, onUnmounted, onMounted } from 'vue'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getI18n, getIcon, useSize, createEvent } from '../../ui'
import VxeButtonComponent from '../../button/src/button'
import { getSlotVNs } from '../..//ui/src/vn'
import { errLog } from '../../ui/src/log'
import { toCssUnit } from '../../ui/src/dom'
import { readLocalFile } from './util'

import type { VxeUploadDefines, VxeUploadPropTypes, UploadReactData, UploadPrivateMethods, UploadMethods, VxeUploadEmits, UploadPrivateRef, VxeUploadPrivateComputed, VxeUploadConstructor, VxeUploadPrivateMethods, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeUpload',
  props: {
    modelValue: [Array, String, Object] as PropType<VxeUploadPropTypes.ModelValue>,
    showList: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowList>,
      default: () => getConfig().upload.showList
    },
    readonly: {
      type: Boolean as PropType<VxeUploadPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeUploadPropTypes.Disabled>,
      default: null
    },
    mode: {
      type: String as PropType<VxeUploadPropTypes.Mode>,
      default: () => getConfig().upload.mode
    },
    imageTypes: {
      type: Array as PropType<VxeUploadPropTypes.ImageTypes>,
      default: () => XEUtils.clone(getConfig().upload.imageTypes, true)
    },
    imageStyle: {
      type: Object as PropType<VxeUploadPropTypes.ImageStyle>,
      default: () => XEUtils.clone(getConfig().upload.imageStyle, true)
    },
    fileTypes: {
      type: Array as PropType<VxeUploadPropTypes.FileTypes>,
      default: () => XEUtils.clone(getConfig().upload.fileTypes, true)
    },
    singleMode: Boolean as PropType<VxeUploadPropTypes.SingleMode>,
    urlMode: Boolean as PropType<VxeUploadPropTypes.UrlMode>,
    multiple: Boolean as PropType<VxeUploadPropTypes.Multiple>,
    limitSize: {
      type: [String, Number] as PropType<VxeUploadPropTypes.LimitSize>,
      default: () => getConfig().upload.limitSize
    },
    limitCount: {
      type: [String, Number] as PropType<VxeUploadPropTypes.LimitCount>,
      default: () => getConfig().upload.limitCount
    },
    nameField: {
      type: String as PropType<VxeUploadPropTypes.NameField>,
      default: () => getConfig().upload.nameField
    },
    typeField: {
      type: String as PropType<VxeUploadPropTypes.TypeField>,
      default: () => getConfig().upload.typeField
    },
    urlField: {
      type: String as PropType<VxeUploadPropTypes.UrlField>,
      default: () => getConfig().upload.urlField
    },
    sizeField: {
      type: String as PropType<VxeUploadPropTypes.SizeField>,
      default: () => getConfig().upload.sizeField
    },
    showErrorStatus: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowErrorStatus>,
      default: () => getConfig().upload.showErrorStatus
    },
    showProgress: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowProgress>,
      default: () => getConfig().upload.showProgress
    },
    autoHiddenButton: {
      type: Boolean as PropType<VxeUploadPropTypes.AutoHiddenButton>,
      default: () => getConfig().upload.autoHiddenButton
    },
    buttonText: {
      type: String as PropType<VxeUploadPropTypes.ButtonText>,
      default: () => getConfig().upload.buttonText
    },
    buttonIcon: {
      type: String as PropType<VxeUploadPropTypes.ButtonIcon>,
      default: () => getConfig().upload.buttonIcon
    },
    showButtonText: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowButtonText>,
      default: () => getConfig().upload.showButtonText
    },
    showButtonIcon: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowButtonIcon>,
      default: () => getConfig().upload.showButtonIcon
    },
    showRemoveButton: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowRemoveButton>,
      default: () => getConfig().upload.showRemoveButton
    },
    tipText: String as PropType<VxeUploadPropTypes.TipText>,
    hintText: String as PropType<VxeUploadPropTypes.HintText>,
    uploadMethod: Function as PropType<VxeUploadPropTypes.UploadMethod>,
    removeMethod: Function as PropType<VxeUploadPropTypes.RemoveMethod>,
    getUrlMethod: Function as PropType<VxeUploadPropTypes.GetUrlMethod>,
    size: { type: String as PropType<VxeUploadPropTypes.Size>, default: () => getConfig().upload.size || getConfig().size }
  },
  emits: [
    'update:modelValue',
    'add',
    'remove',
    'upload-success',
    'upload-error'
  ] as VxeUploadEmits,
  setup (props, context) {
    const { emit, slots } = context

    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<UploadReactData>({
      isDrag: false,
      fileList: []
    })

    const refMaps: UploadPrivateRef = {
      refElem
    }

    const computeFormReadonly = computed(() => {
      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.props.readonly
        }
        return false
      }
      return readonly
    })

    const computeIsDisabled = computed(() => {
      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.props.disabled
        }
        return false
      }
      return disabled
    })

    const computeIsImage = computed(() => {
      return props.mode === 'image'
    })

    const computeNameProp = computed(() => {
      return props.nameField || 'name'
    })

    const computeTypeProp = computed(() => {
      return props.typeField || 'type'
    })

    const computeUrlProp = computed(() => {
      return props.urlField || 'url'
    })

    const computeSizeProp = computed(() => {
      return props.sizeField || 'size'
    })

    const computeLimitMaxSizeB = computed(() => {
      return XEUtils.toNumber(props.limitSize) * 1024 * 1024
    })

    const computeLimitMaxCount = computed(() => {
      return props.multiple ? XEUtils.toNumber(props.limitCount) : 1
    })

    const computeOverCount = computed(() => {
      const { multiple } = props
      const { fileList } = reactData
      const limitMaxCount = computeLimitMaxCount.value
      if (multiple) {
        if (limitMaxCount) {
          return fileList.length >= limitMaxCount
        }
        return true
      }
      return fileList.length >= 1
    })

    const computeLimitSizeUnit = computed(() => {
      const limitSize = XEUtils.toNumber(props.limitSize)
      if (limitSize) {
        if (limitSize > 1048576) {
          return `${limitSize / 1048576}T`
        }
        if (limitSize > 1024) {
          return `${limitSize / 1024}G`
        }
        return `${limitSize}M`
      }
      return ''
    })

    const computedDefHintText = computed(() => {
      const { limitSize, fileTypes, multiple, limitCount } = props
      const tipText = props.tipText || props.hintText
      const isImage = computeIsImage.value
      const limitSizeUnit = computeLimitSizeUnit.value
      if (XEUtils.isString(tipText)) {
        return tipText
      }
      const defHints: string[] = []
      if (isImage) {
        if (multiple && limitCount) {
          defHints.push(getI18n('vxe.upload.imgCountHint', [limitCount]))
        }
        if (limitSize && limitSizeUnit) {
          defHints.push(getI18n('vxe.upload.imgSizeHint', [limitSizeUnit]))
        }
      } else {
        if (fileTypes && fileTypes.length) {
          defHints.push(getI18n('vxe.upload.fileTypeHint', [fileTypes.join('/')]))
        }
        if (limitSize && limitSizeUnit) {
          defHints.push(getI18n('vxe.upload.fileSizeHint', [limitSizeUnit]))
        }
        if (multiple && limitCount) {
          defHints.push(getI18n('vxe.upload.fileCountHint', [limitCount]))
        }
      }
      return defHints.join(getI18n('vxe.base.comma'))
    })

    const computeImgStyle = computed(() => {
      const { width, height } = Object.assign({}, props.imageStyle)
      const stys: Record<string, string> = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      return stys
    })

    const computeMaps: VxeUploadPrivateComputed = {
    }

    const $xeUpload = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeUploadConstructor & VxeUploadPrivateMethods

    const updateFileList = () => {
      const { modelValue, multiple } = props
      const formReadonly = computeFormReadonly.value
      const nameProp = computeNameProp.value
      const typeProp = computeTypeProp.value
      const urlProp = computeUrlProp.value
      const sizeProp = computeSizeProp.value
      const fileList = modelValue
        ? (modelValue ? (XEUtils.isArray(modelValue) ? modelValue : [modelValue]) : []).map(item => {
            if (!item || XEUtils.isString(item)) {
              const url = `${item || ''}`
              const name = parseFileName(url)
              return {
                [nameProp]: name,
                [typeProp]: parseFileType(name),
                [urlProp]: url,
                [sizeProp]: 0
              }
            }
            const name = item[nameProp] || ''
            item[nameProp] = name
            item[typeProp] = item[typeProp] || parseFileType(name)
            item[urlProp] = item[urlProp] || ''
            item[sizeProp] = item[sizeProp] || 0
            return item
          })
        : []
      reactData.fileList = (formReadonly || multiple) ? fileList : (fileList.slice(0, 1))
    }

    const parseFileName = (url: string) => {
      return decodeURIComponent(`${url || ''}`).split('/').pop() || ''
    }

    const parseFileType = (name: string) => {
      const index = name ? name.indexOf('.') : -1
      if (index > -1) {
        return name.substring(index + 1, name.length).toLowerCase()
      }
      return ''
    }

    const uploadMethods: UploadMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $upload: $xeUpload }, params))
      }
    }

    const emitModel = (value: VxeUploadDefines.FileObjItem[]) => {
      const { singleMode, urlMode } = props
      const urlProp = computeUrlProp.value
      let restList = value ? value.slice(0) : []
      if (urlMode) {
        restList = restList.map(item => item[urlProp])
      }
      emit('update:modelValue', singleMode ? (restList[0] || null) : restList)
    }

    const getFileUrl = (item: VxeUploadDefines.FileObjItem) => {
      const getUrlFn = props.getUrlMethod || getConfig().upload.getUrlMethod
      const urlProp = computeUrlProp.value
      return getUrlFn
        ? getUrlFn({
          $upload: $xeUpload,
          option: item
        })
        : item[urlProp]
    }

    const handlePreviewImageEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) => {
      const { fileList } = reactData
      if (VxeUI.previewImage) {
        VxeUI.previewImage({
          urlList: fileList.map(item => getFileUrl(item)),
          activeIndex: index
        })
      }
    }

    const handleUploadResult = (item: VxeUploadDefines.FileObjItem, file: File) => {
      const { showErrorStatus } = props
      const uploadFn = props.uploadMethod || getConfig().upload.uploadMethod
      if (uploadFn && item._X_DATA) {
        return Promise.resolve(
          uploadFn({
            $upload: $xeUpload,
            file,
            option: item,
            updateProgress (percentNum) {
              Object.assign(item._X_DATA || {}, { p: Math.max(0, Math.min(99, XEUtils.toNumber(percentNum))) })
            }
          })
        ).then(res => {
          Object.assign(item._X_DATA || {}, { l: false, p: 100 })
          Object.assign(item, res)
          uploadMethods.dispatchEvent('upload-success', { option: item, data: res }, null)
        }).catch((res) => {
          Object.assign(item._X_DATA || {}, { l: false, s: 'error' })
          if (showErrorStatus) {
            Object.assign(item, res)
          } else {
            reactData.fileList = reactData.fileList.filter(obj => obj._X_DATA !== item._X_DATA)
          }
          uploadMethods.dispatchEvent('upload-error', { option: item, data: res }, null)
        })
      }
      return Promise.resolve()
    }

    const handleReUpload = (item: VxeUploadDefines.FileObjItem) => {
      const { uploadMethod, urlMode } = props
      const uploadFn = uploadMethod || getConfig().upload.uploadMethod
      if (uploadFn && item._X_DATA) {
        const file = item._X_DATA.f
        Object.assign(item._X_DATA, {
          l: true,
          s: '',
          p: 0
        })
        handleUploadResult(item, file).then(() => {
          if (urlMode) {
            emitModel(reactData.fileList)
          }
        })
      }
    }
    const uploadFile = (files: File[], evnt: Event) => {
      const { multiple, urlMode } = props
      const { fileList } = reactData
      const uploadFn = props.uploadMethod || getConfig().upload.uploadMethod
      const nameProp = computeNameProp.value
      const typeProp = computeTypeProp.value
      const urlProp = computeUrlProp.value
      const sizeProp = computeSizeProp.value
      const limitMaxSizeB = computeLimitMaxSizeB.value
      const limitMaxCount = computeLimitMaxCount.value
      const limitSizeUnit = computeLimitSizeUnit.value
      let selectFiles = files

      if (multiple && limitMaxCount) {
        // 校验文件数量
        if (fileList.length >= limitMaxCount) {
          if (VxeUI.modal) {
            VxeUI.modal.notification({
              title: getI18n('vxe.modal.errTitle'),
              status: 'error',
              content: getI18n('vxe.upload.overCountErr', [limitMaxCount])
            })
          }
          return
        }
        const overNum = selectFiles.length - (limitMaxCount - fileList.length)
        if (overNum > 0) {
          const overExtraList = selectFiles.slice(limitMaxCount - fileList.length)
          if (VxeUI.modal) {
            VxeUI.modal.notification({
              title: getI18n('vxe.modal.errTitle'),
              status: 'error',
              slots: {
                default () {
                  return h('div', {
                    class: 'vxe-upload--file-message-over-error'
                  }, [
                    h('div', {}, getI18n('vxe.upload.overCountExtraErr', [limitMaxCount, overNum])),
                    h('div', {
                      class: 'vxe-upload--file-message-over-extra'
                    }, overExtraList.map((file, index) => {
                      return h('div', {
                        key: index,
                        class: 'vxe-upload--file-message-over-extra-item'
                      }, file.name)
                    }))
                  ])
                }
              }
            })
          }
        }
        selectFiles = selectFiles.slice(0, limitMaxCount - fileList.length)
      }

      // 校验文件大小
      if (limitMaxSizeB) {
        for (let i = 0; i < files.length; i++) {
          const file = files[0]
          if (file.size > limitMaxSizeB) {
            if (VxeUI.modal) {
              VxeUI.modal.notification({
                title: getI18n('vxe.modal.errTitle'),
                status: 'error',
                content: getI18n('vxe.upload.overSizeErr', [limitSizeUnit])
              })
            }
            return
          }
        }
      }

      const newFileList = multiple ? fileList : []
      const uploadPromiseRests: any[] = []
      selectFiles.forEach(file => {
        const { name } = file
        const fileObj: VxeUploadDefines.FileObjItem = {
          [nameProp]: name,
          [typeProp]: parseFileType(name),
          [sizeProp]: file.size,
          [urlProp]: ''
        }
        if (uploadFn) {
          fileObj._X_DATA = {
            k: XEUtils.uniqueId(),
            f: file,
            l: true,
            s: '',
            p: 0
          }
        }
        const item = reactive(fileObj)
        if (uploadFn) {
          uploadPromiseRests.push(
            handleUploadResult(item, file)
          )
        }
        newFileList.push(item)
        uploadMethods.dispatchEvent('add', { option: item }, evnt)
      })
      reactData.fileList = newFileList
      Promise.all(urlMode ? uploadPromiseRests : []).then(() => {
        emitModel(newFileList)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, newFileList)
        }
      })
    }

    const clickEvent = (evnt: MouseEvent) => {
      const { multiple, imageTypes, fileTypes } = props
      const isDisabled = computeIsDisabled.value
      const isImage = computeIsImage.value
      if (isDisabled) {
        return
      }
      readLocalFile({
        multiple,
        types: isImage ? imageTypes : fileTypes
      }).then(({ files }) => {
        uploadFile(files, evnt)
      }).catch(() => {
        // 错误文件类型
      })
    }

    const handleRemoveEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) => {
      const { fileList } = reactData
      fileList.splice(index, 1)
      emitModel(fileList)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, fileList)
      }
      uploadMethods.dispatchEvent('remove', { option: item }, evnt)
    }

    const removeFileEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) => {
      const removeFn = props.removeMethod || getConfig().upload.removeMethod
      if (removeFn) {
        Promise.resolve(
          removeFn({
            $upload: $xeUpload,
            option: item
          })
        ).then(() => {
          handleRemoveEvent(evnt, item, index)
        }).catch(e => e)
      } else {
        handleRemoveEvent(evnt, item, index)
      }
    }

    const handleDragleaveEvent = (evnt: DragEvent) => {
      const elem = refElem.value
      const { clientX, clientY } = evnt
      if (elem) {
        const { x: targetX, y: targetY, height: targetHeight, width: targetWidth } = elem.getBoundingClientRect()
        if (clientX < targetX || clientX > targetX + targetWidth || clientY < targetY || clientY > targetY + targetHeight) {
          reactData.isDrag = false
        }
      }
    }

    const handleDragoverEvent = (evnt: DragEvent) => {
      const dataTransfer = evnt.dataTransfer
      if (dataTransfer) {
        const { items } = dataTransfer
        if (items && items.length) {
          evnt.preventDefault()
          reactData.isDrag = true
        }
      }
    }

    const handleDropEvent = (evnt: DragEvent) => {
      const dataTransfer = evnt.dataTransfer
      if (dataTransfer) {
        const { items } = dataTransfer
        if (items && items.length) {
          const files: File[] = []
          Array.from(items).forEach(item => {
            const file = item.getAsFile()
            if (file) {
              files.push(file)
            }
          })
          uploadFile(files, evnt)
          evnt.preventDefault()
        }
      }
      reactData.isDrag = false
    }

    const uploadPrivateMethods: UploadPrivateMethods = {
    }

    Object.assign($xeUpload, uploadMethods, uploadPrivateMethods)

    const renderAllMode = () => {
      const { buttonText, buttonIcon, showButtonText, showButtonIcon, showRemoveButton, showProgress, showErrorStatus, autoHiddenButton } = props
      const { fileList } = reactData
      const defaultSlot = slots.default
      const tipSlot = slots.tip || slots.hint
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const nameProp = computeNameProp.value
      const typeProp = computeTypeProp.value
      const defHintText = computedDefHintText.value
      const overCount = computeOverCount.value

      return h('div', {
        key: 'all',
        class: 'vxe-upload--file-wrapper'
      }, [
        formReadonly
          ? createCommentVNode()
          : h('div', {
            class: 'vxe-upload--file-action'
          }, [
            autoHiddenButton && overCount
              ? createCommentVNode()
              : h('div', {
                class: 'vxe-upload--file-action-btn',
                onClick: clickEvent
              }, defaultSlot
                ? getSlotVNs(defaultSlot({ $upload: $xeUpload }))
                : [
                    h(VxeButtonComponent, {
                      content: showButtonText ? (buttonText ? `${buttonText}` : getI18n('vxe.upload.fileBtnText')) : '',
                      icon: showButtonIcon ? (buttonIcon || getIcon().UPLOAD_FILE_ADD) : '',
                      disabled: isDisabled
                    })
                  ]),
            defHintText || tipSlot
              ? h('div', {
                class: 'vxe-upload--file-action-tip'
              }, tipSlot ? getSlotVNs(tipSlot({ $upload: $xeUpload })) : defHintText)
              : createCommentVNode()
          ]),
        fileList.length
          ? h('div', {
            class: 'vxe-upload--file-list'
          }, fileList.map((item, index) => {
            const isLoading = item._X_DATA && item._X_DATA.l
            const isError = item._X_DATA && item._X_DATA.s === 'error'
            return h('div', {
              key: index,
              class: ['vxe-upload--file-item', {
                'is--loading': isLoading,
                'is--error': isError
              }]
            }, [
              h('div', {
                class: 'vxe-upload--file-item-icon'
              }, [
                h('i', {
                  class: getIcon()[`UPLOAD_FILE_TYPE_${`${item[typeProp]}`.toLocaleUpperCase() as 'DEFAULT'}`] || getIcon().UPLOAD_FILE_TYPE_DEFAULT
                })
              ]),
              h('div', {
                class: 'vxe-upload--file-item-name'
              }, `${item[nameProp] || ''}`),
              isLoading
                ? h('div', {
                  class: 'vxe-upload--file-item-loading-icon'
                }, [
                  h('i', {
                    class: getIcon().UPLOAD_LOADING
                  })
                ])
                : createCommentVNode(),
              showProgress && isLoading && item._X_DATA
                ? h('div', {
                  class: 'vxe-upload--file-item-loading-text'
                }, getI18n('vxe.upload.uploadProgress', [item._X_DATA.p]))
                : createCommentVNode(),
              showErrorStatus && isError
                ? h('div', {
                  class: 'vxe-upload--image-item-error'
                }, [
                  h(VxeButtonComponent, {
                    icon: getIcon().UPLOAD_IMAGE_RE_UPLOAD,
                    mode: 'text',
                    status: 'primary',
                    content: getI18n('vxe.upload.reUpload'),
                    onClick () {
                      handleReUpload(item)
                    }
                  })
                ])
                : createCommentVNode(),
              showRemoveButton && !formReadonly && !isDisabled && !isLoading
                ? h('div', {
                  class: 'vxe-upload--file-item-remove-icon',
                  onClick (evnt: MouseEvent) {
                    removeFileEvent(evnt, item, index)
                  }
                }, [
                  h('i', {
                    class: getIcon().UPLOAD_FILE_REMOVE
                  })
                ])
                : createCommentVNode()
            ])
          }))
          : createCommentVNode()
      ])
    }

    const renderImageMode = () => {
      const { buttonText, buttonIcon, showButtonText, showButtonIcon, showRemoveButton, showProgress, showErrorStatus, autoHiddenButton } = props
      const { fileList } = reactData
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const defHintText = computedDefHintText.value
      const overCount = computeOverCount.value
      const imgStyle = computeImgStyle.value
      const defaultSlot = slots.default
      const hintSlot = slots.hint

      return h('div', {
        key: 'image',
        class: 'vxe-upload--image-wrapper'
      }, [
        h('div', {
          class: 'vxe-upload--image-list'
        }, fileList.map((item, index) => {
          const isLoading = item._X_DATA && item._X_DATA.l
          const isError = item._X_DATA && item._X_DATA.s === 'error'
          return h('div', {
            key: index,
            class: ['vxe-upload--image-item', {
              'is--loading': isLoading,
              'is--error': isError
            }]
          }, [
            h('div', {
              class: 'vxe-upload--image-item-box',
              style: imgStyle,
              onClick (evnt) {
                if (!isLoading && !isError) {
                  handlePreviewImageEvent(evnt, item, index)
                }
              }
            }, [
              isLoading && item._X_DATA
                ? h('div', {
                  class: 'vxe-upload--image-item-loading'
                }, [
                  h('div', {
                    class: 'vxe-upload--image-item-loading-icon'
                  }, [
                    h('i', {
                      class: getIcon().UPLOAD_LOADING
                    })
                  ]),
                  showProgress
                    ? h('div', {
                      class: 'vxe-upload--image-item-loading-text'
                    }, getI18n('vxe.upload.uploadProgress', [item._X_DATA.p]))
                    : createCommentVNode()
                ])
                : createCommentVNode(),
              !isLoading
                ? (
                    isError && showErrorStatus
                      ? h('div', {
                        class: 'vxe-upload--image-item-error'
                      }, [
                        h(VxeButtonComponent, {
                          icon: getIcon().UPLOAD_IMAGE_RE_UPLOAD,
                          mode: 'text',
                          status: 'primary',
                          content: getI18n('vxe.upload.reUpload'),
                          onClick () {
                            handleReUpload(item)
                          }
                        })
                      ])
                      : h('img', {
                        class: 'vxe-upload--image-item-img',
                        src: getFileUrl(item)
                      })
                  )
                : createCommentVNode(),
              showRemoveButton && !formReadonly && !isDisabled && !isLoading
                ? h('div', {
                  class: 'vxe-upload--image-item-remove-icon',
                  onClick (evnt: MouseEvent) {
                    evnt.stopPropagation()
                    removeFileEvent(evnt, item, index)
                  }
                }, [
                  h('i', {
                    class: getIcon().UPLOAD_IMAGE_REMOVE
                  })
                ])
                : createCommentVNode()
            ])
          ])
        }).concat(formReadonly || (autoHiddenButton && overCount)
          ? []
          : [
              h('div', {
                class: 'vxe-upload--image-action'
              }, [
                h('div', {
                  class: 'vxe-upload--image-action-btn',
                  onClick: clickEvent
                }, defaultSlot
                  ? defaultSlot({ $upload: $xeUpload })
                  : [
                      h('div', {
                        class: 'vxe-upload--image-action-box',
                        style: imgStyle
                      }, [
                        showButtonIcon
                          ? h('div', {
                            class: 'vxe-upload--image-action-icon'
                          }, [
                            h('i', {
                              class: buttonIcon || getIcon().UPLOAD_IMAGE_ADD
                            })
                          ])
                          : createCommentVNode(),
                        showButtonText
                          ? h('div', {
                            class: 'vxe-upload--image-action-content'
                          }, buttonText ? `${buttonText}` : getI18n('vxe.upload.imgBtnText'))
                          : createCommentVNode(),
                        defHintText || hintSlot
                          ? h('div', {
                            class: 'vxe-upload--image-action-hint'
                          }, hintSlot ? getSlotVNs(hintSlot({ $upload: $xeUpload })) : defHintText)
                          : createCommentVNode()
                      ])
                    ])
              ])
            ]))
      ])
    }

    const renderVN = () => {
      const { showErrorStatus } = props
      const { isDrag } = reactData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const isImage = computeIsImage.value
      return h('div', {
        ref: refElem,
        class: ['vxe-upload', {
          [`size--${vSize}`]: vSize,
          'is--readonly': formReadonly,
          'is--disabled': isDisabled,
          'show--error': showErrorStatus,
          'is--drag': isDrag
        }],
        onDragover: handleDragoverEvent,
        onDragleave: handleDragleaveEvent,
        onDrop: handleDropEvent
      }, [
        isImage ? renderImageMode() : renderAllMode(),
        isDrag
          ? h('div', {
            class: 'vxe-upload--drag-placeholder'
          }, getI18n('vxe.upload.dragPlaceholder'))
          : createCommentVNode()
      ])
    }

    $xeUpload.renderVN = renderVN

    const listFlag = ref(0)
    watch(() => props.modelValue ? props.modelValue.length : 0, () => {
      listFlag.value++
    })
    watch(() => props.modelValue, () => {
      listFlag.value++
    })
    watch(listFlag, () => {
      updateFileList()
    })

    onMounted(() => {
      if (process.env.VUE_APP_VXE_ENV === 'development') {
        if (props.multiple && props.singleMode) {
          errLog('vxe.error.errConflicts', ['multiple', 'single-mode'])
        }
      }
    })

    onUnmounted(() => {
      reactData.isDrag = false
    })

    updateFileList()

    return $xeUpload
  },
  render () {
    return this.renderVN()
  }
})
