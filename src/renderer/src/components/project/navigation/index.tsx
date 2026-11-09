import { Link, useParams } from '@tanstack/react-router'

const Navigation = () => {
  const { projectId = '' } = useParams({ strict: false })
  return (
    <nav className="px-2 py-1">
      <ul className="flex items-center gap-2">
        <li>
          <Link
            to={`/projects/$projectId/info`}
            params={{
              projectId
            }}
            className="[&.active]:font-bold"
          >
            Info
          </Link>
        </li>
        <li>
          <Link
            to={`/projects/$projectId/diagram`}
            params={{
              projectId
            }}
            className="[&.active]:font-bold"
          >
            Diagram
          </Link>
        </li>
        <li>
          <Link
            to={`/projects/$projectId/add-node`}
            params={{
              projectId
            }}
            className="[&.active]:font-bold"
          >
            Add node
          </Link>
        </li>
      </ul>
      <button
        onClick={() => {
          window.api.print()
        }}
      >
        print
      </button>
    </nav>
  )
}

export default Navigation
