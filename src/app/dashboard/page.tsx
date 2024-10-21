import Link from 'next/link'
import { CirclePlusIcon } from 'lucide-react'

import { InvoicesTable } from '@/components/invoices-table'
import { MaxWidthWrapper } from '@/components/globals/max-width-wrapper'
import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/globals/page-title'

export default function DashboardPage() {
  return (
    <MaxWidthWrapper>
      <div className='flex justify-between'>
        <PageTitle>Facturas</PageTitle>
        <p className=''>
          <Button variant='ghost' asChild>
            <Link href='/invoices/new' className='inline-flex gap-2'>
              <CirclePlusIcon className='size-4' />
              <span>Crear Factura</span>
            </Link>
          </Button>
        </p>
      </div>
      <InvoicesTable />
    </MaxWidthWrapper>
  )
}
