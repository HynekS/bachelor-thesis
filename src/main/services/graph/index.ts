export interface GraphNode {
  id: string
}

export interface GraphEdge {
  from: string
  to: string
}

export class Graph {
  nodes: GraphNode[] = []
  edges: GraphEdge[] = []

  constructor(nodes: GraphNode[] = [], edges: GraphEdge[] = []) {
    this.nodes = nodes
    this.edges = edges
  }
  // TODO: should guard duplication? (It is handled by DB, but…)
  addNode(n: GraphNode): void {
    this.nodes.push(n)
  }
  // TODO: should guard duplication? (It is handled by DB, but…)
  addEdge(e: GraphEdge): void {
    this.edges.push(e)
  }

  removeEdge(from: string, to: string): void {
    this.edges = this.edges.filter((edge) => !(edge.from === from && edge.to === to))
  }

  getAdjacentNodes(node: GraphNode): GraphNode[] {
    const idsOfAdjacentNodes = new Set(
      this.edges.filter((edge) => edge.from === node.id).map((edge) => edge.to)
    )
    return this.nodes.filter((node) => idsOfAdjacentNodes.has(node.id))
  }

  countIncomingEdges(node: GraphNode): number {
    return this.edges.filter((edge) => edge.to === node.id).length
  }

  getOutcomingEdges(node: GraphNode): GraphEdge[] {
    return this.edges.filter((edge) => edge.from === node.id)
  }

  getCountsOfIncomingEdges(): Map<GraphNode, number> {
    const incomingEdgesCountMap = new Map<GraphNode, number>()

    for (const node of this.nodes) {
      incomingEdgesCountMap.set(node, this.countIncomingEdges(node))
    }
    return incomingEdgesCountMap
  }

  getTopologicalOrder(): GraphNode[] {
    const clonedGraph = new Graph(this.nodes.slice(), this.edges.slice())

    const topologicalOrder: GraphNode[] = []

    const incomingEdgesCountMap = this.getCountsOfIncomingEdges()

    const nodesWithoutIncomingEdges: GraphNode[] = this.nodes.filter(
      (node) => incomingEdgesCountMap.get(node) === 0
    )

    while (nodesWithoutIncomingEdges.length > 0) {
      const currentNode = nodesWithoutIncomingEdges.shift()

      if (!currentNode) {
        break
      }

      topologicalOrder.push(currentNode)

      const directlyAccessibleNodes = clonedGraph.getAdjacentNodes(currentNode)

      for (const directlyAccessibleNode of directlyAccessibleNodes) {
        clonedGraph.removeEdge(currentNode.id, directlyAccessibleNode.id)

        incomingEdgesCountMap.set(
          directlyAccessibleNode,
          incomingEdgesCountMap.get(directlyAccessibleNode)! - 1
        )

        if (incomingEdgesCountMap.get(directlyAccessibleNode) === 0) {
          nodesWithoutIncomingEdges.push(directlyAccessibleNode)
        }
      }
    }
    if (clonedGraph.edges.length > 0) {
      throw new Error('Graph has cycles')
    }

    return topologicalOrder
  }

  /*
  getComponents(): Graph[] {
    const clonedTopologicalySortedGraph = new Graph(this.nodes.slice(), this.edges.slice())

    const incomingEdgesCountMap = this.getCountsOfIncomingEdges()

    const nodesWithoutIncomingEdges: GraphNode[] = this.nodes.filter(
      (node) => incomingEdgesCountMap.get(node) === 0
    )

    const visited = new Set<GraphNode>()

    const components: GraphNode[][] = [[]]
    const currentComponentIndex = 0

    while (nodesWithoutIncomingEdges.length > 0) {
      const currentNode = nodesWithoutIncomingEdges.shift()

      if (!currentNode) {
        break
      }

      // visited.add(currentNode)
      components[currentComponentIndex].push(currentNode)

      const directlyAccessibleNodes = this.getAdjacentNodes(currentNode)
    }
  }*/

  getComponents(): GraphNode[][] {
    const clonedGraph = new Graph(this.nodes.slice(), this.edges.slice())

    const visited = new Set<string>()
    const components: GraphNode[][] = []

    function getComponent(node: GraphNode): GraphNode[] {
      const component: GraphNode[] = []
      const stack: GraphNode[] = [node]

      while (stack.length > 0) {
        const current = stack.pop()!
        if (!visited.has(current.id)) {
          visited.add(current.id)
          component.push(current)
          const neighbors = clonedGraph.getAdjacentNodes(current)
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor.id)) {
              stack.push(neighbor)
            }
          }
        }
      }
      return component
    }

    for (const node of clonedGraph.nodes) {
      if (!visited.has(node.id)) {
        const component = getComponent(node)
        components.push(component)
      }
    }
    return components
  }
}

const graph = new Graph(
  [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' }
  ],
  [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '3', to: '2' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '6', to: '7' },
    { from: '8', to: '1' }
  ]
)

const test = graph.getComponents()

console.log(test)
