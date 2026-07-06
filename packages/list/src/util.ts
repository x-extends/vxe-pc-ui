
import type { VxeListDefines } from '../../../types'

export function getItemCacheObj (item: any): VxeListDefines.RowCacheItem {
  return {
    item,
    index: -1,
    $index: -1,
    _index: -1
  }
}
