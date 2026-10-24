import { ReactFlowProvider } from '@xyflow/react'
import { ReactNode } from 'react'

import '@xyflow/react/dist/style.css'

interface ElkDiagramProviderProps {
  children: ReactNode
}

const ElkDiagramProvider = ({ children }: ElkDiagramProviderProps) => {
  return (
    <div className="w-full h-screen ">
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </div>
  )
}

export default ElkDiagramProvider
