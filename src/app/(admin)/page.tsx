import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

export default function Home() {
  return (
    <main className="p-6 bg-[#3C3D37] m-5 rounded-md text-white">
      <h1 className="text-4xl font-light">
        Welcome to <span className="text-[#6485F5] font-semibold">Assistly</span>
      </h1>
      <h2 className="mt-2 mb-10">
        Your customisable AI chat agent that helps you manage your customer
        conversations.
      </h2>
      <Link href="/create-chatbots">
        <Button className="bg-[#697565]">
          Get started by creating your chatbot
        </Button>
      </Link>
    </main>
  );
}
