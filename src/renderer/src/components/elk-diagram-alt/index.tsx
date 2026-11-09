import {
  ReactFlow,
  useReactFlow,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge,
  Controls
} from '@xyflow/react'
import getElkLayout from './get-elk-layout'
import { useEffect } from 'react'

interface ElkdiagramAltProps {
  initialNodesAndEdges: {
    initialNodes: ReactFlowNode[]
    initialEdges: ReactFlowEdge[]
  }
}

const ElkDiagramAlt = ({ initialNodesAndEdges }: ElkdiagramAltProps) => {
  const { initialNodes: nodes, initialEdges: edges } = initialNodesAndEdges
  const { setNodes, setEdges, getNodes, getEdges, fitView } = useReactFlow()

  useEffect(() => {
    const handler = async () => {
      const { nodes, edges } = await getElkLayout(getNodes(), getEdges(), 'UP')
      setNodes(nodes)
      setEdges(edges)
      setTimeout(() => {
        fitView()
      }, 10)
    }
    handler()
  }, [nodes, edges, fitView, getNodes, getEdges, setNodes, setEdges])

  return (
    <ReactFlow defaultNodes={nodes} defaultEdges={edges} nodes={nodes} edges={edges} fitView>
      <Controls />
    </ReactFlow>
  )
}

export default ElkDiagramAlt
