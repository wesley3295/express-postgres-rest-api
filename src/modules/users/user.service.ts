import crypto from "crypto"

import { prisma } from "../../config/db"

import type { CreateUserInput, ListUsersQuery, UpdateUserInput, UserSafe } from "./user.types"

const hashPassword = (password: string) =>
  crypto.createHash("sha256").update(password).digest("hex")

export const toUserSafe = <T extends { passwordHash?: string }>(u: any): UserSafe => ({
  id: u.id,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  role: u.role,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
})

export const createUserService = async (data: CreateUserInput) => {
  const created = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: hashPassword(data.password),
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role ?? "USER",
    },
  })
  return toUserSafe(created)
}

export const getUserByIdService = async (id: number) => {
  const u = await prisma.user.findUnique({ where: { id } })
  return u ? toUserSafe(u) : null
}

export const listUsersService = async (query: ListUsersQuery) => {
  const where: any = {}
  if (query.role) where.role = query.role
  if (query.email) where.email = query.email

  const sort = query.sort?.toLowerCase() === "asc" ? "asc" : "desc"
  const take = Math.min(Math.max(query.take ?? 20, 1), 100)
  const skip = Math.max(query.skip ?? 0, 0)

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: sort as any },
    take,
    skip,
  })
  return users.map(toUserSafe)
}

export const updateUserService = async (id: number, data: UpdateUserInput) => {
  const toUpdate: any = {}
  if (data.email !== undefined) toUpdate.email = data.email
  if (data.firstName !== undefined) toUpdate.firstName = data.firstName
  if (data.lastName !== undefined) toUpdate.lastName = data.lastName
  if (data.role !== undefined) toUpdate.role = data.role
  if (data.password !== undefined) toUpdate.passwordHash = hashPassword(data.password)

  const updated = await prisma.user.update({ where: { id }, data: toUpdate })
  return toUserSafe(updated)
}

export const deleteUserService = async (id: number) => {
  await prisma.user.delete({ where: { id } })
}
