import CreateProjectForm from '@renderer/components/project/create-form'
import { createMemoryHistory } from '@tanstack/react-router'

import { Outlet, Link, createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/create-project" className="[&.active]:font-bold">
          Create new project
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  }
})

const createProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-project',
  component: () => <CreateProjectForm />
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return <div className="p-2">Hello from About!</div>
  }
})

const routeTree = rootRoute.addChildren([indexRoute, createProjectRoute, aboutRoute])

const memoryHistory = createMemoryHistory({
  initialEntries: ['/']
})

const router = createRouter({ routeTree, history: memoryHistory })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default router
