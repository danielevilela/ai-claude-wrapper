import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { claudeService } from '@/lib/claude'

// Request validation schema
const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(100000, 'Message too long'),
  conversationHistory: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(['user', 'assistant']),
        content: z.string(),
        timestamp: z.string().transform(str => new Date(str)),
      })
    )
    .optional()
    .default([]),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { message, conversationHistory } = chatRequestSchema.parse(body)

    // Send message to Claude
    const response = await claudeService.sendMessage(
      message,
      conversationHistory
    )

    return NextResponse.json({
      success: true,
      data: {
        message: response.message,
        usage: response.usage,
      },
    })
  } catch (error) {
    console.error('Chat API Error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid request data',
            details: error.issues,
            type: 'validation',
          },
        },
        { status: 400 }
      )
    }

    // Handle Claude service errors
    if (error && typeof error === 'object' && 'type' in error) {
      const claudeError = error as {
        message: string
        type: string
        code?: string
      }
      return NextResponse.json(
        {
          success: false,
          error: {
            message: claudeError.message,
            type: claudeError.type,
            code: claudeError.code,
          },
        },
        { status: claudeError.type === 'api' ? 500 : 400 }
      )
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred',
          type: 'unknown',
        },
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const isHealthy = await claudeService.testConnection()

    return NextResponse.json(
      {
        success: true,
        data: {
          status: isHealthy ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
        },
      },
      {
        status: isHealthy ? 200 : 503,
      }
    )
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Health check failed',
          type: 'service',
        },
      },
      {
        status: 503,
      }
    )
  }
}
