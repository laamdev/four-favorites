import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  text: string
  className?: string
}

export const SectionHeading = ({ text, className }: SectionHeadingProps) => {
  return (
    <h2
      className={cn(
        'text-center font-serif text-lg font-medium uppercase text-zinc-100 sm:text-3xl',
        className
      )}
    >
      {text}
    </h2>
  )
}
