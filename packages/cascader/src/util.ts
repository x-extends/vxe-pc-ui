import XEUtils from 'xe-utils'

export function enNodeValue (nodeid: string | number | null) {
  return XEUtils.eqNull(nodeid) ? '' : encodeURIComponent(`${nodeid}`)
}

export function deNodeValue (nodeid: string | number | null) {
  return nodeid ? decodeURIComponent(`${nodeid}`) : nodeid
}
