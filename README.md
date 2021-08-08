### use `nvagir-router`
1. use `npm i nvagir-router`
2. main.ts add `import createBrowserRouter from 'nvagir-router'`
3. and `createBrowserRouter(document.getElementById('app')!, router)`
4. router type is `Record<string, () => HTMLElement>`
5. now can use `history.nvagirRouter`

### `history.nvagirRouter` methods
- push(path)
- replace(path)
- redirect(from, path)
- go(delta)
- back()
- forward()

