import { Request, Response } from "express"

import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  listUsersService,
  updateUserService,
} from "./user.service"

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body)
    return res.status(201).json(user)
  } catch (err: any) {
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "Email already in use" })
    }
    return res.status(500).json({ error: (err as Error).message })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: "id must be an integer" })
    const user = await getUserByIdService(id)
    if (!user) return res.status(404).json({ error: "user not found" })
    return res.json(user)
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message })
  }
}

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await listUsersService(req.query as any)
    return res.json(users)
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: "id must be an integer" })
    const user = await updateUserService(id, req.body)
    return res.json(user)
  } catch (err: any) {
    if (err?.code === "P2025") return res.status(404).json({ error: "user not found" })
    if (err?.code === "P2002") return res.status(409).json({ error: "Email already in use" })
    return res.status(500).json({ error: (err as Error).message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ error: "id must be an integer" })
    await deleteUserService(id)
    return res.status(204).send()
  } catch (err: any) {
    if (err?.code === "P2025") return res.status(404).json({ error: "user not found" })
    return res.status(500).json({ error: (err as Error).message })
  }
}
