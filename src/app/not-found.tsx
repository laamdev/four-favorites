import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-4 text-center'>
      <h1 className='text-4xl font-bold'>404</h1>
      <h2 className='text-2xl font-semibold'>Page Not Found</h2>
      <p className='text-muted-foreground'>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href='/'
        className='bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2'
      >
        Return Home
      </Link>
    </div>
  )
}
