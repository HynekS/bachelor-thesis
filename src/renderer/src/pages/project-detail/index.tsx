import { Button } from '@renderer/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from '@tanstack/react-router'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import EditProjectForm from '@renderer/components/project/edit-form'
import CreateNodeForm from '@renderer/components/node/create-form'
import api from '@renderer/services/api-client'
import { Project } from '@db/schema/project'
import { Node } from '@db/schema/node'
import EditNodeForm from '@renderer/components/node/edit-form'

const ProjectDetail = () => {
  const { projectId } = useParams({ strict: false })
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)

  const [activeNode, setActiveNode] = useState<Node | null>(null)

  const projectDetailQuery = useQuery({
    queryKey: ['projects/:id', { projectId }],
    queryFn: () => api.get<Project>(`/projects/${projectId}`),
    enabled: projectId != undefined
  })

  const projectNodesQuery = useQuery({
    queryKey: ['projects/:id/nodes', { projectId }],
    queryFn: () => api.get<Node[]>(`/projects/${projectId}/nodes`),
    enabled: projectId != undefined
  })

  const handleDeleteProject = () => {
    api.delete(`/projects/${projectId}`).then(() => navigate({ to: '/' }))
  }

  return (
    <div>
      <div className="flex gap-1">
        <Button onClick={() => setIsEditMode(true)}>
          <PencilIcon className="size-5" />
        </Button>
        <Button onClick={handleDeleteProject}>
          <TrashIcon className="size-5" />
        </Button>
      </div>
      {isEditMode ? (
        <EditProjectForm
          project={projectDetailQuery.data}
          onSuccess={() => {
            setIsEditMode(false)
            projectDetailQuery.refetch()
          }}
        />
      ) : (
        <div>
          <pre>{JSON.stringify(projectDetailQuery.data, null, 2)}</pre>
          {/*<ul>
            {projectNodesQuery.data?.map((node) => (
              <li key={node.id}>{node.title}</li>
            ))}
          </ul>*/}
          {projectNodesQuery.data?.map((node) => node.title).join(', ')}
        </div>
      )}
      {activeNode ? (
        <EditNodeForm activeNode={activeNode} />
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

export default ProjectDetail
