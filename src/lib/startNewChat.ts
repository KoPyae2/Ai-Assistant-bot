import { supabase } from "./supabase";

async function startNewChat(
    guestName: string,
    guestEmail: string,
    chatbotId: number
) {
    try {
        //1 setup guest
        const { data: guestResponse, error: guestError } = await supabase
            .from('guests')
            .insert([
                { 'name': guestName, 'email': guestEmail, },
            ])
            .select()

        if (guestError) {
            throw new Error(guestError.message)
        }
        const guestId = guestResponse[0].id;

        //2 set up chat session
        const { data: chatSessionResponse, error: chatSessionError } = await supabase
            .from('chat_sessions')
            .insert([
                { 'chatbot_id': chatbotId, 'guest_id': guestId },
            ])
            .select()

        if (chatSessionError) {
            throw new Error(chatSessionError.message)
        }
        const chatSessionId = chatSessionResponse[0].id;

         //3 insert init message
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    'chat_session_id': chatSessionId,
                    'sender': 'ai',
                    'content': `Welcome ${guestName}!\n How can I assist you today? 🤔`
                },
            ])
            .select()

        if (error) {
            throw new Error(error.message)
        }

        return chatSessionId

    }
    catch (err) {
        console.log('error in new chat session', err);

    }
}

export default startNewChat