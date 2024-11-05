"use client"

import Avatar from '@/components/Avatar';
import Characteristic from '@/components/Characteristic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase'
import { Chatbot, ChatbotCharacteristics } from '@/types/types';
import { CopyIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner';

export default function EditChatbot() {
  const { id } = useParams();
  const router = useRouter()
  const [chatbots, setChatbots] = useState<Chatbot>();
  const [loading, setLoading] = useState<boolean>(true);
  const [url, setUrl] = React.useState('');
  const [chatbotName, setChatbotName] = React.useState('');
  const [newCharacteristic, setNewCharacteristic] = React.useState('');
  const [isUpdating, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isInserting, startInsertTransition] = useTransition();

  const handleUpdateChatbot = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatbotName) return
    startTransition(async () => {
      const { data, error } = await supabase
        .from('chatbots')
        .update({ name: chatbotName })
        .eq('id', id)
        .select()

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Chatbot name updated successfully')
      }
    })
  }

  const handleDeleteChatbot = () => {
    startDeleteTransition(async () => {
      const { error } = await supabase
        .from('chatbots')
        .delete()
        .eq('id', id)

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Chatbot deleted successfully')
        router.back()
      }
    })


  }

  const handleInsertCharacteristic = () => {
    startInsertTransition(async () => {

      const { data, error } = await supabase
        .from('chatbot_characteristics')
        .insert([
          { 'chatbot_id': id, content: newCharacteristic },
        ])
        .select()

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Characteristic added successfully')
      }

    })
  }

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
          messages (
            id,
            content,
            created_at
          )
        )
      `)
      .eq('id', id);

    if (error) {
      console.error(error);
    } else if (data) {
      setChatbots(data[0]);
      setChatbotName(data[0].name);
      console.log(3333, data);
    }

    setLoading(false);
  };

  useEffect(() => {
    const url = `${window.location.origin}/chatbot/${id}`;
    setUrl(url);
    setLoading(true);
    fetchChatbots();
    const channels = supabase.channel('custom-filter-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chatbot_characteristics' },
        (payload) => {
          console.log('Change received!', payload);
          fetchChatbots();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channels);
    };
  }, [id])

  useEffect(() => {
    if (!loading && !chatbots) {
      router.replace('/view-chatbots')
    }
  }, [chatbots])
  return (
    <div className="px-5 md:p-10">
      <div className="md:sticky md:top-0 z-50  sm:max-w-sm ml-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#697565]">
        <h2 className="text-white text-sm font-bold">Link to Chat</h2>
        <p className="text-sm italic text-white">
          Share this link with your customers to start conversations with your chatbot
        </p>
        <div className='flex items-center gap-2'>
          <Link href={url} className="w-full  cursor-pointer hover:opacity-50">
            <Input value={url} readOnly className="cursor-pointer bg-white" />

          </Link>
          <Button className='bg-black rounded-md cursor-pointer hover:bg-slate-700'
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success('Copied to clipboard!');
            }}

          >
            <CopyIcon color='white' />
          </Button>
        </div>
      </div>
      {
        loading ? (
          <div className='bg-[#3C3D37] mt-5 p-5 md:p-10 rounded-lg'>
            <Avatar seed='loading' className='mx-auto animate-spin' />
          </div>
        ) : (
          <section className='relative mt-5 bg-[#3C3D37] p-5 md:p-10 rounded-lg text-white'>
            <Button
              onClick={handleDeleteChatbot}
              className='absolute top-5 right-5'
              variant={"destructive"}

            >
              {
                isDeleting ? 'Deleting...' : <Trash2 />
              }

            </Button>
            <div className='flex items-center gap-2 mt-4'>
              <Avatar seed={chatbotName} className='w-28 h-28' />
              <form onSubmit={handleUpdateChatbot} className='flex flex-1 gap-2'>
                <Input
                  value={chatbotName}
                  onChange={(e) => setChatbotName(e.target.value)}
                  placeholder='Enter Chatbot Name'
                />
                <Button disabled={!chatbotName} >
                  {isUpdating ? 'Updating...' : 'Update'}
                </Button>
              </form>
            </div>
            <h2 className='text-xl font-bold mt-4'>Here what your AI knows ...</h2>
            <p>Your chatbot is equipped with these following information to assist you in your conversation with your customers & users</p>
            <div className='my-4 bg-[#ECDFCC] p-4 rounded-lg '>
              <form className='flex flex-1 gap-2 mb-4' onSubmit={(e) => {
                e.preventDefault()
                handleInsertCharacteristic();
                setNewCharacteristic('')
              }}>
                <Input
                  value={newCharacteristic}
                  onChange={(e) => setNewCharacteristic(e.target.value)}
                  placeholder='eg: If your customer asks for prices, provide pricing page: www.example.com/pricing'
                  className='bg-white text-black'
                />
                <Button type='submit' disabled={!newCharacteristic}>
                  {
                    isInserting ? 'Adding...' : 'Add'
                  }
                </Button>
              </form>
              <ul className='flex flex-wrap-reverse gap-2'>
                {
                  chatbots?.chatbot_characteristics.map((characteristic: ChatbotCharacteristics, index: number) => (
                    <Characteristic characteristic={characteristic} key={index} />
                  ))
                }
              </ul>
            </div>

          </section>
        )
      }

    </div>
  )
}
