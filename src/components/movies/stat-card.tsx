interface StatCardProps {
  label: string
  value: number | string
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className='col-span-1 flex h-fit flex-col gap-y-2 rounded-lg bg-gradient-to-br from-[#252220] to-[#2b2925] px-4 py-5 sm:p-6'>
      <h3 className='text-xs uppercase tracking-wider text-zinc-200 sm:text-sm'>
        {label}
      </h3>
      <div className='flex flex-1 items-center'>
        <h2 className='font-serif text-4xl font-bold text-primary sm:text-8xl'>
          {value}
        </h2>
      </div>
    </div>
  )
}
