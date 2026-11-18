import {
  ReactFlow,
  useReactFlow,
  addEdge,
  Controls,
  useNodesState,
  useEdgesState,
  Background,
  type Node as ReactFlowNode,
  type Edge as ReactFlowEdge,
  type FinalConnectionState,
  type Connection
} from '@xyflow/react'
import getElkLayout, { ElkDirection } from './get-elk-layout'
import { useCallback, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

import { handlePositions } from './get-elk-layout'
import api from '@renderer/services/api-client'

interface ElkdiagramAltProps {
  projectId: number
  initialNodesAndEdges: {
    initialNodes: ReactFlowNode[]
    initialEdges: ReactFlowEdge[]
  }
  elkDirection?: ElkDirection
}

const ElkDiagramAlt = ({
  projectId,
  initialNodesAndEdges,
  elkDirection = 'UP'
}: ElkdiagramAltProps) => {
  const { initialNodes, initialEdges } = initialNodesAndEdges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { getNodes, getEdges, fitView, screenToFlowPosition } = useReactFlow()

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) return
      return setEdges((prevEdges) => addEdge(params, prevEdges))
    },
    [setEdges]
  )

  const onConnectEnd = useCallback(
    async (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (connectionState.isValid || !connectionState.fromNode) return

      const { fromNode, fromHandle } = connectionState
      const newNodeId = uuid()
      const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event

      const newNode = {
        id: newNodeId,
        position: screenToFlowPosition({ x: clientX, y: clientY }),
        data: { label: `Node ${newNodeId}` }
      }

      // dragged from a source handle (bottom) -> existing node is the source
      // dragged from a target handle (top)    -> existing node is the target
      const draggedFromSource = fromHandle?.type === 'source'

      await api.post('/nodes/node-from-edge', undefined, {
        project_id: projectId,
        edge: {
          ...(draggedFromSource
            ? {
                from: fromNode.id
              }
            : {
                to: fromNode.id
              })
        }
      })

      setNodes((nodes) =>
        nodes.concat({
          ...newNode,
          ...handlePositions[elkDirection],
          origin: [0.5, draggedFromSource ? 1.0 : 0.0] as [number, number]
        })
      )
      setEdges((edges) =>
        edges.concat({
          id: uuid(),
          type: 'smoothstep',
          source: draggedFromSource ? fromNode.id : newNodeId,
          target: draggedFromSource ? newNodeId : fromNode.id
        })
      )
    },
    [screenToFlowPosition, projectId, setNodes, setEdges, elkDirection]
  )

  useEffect(() => {
    const handler = async () => {
      const { nodes, edges } = await getElkLayout(getNodes(), getEdges(), elkDirection)
      setNodes(nodes)
      setEdges(edges)
      setTimeout(() => {
        fitView()
      }, 10)
    }
    handler()
  }, [initialNodesAndEdges, elkDirection])

  console.log(edges)

  return (
    <ReactFlow
      defaultNodes={nodes}
      defaultEdges={edges}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      snapToGrid
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  )
}

export default ElkDiagramAlt
