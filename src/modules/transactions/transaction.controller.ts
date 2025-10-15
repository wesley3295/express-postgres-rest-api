import { Request, Response } from "express"

import { prisma } from "../../config/db"

const enum TransactionTypeEnum {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
  PAYMENT = "PAYMENT",
}

const enum TransactionStatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, amount, type, currency, description, status } = req.body || {}

    if (typeof userId !== "number" || Number.isNaN(userId)) {
      return res.status(400).json({ error: "userId must be a number" })
    }
    if (typeof amount !== "number" || Number.isNaN(amount)) {
      return res.status(400).json({ error: "amount must be a number" })
    }
    if (!Object.values(TransactionTypeEnum).includes(type)) {
      return res.status(400).json({ error: "invalid transaction type" })
    }
    if (status && !Object.values(TransactionStatusEnum).includes(status)) {
      return res.status(400).json({ error: "invalid transaction status" })
    }

    const created = await prisma.transaction.create({
      data: {
        userId,
        amount,
        type,
        currency: currency ?? "USD",
        description: description ?? null,
        status: status ?? TransactionStatusEnum.PENDING,
      },
    })

    return res.status(201).json(created)
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message })
  }
}

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id must be an integer" })
    }

    const tx = await prisma.transaction.findUnique({ where: { id } })
    if (!tx) {
      return res.status(404).json({ error: "transaction not found" })
    }

    return res.json(tx)
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message })
  }
}

export const listTransactions = async (req: Request, res: Response) => {
  try {
    const { userId, status, type, sort = "desc", take, skip } = req.query

    const where: any = {}
    if (userId !== undefined) {
      const uid = Number(userId)
      if (!Number.isInteger(uid)) {
        return res.status(400).json({ error: "userId must be an integer" })
      }
      where.userId = uid
    }
    if (status !== undefined) {
      if (!Object.values(TransactionStatusEnum).includes(String(status) as any)) {
        return res.status(400).json({ error: "invalid transaction status" })
      }
      where.status = status
    }
    if (type !== undefined) {
      if (!Object.values(TransactionTypeEnum).includes(String(type) as any)) {
        return res.status(400).json({ error: "invalid transaction type" })
      }
      where.type = type
    }

    const limit = take !== undefined ? Number(take) : 20
    const offset = skip !== undefined ? Number(skip) : 0
    if ((take !== undefined && Number.isNaN(limit)) || (skip !== undefined && Number.isNaN(offset))) {
      return res.status(400).json({ error: "take/skip must be numbers" })
    }

    const items = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: String(sort).toLowerCase() === "asc" ? "asc" : "desc" },
      take: Math.min(Math.max(limit, 1), 100),
      skip: Math.max(offset, 0),
    })

    return res.json(items)
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message })
  }
}

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id must be an integer" })
    }

    const { amount, currency, type, description, status } = req.body || {}
    const data: any = {}
    if (amount !== undefined) {
      if (typeof amount !== "number" || Number.isNaN(amount)) {
        return res.status(400).json({ error: "amount must be a number" })
      }
      data.amount = amount
    }
    if (currency !== undefined) data.currency = currency
    if (description !== undefined) data.description = description
    if (type !== undefined) {
      if (!Object.values(TransactionTypeEnum).includes(type)) {
        return res.status(400).json({ error: "invalid transaction type" })
      }
      data.type = type
    }
    if (status !== undefined) {
      if (!Object.values(TransactionStatusEnum).includes(status)) {
        return res.status(400).json({ error: "invalid transaction status" })
      }
      data.status = status
    }

    const updated = await prisma.transaction.update({ where: { id }, data })
    return res.json(updated)
  } catch (err) {
    if ((err as any)?.code === "P2025") {
      return res.status(404).json({ error: "transaction not found" })
    }
    return res.status(500).json({ error: (err as Error).message })
  }
}

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "id must be an integer" })
    }

    await prisma.transaction.delete({ where: { id } })
    return res.status(204).send()
  } catch (err) {
    if ((err as any)?.code === "P2025") {
      return res.status(404).json({ error: "transaction not found" })
    }
    return res.status(500).json({ error: (err as Error).message })
  }
}
