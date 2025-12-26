import { useRouter } from '@tanstack/react-router'
import GenericProjectForm from '../generic-form'
import { modes } from '@renderer/components/form/modes'

const CreateProjectForm = () => {
  const router = useRouter()

  return (
    <GenericProjectForm
      mode={modes.create}
      defaultValues={{
        title: '',
        country: '',
        region: '',
        city: '',
        district: ''
      }}
      onSuccess={(createdProject) => {
        if (createdProject)
          router.navigate({
            to: `/${createdProject.id}`
          })
      }}
    />
  )
}

export default CreateProjectForm
