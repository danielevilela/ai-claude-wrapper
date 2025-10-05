'use client'

import { useEffect, useRef } from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { ChatMessage as ChatMessageType } from '@/lib/claude'
import { ChatMessage } from './ChatMessage'
import styles from './ChatHistory.module.css'

interface ChatHistoryProps {
  messages: ChatMessageType[]
  isLoading?: boolean
  loadingMessage?: ChatMessageType
}

export function ChatHistory({
  messages,
  isLoading = false,
  loadingMessage,
}: ChatHistoryProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScrollRef.current && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, isLoading])

  // Handle scroll events to determine if user is at bottom
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10
    shouldAutoScrollRef.current = isAtBottom
  }

  const scrollToBottom = () => {
    shouldAutoScrollRef.current = true
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth',
        })
      }
    }
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <h2>Start a conversation with Claude</h2>
          <p>Send a message to begin chatting with Claude AI assistant.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.chatHistoryContainer}>
      <ScrollArea.Root className={styles.scrollRoot}>
        <ScrollArea.Viewport
          ref={scrollAreaRef}
          className={styles.scrollViewport}
          onScroll={handleScroll}
        >
          <div className={styles.messagesContainer}>
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && loadingMessage && (
              <ChatMessage message={loadingMessage} isLoading={true} />
            )}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className={styles.scrollScrollbar}
          orientation='vertical'
        >
          <ScrollArea.Thumb className={styles.scrollThumb} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {!shouldAutoScrollRef.current && (
        <button
          onClick={scrollToBottom}
          className={styles.scrollToBottomButton}
          aria-label='Scroll to bottom'
        >
          ↓
        </button>
      )}
    </div>
  )
}
