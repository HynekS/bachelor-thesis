import { useState, useCallback } from 'react'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Node } from '@db/schema/node'
import { Edge } from '@db/schema/edge'

interface DiagramProps {
  initialNodes: Node[]
  initialEdges: Edge[]
}

const mapEdge = (edge: Edge) => ({
  id: `${edge.id}`,
  source: `${edge.from}`,
  target: `${edge.to}`
})
const mapNode = (node: Node) => ({
  id: `${node.id}`,
  data: {
    label: node.title
  },
  position: {
    x: 0,
    y: 0
  }
})

const Diagram = ({ initialNodes, initialEdges }: DiagramProps) => {
  const [nodes, setNodes] = useState(() => initialNodes.map(mapNode))
  const [edges, setEdges] = useState(() => initialEdges.map(mapEdge))

  const onNodesChange = useCallback(
    (changes) => setNodes((prevNodes) => applyNodeChanges(changes, prevNodes)),
    []
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((prevEdges) => applyEdgeChanges(changes, prevEdges)),
    []
  )
  const onConnect = useCallback((params) => setEdges((prevEdges) => addEdge(params, prevEdges)), [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  )
}

export default Diagram
