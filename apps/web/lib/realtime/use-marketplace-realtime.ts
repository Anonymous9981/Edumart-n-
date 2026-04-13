'use client'

import { useEffect } from 'react'

import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/client'

type ChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

interface SubscriptionConfig {
  schema?: string
  table: string
  event?: ChangeEvent | '*'
  filter?: string
  channel: string
}

export function useRealtimeTableSubscription<T extends Record<string, unknown>>(
  config: SubscriptionConfig,
  onChange: (payload: RealtimePostgresChangesPayload<T>) => void,
) {
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(config.channel)
      .on(
        'postgres_changes',
        {
          event: config.event ?? '*',
          schema: config.schema ?? 'public',
          table: config.table,
          filter: config.filter,
        },
        (payload) => onChange(payload as RealtimePostgresChangesPayload<T>),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [config.channel, config.event, config.filter, config.schema, config.table, onChange])
}

export function useProductsRealtime(
  onChange: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  useRealtimeTableSubscription(
    {
      channel: 'products-realtime',
      table: 'Product',
      event: '*',
    },
    onChange,
  )
}

export function useVendorProfileRealtime(
  vendorUserId: string,
  onChange: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  useRealtimeTableSubscription(
    {
      channel: `vendor-profile-${vendorUserId}`,
      table: 'VendorProfile',
      event: '*',
      filter: `userId=eq.${vendorUserId}`,
    },
    onChange,
  )
}

export function useCartRealtime(
  userId: string,
  onChange: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
) {
  useRealtimeTableSubscription(
    {
      channel: `cart-items-${userId}`,
      table: 'CartItem',
      event: '*',
      filter: `userId=eq.${userId}`,
    },
    onChange,
  )
}
