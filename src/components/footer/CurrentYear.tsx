'use client'

import {useSyncExternalStore} from 'react'

const subscribe = () => () => {}

/** The current year, resolved in the browser so cached pages never show a stale year. */
export function CurrentYear() {
  return useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => '',
  )
}
