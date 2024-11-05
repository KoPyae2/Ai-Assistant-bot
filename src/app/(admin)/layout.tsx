'use client'

import Avatar from '@/components/Avatar';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !user) {
            router.replace('/login');
        }
    }, [isLoaded, user, router]);

    // Show a loading screen while determining if the user is authenticated
    if (!isLoaded) {
        return <div className="flex items-center justify-center w-screen h-screen">
            <Avatar seed='chico' className='mx-auto animate-spin' />
        </div>;
    }
    return (
        <div className="flex flex-col flex-1">
            {/* Header */}
            <Header />

            <div className="flex flex-col flex-1 lg:flex-row">
                <div className="sticky top-0 bg-[#3C3D37]">
                    <SideBar />
                </div>
                <div className="flex-1 justify-center lg:justify-start max-w-6xl lg:mx-auto bg-[#181C14]">
                    {children}
                </div>
            </div>
        </div>
    )
}
