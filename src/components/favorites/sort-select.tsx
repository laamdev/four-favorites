'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const SortSelect = ({ sort }: { sort: string }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams)
    if (sort) {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Select defaultValue={sort ?? 'name'} onValueChange={handleSort}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Sort' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='name'>{`A-Z`}</SelectItem>
        <SelectItem value='-name'>{`Z-A`}</SelectItem>
        <SelectItem value='-publishing_date'>{`Newest`}</SelectItem>
        <SelectItem value='publishing_date'>{`Oldest`}</SelectItem>
      </SelectContent>
    </Select>
  )
}
