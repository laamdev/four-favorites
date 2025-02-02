import {
  Envelope,
  FacebookLogo,
  InstagramLogo,
  LinkSimple,
  XLogo
} from '@phosphor-icons/react/dist/ssr'

export const SocialShare = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <p className='text-xs font-medium text-zinc-500 uppercase sm:text-sm'>
        Share
      </p>
      <div className='flex items-center justify-center gap-4'>
        <XLogo weight='fill' className='text-primary size-6' />
        <InstagramLogo weight='fill' className='text-primary size-6' />
        <FacebookLogo weight='fill' className='text-primary size-6' />
        <Envelope weight='fill' className='text-primary size-6' />
        <LinkSimple weight='bold' className='text-primary size-6' />
      </div>
    </div>
  )
}
