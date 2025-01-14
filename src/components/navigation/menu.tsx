import Link from 'next/link'
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut
} from '@clerk/nextjs'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/components/ui/menubar'

export const Menu = async () => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className='cursor-pointer'>Letterboxd</MenubarTrigger>
        <MenubarContent>
          <Link href='/lists'>
            <MenubarItem className='w-full cursor-pointer'>Lists</MenubarItem>
          </Link>
          <Link href='/movies'>
            <MenubarItem className='w-full cursor-pointer'>Movies</MenubarItem>
          </Link>
          <Link href='/directors'>
            <MenubarItem className='w-full cursor-pointer'>
              Directors
            </MenubarItem>
          </Link>
          <Link href='/genres'>
            <MenubarItem className='w-full cursor-pointer'>Genres</MenubarItem>
          </Link>
          <Link href='/stats'>
            <MenubarItem className='w-full cursor-pointer'>Stats</MenubarItem>
          </Link>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className='cursor-pointer'>Profile</MenubarTrigger>
        <MenubarContent>
          <SignedOut>
            <MenubarItem className='w-full cursor-pointer'>
              <SignInButton mode='modal'>Sign In</SignInButton>
            </MenubarItem>
            <MenubarItem className='w-full cursor-pointer'>
              <SignUpButton mode='modal'>Sign Up</SignUpButton>
            </MenubarItem>
          </SignedOut>
          <SignedIn>
            <Link href={`/profile`}>
              <MenubarItem className='w-full cursor-pointer'>
                My Favorites
              </MenubarItem>
            </Link>
            <MenubarItem className='w-full cursor-pointer'>
              <SignOutButton>Sign Out</SignOutButton>
            </MenubarItem>
          </SignedIn>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
