import ElkDiagramProvider from '@renderer/components/diagram-provider'
import ElkDiagramAlt from '@renderer/components/elk-diagram-alt'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import api from '@renderer/services/api-client'
import { Node } from '@db/schema/node'
// import Diagram from '@renderer/components/diagram'
import { Edge } from '@db/schema/edge'
import { mapEdge, mapNode } from '@renderer/components/elk-diagram-alt/mappers'
import { useParams } from '@tanstack/react-router'

const ProjectDiagram = () => {
  const { projectId } = useParams({ strict: false })

  const projectNodesQuery = useQuery({
    queryKey: ['projects/:id/nodes', { projectId }],
    queryFn: () => api.get<Node[]>(`/projects/${projectId}/nodes`),
    enabled: projectId != undefined
  })

  const projectEdgesQuery = useQuery({
    queryKey: ['projects/:id/edges', { projectId }],
    queryFn: () => api.get<Edge[]>(`/projects/${projectId}/edges`),
    enabled: projectId != undefined
  })

  const initialNodesAndEdges = useMemo(() => {
    if (!projectNodesQuery.data || !projectEdgesQuery.data) return null
    return {
      initialNodes: projectNodesQuery.data.map(mapNode),
      initialEdges: projectEdgesQuery.data.map(mapEdge)
    }
  }, [projectEdgesQuery.data, projectNodesQuery.data])

  return (
    <ElkDiagramProvider>
      {initialNodesAndEdges ? (
        <ElkDiagramAlt initialNodesAndEdges={initialNodesAndEdges} />
      ) : (
        'Loading…'
      )}
    </ElkDiagramProvider>
  )
}

export default ProjectDiagram
