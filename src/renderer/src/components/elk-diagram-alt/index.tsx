import {
  ReactFlow,
  useReactFlow,
  type Node as ReactFlowNode,
  type Edge as ReactFlowEdge,
  addEdge,
  Controls,
  useNodesState,
  useEdgesState,
  Background,
  type ConnectionState,
  Position,
  Handle
} from '@xyflow/react'
import getElkLayout from './get-elk-layout'
import { useCallback, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

interface ElkdiagramAltProps {
  initialNodesAndEdges: {
    initialNodes: ReactFlowNode[]
    initialEdges: ReactFlowEdge[]
  }
}

// const nodeOrigin: [number, number] = [0.5, 0]

const ElkDiagramAlt = ({ initialNodesAndEdges }: ElkdiagramAltProps) => {
  const { initialNodes, initialEdges } = initialNodesAndEdges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { getNodes, getEdges, fitView, screenToFlowPosition } = useReactFlow()

  useEffect(() => {
    console.log(edges)
  }, [edges])

  const onConnect = useCallback(
    (params) => {
      console.log(params)
      return setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  /*
  const onConnectEnd = useCallback(
    (event, connectionState: ConnectionState) => {
      console.log(event, connectionState)
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid && connectionState.fromNode) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const newNodeId = uuid()
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event
        const sourceHandlePosition = connectionState.fromHandle?.position || Position.Top
        const isTopHandle = sourceHandlePosition === Position.Top

        const sourceNode = connectionState.fromNode
        const newNode = {
          id: newNodeId,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY
          }),
          data: { label: `Node ${newNodeId}` }
          //origin: [0.5, 0.5]
        }

        setNodes((nodes) => nodes.concat(newNode))
        setEdges((edges) =>
          edges.concat({
            id: uuid(),
            source: isTopHandle ? sourceNode.id : newNodeId,
            target: isTopHandle ? newNodeId : sourceNode.id,
            targetHandle: isTopHandle ? Position.Bottom : Position.Top,
            sourceHandle: isTopHandle ? Position.Top : Position.Bottom,
            type: 'smoothstep'
          })
        )
      }
    },
    [screenToFlowPosition, setEdges, setNodes]
  )*/

  const onConnectEnd = (event, connectionState) => {
    // Check if the connection was dropped on the pane (empty space) rather than another node
    if (!connectionState.toNode) {
      const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event

      // Get project/flow coordinates from screen coordinates
      const position = screenToFlowPosition({
        x: clientX,
        y: clientY
      })

      const newNodeId = uuid()
      const newNode = {
        id: newNodeId,
        position,
        data: { label: `Node ${newNodeId}` },
        type: 'customNode'
      }

      const originatingNodeId = connectionState.fromNode.id
      const originatingHandleId = connectionState.fromHandleId // 'top' or 'bottom'

      let newEdge

      if (originatingHandleId === 'top') {
        // User dragged UP from the top handle -> New node is placed ABOVE
        // Edge goes: New Node (Bottom) ---> Existing Node (Top)
        newEdge = {
          id: `e_${newNodeId}-${originatingNodeId}`,
          source: newNodeId,
          sourceHandle: 'bottom',
          target: originatingNodeId,
          targetHandle: 'top'
        }
      } else {
        // User dragged DOWN from the bottom handle -> New node is placed BELOW
        // Edge goes: Existing Node (Bottom) ---> New Node (Top)
        newEdge = {
          id: `e_${originatingNodeId}-${newNodeId}`,
          source: originatingNodeId,
          sourceHandle: 'bottom',
          target: newNodeId,
          targetHandle: 'top'
        }
      }

      setNodes((nds) => nds.concat(newNode))
      setEdges((eds) => eds.concat(newEdge))
    }
  }

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
  }, [])

  function CustomNode({ data }) {
    return (
      <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
        {/* Top Handle (Incoming) */}
        <Handle type="target" position={Position.Top} id="top" />

        <div>{data.label}</div>

        {/* Bottom Handle (Outgoing) */}
        <Handle type="source" position={Position.Bottom} id="bottom" />
      </div>
    )
  }

  const nodeTypes = {
    customNode: CustomNode
  }

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
      // nodeOrigin={nodeOrigin}
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      <Background />
    </ReactFlow>
  )
}

export default ElkDiagramAlt
