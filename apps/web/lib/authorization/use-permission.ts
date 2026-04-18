'use client'

import { useMemo } from 'react'

import { hasPermission, type PermissionAction, type PermissionResource, type PermissionSubject } from './policy'

interface UsePermissionInput {
  subject: PermissionSubject | null | undefined
  action: PermissionAction
  resource?: PermissionResource
}

export function usePermission({ subject, action, resource }: UsePermissionInput) {
  return useMemo(() => {
    if (!subject) {
      return false
    }

    return hasPermission({
      subject,
      action,
      resource,
    })
  }, [action, resource, subject])
}
