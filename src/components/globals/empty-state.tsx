import { ReactNode } from 'react'

interface EmptyStateProps {
  children: ReactNode
}

export const EmptyState = ({ children }: EmptyStateProps) => {
  return <div className='border-primary'>{children}</div>
}
