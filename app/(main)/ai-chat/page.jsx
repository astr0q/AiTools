'use client'
import logo from '@/public/logo.svg'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useState, useRef } from 'react'
import { RefreshCcw } from 'lucide-react';


export default function AiChat() {

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null)


    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    const scrollToBottom = () =>{
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setMessages([...messages, {id: messages.length + 1, content: message, role: 'user'}])
        setMessage('')
        scrollToBottom()
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
                {/* Messages prview */}
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
                />
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
            <div className='text-gray-500 text-sm flex justify-center'>
                This ai model doesn't support images, video and audio.
                Currenty it only supports text.
            </div>
        </div>
    );
}
