import { cn } from '@/lib/utils'
import { getOrdinalSuffix } from '@/lib/utils'

interface StatItemProps {
  label: string
  value: string | number
}

const StatItem = ({ label, value }: StatItemProps) => {
  return (
    <div className='flex items-baseline justify-between gap-4'>
      <p className='text-muted-foreground shrink-0 text-sm font-medium tracking-wide'>
        {label}
      </p>
      <div className='h-[1px] grow bg-[repeating-linear-gradient(to_right,currentColor_0_1px,transparent_1px_6px)] opacity-30' />
      <p className='text-foreground shrink-0 text-right font-serif'>{value}</p>
    </div>
  )
}

interface MovieStatsProps {
  releaseYear: string
  director: string
  country: string
  favoritesCount: number
  rank: number
  className?: string
}

export const MovieStats = ({
  releaseYear,
  director,
  country,
  favoritesCount,
  rank,
  className
}: MovieStatsProps) => {
  return (
    <div className={cn('mt-16 max-w-xl', className)}>
      <h3 className='mb-8 text-sm font-bold tracking-widest uppercase'>
        Details
      </h3>

      <div className='flex flex-col space-y-4 border-t-2 border-black pt-8'>
        <StatItem label='Release Date' value={releaseYear} />
        <StatItem label='Director' value={director} />
        <StatItem label='Country' value={country} />
      </div>

      <h3 className='mt-16 mb-8 text-sm font-bold tracking-widest uppercase'>
        Stats
      </h3>

      <div className='flex flex-col space-y-4 border-t-2 border-black pt-8'>
        <StatItem label='Number of Lists' value={favoritesCount} />
        <StatItem label='Rank Position' value={getOrdinalSuffix(rank)} />
      </div>
    </div>
  )
}
