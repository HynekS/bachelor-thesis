import {
  ReactFlow,
  useReactFlow,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge
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
      fitView()
    }
    handler()
  }, [nodes, edges])

  return <ReactFlow defaultNodes={nodes} defaultEdges={edges} nodes={nodes} edges={edges} />
}

export default ElkDiagramAlt
