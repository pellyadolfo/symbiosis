import { Compass } from 'lucide-react'
import { LinkButton } from '../components/ui/Button'
import { EmptyState } from '../components/ui/Surface'

export const NotFoundPage = () => (
  <div className="container-page py-24">
    <EmptyState
      icon={<Compass className="size-12" />}
      title="We could not find that page"
      description="The link may be out of date, or the project may have closed. Everything currently available is listed in the marketplace."
      action={<LinkButton to="/invest">Browse offerings</LinkButton>}
    />
  </div>
)
