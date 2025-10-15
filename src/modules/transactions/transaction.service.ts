import { prisma } from "../../config/db"

import type {
  CreateTransactionInput,
  ListTransactionsQuery,
  UpdateTransactionInput,
} from "./transaction.types"

export const createTransactionService = async (data: CreateTransactionInput) => {
  return prisma.transaction.create({
    data: {
      userId: data.userId,
      amount: data.amount,
      type: data.type,
      currency: data.currency ?? "USD",
      description: data.description ?? null,
      status: data.status ?? "PENDING",
    },
  })
}

export const getTransactionByIdService = async (id: number) => {
  return prisma.transaction.findUnique({ where: { id } })
}

export const listTransactionsService = async (query: ListTransactionsQuery) => {
  const where: any = {}
  if (query.userId !== undefined) where.userId = query.userId
  if (query.status !== undefined) where.status = query.status
  if (query.type !== undefined) where.type = query.type

  const sort = query.sort?.toLowerCase() === "asc" ? "asc" : "desc"
  const take = Math.min(Math.max(query.take ?? 20, 1), 100)
  const skip = Math.max(query.skip ?? 0, 0)

  return prisma.transaction.findMany({
    where,
    orderBy: { createdAt: sort as any },
    take,
    skip,
  })
}

export const updateTransactionService = async (id: number, data: UpdateTransactionInput) => {
  return prisma.transaction.update({
    where: { id },
    data: {
      amount: data.amount,
      currency: data.currency,
      type: data.type,
      description: data.description,
      status: data.status,
    },
  })
}

export const deleteTransactionService = async (id: number) => {
  return prisma.transaction.delete({ where: { id } })
}
