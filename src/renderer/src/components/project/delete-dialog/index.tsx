import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { TrashIcon } from 'lucide-react'

const DeleteDialog = ({ handleDeleteProject }: { handleDeleteProject: () => void }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <TrashIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            Are you really sure you want to delete this project?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleDeleteProject}>
            <TrashIcon className="size-5" /> Delete project
          </Button>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog
