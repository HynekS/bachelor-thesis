import { Project } from '@db/schema/project'
import GenericProjectForm from '../generic-form'
import { modes } from '@renderer/components/form/modes'

interface EditProjectFormProps {
  project: Project | undefined
  onSuccess?: () => void
}

const EditProjectForm = ({ project, onSuccess }: EditProjectFormProps) => {
  console.log(project)
  if (!project) return null

  const { id, title, country, region, city, district } = project
  return (
    <GenericProjectForm
      mode={modes.update}
      defaultValues={{
        title,
        country: country ?? '',
        region: region ?? '',
        city: city ?? '',
        district: district ?? ''
      }}
      projectId={id}
      onSuccess={onSuccess}
    />
  )
}

export default EditProjectForm
