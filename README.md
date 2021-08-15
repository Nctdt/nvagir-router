# installation
1. use `npm i nvagir-router`
2. main.ts add `import createBrowserRouter from 'nvagir-router'`
3. and `createBrowserRouter(document.getElementById('app')!, router)`
4. router type is `Record<string, () => HTMLElement>`
5. now can use `history.nvagirRouter`

# `history.nvagirRouter` api
- push(path)
- replace(path)
- redirect(from, path)
- go(delta)
- back()
- forward()

# example
```ts
// /page/App.ts
import { html, PageComponent } from 'nvagir'

const App: PageComponent = () => {
  const { el } = html`
    <div>this is App page</div>
  `
  return { el }
}

export default App

// /router.ts
import App from './pages/App'

const routerMap = {
  '/': App,
}

export default routerMap

// /main.ts
import createBrowserHistory from 'nvagir-router'
import routerMap from './router'

const app = document.querySelector<HTMLDivElement>('#app')!

createBrowserHistory(app, routerMap)
```
