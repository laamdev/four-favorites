export const Footer = () => {
  return (
    <footer className='mt-16 py-4'>
      <div className='tw-animation text-center text-[10px] text-zinc-400 sm:text-xs'>
        <span>{`Created by `}</span>
        <a
          href='https://www.laam.dev'
          target='_blank'
          rel='noopener noreferrer'
          className='tw-animation font-medium underline hover:text-primary'
        >
          {`laam.dev.`}
        </a>

        <span>{` If you like my work, `}</span>
        <a
          href='https://buymeacoffee.com/laamdev'
          target='_blank'
          rel='noopener noreferrer'
          className='tw-animation font-medium underline hover:text-primary'
        >
          {`buy me a cofee!`}
        </a>
      </div>
    </footer>
  )
}
