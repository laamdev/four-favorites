import { NewInvoiceForm } from '@/components/invoices/new-invoice-form'
import { MaxWidthWrapper } from '@/components/globals/max-width-wrapper'
import { PageTitle } from '@/components/globals/page-title'

export default async function NewInvoicePage() {
  return (
    <MaxWidthWrapper>
      <PageTitle>Crear Factura</PageTitle>

      <div className='mt-8'>
        <h2 className='text-xl font-medium'>Cliente</h2>

        <NewInvoiceForm />
      </div>
    </MaxWidthWrapper>
  )
}
