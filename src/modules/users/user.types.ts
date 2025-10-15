// User domain types

export type Role = "USER" | "ADMIN" | "SUPERUSER"

export interface CreateUserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: Role
}

export interface UpdateUserInput {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  role?: Role
}

export interface ListUsersQuery {
  role?: Role
  email?: string
  sort?: "asc" | "desc"
  take?: number
  skip?: number
}

export interface UserSafe {
  id: number
  email: string
  firstName: string
  lastName: string
  role: Role
  createdAt: Date
  updatedAt: Date
}
