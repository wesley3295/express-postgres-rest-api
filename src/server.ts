import app from "./app"
import { prisma } from "./config/db"

const PORT = process.env.PORT || 3000

const start = async () => {
  await prisma.$connect()
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

start()
