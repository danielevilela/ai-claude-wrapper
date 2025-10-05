import { ChatMessage as ChatMessageType } from '@/lib/claude'
import { formatTimestamp, cn } from '@/lib/utils'
import styles from './ChatMessage.module.css'

interface ChatMessageProps {
  message: ChatMessageType
  isLoading?: boolean
}

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        styles.messageContainer,
        isUser ? styles.userMessage : styles.assistantMessage
      )}
    >
      <div className={styles.messageContent}>
        <div className={styles.messageHeader}>
          <span className={styles.sender}>{isUser ? 'You' : 'Claude'}</span>
          <span className={styles.timestamp}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <div className={cn(styles.messageText, isLoading && styles.loading)}>
          {isLoading ? (
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      </div>
    </div>
  )
}
