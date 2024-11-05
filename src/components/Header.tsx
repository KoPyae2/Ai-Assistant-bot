import Link from 'next/link'
import React from 'react'
import Avatar from './Avatar'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'

export default function Header() {
    return (
        <header className='bg-[#3C3D37] shadow-sm text-gray-800 flex items-center justify-between p-5'>
            <Link href={'/'} className='flex items-center text-4xl font-thin'>
                <Avatar seed='header' />
                <div className='ms-4 text-white'>
                    <h1 >Ai Assistant</h1>
                    <h2 className='text-sm'>Your Customisable Ai Chat Agent</h2>
                </div>
            </Link>
            <div>
                <SignedOut>
                    {/* <SignInButton /> */}
                    <Link href={'/login'}>
                        <Button variant='default'>Get Started</Button>
                    </Link>

                </SignedOut>

                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

        </header>
    )
}
