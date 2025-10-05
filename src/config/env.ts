import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLAUDE_API_KEY: z.string().min(1, 'Claude API key is required'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  PORT: z.string().default('3000').transform(Number),
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      )
      throw new Error(
        `Environment validation failed:\n${missingVars.join('\n')}`
      )
    }
    throw error
  }
}

const env = validateEnv()

export const config = {
  // Environment variables
  nodeEnv: env.NODE_ENV,
  claudeApiKey: env.CLAUDE_API_KEY,
  appUrl: env.NEXT_PUBLIC_APP_URL,
  port: env.PORT,

  // Environment flags
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  // API Configuration
  api: {
    timeout: 30000, // 30 seconds
    maxRetries: 3,
  },

  // Claude Configuration
  claude: {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 4096,
    temperature: 0.7,
  },
} as const

export type Config = typeof config