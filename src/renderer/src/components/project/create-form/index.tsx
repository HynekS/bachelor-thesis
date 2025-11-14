import { FormTextField } from '@renderer/components/form/text-field-alt'
import React, { useEffect, useMemo } from 'react'
import { Button } from '@renderer/components/button'
import { SubmitHandler, useForm } from 'react-hook-form'

interface FormInputs {
  title: string
  country: string
  region: string
  city: string
  district: string
}

const CreateProjectForm = (): React.JSX.Element => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors }
  } = useForm<FormInputs>()

  const createProject: SubmitHandler<FormInputs> = (data) =>
    fetch(`${import.meta.env.VITE_API_URL_PREFIXED}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((data) => console.log(data))

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        title: undefined,
        country: undefined,
        region: undefined,
        city: undefined,
        district: undefined
      })
    }
  }, [isSubmitSuccessful, reset])

  const rules = useMemo(() => ({ required: "foo bar baz" }),[])

  return (
    <div>
      <form onSubmit={handleSubmit(createProject)}>
        <FormTextField<FormInputs>
          control={control}
          name="title"
          label="Title"
          rules={rules}
        />
        <FormTextField<FormInputs> control={control} name="country" label="Country" />
        <FormTextField<FormInputs> control={control} name="region" label="Region" />
        <FormTextField<FormInputs> control={control} name="city" label="City" />
        <FormTextField<FormInputs> control={control} name="district" label="District" />
        <Button type="submit">Create project</Button>
      </form>
    </div>
  )
}

export default CreateProjectForm
