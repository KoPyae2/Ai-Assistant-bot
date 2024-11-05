export type Message = {
    id: number;
    content: string;
    created_at: Date;
    sender?: 'user' | 'ai';
    chat_session_id?: number;
};

export type ChatSession = {
    id: string;
    created_at: Date;
    guest_id: string;
    messages: Message[];
    guests?: Guest;
    chatbots?: Chatbot;
};

export type Guest = {
    id: string;
    name: string;
    email: string;
};

export type ChatbotCharacteristics = {
    id: number;
    content: string;
};

export type Chatbot = {
    id: string;
    name: string;
    created_at: Date;
    chatbot_characteristics: ChatbotCharacteristics[];
    chat_sessions: ChatSession[];
};