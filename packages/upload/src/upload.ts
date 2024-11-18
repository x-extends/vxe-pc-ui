import { defineComponent, ref, h, reactive, watch, computed, PropType, inject, createCommentVNode, onUnmounted, onMounted } from 'vue'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getI18n, getIcon, useSize, createEvent, globalEvents } from '../../ui'
import { getSlotVNs } from '../..//ui/src/vn'
import { errLog } from '../../ui/src/log'
import { getEventTargetNode, toCssUnit } from '../../ui/src/dom'
import { readLocalFile } from './util'
import VxeButtonComponent from '../../button/src/button'

import type { VxeUploadDefines, VxeUploadPropTypes, UploadReactData, UploadInternalData, UploadPrivateMethods, UploadMethods, VxeUploadEmits, UploadPrivateRef, VxeUploadPrivateComputed, VxeUploadConstructor, VxeUploadPrivateMethods, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, ValueOf } from '../../../types'

export default defineComponent({
  name: 'VxeUpload',
  props: {
    modelValue: [Array, String, Object] as PropType<VxeUploadPropTypes.ModelValue>,
    showList: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowList>,
      default: () => getConfig().upload.showList
    },
    moreConfig: Object as PropType<VxeUploadPropTypes.MoreConfig>,
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
    dragToUpload: {
      type: Boolean as PropType<VxeUploadPropTypes.DragToUpload>,
      default: () => XEUtils.clone(getConfig().upload.dragToUpload, true)
    },
    pasteToUpload: {
      type: Boolean as PropType<VxeUploadPropTypes.PasteToUpload>,
      default: () => XEUtils.clone(getConfig().upload.pasteToUpload, true)
    },
    keyField: String as PropType<VxeUploadPropTypes.KeyField>,
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
    progressText: {
      type: String as PropType<VxeUploadPropTypes.ProgressText>,
      default: () => getConfig().upload.progressText
    },
    autoHiddenButton: {
      type: Boolean as PropType<VxeUploadPropTypes.AutoHiddenButton>,
      default: () => getConfig().upload.autoHiddenButton
    },
    showUploadButton: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowUploadButton>,
      default: () => getConfig().upload.showUploadButton
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
    showDownloadButton: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowDownloadButton>,
      default: () => getConfig().upload.showDownloadButton
    },
    showPreview: {
      type: Boolean as PropType<VxeUploadPropTypes.ShowPreview>,
      default: () => getConfig().upload.showPreview
    },
    tipText: String as PropType<VxeUploadPropTypes.TipText>,
    hintText: String as PropType<VxeUploadPropTypes.HintText>,
    previewMethod: Function as PropType<VxeUploadPropTypes.PreviewMethod>,
    uploadMethod: Function as PropType<VxeUploadPropTypes.UploadMethod>,
    beforeRemoveMethod: Function as PropType<VxeUploadPropTypes.BeforeRemoveMethod>,
    removeMethod: Function as PropType<VxeUploadPropTypes.RemoveMethod>,
    beforeDownloadMethod: Function as PropType<VxeUploadPropTypes.BeforeDownloadMethod>,
    downloadMethod: Function as PropType<VxeUploadPropTypes.DownloadMethod>,
    getUrlMethod: Function as PropType<VxeUploadPropTypes.GetUrlMethod>,
    getThumbnailUrlMethod: Function as PropType<VxeUploadPropTypes.GetThumbnailUrlMethod>,
    size: {
      type: String as PropType<VxeUploadPropTypes.Size>,
      default: () => getConfig().upload.size || getConfig().size
    }
  },
  emits: [
    'update:modelValue',
    'add',
    'remove',
    'remove-fail',
    'download',
    'download-fail',
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
      showMorePopup: false,
      isActivated: false,
      fileList: [],
      fileCacheMaps: {}
    })

    const internalData: UploadInternalData = {
      imagePreviewTypes: ['jpg', 'jpeg', 'png', 'gif']
    }

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

    const computeKeyField = computed(() => {
      return props.keyField || '_X_KEY'
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

    const computeImageStyleOpts = computed(() => {
      return Object.assign({}, props.imageStyle)
    })

    const computeImgStyle = computed(() => {
      const { width, height } = computeImageStyleOpts.value
      const stys: Record<string, string> = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      return stys
    })

    const computeMoreOpts = computed(() => {
      return Object.assign({ showMoreButton: true }, props.moreConfig)
    })

    const computeMaps: VxeUploadPrivateComputed = {
    }

    const $xeUpload = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeUploadConstructor & VxeUploadPrivateMethods

    const getUniqueKey = () => {
      return XEUtils.uniqueId()
    }

    const getFieldKey = (item: VxeUploadDefines.FileObjItem) => {
      const keyField = computeKeyField.value
      return item[keyField]
    }

    const updateFileList = () => {
      const { modelValue, multiple } = props
      const formReadonly = computeFormReadonly.value
      const keyField = computeKeyField.value
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
                [sizeProp]: 0,
                [keyField]: getUniqueKey()
              }
            }
            const name = item[nameProp] || ''
            item[nameProp] = name
            item[typeProp] = item[typeProp] || parseFileType(name)
            item[urlProp] = item[urlProp] || ''
            item[sizeProp] = item[sizeProp] || 0
            item[keyField] = item[keyField] || getUniqueKey()
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

    const dispatchEvent = (type: ValueOf<VxeUploadEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $upload: $xeUpload }, params))
    }

    const handleChange = (value: VxeUploadDefines.FileObjItem[]) => {
      const { singleMode, urlMode } = props
      const urlProp = computeUrlProp.value
      let restList = value ? value.slice(0) : []
      if (urlMode) {
        restList = restList.map(item => item[urlProp])
      }
      emit('update:modelValue', singleMode ? (restList[0] || null) : restList)
    }

    const getThumbnailFileUrl = (item: VxeUploadDefines.FileObjItem) => {
      const getThumbnailUrlFn = props.getThumbnailUrlMethod || getConfig().upload.getThumbnailUrlMethod
      if (getThumbnailUrlFn) {
        return getThumbnailUrlFn({
          $upload: $xeUpload,
          option: item
        })
      }
      return getFileUrl(item)
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

    const handleDefaultFilePreview = (item: VxeUploadDefines.FileObjItem) => {
      const { imageTypes, showDownloadButton } = props
      const typeProp = computeTypeProp.value
      const beforeDownloadFn = props.beforeDownloadMethod || getConfig().upload.beforeDownloadMethod
      const { imagePreviewTypes } = internalData
      // 如果是预览图片
      if (imagePreviewTypes.concat(imageTypes || []).some(type => `${type}`.toLowerCase() === `${item[typeProp]}`.toLowerCase())) {
        if (VxeUI.previewImage) {
          VxeUI.previewImage({
            urlList: [getFileUrl(item)],
            showDownloadButton,
            beforeDownloadMethod: beforeDownloadFn
              ? () => {
                  return beforeDownloadFn({
                    $upload: $xeUpload,
                    option: item
                  })
                }
              : undefined
          })
        }
      }
    }

    const handlePreviewFileEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem) => {
      const previewFn = props.previewMethod || getConfig().upload.previewMethod
      if (props.showPreview) {
        if (previewFn) {
          previewFn({
            $upload: $xeUpload,
            option: item
          })
        } else {
          handleDefaultFilePreview(item)
        }
      }
    }

    const handlePreviewImageEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) => {
      const { showDownloadButton } = props
      const { fileList } = reactData
      const beforeDownloadFn = props.beforeDownloadMethod || getConfig().upload.beforeDownloadMethod
      if (props.showPreview) {
        if (VxeUI.previewImage) {
          VxeUI.previewImage({
            urlList: fileList.map(item => getFileUrl(item)),
            activeIndex: index,
            showDownloadButton,
            beforeDownloadMethod: beforeDownloadFn
              ? ({ index }) => {
                  return beforeDownloadFn({
                    $upload: $xeUpload,
                    option: fileList[index]
                  })
                }
              : undefined
          })
        }
      }
    }

    const handleUploadResult = (item: VxeUploadDefines.FileObjItem, file: File) => {
      const { showErrorStatus } = props
      const fileKey = getFieldKey(item)
      const uploadFn = props.uploadMethod || getConfig().upload.uploadMethod
      if (uploadFn) {
        return Promise.resolve(
          uploadFn({
            $upload: $xeUpload,
            file,
            option: item,
            updateProgress (percentNum) {
              const { fileCacheMaps } = reactData
              const cacheItem = fileCacheMaps[getFieldKey(item)]
              if (cacheItem) {
                cacheItem.percent = Math.max(0, Math.min(99, XEUtils.toNumber(percentNum)))
              }
            }
          })
        ).then(res => {
          const { fileCacheMaps } = reactData
          const cacheItem = fileCacheMaps[fileKey]
          if (cacheItem) {
            cacheItem.percent = 100
          }
          Object.assign(item, res)
          dispatchEvent('upload-success', { option: item, data: res }, null)
        }).catch((res) => {
          const { fileCacheMaps } = reactData
          const cacheItem = fileCacheMaps[fileKey]
          if (cacheItem) {
            cacheItem.status = 'error'
          }
          if (showErrorStatus) {
            Object.assign(item, res)
          } else {
            reactData.fileList = reactData.fileList.filter(obj => getFieldKey(obj) !== fileKey)
          }
          dispatchEvent('upload-error', { option: item, data: res }, null)
        }).finally(() => {
          const { fileCacheMaps } = reactData
          const cacheItem = fileCacheMaps[fileKey]
          if (cacheItem) {
            cacheItem.loading = false
          }
        })
      } else {
        const { fileCacheMaps } = reactData
        const cacheItem = fileCacheMaps[fileKey]
        if (cacheItem) {
          cacheItem.loading = false
        }
      }
      return Promise.resolve()
    }

    const handleReUpload = (item: VxeUploadDefines.FileObjItem) => {
      const { uploadMethod, urlMode } = props
      const { fileCacheMaps } = reactData
      const fileKey = getFieldKey(item)
      const cacheItem = fileCacheMaps[fileKey]
      const uploadFn = uploadMethod || getConfig().upload.uploadMethod
      if (uploadFn && cacheItem) {
        const file = cacheItem.file
        cacheItem.loading = true
        cacheItem.status = ''
        cacheItem.percent = 0
        handleUploadResult(item, file).then(() => {
          if (urlMode) {
            handleChange(reactData.fileList)
          }
        })
      }
    }
    const uploadFile = (files: File[], evnt: Event | null) => {
      const { multiple, urlMode } = props
      const { fileList } = reactData
      const uploadFn = props.uploadMethod || getConfig().upload.uploadMethod
      const keyField = computeKeyField.value
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

      const cacheMaps = Object.assign({}, reactData.fileCacheMaps)
      const newFileList = multiple ? fileList : []
      const uploadPromiseRests: any[] = []
      selectFiles.forEach(file => {
        const { name } = file
        const fileKey = getUniqueKey()
        const fileObj: VxeUploadDefines.FileObjItem = {
          [nameProp]: name,
          [typeProp]: parseFileType(name),
          [sizeProp]: file.size,
          [urlProp]: '',
          [keyField]: fileKey
        }
        if (uploadFn) {
          cacheMaps[fileKey] = {
            file: file,
            loading: true,
            status: '',
            percent: 0
          }
        }
        const item = reactive(fileObj)
        if (uploadFn) {
          uploadPromiseRests.push(
            handleUploadResult(item, file)
          )
        }
        newFileList.push(item)
        dispatchEvent('add', { option: item }, evnt)
      })
      reactData.fileList = newFileList
      reactData.fileCacheMaps = cacheMaps
      Promise.all(urlMode ? uploadPromiseRests : []).then(() => {
        handleChange(newFileList)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt as any, formItemInfo.itemConfig.field, newFileList)
        }
      })
    }

    const handleChoose = (evnt: MouseEvent | null) => {
      const { multiple, imageTypes, fileTypes } = props
      const isDisabled = computeIsDisabled.value
      const isImage = computeIsImage.value
      if (isDisabled) {
        return Promise.resolve({
          status: false,
          files: [],
          file: null
        })
      }
      return readLocalFile({
        multiple,
        types: isImage ? imageTypes : fileTypes
      }).then((params) => {
        uploadFile(params.files, evnt)
        return params
      })
    }

    const clickEvent = (evnt: MouseEvent) => {
      handleChoose(evnt).catch(() => {
        // 错误文件类型
      })
    }

    const handleRemoveEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) => {
      const { fileList } = reactData
      fileList.splice(index, 1)
      handleChange(fileList)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, fileList)
      }
      dispatchEvent('remove', { option: item }, evnt)
    }

    const removeFileEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem, index: number) => {
      const beforeRemoveFn = props.beforeRemoveMethod || getConfig().upload.beforeRemoveMethod
      const removeFn = props.removeMethod || getConfig().upload.removeMethod
      Promise.resolve(
        beforeRemoveFn
          ? beforeRemoveFn({
            $upload: $xeUpload,
            option: item
          })
          : true
      ).then(status => {
        if (status) {
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
        } else {
          dispatchEvent('remove-fail', { option: item }, evnt)
        }
      })
    }

    const handleDownloadEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem) => {
      dispatchEvent('download', { option: item }, evnt)
    }

    const downloadFileEvent = (evnt: MouseEvent, item: VxeUploadDefines.FileObjItem) => {
      const beforeDownloadFn = props.beforeDownloadMethod || getConfig().upload.beforeDownloadMethod
      const downloadFn = props.downloadMethod || getConfig().upload.downloadMethod
      Promise.resolve(
        beforeDownloadFn
          ? beforeDownloadFn({
            $upload: $xeUpload,
            option: item
          })
          : true
      ).then(status => {
        if (status) {
          if (downloadFn) {
            Promise.resolve(
              downloadFn({
                $upload: $xeUpload,
                option: item
              })
            ).then(() => {
              handleDownloadEvent(evnt, item)
            }).catch(e => e)
          } else {
            handleDownloadEvent(evnt, item)
          }
        } else {
          dispatchEvent('download-fail', { option: item }, evnt)
        }
      })
    }

    const handleDragleaveEvent = (evnt: DragEvent) => {
      const targetElem = evnt.currentTarget as HTMLDivElement
      const { clientX, clientY } = evnt
      if (targetElem) {
        const { x: targetX, y: targetY, height: targetHeight, width: targetWidth } = targetElem.getBoundingClientRect()
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

    const uploadTransferFileEvent = (evnt: Event, files: File[]) => {
      const { imageTypes } = props
      const { imagePreviewTypes } = internalData
      const isImage = computeIsImage.value
      if (isImage) {
        const pasteImgTypes = imagePreviewTypes.concat(imageTypes && imageTypes.length ? imageTypes : [])
        files = files.filter(file => {
          const fileType = `${file.type.split('/')[1] || ''}`.toLowerCase()
          if (pasteImgTypes.some(type => `${type}`.toLowerCase() === fileType)) {
            return true
          }
          return false
        })
      }
      // 如果全部不满足条件
      if (!files.length) {
        if (VxeUI.modal) {
          VxeUI.modal.notification({
            title: getI18n('vxe.modal.errTitle'),
            status: 'error',
            content: getI18n('vxe.upload.uploadTypeErr')
          })
        }
        return
      }
      uploadFile(files, evnt)
    }

    const handleDropEvent = (evnt: DragEvent) => {
      const dataTransfer = evnt.dataTransfer
      if (dataTransfer) {
        const { items } = dataTransfer
        if (items && items.length) {
          evnt.preventDefault()
          const files = handleTransferFiles(items)
          if (files.length) {
            uploadTransferFileEvent(evnt, files)
          }
        }
      }
      reactData.isDrag = false
    }

    const handleTransferFiles = (items: DataTransferItemList) => {
      const files: File[] = []
      XEUtils.arrayEach(items, item => {
        const file = item.getAsFile()
        if (file) {
          files.push(file)
        }
      })
      return files
    }

    const handleMoreEvent = () => {
      const formReadonly = computeFormReadonly.value
      const isImage = computeIsImage.value

      if (VxeUI.modal) {
        VxeUI.modal.open({
          title: formReadonly ? getI18n('vxe.upload.morePopup.readTitle') : getI18n(`vxe.upload.morePopup.${isImage ? 'imageTitle' : 'fileTitle'}`),
          width: 660,
          height: 500,
          escClosable: true,
          showMaximize: true,
          resize: true,
          maskClosable: true,
          slots: {
            default () {
              const { showErrorStatus, dragToUpload } = props
              const { isDrag } = reactData
              const isDisabled = computeIsDisabled.value
              const { fileList } = reactData

              const ons: Record<string, any> = {}
              if (dragToUpload) {
                ons.onDragover = handleDragoverEvent
                ons.onDragleave = handleDragleaveEvent
                ons.onDrop = handleDropEvent
              }

              return h('div', {
                class: ['vxe-upload--more-popup', {
                  'is--readonly': formReadonly,
                  'is--disabled': isDisabled,
                  'show--error': showErrorStatus,
                  'is--drag': isDrag
                }],
                ...ons
              }, [
                isImage
                  ? h('div', {
                    class: 'vxe-upload--image-more-list'
                  }, renderImageItemList(fileList, true).concat(renderImageAction(true)))
                  : h('div', {
                    class: 'vxe-upload--file-more-list'
                  }, [
                    renderFileAction(true),
                    h('div', {
                      class: 'vxe-upload--file-list'
                    }, renderFileItemList(fileList, true))
                  ]),
                isDrag
                  ? h('div', {
                    class: 'vxe-upload--drag-placeholder'
                  }, getI18n('vxe.upload.dragPlaceholder'))
                  : createCommentVNode()
              ])
            }
          },
          onShow () {
            reactData.showMorePopup = true
          },
          onHide () {
            reactData.showMorePopup = false
          }
        })
      }
    }

    const handleGlobalPasteEvent = (evnt: ClipboardEvent) => {
      const { pasteToUpload } = props
      const { isActivated } = reactData
      if (!isActivated || !pasteToUpload) {
        return
      }
      const clipboardData: DataTransfer = evnt.clipboardData || (evnt as any).originalEvent.clipboardData
      if (!clipboardData) {
        return
      }
      const { items } = clipboardData
      if (!items) {
        return
      }
      const files = handleTransferFiles(items)
      if (files.length) {
        evnt.preventDefault()
        uploadTransferFileEvent(evnt, files)
      }
    }

    const handleGlobalMousedownEvent = (evnt: MouseEvent) => {
      const el = refElem.value
      const isActivated = getEventTargetNode(evnt, el).flag
      reactData.isActivated = isActivated
    }

    const handleGlobalBlurEvent = () => {
      reactData.isActivated = false
    }

    const uploadMethods: UploadMethods = {
      dispatchEvent,
      choose () {
        return handleChoose(null)
      }
    }

    const uploadPrivateMethods: UploadPrivateMethods = {
    }

    Object.assign($xeUpload, uploadMethods, uploadPrivateMethods)

    const renderFileItemList = (currList: VxeUploadDefines.FileObjItem[], isMoreView: boolean) => {
      const { showRemoveButton, showDownloadButton, showProgress, progressText, showPreview, showErrorStatus } = props
      const { fileCacheMaps } = reactData
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const nameProp = computeNameProp.value
      const typeProp = computeTypeProp.value
      const cornerSlot = slots.corner

      return currList.map((item, index) => {
        const fileKey = getFieldKey(item)
        const cacheItem = fileCacheMaps[fileKey]
        const isLoading = cacheItem && cacheItem.loading
        const isError = cacheItem && cacheItem.status === 'error'
        return h('div', {
          key: index,
          class: ['vxe-upload--file-item', {
            'is--preview': showPreview,
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
            class: 'vxe-upload--file-item-name',
            onClick (evnt) {
              if (!isLoading && !isError) {
                handlePreviewFileEvent(evnt, item)
              }
            }
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
          showProgress && isLoading && cacheItem
            ? h('div', {
              class: 'vxe-upload--file-item-loading-text'
            }, progressText ? XEUtils.toFormatString(progressText, { percent: cacheItem.percent }) : getI18n('vxe.upload.uploadProgress', [cacheItem.percent]))
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
          h('div', {
            class: 'vxe-upload--file-item-btn-wrapper'
          }, [
            cornerSlot
              ? h('div', {
                class: 'vxe-upload--file-item-corner'
              }, getSlotVNs(cornerSlot({ option: item, isMoreView, readonly: formReadonly })))
              : createCommentVNode(),
            showDownloadButton && !isLoading
              ? h('div', {
                class: 'vxe-upload--file-item-download-btn',
                onClick (evnt: MouseEvent) {
                  downloadFileEvent(evnt, item)
                }
              }, [
                h('i', {
                  class: getIcon().UPLOAD_FILE_DOWNLOAD
                })
              ])
              : createCommentVNode(),
            showRemoveButton && !formReadonly && !isDisabled && !isLoading
              ? h('div', {
                class: 'vxe-upload--file-item-remove-btn',
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
        ])
      })
    }

    const renderFileAction = (isMoreView: boolean) => {
      const { showUploadButton, buttonText, buttonIcon, showButtonText, showButtonIcon, autoHiddenButton } = props
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const defHintText = computedDefHintText.value
      const overCount = computeOverCount.value
      const defaultSlot = slots.default
      const tipSlot = slots.tip || slots.hint

      if (formReadonly || !showUploadButton) {
        return createCommentVNode()
      }
      return h('div', {
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
                  class: 'vxe-upload--file-action-button',
                  content: (isMoreView || showButtonText) ? (buttonText ? `${buttonText}` : getI18n('vxe.upload.fileBtnText')) : '',
                  icon: showButtonIcon ? (buttonIcon || getIcon().UPLOAD_FILE_ADD) : '',
                  disabled: isDisabled
                })
              ]),
        isMoreView && (defHintText || tipSlot)
          ? h('div', {
            class: 'vxe-upload--file-action-tip'
          }, tipSlot ? getSlotVNs(tipSlot({ $upload: $xeUpload })) : defHintText)
          : createCommentVNode()
      ])
    }

    const renderAllMode = () => {
      const { moreConfig } = props
      const { fileList } = reactData
      const moreOpts = computeMoreOpts.value

      const { maxCount, showMoreButton, layout } = moreOpts
      const isHorizontal = layout === 'horizontal'

      let currList = fileList
      let overMaxNum = 0
      if (maxCount && fileList.length > maxCount) {
        overMaxNum = fileList.length - maxCount
        currList = fileList.slice(0, maxCount)
      }

      return h('div', {
        key: 'all',
        class: 'vxe-upload--file-wrapper'
      }, [
        showMoreButton && moreConfig && isHorizontal
          ? createCommentVNode()
          : renderFileAction(true),
        currList.length || (showMoreButton && isHorizontal)
          ? h('div', {
            class: ['vxe-upload--file-list-wrapper', {
              'is--horizontal': isHorizontal
            }]
          }, [
            currList.length
              ? h('div', {
                class: 'vxe-upload--file-list'
              }, renderFileItemList(currList, false))
              : createCommentVNode(),
            showMoreButton && overMaxNum
              ? h('div', {
                class: 'vxe-upload--file-over-more'
              }, [
                h(VxeButtonComponent, {
                  mode: 'text',
                  content: getI18n('vxe.upload.moreBtnText', [fileList.length]),
                  status: 'primary',
                  onClick: handleMoreEvent
                })
              ])
              : createCommentVNode(),
            showMoreButton && moreConfig && isHorizontal
              ? renderFileAction(false)
              : createCommentVNode()
          ])
          : createCommentVNode()
      ])
    }

    const renderImageItemList = (currList: VxeUploadDefines.FileObjItem[], isMoreView: boolean) => {
      const { showRemoveButton, showProgress, progressText, showPreview, showErrorStatus } = props
      const { fileCacheMaps } = reactData
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const imgStyle = computeImgStyle.value
      const cornerSlot = slots.corner

      return currList.map((item, index) => {
        const fileKey = getFieldKey(item)
        const cacheItem = fileCacheMaps[fileKey]
        const isLoading = cacheItem && cacheItem.loading
        const isError = cacheItem && cacheItem.status === 'error'
        return h('div', {
          key: index,
          class: ['vxe-upload--image-item', {
            'is--preview': showPreview,
            'is--loading': isLoading,
            'is--error': isError
          }]
        }, [
          h('div', {
            class: 'vxe-upload--image-item-box',
            style: isMoreView ? null : imgStyle,
            title: getI18n('vxe.upload.viewItemTitle'),
            onClick (evnt) {
              if (!isLoading && !isError) {
                handlePreviewImageEvent(evnt, item, index)
              }
            }
          }, [
            isLoading && cacheItem
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
                  }, progressText ? XEUtils.toFormatString(progressText, { percent: cacheItem.percent }) : getI18n('vxe.upload.uploadProgress', [cacheItem.percent]))
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
                      src: getThumbnailFileUrl(item)
                    })
                )
              : createCommentVNode(),
            h('div', {
              class: 'vxe-upload--image-item-btn-wrapper',
              onClick (evnt) {
                evnt.stopPropagation()
              }
            }, [
              cornerSlot
                ? h('div', {
                  class: 'vxe-upload--file-item-corner'
                }, getSlotVNs(cornerSlot({ option: item, isMoreView, readonly: formReadonly })))
                : createCommentVNode(),
              showRemoveButton && !formReadonly && !isDisabled && !isLoading
                ? h('div', {
                  class: 'vxe-upload--image-item-remove-btn',
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
        ])
      })
    }

    const renderImageAction = (isMoreView: boolean) => {
      const { showUploadButton, buttonText, buttonIcon, showButtonText, showButtonIcon, autoHiddenButton } = props
      const formReadonly = computeFormReadonly.value
      const defHintText = computedDefHintText.value
      const overCount = computeOverCount.value
      const imgStyle = computeImgStyle.value
      const defaultSlot = slots.default
      const hintSlot = slots.hint

      if (formReadonly || !showUploadButton || (autoHiddenButton && overCount)) {
        return createCommentVNode()
      }
      return h('div', {
        key: 'action',
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
                style: isMoreView ? null : imgStyle
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
                isMoreView || showButtonText
                  ? h('div', {
                    class: 'vxe-upload--image-action-content'
                  }, buttonText ? `${buttonText}` : getI18n('vxe.upload.imgBtnText'))
                  : createCommentVNode(),
                isMoreView && (defHintText || hintSlot)
                  ? h('div', {
                    class: 'vxe-upload--image-action-hint'
                  }, hintSlot ? getSlotVNs(hintSlot({ $upload: $xeUpload })) : defHintText)
                  : createCommentVNode()
              ])
            ])
      ])
    }

    const renderImageMode = () => {
      const { fileList } = reactData
      const moreOpts = computeMoreOpts.value

      const { maxCount, showMoreButton } = moreOpts
      let currList = fileList
      let overMaxNum = 0
      if (maxCount && fileList.length > maxCount) {
        overMaxNum = fileList.length - maxCount
        currList = fileList.slice(0, maxCount)
      }

      return h('div', {
        key: 'image',
        class: 'vxe-upload--image-wrapper'
      }, [
        h('div', {
          class: 'vxe-upload--image-list'
        }, renderImageItemList(currList, false).concat([
          showMoreButton && overMaxNum
            ? h('div', {
              class: 'vxe-upload--image-over-more'
            }, [
              h(VxeButtonComponent, {
                mode: 'text',
                content: getI18n('vxe.upload.moreBtnText', [fileList.length]),
                status: 'primary',
                onClick: handleMoreEvent
              })
            ])
            : createCommentVNode(),
          renderImageAction(false)
        ]))
      ])
    }

    const renderVN = () => {
      const { showErrorStatus, dragToUpload, pasteToUpload } = props
      const { isDrag, showMorePopup, isActivated } = reactData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const isImage = computeIsImage.value

      const ons: Record<string, any> = {}
      if (dragToUpload) {
        ons.onDragover = handleDragoverEvent
        ons.onDragleave = handleDragleaveEvent
        ons.onDrop = handleDropEvent
      }

      return h('div', {
        ref: refElem,
        class: ['vxe-upload', {
          [`size--${vSize}`]: vSize,
          'is--active': isActivated,
          'is--readonly': formReadonly,
          'is--disabled': isDisabled,
          'is--paste': pasteToUpload,
          'show--error': showErrorStatus,
          'is--drag': isDrag
        }],
        ...ons
      }, [
        isImage ? renderImageMode() : renderAllMode(),
        isDrag && !showMorePopup
          ? h('div', {
            class: 'vxe-upload--drag-placeholder'
          }, getI18n('vxe.upload.dragPlaceholder'))
          : createCommentVNode()
      ])
    }

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
      globalEvents.on($xeUpload, 'paste', handleGlobalPasteEvent)
      globalEvents.on($xeUpload, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeUpload, 'blur', handleGlobalBlurEvent)
    })

    onUnmounted(() => {
      reactData.isDrag = false
      globalEvents.off($xeUpload, 'paste')
      globalEvents.off($xeUpload, 'mousedown')
      globalEvents.off($xeUpload, 'blur')
    })

    updateFileList()

    $xeUpload.renderVN = renderVN

    return $xeUpload
  },
  render () {
    return this.renderVN()
  }
})
