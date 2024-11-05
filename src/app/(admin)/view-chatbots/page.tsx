"use client"

import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function ViewChatbot() {
    const { user } = useUser();
    const [chatbots, setChatbots] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        if (!user) return;
        // Fetch chatbots data
        const fetchChatbots = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('chatbots')
                .select(`
              id,
              name,
              created_at,
              chatbot_characteristics (content),
              chat_sessions (
                id,
                created_at,
                guest_id,
                messages (
                  id,
                  content,
                  created_at
                )
              )
            `)
                .eq('clerk_user_id', user?.id);

            if (error) {
                console.error(error);
            } else if (data) {
                setChatbots(data);
            }

            setLoading(false);
        };

        fetchChatbots();
    }, [user]);
    return (
        <div className='flex-1 pb-20 p-6 text-white'>
            <h1 className='text-xl lg:text-3xl font-semibold mb-5'>Active Chatbots</h1>
            {
                loading &&
                <div className='bg-[#3C3D37] mt-5 p-5 md:p-10 h-36 rounded-lg border'>
                    <Avatar seed='chico' className='mx-auto animate-spin' />
                </div>
            }
            {!loading && chatbots.length === 0 && (
                <div>
                    <p>
                        You have not created any chatbots yet, Click on the button
                        below to create one.
                    </p>
                    <Link href="/create-chatbots">
                        <Button className="bg-[#64B5F5] text-white p-3 rounded-md mt-5">
                            Create Chatbot
                        </Button>
                    </Link>
                </div>
            )}

            <ul className="flex flex-col space-y-5">
                {chatbots.map((chatbot, index) => (
                    <Link key={index} href={`/edit-chatbot/${chatbot.id}`}>
                        <li className="relative p-10 border rounded-md min-w-3xl bg-3C3D37 text-white bg-[#3C3D37]">
                            <div>
                                <div className="flex items-center space-x-4">
                                    <Avatar seed={chatbot.name} />
                                    <h2 className="text-xl font-bold">{chatbot.name}</h2>
                                </div>
                                <p className="absolute top-5 right-5 text-xs text-gray-400">
                                    Created: {new Date(chatbot.created_at).toLocaleString()}
                                </p>
                            </div>
                            <hr className='mt-2' />
                            <div className="grid grid-cols-2 gap-10 md:gap-5 p-5">
                                <h3 className="italic">Characteristics:</h3>

                                <ul className="text-xs">
                                    {!chatbot.chatbot_characteristics.length && (
                                        <p>No characteristics added yet.</p>
                                    )}

                                    {chatbot.chatbot_characteristics.map((characteristic: any,index:number) => (
                                        <li className="list-disc break-words" key={index}>
                                            {characteristic.content}
                                        </li>
                                    ))}
                                </ul>
                                <h3 className="italic">Session:</h3>
                                <p>{chatbot.chat_sessions.length}</p>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}
