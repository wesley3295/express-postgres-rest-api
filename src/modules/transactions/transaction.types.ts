// Transaction domain types for requests/filters

export type TransactionType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "PAYMENT"

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELED"

export interface CreateTransactionInput {
  userId: number
  amount: number
  type: TransactionType
  currency?: string
  description?: string | null
  status?: TransactionStatus
}

export interface UpdateTransactionInput {
  amount?: number
  currency?: string
  type?: TransactionType
  description?: string | null
  status?: TransactionStatus
}

export interface ListTransactionsQuery {
  userId?: number
  status?: TransactionStatus
  type?: TransactionType
  sort?: "asc" | "desc"
  take?: number
  skip?: number
}
