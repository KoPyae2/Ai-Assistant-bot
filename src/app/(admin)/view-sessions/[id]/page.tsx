"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Avatar from '@/components/Avatar';
import { supabase } from '@/lib/supabase';
import { ChatSession } from '@/types/types';
import Messages from '@/components/Messages';

export default function ViewSession() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const [chatSession, setChatSession] = useState<ChatSession>();

    const fetchChatbots = async () => {
        const { data, error } = await supabase
            .from('chat_sessions')
            .select(`
              id,
              created_at,
              messages (
                id,
                content,
                created_at,
                sender
              ),
              chatbots (
                name
              ),
              guests (
                name,
                email
              )
            `)
            .eq('id', id);

        if (error) {
            console.error(error);
        } else {
            setChatSession(data[0] as any);
            console.log(3333, data);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!id) return
        setLoading(true);
        fetchChatbots();
    }, [id])


    return (
        <div className="flex-1 px-5 text-white">
            <h1 className="text-xl lg:text-3xl font-semibold mt-10">Session Review</h1>
            {
                chatSession && chatSession &&
                <p className="font-light text-sm text-gray-400 mt-2">Start at - {new Date(chatSession.created_at).toLocaleString()}</p>
            }

            {
                chatSession && chatSession.chatbots && chatSession.guests &&
                <div>
                    <h2 className='font-light mt-2 mb-6'>
                        Between {chatSession?.chatbots.name} and <span className='font-bold'>{chatSession?.guests.name} ({chatSession?.guests.email})</span>
                    </h2>
                    <Messages messages={chatSession.messages} botName={chatSession.chatbots.name} />
                </div>
            }

            {
                loading &&
                <div className='bg-[#3C3D37] mt-5 p-5 md:p-10 rounded-lg'>
                    <Avatar seed='chico' className='mx-auto animate-spin' />
                </div>
            }

        </div>
    );
}
