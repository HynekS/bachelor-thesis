import { useQuery } from '@tanstack/react-query'
import { Project } from '../../../../main/db/schema/project'
import { Link } from '@tanstack/react-router'
import api from '@renderer/services/api-client'

const ProjectList = () => {
  const testQuery = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get<Project[]>(`/projects`)
  })

  return (
    <div className="p-3">
      {testQuery.data?.map((project) => (
        <div key={project.title}>
          <Link to={`/projects/$projectId`} params={{ projectId: `${project.id}` }}>
            {project.title}
          </Link>
        </div>
      ))}
      <div>
        <Link to="/projects/create-project" className="[&.active]:font-bold">
          Create new project
        </Link>
      </div>
    </div>
  )
}

export default ProjectList
