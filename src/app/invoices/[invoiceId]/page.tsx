import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { Invoices } from '@/db/schema'

import { PageTitle } from '@/components/globals/page-title'
import { MaxWidthWrapper } from '@/components/globals/max-width-wrapper'
import { InvoiceSection } from '@/components/invoices/invoice-section'

export default async function InvoicePage({
  params
}: {
  params: { invoiceId: string }
}) {
  const invoiceId = parseInt(params.invoiceId)

  const [invoice] = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.id, invoiceId))
    .limit(1)

  console.log(JSON.stringify(invoice, null, 2), 'invoice')

  return (
    <MaxWidthWrapper>
      <div>
        <PageTitle>{`Invoice #${invoice.id}`}</PageTitle>
        <h2 className='mt-2 text-4xl'>{`${(invoice.amount / 100).toFixed(2)} €`}</h2>
        <p className='mt-4'>{invoice.description}</p>
      </div>

      <div>
        <InvoiceSection amount={invoice.amount} status={invoice.status} />
      </div>
    </MaxWidthWrapper>
  )
}
