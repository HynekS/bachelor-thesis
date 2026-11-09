import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useState } from 'react'
import CreateNodeForm from '@renderer/components/node/create-form'
import api from '@renderer/services/api-client'
import { Node } from '@db/schema/node'
import EditNodeForm from '@renderer/components/node/edit-form'
import { Edge } from '@db/schema/edge'

const ProjectAddNodeForm = () => {
  const { projectId = '' } = useParams({ strict: false })

  const [activeNode, setActiveNode] = useState<Node | null>(null)

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

  return (
    <div>
      {activeNode ? (
        <EditNodeForm activeNode={activeNode} onSuccess={() => projectEdgesQuery.refetch()} />
      ) : (
        <CreateNodeForm
          projectId={projectId}
          onSuccess={(createdNode) => {
            if (createdNode) {
              setActiveNode(createdNode)
            }
            projectNodesQuery.refetch()
          }}
        />
      )}
    </div>
  )
}

export default ProjectAddNodeForm
