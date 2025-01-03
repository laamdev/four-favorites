import { SlidersHorizontal } from '@phosphor-icons/react/dist/ssr'

import { Label } from '@/components/ui/label'
import { Search } from '@/components/favorites/search'
import { FiltersRadio } from '@/components/movies/filters-radio'
import { SortSelect } from '@/components/movies/sort-select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

interface FiltersSliderProps {
  sort: string
  filter: string
}

export const FiltersSlider = ({ sort, filter }: FiltersSliderProps) => {
  return (
    <Sheet>
      <SheetTrigger className='flex items-center gap-x-2'>
        <SlidersHorizontal weight='fill' className='size-4' />
        <span className='text-sm'>Show filters</span>
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <SheetTitle>Filters & Sort</SheetTitle>
          <SheetDescription>{`Filter, search, and sort movies.`}</SheetDescription>
        </SheetHeader>

        <div className='mt-8 flex max-h-[calc(100vh-8rem)] flex-col gap-y-8 overflow-y-auto'>
          <div className='flex flex-col gap-y-4'>
            <Label className='text-xs uppercase tracking-wider text-zinc-300'>{`Search`}</Label>
            <Search placeholder='Find a movie...' />
          </div>

          <div className='flex flex-col gap-y-4'>
            <Label className='text-xs uppercase tracking-wider text-zinc-300'>{`Sort`}</Label>
            <SortSelect sort={sort as string} />
          </div>

          <div className='flex flex-col gap-y-4'>
            <Label className='text-xs uppercase tracking-wider text-zinc-300'>{`Genre`}</Label>
            <FiltersRadio filter={filter as string} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
