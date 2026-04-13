'use client'

import { useEffect } from 'react'

import { createClient } from './client'

interface RealtimeTableConfig {
  table: string
  event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE'
}

export function useRealtimeRefresh(
  channelName: string,
  tables: RealtimeTableConfig[],
  onChange: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const supabase = createClient()
    const channel = supabase.channel(channelName)

    tables.forEach((config) => {
      channel.on(
        'postgres_changes',
        {
          event: config.event ?? '*',
          schema: 'public',
          table: config.table,
        },
        () => onChange(),
      )
    })

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelName, enabled, onChange, tables])
}
