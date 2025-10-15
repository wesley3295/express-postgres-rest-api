import { z } from "zod"

import type {
  ListTransactionsQuery,
  TransactionStatus,
  TransactionType,
} from "./transaction.types"

export const TransactionTypeSchema = z.enum([
  "DEPOSIT",
  "WITHDRAWAL",
  "TRANSFER",
  "PAYMENT",
]) as z.ZodType<TransactionType>

export const TransactionStatusSchema = z.enum([
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELED",
]) as z.ZodType<TransactionStatus>

export const createTransactionSchema = z.object({
  userId: z.number().int().nonnegative(),
  amount: z.number(),
  type: TransactionTypeSchema,
  currency: z.string().min(1).optional().default("USD"),
  description: z.string().optional().nullable(),
  status: TransactionStatusSchema.optional().default("PENDING"),
})

export const updateTransactionSchema = z
  .object({
    amount: z.number().optional(),
    currency: z.string().min(1).optional(),
    type: TransactionTypeSchema.optional(),
    description: z.string().optional().nullable(),
    status: TransactionStatusSchema.optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
    path: [],
  })

export const listTransactionsQuerySchema = z
  .object({
    userId: z.coerce.number().int().optional(),
    status: TransactionStatusSchema.optional(),
    type: TransactionTypeSchema.optional(),
    sort: z.enum(["asc", "desc"]).optional().default("desc"),
    take: z.coerce.number().int().min(1).max(100).optional().default(20),
    skip: z.coerce.number().int().min(0).optional().default(0),
  })
  .transform((v) => v as ListTransactionsQuery)

export const idParamSchema = z.object({ id: z.coerce.number().int() })

// Minimal validation middleware helpers
export const validateBody = <T extends z.ZodTypeAny>(schema: T) =>
  (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten(),
      })
    }
    req.body = result.data
    next()
  }

export const validateQuery = <T extends z.ZodTypeAny>(schema: T) =>
  (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten(),
      })
    }
    req.query = result.data
    next()
  }

export const validateParams = <T extends z.ZodTypeAny>(schema: T) =>
  (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.params)
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten(),
      })
    }
    req.params = result.data
    next()
  }
