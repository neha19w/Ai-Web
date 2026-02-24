import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

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
