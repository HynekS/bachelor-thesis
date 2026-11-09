import { ReactFlowProvider } from '@xyflow/react'
import { ReactNode } from 'react'

import '@xyflow/react/dist/style.css'

interface ElkDiagramProviderProps {
  children: ReactNode
}

const ElkDiagramProvider = ({ children }: ElkDiagramProviderProps) => {
  return (
    <div className="flex w-full h-screen">
      <div className="flex-1">
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </div>
    </div>
  )
}

export default ElkDiagramProvider
