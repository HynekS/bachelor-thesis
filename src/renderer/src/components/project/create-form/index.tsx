import GenericProjectForm from '../generic-form'
import { modes } from '@renderer/components/form/modes'

const CreateProjectForm = () => {
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
      
    />
  )
}

export default CreateProjectForm
