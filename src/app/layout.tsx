import { ReactNode } from 'react'
import localFont from 'next/font/local'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/navigation/app-sidebar'
import { Header } from '@/components/nav/header'

import '@/app/globals.css'
import { cn } from '@/lib/utils'

const grafier = localFont({
  src: [
    {
      path: '../../public/fonts/grafier/regular-display.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/grafier/medium-display.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/fonts/grafier/bold-display.woff2',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../../public/fonts/grafier/heavy-display.woff2',
      weight: '800',
      style: 'normal'
    },
    {
      path: '../../public/fonts/grafier/black-display.woff2',
      weight: '900',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-grafier'
})

const neueMontreal = localFont({
  src: [
    {
      path: '../../public/fonts/neue-montreal/thin.woff2',
      weight: '200',
      style: 'normal'
    },
    {
      path: '../../public/fonts/neue-montreal/thin-italic.woff2',
      weight: '200',
      style: 'italic'
    },
    {
      path: '../../public/fonts/neue-montreal/light.woff2',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../../public/fonts/neue-montreal/light-italic.woff2',
      weight: '300',
      style: 'italic'
    },
    {
      path: '../../public/fonts/neue-montreal/regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/neue-montreal/medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/fonts/neue-montreal/medium-italic.woff2',
      weight: '500',
      style: 'italic'
    },
    {
      path: '../../public/fonts/neue-montreal/semibold.woff2',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../../public/fonts/neue-montreal/bold.woff2',
      weight: '800',
      style: 'normal'
    },
    {
      path: '../../public/fonts/neue-montreal/bold-italic.woff2',
      weight: '800',
      style: 'italic'
    }
  ],
  display: 'swap',
  variable: '--font-neueMontreal'
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html
        className={cn(
          'dark container font-sans',
          neueMontreal.variable,
          grafier.variable
        )}
      >
        <body>
          {/* <SidebarProvider> */}
          {/* <AppSidebar /> */}
          <UserButton />
          {/* <Header /> */}
          {/* <SidebarTrigger /> */}
          <main className='py-10'>{children}</main>
          {/* </SidebarProvider> */}
        </body>
      </html>
    </ClerkProvider>
  )
}
