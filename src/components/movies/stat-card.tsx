interface StatCardProps {
  label: string
  value: number | string
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className='col-span-1 flex h-fit flex-col gap-y-2 rounded-lg bg-gradient-to-br from-[#262626] to-card px-4 py-5 sm:p-6'>
      <h3 className='text-xs uppercase tracking-wider text-zinc-200'>
        {label}
      </h3>
      <div className='flex flex-1 items-center'>
        <h2 className='font-serif text-8xl font-bold text-primary'>{value}</h2>
      </div>
    </div>
  )
}
