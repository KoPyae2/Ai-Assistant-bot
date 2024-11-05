"use client"
import Avatar from '@/components/Avatar';
import ChatBotSessions from '@/components/ChatBotSessions';
import { supabase } from '@/lib/supabase';
import { Chatbot } from '@/types/types';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'

export default function ViewSessions() {
    const { user } = useUser()
    // if (!user) return null

    const [loading, setLoading] = useState(true);
    const [chatbots, setChatbots] = useState<Chatbot[]>([]);

    const fetchChatbots = async () => {
        const { data, error } = await supabase
            .from('chatbots')
            .select(`
            id,
            name,
            created_at,
            chatbot_characteristics (
            id,
            content
            ),
            chat_sessions (
              id,
              created_at,
              guest_id,
              guests (id,name, email),
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
        } else {
            setChatbots(data as any);
            console.log(3333, data);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!user) return
        // setLoading(true);
        fetchChatbots();
    }, [user])
    return (
        <div className="flex-1 px-10 text-white">
            <h1 className="text-xl lg:text-3xl font-semibold mt-10">Chat Sessions</h1>
            <h2 className="mb-5">Review all the chat sessions the chat bots have had with your customers.</h2>

            {
                loading &&
                <div className='bg-[#3C3D37] mt-5 p-5 md:p-10 rounded-lg'>
                    <Avatar seed='chico' className='mx-auto animate-spin' />
                </div>
            }
            <ChatBotSessions chatbots={chatbots} />
        </div>
    )
}
