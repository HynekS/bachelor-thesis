import { Button } from '@renderer/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useCanGoBack, useRouter, useRouterState } from '@tanstack/react-router'

const TopNavigation = () => {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  // This is not merged yet, but seems to be working? https://github.com/TanStack/router/pull/3196/files
  const canGoForward = useRouterState({
    select: (s) => s.location.state.__TSR_index !== router.history.length - 1
  })

  return (
    <div className="p-3 flex gap-1 shadow-lg">
      <Button onClick={() => router.history.back()} disabled={!canGoBack}>
        <ArrowLeftIcon className="size-5" />
      </Button>
      <Button onClick={() => router.history.forward()} disabled={!canGoForward}>
        <ArrowRightIcon className="size-5" />
      </Button>
    </div>
  )
}

export default TopNavigation
