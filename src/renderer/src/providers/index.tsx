import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { JSX, ReactNode } from 'react'
import { RouterProvider } from '@tanstack/react-router'

import router from '../router'

interface ProviderProps {
  children: ReactNode
}

const Providers = ({ children }: ProviderProps): JSX.Element => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {children}
    </QueryClientProvider>
  )
}

export default Providers
