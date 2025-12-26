import CreateProjectForm from '@renderer/components/project/create-form'
import ProjectDetail from '@renderer/pages/project-detail'
import ProjectList from '@renderer/pages/project-list'
import { createMemoryHistory } from '@tanstack/react-router'

import { Outlet, Link, createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TopNavigation from '@renderer/components/top-navigation'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <TopNavigation />
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
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
  component: () => <ProjectList />
})

const projectDetail = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$projectId',
  component: () => <ProjectDetail />
})

const createProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-project',
  component: () => <CreateProjectForm />
})

const routeTree = rootRoute.addChildren([indexRoute, projectDetail, createProjectRoute])

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
