import { useQuery } from '@tanstack/react-query'

function App(): React.JSX.Element {
  const testQuery = useQuery({
    queryKey: ['test'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL_PREFIXED}/projects/1`).then((res) =>
        res.json().then((data) => data)
      )
  })

  return <pre>{JSON.stringify(testQuery.data, null, 2)}</pre>
}

export default App
