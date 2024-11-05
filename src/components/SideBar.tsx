import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { BotMessageSquare, ChartGanttIcon, PencilLine, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function SideBar() {
    return (
        <div className=' text-white p-5 sticky top-0'>
            <ul className='gap-4 flex lg:flex-col'>
                <li className='flex-1'>
                    <Link
                        href="/create-chatbots"
                        className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-2 p-5 rounded-md bg-[#697565]"
                    >
                        <BotMessageSquare />
                        <div className='hidden md:inline'>
                            <p className='text-xl'>Create</p>
                            <p className='text-sm font-extralight'>New Chatbot</p>
                        </div>
                    </Link>
                </li>
                <li className='flex-1'>
                    <Link
                        href="/view-chatbots"
                        className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-2 p-5 rounded-md bg-[#697565]"
                    >
                        <PencilLine />
                        <div className='hidden md:inline'>
                            <p className='text-xl'>Edit</p>
                            <p className='text-sm font-extralight'>Chatbot</p>
                        </div>
                    </Link>
                </li>
                <li className='flex-1'>
                    <Link
                        href="/view-sessions"
                        className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-2 p-5 rounded-md bg-[#697565]"
                    >
                        <SearchIcon/>
                        <div className='hidden md:inline'>
                            <p className='text-xl'>View</p>
                            <p className='text-sm font-extralight'>Session</p>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
    )
}
