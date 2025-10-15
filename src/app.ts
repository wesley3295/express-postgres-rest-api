import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { prisma } from './config/db'

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.get('/api/v1/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false, error: (e as Error).message })
  }
})

export default app
