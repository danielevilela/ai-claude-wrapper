# Claude Chat Wrapper

A modern, responsive chat interface for Claude AI built with Next.js, TypeScript, and Radix UI components.

## Features

- 🤖 **Claude AI Integration** - Direct integration with Claude API using the official Anthropic SDK
- 🎨 **Modern UI** - Clean, accessible interface built with Radix UI primitives
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔒 **Type Safety** - Full TypeScript support with strict type checking
- ⚡ **Real-time Chat** - Instant messaging with loading states and error handling
- 🎯 **Environment Validation** - Robust environment variable validation with Zod
- 🚀 **Next.js 13+** - Built with the latest Next.js App Router
- 🌙 **Dark/Light Mode** - Automatic theme switching based on system preference

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript with strict mode
- **Styling**: CSS Modules with semantic class names
- **UI Components**: Radix UI primitives for accessibility
- **AI Integration**: Anthropic Claude SDK
- **Validation**: Zod for environment and request validation
- **Error Handling**: React Error Boundaries

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Claude API key from Anthropic

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-claude-wrapper.git
   cd ai-claude-wrapper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Claude API key:
   ```env
   CLAUDE_API_KEY=your_claude_api_key_here
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `CLAUDE_API_KEY` | Your Anthropic Claude API key | Yes | - |
| `NODE_ENV` | Environment mode | No | `development` |
| `NEXT_PUBLIC_APP_URL` | Public URL of your app | No | - |
| `PORT` | Port to run the server on | No | `3000` |

## API Endpoints

### POST /api/chat

Send a message to Claude and receive a response.

**Request Body:**
```json
{
  "message": "Hello, Claude!",
  "conversationHistory": [
    {
      "id": "msg_1",
      "role": "user",
      "content": "Previous message",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg_2",
      "role": "assistant",
      "content": "Hello! How can I help you today?",
      "timestamp": "2024-01-01T00:00:01.000Z"
    },
    "usage": {
      "inputTokens": 10,
      "outputTokens": 15
    }
  }
}
```

### GET /api/chat

Health check endpoint to verify Claude API connectivity.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/chat/          # Chat API endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with ErrorBoundary
│   └── page.tsx           # Main chat interface
├── components/            # React components
│   ├── ChatHistory.tsx    # Message history with scroll
│   ├── ChatInput.tsx      # Message input form
│   ├── ChatMessage.tsx    # Individual message display
│   └── ErrorBoundary.tsx  # Error boundary component
├── config/
│   └── env.ts            # Environment validation with Zod
└── lib/
    ├── claude.ts         # Claude API service layer
    └── utils.ts          # Utility functions
```

## Component Architecture

### ChatMessage
- Displays individual messages from user or Claude
- Supports loading states with animated dots
- Responsive design with proper spacing
- CSS Modules for scoped styling

### ChatInput
- Auto-resizing textarea for message input
- Character count display
- Submit on Enter (Shift+Enter for new line)
- Loading and disabled states

### ChatHistory
- Scrollable message container using Radix ScrollArea
- Auto-scroll to bottom for new messages
- Scroll-to-bottom button when scrolled up
- Empty state for new conversations

### ErrorBoundary
- Catches and displays React errors gracefully
- Provides retry and refresh options
- Detailed error information in development

## Configuration

The app uses a robust configuration system with Zod validation:

- **Environment Variables**: Validated on startup with helpful error messages
- **Claude Settings**: Configurable model, max tokens, and temperature
- **API Settings**: Timeout and retry configuration
- **Environment Flags**: Easy development/production/test detection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Anthropic](https://www.anthropic.com/) for the Claude API
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives  
- [Next.js](https://nextjs.org/) for the React framework
- [Zod](https://zod.dev/) for schema validation