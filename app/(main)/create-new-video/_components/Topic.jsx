'use client'
import React, {useState} from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles } from 'lucide-react'

const suggestions = [
  "AI vs. Human Challenge",
   "Time-Travel AI",
    "AI-Powered Glow-Up",
     "What If History Was Different?",
      "AI Creates a Movie Trailer",
       "AI Predicts the Future",
        "Cartoonify Yourself",
         "AI-Powered Food Creations",
          "AI’s Take on My Dreams", 
          "Turn a Song Into a Video",
           "AI Recreates Famous Paintings", 
  "AI Writes My Day as a Movie Script"
]


const Topic = ({onHandleInputChange}) => {
    const [selectedTopic, setSelectedTopic] = useState()

    const GenerateScript = () => {
        console.log(selectedTopic)
    }
  return (
    <div>
      <h2 className='text-2xl font-bold mb-2'>Project Title</h2>
      <Input type='text' placeholder='Enter a title' onChange={(e) => onHandleInputChange('title', e?.target?.value)}/>
        <div className='mt-5'>
      <h2>Video Topic</h2>
      <p className='text-sm text-gray-600'>Select topic for video</p>

      <Tabs defaultValue="suggestions" className="w-full mt-2">
  <TabsList>
    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
    <TabsTrigger value="custom">Custom</TabsTrigger>
  </TabsList>
  <TabsContent value="suggestions">
    <div>
        {suggestions.map((suggestion, index) => (
            <Button key={index} variant='outline' className={`m-1 ${suggestion===selectedTopic&&'bg-secondary'}`} onClick={() => {setSelectedTopic(suggestion); onHandleInputChange('topic', suggestion)}}>{suggestion}</Button>
        ))}
    </div>
  </TabsContent>
  <TabsContent value="custom">
    <div>
        <h2>Enter your own topic</h2>
        <Textarea placeholder='Enter your own topic' onChange={(e) => onHandleInputChange('topic', e?.target?.value)} />
    </div>
  </TabsContent>
</Tabs>

      </div>
      <Button className='mt-3' size='sm' onClick={GenerateScript}>
        <Sparkles/>Generate Script
      </Button>
    </div>
  )
}

export default Topic
