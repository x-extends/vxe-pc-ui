import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'
import { assembleTabItem, destroyTabItem } from './util'

import type { VxeTabPanePropTypes, TabPaneReactData, VxeComponentSizeType, VxeTabPaneEmits, ValueOf, VxeTabPaneDefines, VxeTabsConstructor, VxeTabsPrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxeTabPane',
  props: {
    title: [String, Number] as PropType<VxeTabPanePropTypes.Title>,
    name: [String, Number] as PropType<VxeTabPanePropTypes.Name>,
    icon: String as PropType<VxeTabPanePropTypes.Icon>,
    titleWidth: [String, Number] as PropType<VxeTabPanePropTypes.TitleWidth>,
    titleAlign: [String, Number] as PropType<VxeTabPanePropTypes.TitleAlign>,
    preload: Boolean as PropType<VxeTabPanePropTypes.Preload>,
    permissionCode: [String, Number] as PropType<VxeTabPanePropTypes.PermissionCode>
  },
  inject: {
    $xeTabs: {
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: TabPaneReactData = {
    }
    const tabConfig: VxeTabPaneDefines.TabConfig = {
      id: xID,
      title: '',
      name: '',
      icon: '',
      titleWidth: '',
      titleAlign: '',
      preload: false,
      permissionCode: '',
      slots: {}
    }
    return {
      xID,
      reactData,
      tabConfig
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeTabs(): (VxeTabsConstructor & VxeTabsPrivateMethods) | null
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTabPaneEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTabPane = this
      $xeTabPane.$emit(type, createEvent(evnt, { $tabPane: $xeTabPane }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem'
      }, [])
    }
  },
  watch: {
    title (val) {
      const $xeTabPane = this
      const tabConfig = $xeTabPane.tabConfig

      tabConfig.title = val
    },
    name (val) {
      const $xeTabPane = this
      const tabConfig = $xeTabPane.tabConfig

      tabConfig.name = val
    },
    icon (val) {
      const $xeTabPane = this
      const tabConfig = $xeTabPane.tabConfig

      tabConfig.icon = val
    },
    permissionCode (val) {
      const $xeTabPane = this
      const tabConfig = $xeTabPane.tabConfig

      tabConfig.permissionCode = val
    }
  },
  created () {
    const $xeTabPane = this
    const props = $xeTabPane
    const slots = $xeTabPane.$scopedSlots
    const tabConfig = $xeTabPane.tabConfig

    Object.assign(tabConfig, {
      title: props.title,
      name: props.name,
      icon: props.icon,
      titleWidth: props.titleWidth,
      titleAlign: props.titleAlign,
      preload: props.preload,
      permissionCode: props.permissionCode,
      slots
    })
  },
  mounted () {
    const $xeTabPane = this
    const slots = $xeTabPane.$scopedSlots
    const $xeTabs = $xeTabPane.$xeTabs
    const tabConfig = $xeTabPane.tabConfig

    tabConfig.slots = slots

    const elem = $xeTabPane.$refs.refElem as HTMLDivElement
    if ($xeTabs && elem) {
      assembleTabItem($xeTabs, elem, tabConfig)
    }
  },
  beforeDestroy () {
    const $xeTabPane = this
    const tabConfig = $xeTabPane.tabConfig
    const $xeTabs = $xeTabPane.$xeTabs

    if ($xeTabs) {
      destroyTabItem($xeTabs, tabConfig)
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
