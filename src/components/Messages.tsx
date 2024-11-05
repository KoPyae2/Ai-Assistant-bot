"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import Avatar from './Avatar'
import { CircleUserRound } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from '@/types/types'

export default function Messages({ messages, botName }: { messages: Message[], botName: string }) {
    const path = usePathname()

    const isReviewPage = path.includes('view-sessions')
    return (
        <div className="flex-1 flex flex-col overflow-y-auto space-y-4 py-6 px-5 bg-[#3C3D37] rounded shadow">
            {messages.map((msg: Message, index) => {
                const isSender = msg.sender != 'user';
                return (
                    <div key={index} className={`flex items-end space-x-2 ${!isSender ? 'justify-end' : ''}`}>
                        <div className={`flex flex-col ${!isSender ? 'items-end' : ''}`}>
                            <div className='flex items-end gap-2'>
                                {isSender && <Avatar seed={botName} className="w-6 h-6 rounded-full" />}
                                <div
                                    className={`max-w-xs p-3 rounded-lg ${!isSender ? 'bg-[#697565] text-white' : 'bg-[#ECDFCC] text-gray-800'
                                        }`}
                                >
                                    <Markdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            ul: ({ node, ...props }) => (
                                                <ul {...props} className="list-disc list-inside ml-5 " />
                                            ),
                                            ol: ({ node, ...props }) => (
                                                <ol {...props} className="list-decimal list-inside ml-5 " />
                                            ),

                                            h1: ({ node, ...props }) => (
                                                <h1 {...props} className="text-2xl font-bold " />
                                            ),
                                            h2: ({ node, ...props }) => (
                                                <h2 {...props} className="text-xl font-bold " />
                                            ),
                                            h3: ({ node, ...props }) => (
                                                <h3 {...props} className="text-lg font-bold " />
                                            ),
                                            table: ({ node, ...props }) => (
                                                <table
                                                    {...props}
                                                    className="table-auto w-full border-separate border-2 rounded-sm border-spacing-4 border-white "
                                                />
                                            ),
                                            th: ({ node, ...props }) => (
                                                <th {...props} className="text-left underline" />
                                            ),
                                            p: ({ node, ...props }) => (
                                                <p
                                                    {...props}
                                                    className={`whitespace-break-spaces  ${msg.content === "Thinking..." && "animate-pulse"
                                                        } ${isSender ? "text-black" : "text-white"}`}
                                                />
                                            ),
                                            a: ({ node, ...props }) => (
                                                <a
                                                    {...props}
                                                    target="_blank"
                                                    className="font-bold underline hover:text-blue-400"
                                                    rel="noopener noreferrer"
                                                />
                                            ),
                                        }}
                                    >{msg.content}</Markdown>
                                </div>
                                {!isSender && <CircleUserRound size={26} color='#697565'/>}
                            </div>

                            <span className="text-xs text-white text-opacity-70 mt-1">Sent at {new Date(msg.created_at).toLocaleString()}</span>
                        </div>

                    </div>
                )

            })}
        </div>
    )
}
