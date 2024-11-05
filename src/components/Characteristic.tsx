"use client"

import React from 'react'
import { CircleX } from 'lucide-react'
import { toast } from 'sonner'
import { ChatbotCharacteristics } from '@/types/types'
import { supabase } from '@/lib/supabase'

export default function Characteristic({ characteristic }: { characteristic: ChatbotCharacteristics }) {


    const handleRemoveCharacteristic = async () => {
        try {
            const { error } = await supabase
                .from('chatbot_characteristics')
                .delete()
                .eq('id', characteristic.id)
            if (error) {
                console.log('delete characterstics error', error);
            }

        }
        catch (error) {
            console.log('delete characterstics error', error);

        }
    }
    return (
        <li key={characteristic.content + Math.random()} className='relative p-4  bg-[#3C3D37] border border-gray-200 rounded-lg shadow animate-in'>
            {characteristic.content}
            <CircleX
                onClick={() => {
                    const promise = handleRemoveCharacteristic()
                    toast.promise(promise, {
                        loading: 'Removing...',
                        success: 'Characteristic removed',
                        error: 'Fail to remove characteristic'
                    })
                }}
                className='w-6 h-6 text-white fill-red-500 absolute top-0 right-0 cursor-pointer hover:opacity-50'
            />
        </li>
    )
}
