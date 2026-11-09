import { Button } from '@renderer/components/ui/button'
import { useParams, useNavigate } from '@tanstack/react-router'
import { PencilIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import EditProjectForm from '@renderer/components/project/edit-form'
// import Diagram from '@renderer/components/diagram'
import DeleteDialog from '@renderer/components/project/delete-dialog'
import api from '@renderer/services/api-client'
import { Project } from '@db/schema/project'
import { useQuery } from '@tanstack/react-query'

const ProjectInfo = () => {
  const { projectId = '' } = useParams({ strict: false })
  const navigate = useNavigate()

  const projectDetailQuery = useQuery({
    queryKey: ['projects/:id', { projectId }],
    queryFn: () => api.get<Project>(`/projects/${projectId}`),
    enabled: projectId != undefined
  })

  const [isEditMode, setIsEditMode] = useState(false)

  const handleDeleteProject = () => {
    api.delete(`/projects/${projectId}`).then(() => navigate({ to: '/' }))
  }

  return (
    <div>
      <div className="flex gap-1">
        <Button onClick={() => setIsEditMode(true)}>
          <PencilIcon className="size-5" />
        </Button>
        <DeleteDialog handleDeleteProject={handleDeleteProject} />
      </div>
      {isEditMode && (
        <EditProjectForm
          project={projectDetailQuery.data}
          onSuccess={() => {
            setIsEditMode(false)
            projectDetailQuery.refetch()
          }}
        />
      )}
    </div>
  )
}

export default ProjectInfo
