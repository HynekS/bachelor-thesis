import { Node } from '@db/schema/node'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Button } from '@renderer/components/ui/button'
import api from '@renderer/services/api-client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface EditNodeFormProps {
  activeNode: Node
}

const formSchema = z.object({
  project_id: z.coerce.number(),
  title: z.string().min(1, {
    message: 'Unit identifier must be at least 1 character/number.'
  })
})

const EditNodeForm = ({ activeNode }: EditNodeFormProps) => {
  const descentantsForm = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      project_id: activeNode.project_id,
      title: ''
    }
  })

  const ancestorsForm = useForm()

  const createDescendantNodeAndEdge = (data: z.infer<typeof formSchema>) =>
    api
      .post(`/edges/edgeFromNodes`, undefined, {
        ancestorNodeTitle: activeNode.title,
        descendantNodeTitle: data.title,
        project_id: Number(data.project_id)
      })
      .then((response) => {
        console.log(response)
        //onSuccess?.(response)
        return response
      })
      .catch((error) => {
        ancestorsForm.setError('title', { message: error.message })
      })

  return (
    <div>
      <Form {...descentantsForm}>
        <form
          onSubmit={descentantsForm.handleSubmit(createDescendantNodeAndEdge)}
          className="space-y-8"
        >
          <FormField
            control={descentantsForm.control}
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

      <div>{activeNode.title}</div>
      {/*<Form {...ancestorsForm}>
        <form onSubmit={() => {}} className="space-y-8"></form>
        <FormField
          control={ancestorsForm.control}
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
      </Form>*/}
    </div>
  )
}

export default EditNodeForm
