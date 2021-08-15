import { PageComponent } from 'nvagir'

import { PathListener } from './PathListener'

/** path subscribe */
export const pathListener = new PathListener()

type Methods = ReturnType<typeof createBrowserHistory>

/** bind window popstate event */
function bindPopEvent(fn: (ev: WindowEventMap['popstate']) => void) {
  window.addEventListener('popstate', ev => {
    fn(ev)
  })
}

/** bind methods when call, after call render */
function bindRender(methods: Methods, render: () => void) {
  for (let methodName in methods) {
    const propertyDescriptor = Reflect.getOwnPropertyDescriptor(
      methods,
      methodName,
    )!
    const oldMethod = propertyDescriptor.value!
    Reflect.set(methods, methodName, (...args: any) => {
      oldMethod(...args)
      render()
    })
  }
}

declare global {
  interface History {
    nvagirRouter: Methods
  }
}

/**
 * create router and inject History of nvagirRouter prop
 * @param root DOM element render place
 * @param router path map component
 */
export function createBrowserHistory<T extends Record<string, PageComponent>>(
  root: HTMLElement,
  router: T,
) {
  type Path = keyof T & string
  type PathMethod = {
    (path: Path): void
    (path: `${Path}${any}`): void
  }
  type RedirectPathMethod = {
    (from: string, path: Path): void
    (from: string, path: `${Path}${any}`): void
  }

  const replaceMap: Record<string, string> = {}

  const render = (): void => {
    const { pathname } = location
    const to = replaceMap[pathname]
    pathListener.emit(pathname)
    if (to) {
      allMethod.replace(to)
      return
    }
    root.innerHTML = ''
    if (!router[pathname]) {
      return
    }

    const component = router[pathname]()
    root.append(component.el.dom)
  }

  const push: PathMethod = path => {
    history.pushState(null, '', path)
  }
  const replace: PathMethod = path => {
    history.replaceState(null, '', path)
  }
  const redirect: RedirectPathMethod = (from, path) => {
    replaceMap[from] = path
  }

  const { back, go, forward } = history

  const allMethod = {
    push,
    replace,
    redirect,
    back,
    go,
    forward,
  }

  bindRender(allMethod, render)
  bindPopEvent(render)

  render()
  history.nvagirRouter = allMethod

  return allMethod
}

export default { createBrowserHistory, pathListener }
