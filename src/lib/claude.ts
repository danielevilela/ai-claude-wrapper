import Anthropic from '@anthropic-ai/sdk'
import { config } from '@/config/env'

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: config.claudeApiKey,
})

// Types for chat functionality
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatResponse {
  message: ChatMessage
  usage?: {
    inputTokens: number
    outputTokens: number
  }
}

export interface ChatError {
  message: string
  code?: string
  type: 'validation' | 'api' | 'network' | 'unknown'
}

// Claude API service class
export class ClaudeService {
  private static instance: ClaudeService
  private retryCount = 0

  private constructor() {}

  static getInstance(): ClaudeService {
    if (!ClaudeService.instance) {
      ClaudeService.instance = new ClaudeService()
    }
    return ClaudeService.instance
  }

  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      this.validateMessage(message)

      // Convert conversation history to Claude format
      const messages = this.formatMessagesForClaude(
        conversationHistory,
        message
      )

      const response = await anthropic.messages.create({
        model: config.claude.model,
        max_tokens: config.claude.maxTokens,
        temperature: config.claude.temperature,
        messages,
      })

      return this.formatClaudeResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private validateMessage(message: string): void {
    if (!message || message.trim().length === 0) {
      throw new Error('Message cannot be empty')
    }

    if (message.length > 100000) {
      throw new Error('Message is too long (max 100,000 characters)')
    }
  }

  private formatMessagesForClaude(
    history: ChatMessage[],
    newMessage: string
  ): Anthropic.MessageParam[] {
    const messages: Anthropic.MessageParam[] = []

    // Add conversation history
    for (const msg of history) {
      messages.push({
        role: msg.role,
        content: msg.content,
      })
    }

    // Add new user message
    messages.push({
      role: 'user',
      content: newMessage,
    })

    return messages
  }

  private formatClaudeResponse(response: Anthropic.Message): ChatResponse {
    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as Anthropic.TextBlock).text)
      .join('')

    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
    }

    return {
      message: assistantMessage,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    }
  }

  private handleError(error: unknown): ChatError {
    if (error instanceof Anthropic.APIError) {
      return {
        message: `Claude API Error: ${error.message}`,
        code: error.status?.toString(),
        type: 'api',
      }
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        type: 'validation',
      }
    }

    return {
      message: 'An unexpected error occurred',
      type: 'unknown',
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.sendMessage('Hello')
      return true
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const claudeService = ClaudeService.getInstance()
