import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@renderer/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Mode, modes } from '@renderer/components/form/modes'
import { useEffect } from 'react'
import api from '@renderer/services/api-client'
import { Project, ProjectInsertSchema } from '@db/schema/project'

interface GenericProjectFormProps {
  mode: Mode
  defaultValues: z.infer<typeof formSchema>
  projectId?: number
  onSuccess?: (project?: Project) => void
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Project name must be at least 2 characters.'
  }),
  country: z.string(),
  region: z.string(),
  city: z.string(),
  district: z.string()
})

const GenericProjectForm = ({
  mode,
  defaultValues,
  projectId,
  onSuccess
}: GenericProjectFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  })

  const createProject = (data: z.infer<typeof formSchema>) =>
    api.post<Project, ProjectInsertSchema>(`/projects`, undefined, data).then((response) => {
      onSuccess?.(response)
    })

  const editProject = (data: z.infer<typeof formSchema>) =>
    api.patch(`/projects/${projectId}`, undefined, data).then(() => {
      onSuccess?.()
    })

  const handler = mode === modes.create ? createProject : editProject

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset()
    }
  }, [form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handler)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default GenericProjectForm
