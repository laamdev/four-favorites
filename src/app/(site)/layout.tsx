import '@/app/globals.css'

import { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
