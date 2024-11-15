'use client'

import { useParams } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FormEvent, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/Avatar';
import Messages from '@/components/Messages';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/lib/supabase';
import { ChatSession, Message } from '@/types/types';
import startNewChat from '@/lib/startNewChat';
import { toast } from 'sonner';


const formSchema = z.object({
    message: z.string().min(2, { message: "Your message is too short" }),
})
export default function ChatbotPage() {
    const { id } = useParams()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [chatId, setChatId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatSession, setChatSession] = useState<ChatSession>();
    const [loadingChatbot, setLoadingChatbot] = useState(true);
    const [chatbotCharacteristics, setChatbotCharacteristics] = useState<{ content: string }[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        }
    })



    const handleInformationSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const chatId = await startNewChat(name, email, Number(id));
        setChatId(chatId);
        setLoading(false);
        setIsOpen(false);
        const data = {
            name: name,
            email: email,
            chatSessonId: chatId,
        }
        localStorage.setItem(`bot_id_${id}`, JSON.stringify(data));

    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const { message: formMessage } = values;
        const message = formMessage.trim();
        form.reset();

        const userMessage: Message = {
            id: Date.now(),
            content: message,
            sender: "user",
            chat_session_id: chatId,
            created_at: new Date(),
        };

        const loadingMessage: Message = {
            id: Date.now() + 1,
            content: "Thinking...",
            sender: "ai",
            chat_session_id: chatId,
            created_at: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, userMessage, loadingMessage]);
        const aiData = chatbotCharacteristics.map(item => item.content).join(" | ");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_API}/send-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    chat_session_id: chatId,
                    chatbot_id: id,
                    content: message,
                    ai_data: aiData
                }),
            });

            const result = await response.json();

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === loadingMessage.id
                        ? { ...msg, content: result.content.response, id: result.id }
                        : msg
                )
            );
            setLoading(false);

            // save ai & user message
            const { error } = await supabase
                .from('messages')
                .insert([
                    { 'chat_session_id': chatId, 'sender': 'user', 'content': message, "created_at": new Date() },
                    { 'chat_session_id': chatId, 'sender': 'ai', 'content': result.content.response, "created_at": new Date() },
                ])
                .select()

            if (error) {
                toast.error(error.message)
            }

            console.log(new Date());
            
        }
        catch (err) {
            console.log(err);
        }
    }

    const fetchChatSession = async () => {
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
                name,
                chatbot_characteristics (
                content
                )
              ),
              guests (
                name,
                email
              )
            `)
            .eq('id', chatId);

        if (error) {
            console.error(error);
        } else {
            /* eslint-disable */
            setChatSession(data[0] as any);
            console.log(3333, data);
        }

        setLoadingChatbot(false);
    };

    useEffect(() => {
        const existingChatId = localStorage.getItem(`bot_id_${id}`);
        if (existingChatId) {
            const oldData = JSON.parse(existingChatId);
            setChatId(Number(oldData.chatSessonId));
            setName(oldData.name);
            setEmail(oldData.email);
        } else {
            setIsOpen(true);
        }
    }, [id])

    useEffect(() => {
        if (chatSession) {
            setMessages(chatSession.messages)
            /* eslint-disable */
            setChatbotCharacteristics(chatSession.chatbots?.chatbot_characteristics as any)
        }
    }, [chatSession])


    useEffect(() => {
        if (!chatId) return
        fetchChatSession()
        const channels = supabase.channel('custom-filter-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'message' },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchChatSession();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channels);
        };
    }, [chatId])

    return (
        <div className='w-screen h-screen'>
            <Dialog open={isOpen}  >
                <DialogContent className="sm:max-w-[425px]">
                    <form className='flex flex-col gap-2' onSubmit={handleInformationSubmit}>
                        <DialogHeader>
                            <DialogTitle>Lets help you out!</DialogTitle>
                            <DialogDescription>
                                I just need a few details to get started.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="col-span-3"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="name"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                className="col-span-3"
                            />
                        </div>
                        <DialogFooter>
                            <Button type='submit' onClick={handleInformationSubmit} disabled={!name || !email || loading}>
                                {loading ? "Loading..." : "Continue"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col justify-between flex-1 max-w-3xl mx-auto h-screen  md:h-[94%]  md:rounded-lg md:shadow-2xl md:mt-10 overflow-hidden">
                <div className="pb-4 border-b sticky top-0 z-50 bg-[#4D7DFB] py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4 h-24">
                    <Avatar
                        seed={chatSession?.chatbots?.name as string}
                        className="h-12 w-12 bg-white rounded-full border-2 border-white"
                    />
                    <div>
                        <h1 className="truncate text-lg">{loadingChatbot ? "Loading..." : chatSession?.chatbots?.name}</h1>
                        <p className="text-sm text-gray-300">
                            ⚡ Typically replies Instantly
                        </p>
                    </div>
                </div>
                {
                    chatSession && chatSession.messages && !loadingChatbot && messages &&
                    <Messages messages={messages as Message[]} botName={chatSession?.chatbots?.name as string} />
                }
                {
                    loadingChatbot &&
                    <div className=' mt-5 p-5 md:p-10 rounded-lg'>
                        <Avatar seed='chico' className='mx-auto animate-spin' />
                    </div>
                }

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex  items-end sticky bottom-0 z-50 space-x-4 drop-shadow-lg bg-gray-100 rounded-md p-4'>
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel hidden>Message</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Type a message..."
                                            {...field}
                                            className="p-6"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button

                            type="submit"
                            className="h-full"
                            disabled={loading || form.formState.isSubmitting || !form.formState.isValid}
                        >
                            Send
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
