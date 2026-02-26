import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = Number(process.env.PORT || 8080)

// Middleware
app.use(
  cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' })
)
app.use(express.json({ limit: '1mb' }))

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'AI Doc Assistant Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

// Chat streaming endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages } = req.body

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' })
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || 'http://localhost:3000')

  try {
    // Simulate AI response by echoing back messages
    const tokens = messages
      .filter((m: any) => m.role === 'user')
      .map((m: any) => m.content)
      .join(' ')
      .split('')

    // Stream tokens one by one
    for (const token of tokens) {
      res.write(`data: ${JSON.stringify({ token })}\n\n`)
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    // Send done message
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    res.end()
  } catch (err: any) {
    console.error('Chat error:', err)
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

// Error handling middleware
app.use((err: any, _req: Request, res: Response) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  })
})

app.listen(port, () => {
  console.log(`⚡ Server is running at http://localhost:${port}`)
})
