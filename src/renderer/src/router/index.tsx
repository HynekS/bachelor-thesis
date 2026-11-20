import CreateProjectForm from '@renderer/components/project/create-form'
import ProjectDetail from '@renderer/pages/project-detail'
import ProjectList from '@renderer/pages/project-list'
import { createMemoryHistory } from '@tanstack/react-router'

import { Outlet, createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TopNavigation from '@renderer/components/top-navigation'
import ProjectDiagram from '@renderer/pages/project-diagram'
import ProjectInfo from '@renderer/pages/project-info'
import Navigation from '@renderer/components/project/navigation'
import ProjectAddNodeForm from '@renderer/pages/project-add-node-form'
import RootLayout from '@renderer/components/layouts/root-layout'

const rootRoute = createRootRoute({
  component: () => (
    <RootLayout>
      <TopNavigation />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </RootLayout>
  )
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <ProjectList />
})

const projectDetail = createRoute({
  getParentRoute: () => rootRoute,
  path: 'projects/$projectId',
  component: () => (
    <ProjectDetail>
      <Navigation />
      <Outlet />
    </ProjectDetail>
  )
})

const projectDetailDiagram = createRoute({
  getParentRoute: () => projectDetail,
  path: '/diagram',
  component: () => <ProjectDiagram />
})

const projectDetailInfo = createRoute({
  getParentRoute: () => projectDetail,
  path: '/info',
  component: () => <ProjectInfo />
})

const projectDetailAddNodeForm = createRoute({
  getParentRoute: () => projectDetail,
  path: '/add-node',
  component: () => <ProjectAddNodeForm />
})

const createProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'projects/create-project',
  component: () => <CreateProjectForm />
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  projectDetail,
  projectDetailDiagram,
  projectDetailInfo,
  projectDetailAddNodeForm,
  createProjectRoute
])

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
