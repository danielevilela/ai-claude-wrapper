'use client'

import { useState, useCallback } from 'react'
import { ChatHistory } from '@/components/ChatHistory'
import { ChatInput } from '@/components/ChatInput'
import { ChatMessage } from '@/lib/claude'
import { generateId } from '@/lib/utils'
import styles from './page.module.css'

// Types for API responses
interface ChatApiResponse {
  success: boolean
  data?: {
    message: {
      id: string
      role: 'assistant'
      content: string
      timestamp: string
    }
    usage?: {
      inputTokens: number
      outputTokens: number
    }
  }
  error?: {
    message: string
    type: string
  }
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (isLoading) return

    // Create user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    // Add user message to conversation
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      // Send request to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages,
        }),
      })

      const result: ChatApiResponse = await response.json()

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to send message')
      }

      // Add Claude's response to conversation
      const assistantMessage: ChatMessage = {
        id: result.data.message.id,
        role: 'assistant',
        content: result.data.message.content,
        timestamp: new Date(result.data.message.timestamp),
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (err) {
      console.error('Chat error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  // Create loading message for display
  const loadingMessage: ChatMessage | undefined = isLoading ? {
    id: 'loading',
    role: 'assistant',
    content: '',
    timestamp: new Date(),
  } : undefined

  return (
    <main className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <h1>Claude Chat Wrapper</h1>
        <p>Chat with Claudia, your AI assistant</p>
      </header>

      <div className={styles.chatContent}>
        <ChatHistory 
          messages={messages}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />
        
        {error && (
          <div className={styles.errorMessage}>
            <p>Error: {error}</p>
            <button 
              onClick={() => setError(null)}
              className={styles.dismissError}
            >
              Dismiss
            </button>
          </div>
        )}
        
        <ChatInput 
          onSendMessage={sendMessage}
          isLoading={isLoading}
          placeholder="Ask Claude anything..."
        />
      </div>
    </main>
  )
}