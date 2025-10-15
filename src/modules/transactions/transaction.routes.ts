import { Router } from "express"

import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  listTransactions,
  updateTransaction,
} from "./transaction.controller"
import {
  createTransactionSchema,
  idParamSchema,
  listTransactionsQuerySchema,
  updateTransactionSchema,
  validateBody,
  validateParams,
  validateQuery,
} from "./transaction.validators"

const router = Router()

router.post("/", validateBody(createTransactionSchema), createTransaction)
router.get("/", validateQuery(listTransactionsQuerySchema), listTransactions)
router.get("/:id", validateParams(idParamSchema), getTransactionById)
router.patch(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateTransactionSchema),
  updateTransaction,
)
router.delete("/:id", validateParams(idParamSchema), deleteTransaction)

export default router
