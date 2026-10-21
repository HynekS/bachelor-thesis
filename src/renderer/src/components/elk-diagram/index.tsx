import ELK from 'elkjs/lib/elk.bundled.js'
import { useCallback } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node as ReactFlowNode,
  type Edge as ReactFlowEdge
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Edge } from '@db/schema/edge'
import { Node } from '@db/schema/node.js'

interface ElkDiagramProps {
  initialNodes: Node[]
  initialEdges: Edge[]
}

interface LayoutFlowProps {
  initialNodes: ReactFlowNode[]
  initialEdges: ReactFlowEdge[]
}

const elk = new ELK()

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

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow()
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80
  }

  const getLayoutedElements = useCallback((options) => {
    const layoutOptions = { ...defaultOptions, ...options }
    const graph = {
      id: 'root',
      layoutOptions,
      children: getNodes().map((node) => ({
        ...node,
        width: node.measured?.width,
        height: node.measured?.height
      })),
      edges: getEdges()
    }

    elk.layout(graph).then(({ children }) => {
      children.forEach((node) => {
        node.position = { x: node.x, y: node.y }
      })

      setNodes(children)
      fitView()
    })
  }, [])

  return { getLayoutedElements }
}

const LayoutFlow = ({ initialNodes, initialEdges }: LayoutFlowProps) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const { getLayoutedElements } = useLayoutedElements()

  return (
    <div style={{ height: 800 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="system"
      />
    </div>
  )
}

const ElkDiagram = ({ initialNodes, initialEdges }: ElkDiagramProps) => {
  return (
    <ReactFlowProvider>
      <LayoutFlow
        initialNodes={initialNodes.map((n) => mapNode(n))}
        initialEdges={initialEdges.map((e) => mapEdge(e))}
      />
    </ReactFlowProvider>
  )
}

export default ElkDiagram
