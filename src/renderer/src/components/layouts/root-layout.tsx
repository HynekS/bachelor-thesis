import { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return <div className="d-flex">{children}</div>
}

export default RootLayout
