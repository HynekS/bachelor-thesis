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
import { useEffect } from 'react'
import api from '@renderer/services/api-client'
import { Node } from '@db/schema/node'

interface CreateNodeFormProps {
  projectId: string | undefined
  onSuccess?: (createdNode?: Node) => void
}

const formSchema = z.object({
  project_id: z.string(),
  title: z.string().min(1, {
    message: 'Unit identifier must be at least 1 character/number.'
  })
})

const CreateNodeForm = ({ projectId, onSuccess }: CreateNodeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: projectId,
      title: ''
    }
  })

  const createNode = (data: z.infer<typeof formSchema>) =>
    api
      .post<Node>(`/nodes`, undefined, { ...data, project_id: Number(data.project_id) })
      .then((response) => {
        onSuccess?.(response)
        return response
      })
      .catch((error) => {
        form.setError('title', { message: error.message })
      })

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      // TODO
    }
  }, [form])

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createNode)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit identifier</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <Button type="submit">Save</Button>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default CreateNodeForm
