class Mitt {
  map: Map<string, any>
  constructor () {
    this.map = new Map()
  }

  emit (name: string, params?: any) {
    const item = this.map.get(name)
    if (item) item.slice().forEach((fn: (_params: any) => any) => fn(params))
  }

  on (name: string, fn: (params?: any) => any) {
    const item = this.map.get(name)
    if (item && item.length) item.push(fn)
    else this.map.set(name, [fn])
  }

  off (name: string, fn: (params?: any) => any) {
    const item: ((args?: any) => any)[] = this.map.get(name)
    if (item) {
      const index = item.slice().findIndex((f) => f === fn)
      if (index > -1) item.splice(index, 1)
      else this.map.set(name, [])
    }
  }

  clear () {
    this.map.clear()
  }
}

export default new Mitt()
