import { z } from "zod"

import type { ListUsersQuery, Role } from "./user.types"

export const RoleSchema = z.enum(["USER", "ADMIN", "SUPERUSER"]) as z.ZodType<Role>

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: RoleSchema.optional().default("USER"),
})

export const updateUserSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: RoleSchema.optional(),
  })
  .refine((o) => Object.keys(o).length > 0, {
    message: "At least one field must be provided",
    path: [],
  })

export const listUsersQuerySchema = z
  .object({
    role: RoleSchema.optional(),
    email: z.string().email().optional(),
    sort: z.enum(["asc", "desc"]).optional().default("desc"),
    take: z.coerce.number().int().min(1).max(100).optional().default(20),
    skip: z.coerce.number().int().min(0).optional().default(0),
  })
  .transform((v) => v as ListUsersQuery)

export const idParamSchema = z.object({ id: z.coerce.number().int() })

// Reusable validation middleware (kept local for module cohesion)
export const validateBody = <T extends z.ZodTypeAny>(schema: T) =>
  (req: any, res: any, next: any) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() })
    }
    req.body = parsed.data
    next()
  }

export const validateQuery = <T extends z.ZodTypeAny>(schema: T) =>
  (req: any, res: any, next: any) => {
    const parsed = schema.safeParse(req.query)
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() })
    }
    req.query = parsed.data
    next()
  }

export const validateParams = <T extends z.ZodTypeAny>(schema: T) =>
  (req: any, res: any, next: any) => {
    const parsed = schema.safeParse(req.params)
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() })
    }
    req.params = parsed.data
    next()
  }
