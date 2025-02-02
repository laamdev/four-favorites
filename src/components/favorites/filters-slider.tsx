import { SlidersHorizontal } from '@phosphor-icons/react/dist/ssr'

import { Label } from '@/components/ui/label'
import { Search } from '@/components/favorites/search'
import { FiltersRadio } from '@/components/favorites/filters-radio'
import { SortSelect } from '@/components/favorites/sort-select'
import {
  SheetDescription,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

interface FiltersSliderProps {
  sort: string
  role: string
}

export const FiltersSlider = ({ sort, role }: FiltersSliderProps) => {
  return (
    <Sheet>
      <SheetTrigger className='group flex cursor-pointer items-center justify-center gap-x-2'>
        <SlidersHorizontal
          weight='fill'
          className='group-hover:text-primary tw-animation size-5'
        />
        <span className='text-[10px] font-medium tracking-widest text-zinc-700 uppercase sm:text-xs'>
          Show filters
        </span>
      </SheetTrigger>
      <SheetContent side='right'>
        <SheetHeader>
          <SheetTitle>Lists Filters</SheetTitle>
          <SheetDescription>{`Filter, search, and sort the Four Favorite lists of your favorite artists.`}</SheetDescription>
        </SheetHeader>

        <div className='mt-8 flex max-h-[calc(100vh-8rem)] flex-col gap-y-8 overflow-y-auto'>
          <div className='flex flex-col gap-y-3'>
            <Label className='text-xs tracking-wider text-zinc-300 uppercase'>{`Search`}</Label>
            <Search placeholder='Find a list...' />
          </div>

          <div className='flex flex-col gap-y-3'>
            <Label className='text-xs tracking-wider text-zinc-300 uppercase'>{`Sort`}</Label>
            <SortSelect sort={sort as string} />
          </div>

          <div className='flex flex-col gap-y-3'>
            <Label className='text-xs tracking-wider text-zinc-300 uppercase'>{`Role`}</Label>
            <FiltersRadio role={role as string} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
