export const Footer = () => {
  return (
    <footer className='pb-8 pt-24'>
      <div className='tw-animation text-center text-xs text-zinc-400'>
        <span>{`Created by `}</span>
        <a
          href='https://www.laam.dev'
          target='_blank'
          rel='noopener noreferrer'
          className='tw-animation font-medium underline hover:text-primary'
        >
          {`laam.dev`}
        </a>

        <span>{`. You can `}</span>
        <a
          href='https://buymeacoffee.com/laamdev'
          target='_blank'
          rel='noopener noreferrer'
          className='tw-animation font-medium underline hover:text-primary'
        >
          {`buy me a cofee`}
        </a>
        <span>{` if you like my work.`}</span>
      </div>
    </footer>
  )
}
