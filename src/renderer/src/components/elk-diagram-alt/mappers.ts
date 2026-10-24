import { Edge } from '@db/schema/edge'
import { Node } from '@db/schema/node'

const mapEdge = (edge: Edge) => ({
  id: `${edge.id}`,
  source: `${edge.from}`,
  target: `${edge.to}`,
  type: 'smoothstep'
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

export { mapNode, mapEdge }
