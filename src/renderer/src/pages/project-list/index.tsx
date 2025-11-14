import { useQuery } from '@tanstack/react-query'
import { Project } from '../../../../main/db/schema/project'

const ProjectList = (): React.JSX.Element => {
  const testQuery = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL_PREFIXED}/project/1`).then((res) =>
        res.json().then((json) => json)
      )
  })

  return <pre>{JSON.stringify(testQuery.data, null, 2)}</pre>
}

export default ProjectList