import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Search } from '@/components/favorites/search'
import { FiltersRadio } from '@/components/favorites/filters-radio'
import { SortSelect } from '@/components/favorites/sort-select'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

interface FiltersSliderProps {
  label: string
  sort: string
  filter: string
}

export const FiltersSlider = ({ label, sort, filter }: FiltersSliderProps) => {
  return (
    <Sheet>
      <SheetTrigger>{label}</SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          {/* <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription> */}

          <div className='flex flex-col gap-y-3'>
            <Label className='text-xs uppercase tracking-wider text-zinc-300'>{`Search`}</Label>
            <Search placeholder='Find a list...' />
          </div>

          <div className='py-5'>
            <Separator />
          </div>

          <div className='flex flex-col gap-y-3'>
            <Label className='text-xs uppercase tracking-wider text-zinc-300'>{`Sort`}</Label>
            <SortSelect sort={sort as string} />
          </div>

          <div className='py-5'>
            <Separator />
          </div>

          <div className='flex flex-col gap-y-3'>
            <Label className='text-xs uppercase tracking-wider text-zinc-300'>{`Artist Role`}</Label>
            <FiltersRadio filter={filter as string} />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
