import { getSupabaseServiceRoleKey, getSupabaseUrl } from './env'

type AdminUser = {
  id: string
  email?: string | null
}

interface EnsureAuthUserInput {
  email: string
  password: string
  metadata?: Record<string, string>
}

async function fetchAdmin(path: string, init?: RequestInit) {
  const serviceRoleKey = getSupabaseServiceRoleKey()
  if (!serviceRoleKey) {
    return null
  }

  const response = await fetch(`${getSupabaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(init?.headers || {}),
    },
  })

  return response
}

export function isConfirmationDeliveryError(message: string | undefined) {
  if (!message) {
    return false
  }

  return /confirmation email|error sending confirmation email|smtp/i.test(message)
}

export async function ensureConfirmedAuthUser(input: EnsureAuthUserInput) {
  const normalizedEmail = input.email.trim().toLowerCase()

  const usersResponse = await fetchAdmin('/auth/v1/admin/users?page=1&per_page=1000', {
    method: 'GET',
  })

  if (!usersResponse) {
    return null
  }

  if (!usersResponse.ok) {
    throw new Error(`Unable to list auth users (${usersResponse.status})`)
  }

  const usersPayload = (await usersResponse.json()) as { users?: AdminUser[] }
  const existing = (usersPayload.users || []).find(
    (user) => user.email?.trim().toLowerCase() === normalizedEmail,
  )

  const payload = {
    email: normalizedEmail,
    password: input.password,
    email_confirm: true,
    user_metadata: input.metadata ?? {},
  }

  if (existing) {
    const updateResponse = await fetchAdmin(`/auth/v1/admin/users/${existing.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })

    if (!updateResponse?.ok) {
      throw new Error(`Unable to update auth user (${updateResponse?.status ?? 'n/a'})`)
    }

    return { id: existing.id, email: normalizedEmail }
  }

  const createResponse = await fetchAdmin('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!createResponse?.ok) {
    throw new Error(`Unable to create auth user (${createResponse?.status ?? 'n/a'})`)
  }

  const created = (await createResponse.json()) as { user?: AdminUser }
  return {
    id: created.user?.id ?? '',
    email: normalizedEmail,
  }
}
