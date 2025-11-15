import { Button } from '@renderer/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useCanGoBack, useRouter } from '@tanstack/react-router'

const TopNavigation = () => {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  console.log(router.history)

  return (
    <div className='p-3 flex gap-1 shadow-lg'>
      <Button onClick={() => router.history.back()} disabled={!canGoBack}>
        <ArrowLeftIcon className="size-5" />
      </Button>
      <Button onClick={() => router.history.forward()}>
        <ArrowRightIcon className="size-5" />
      </Button>
    </div>
  )
}

export default TopNavigation
