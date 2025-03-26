'use client'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useState, useRef } from 'react'
import { RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

export default function AiChat() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const generateResponse = async (userMessage) => {
        try {
            const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`
                },
                body: JSON.stringify({
                    inputs: userMessage,
                    options: {
                        wait_for_model: true
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error:', response.status, errorData);
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data[0]?.generated_text || "I apologize, but I couldn't generate a response.";
        } catch (error) {
            console.error('Error details:', error);
            toast.error(`Error: ${error.message}`);
            return "I apologize, but I'm having trouble responding right now. Please try again later.";
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!message.trim()) return

        // Add user message
        const userMessage = message
        setMessages(prev => [...prev, { id: prev.length + 1, content: userMessage, role: 'user' }])
        setMessage('')
        scrollToBottom()

        // Show loading state
        setIsLoading(true)

        try {
            // Get AI response
            const aiResponse = await generateResponse(userMessage)
            
            // Add AI response to messages
            setMessages(prev => [...prev, { id: prev.length + 1, content: aiResponse, role: 'assistant' }])
            scrollToBottom()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to get response')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRefresh = () => {
        setMessages([])
    }

    return (
        <div className='flex flex-col h-[calc(100vh-4rem)]'>
            <div className="flex items-center p-4 border-b">
                <Image src={logo} alt="logo" width={50} height={50} />
                <h1 className="text-2xl font-bold p-3">AI Chat</h1>
                <div className="flex items-end p-4 ml-auto">
                    <Button variant="outline" size="icon" onClick={handleRefresh}>
                        <RefreshCcw />
                    </Button>
                </div>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 m-4 border border-white rounded-lg">
                {messages.length === 0 && (
                    <div className='flex items-center justify-center border border-white rounded-lg p-4'>
                        <div className='text-white text-s'>
                            Hello, I'm the AI chatbot of Ai tools. How can I help you today?    
                        </div>
                    </div>
                )}
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === "user"
                                    ? "bg-primary text-primary-foreground ml-4"
                                    : "bg-muted mr-4"
                            }`}
                        >
                            <p className="text-sm">{message.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3 mr-4">
                            <p className="text-sm">Thinking...</p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form 
                onSubmit={handleSubmit}
                className="border-t p-4 flex gap-2 items-center"
            >
                <Input
                    value={message}
                    onChange={handleMessage}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
            <div className='text-gray-500 text-sm flex justify-center'>
                This ai model doesn't support images, video and audio.
                Currently it only supports text.
            </div>
        </div>
    )
}
