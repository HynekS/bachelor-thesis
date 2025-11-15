import { Button } from '@renderer/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from '@tanstack/react-router'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import EditProjectForm from '@renderer/components/project/edit-form'
import CreateNodeForm from '@renderer/components/node/create-form'

const ProjectDetail = () => {
  const { projectId } = useParams({ strict: false })
  const navigate = useNavigate()
  const [isEditMode, setIsEditMode] = useState(false)

  const projectDetailQuery = useQuery({
    queryKey: ['projects/:id', { projectId }],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL_PREFIXED}/projects/${projectId}`).then((res) =>
        res.json()
      ),
    enabled: projectId != undefined
  })

  const handleDeleteProject = () => {
    fetch(`${import.meta.env.VITE_API_URL_PREFIXED}/projects/${projectId}`, {
      method: 'DELETE'
    }).then(() => {
      navigate({ to: '/' })
    })
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
        <pre>{JSON.stringify(projectDetailQuery.data, null, 2)}</pre>
      )}
      <CreateNodeForm projectId={projectId}/>
    </div>
  )
}

export default ProjectDetail
