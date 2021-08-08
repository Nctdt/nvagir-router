type Methods = ReturnType<typeof createBrowserHistory>

function bindPopEvent(fn: (ev: WindowEventMap['popstate']) => void) {
  window.addEventListener('popstate', ev => {
    fn(ev)
  })
}
function bindRender(methods: Methods, render: () => void) {
  for (let methodName in methods) {
    const propertyDescriptor = Reflect.getOwnPropertyDescriptor(
      methods,
      methodName,
    )!
    const oldMethod = propertyDescriptor.value!
    console.log(propertyDescriptor)
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

function createBrowserHistory<T extends Record<string, () => HTMLElement>>(
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
    if (to) {
      allMethod.replace(to)
      return
    }
    root.innerHTML = ''
    if (!router[pathname]) {
      return
    }

    const component = router[pathname]()
    root.append(component)
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

export default createBrowserHistory
