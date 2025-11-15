import { useQuery } from '@tanstack/react-query'
import { Project } from '../../../../main/db/schema/project'
import { Link } from '@tanstack/react-router'

const ProjectList = () => {
  const testQuery = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL_PREFIXED}/projects`).then((res) =>
        res.json().then((json) => json)
      )
  })

  return (
    <div className='p-3'>
      {testQuery.data?.map((project) => (
        <div key={project.title}>
          <Link to={`/$projectId`} params={{ projectId: `${project.id}` }}>
            {project.title}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default ProjectList
