import { Router } from "express"

import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from "./user.controller"
import {
  createUserSchema,
  idParamSchema,
  listUsersQuerySchema,
  updateUserSchema,
  validateBody,
  validateParams,
  validateQuery,
} from "./user.validators"

const router = Router()

router.post("/", validateBody(createUserSchema), createUser)
router.get("/", validateQuery(listUsersQuerySchema), listUsers)
router.get("/:id", validateParams(idParamSchema), getUserById)
router.patch("/:id", validateParams(idParamSchema), validateBody(updateUserSchema), updateUser)
router.delete("/:id", validateParams(idParamSchema), deleteUser)

export default router
