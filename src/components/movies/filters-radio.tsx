'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { movieGenres } from '@/lib/data/movie-genres'

interface FitlersRadioProps {
  filter: string
}

export const FiltersRadio = ({ filter }: FitlersRadioProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams)
    if (filter) {
      if (filter === 'all') {
        params.delete('filter')
      } else {
        params.set('filter', filter)
      }
      params.set('page', '1')
    } else {
      params.delete('filter')
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <RadioGroup
      defaultValue={filter ?? 'all'}
      onValueChange={handleFilter}
      className='grid grid-cols-2'
    >
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='all' id='all' />
        <Label htmlFor='all'>{`All`}</Label>
      </div>
      {movieGenres.map(genre => (
        <div className='flex items-center space-x-2'>
          <RadioGroupItem value={genre.name} id={genre.name} />
          <Label htmlFor={genre.name}>{genre.name}</Label>
        </div>
      ))}
    </RadioGroup>
  )
}
