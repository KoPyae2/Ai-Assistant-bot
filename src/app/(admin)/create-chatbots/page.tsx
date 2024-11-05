"use client"

import Avatar from '@/components/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function CreateChatbot() {
  const router = useRouter()
  const [name, setName] = useState('')
  const { user } = useUser();
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {

      const { data, error } = await supabase
        .from('chatbots')
        .insert([
          { clerk_user_id: user?.id, name: name, },
        ])
        .select()

      if (!error) {
        setName('');
        console.log(1111, data[0].id);
        toast.success('Chatbot created successfully')
        // router.push(`edit-chatbot/${data[0].id}`)
      }else{
        toast.error(error.message)
      }
      setLoading(false)

    }
    catch (err) {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }


  return (
    <div className="flex flex-col h-auto items-center justify-center md:flex-row md:space-x-10 bg-[#3C3D37] p-10 rounded-md m-10">
      <Avatar seed="create-chatbot" className='w-32 h-32' />
      <div className='text-white'>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="font-light">
          Create a new chatbot to assist you in your conversations with your customers.
        </h2>
        <form className="flex flex-col md:flex-row gap-2 mt-5" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Chatbot Name..."
            className="max-w-lg"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button disabled={!name || loading} type="submit">{loading ? 'Creating Chatbot...' : 'Create Chatbot'}</Button>
        </form>
        <p className='text-gray-300 mt-5'>
          Example: Customer Support Chatbot
        </p>
      </div>
    </div>
  )
}
