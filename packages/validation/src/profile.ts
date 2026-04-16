import { z } from 'zod'

import { nameSchema, phoneSchema } from './auth'

const optionalTrimmedString = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value
    }
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  },
  z.string().optional(),
)

const optionalUrl = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value
    }
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  },
  z.string().url('Avatar must be a valid URL').optional(),
)

export const profileUpdateSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema.optional(),
  bio: optionalTrimmedString,
  avatar: optionalUrl,
  storeName: optionalTrimmedString,
  description: optionalTrimmedString,
  logo: optionalUrl,
  banner: optionalUrl,
  bankAccountName: optionalTrimmedString,
  bankAccountNumber: optionalTrimmedString,
  bankCode: optionalTrimmedString,
  taxId: optionalTrimmedString,
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
