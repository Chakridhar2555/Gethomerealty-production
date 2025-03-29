import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "manager", "user"]),
  permissions: z.object({
    dashboard: z.boolean(),
    leads: z.boolean(),
    calendar: z.boolean(),
    email: z.boolean(),
    settings: z.boolean(),
    inventory: z.boolean(),
    favorites: z.boolean(),
    mls: z.boolean()
  }),
  // MLS Integration fields
  mlsConnected: z.boolean().optional(),
  mlsToken: z.string().optional(),
  mlsProvider: z.string().optional(),
  mlsConnectedAt: z.date().optional(),
  mlsAutoSync: z.boolean().optional(),
  mlsNotifications: z.boolean().optional(),
  mlsLastSync: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export type User = z.infer<typeof userSchema>

export const defaultUserPermissions = {
  dashboard: false,
  leads: true,
  calendar: false,
  email: false,
  settings: false,
  inventory: false,
  favorites: false,
  mls: false
} 