'use client'

import { useState, useRef, FormEvent } from 'react'
import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import styles from './ChatInput.module.css'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!message.trim() || isLoading || disabled) return

    onSendMessage(message.trim())
    setMessage('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    setMessage(textarea.value)

    // Auto-resize textarea
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  return (
    <form onSubmit={handleSubmit} className={styles.chatInputForm}>
      <div className={styles.inputContainer}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className={cn(
            styles.messageInput,
            (disabled || isLoading) && styles.disabled
          )}
          rows={1}
          maxLength={10000}
        />
        <button
          type='submit'
          disabled={!message.trim() || isLoading || disabled}
          className={cn(
            styles.sendButton,
            (!message.trim() || isLoading || disabled) &&
              styles.sendButtonDisabled
          )}
          aria-label='Send message'
        >
          <PaperPlaneIcon className={styles.sendIcon} />
        </button>
      </div>
      {message.length > 9000 && (
        <div className={styles.characterCount}>
          {message.length}/10000 characters
        </div>
      )}
    </form>
  )
}
