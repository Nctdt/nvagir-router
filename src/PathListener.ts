type ListenerPathMap = Record<string, VoidFunction[]>

/** listeners manager class */
export class PathListener {
  /** all listener array */
  listenerPathMap: ListenerPathMap = {
    '*': [],
  }

  /**
   * monitor path change
   * @param path monitor path, * as all path
   * @param fn when path change equiv path, will call
   */
  subscribe(path: string, fn: VoidFunction) {
    this.listenerPathMap[path] ??= []
    this.listenerPathMap[path].push(fn)
    return () =>
      (this.listenerPathMap[path] = this.listenerPathMap[path].filter(
        l => l !== fn,
      ))
  }
  /**
   * Call the function corresponding to the path
   * @param path emit path
   */
  emit(path: string) {
    this.listenerPathMap['*'].forEach(l => l())
    this.listenerPathMap[path] ??= []
    this.listenerPathMap[path].forEach(l => l())
  }
}
