'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
    <RadioGroup defaultValue={filter ?? 'all'} onValueChange={handleFilter}>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='all' id='all' />
        <Label htmlFor='actor'>{`All`}</Label>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='actor' id='actor' />
        <Label htmlFor='actor'>{`Actors`}</Label>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='director' id='director' />
        <Label htmlFor='director'>{`Directors`}</Label>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='producer' id='producer' />
        <Label htmlFor='producer'>{`Producers`}</Label>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='writer' id='writer' />
        <Label htmlFor='writer'>{`Writers`}</Label>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='composer' id='composer' />
        <Label htmlFor='composer'>{`Composers`}</Label>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='costume' id='costume' />
        <Label htmlFor='costume'>{`Costume Designer`}</Label>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='musician' id='musician' />
        <Label htmlFor='musician'>{`Musician`}</Label>
      </div>
      <div className='flex items-center space-x-2'>
        <RadioGroupItem value='fictional' id='fictional' />
        <Label htmlFor='fictional'>{`Fictional Character`}</Label>
      </div>
    </RadioGroup>
  )
}
