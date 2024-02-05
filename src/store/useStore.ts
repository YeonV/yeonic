import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {} from '@redux-devtools/extension'

interface BearState {
  bears: number
  setBears: (by: number) => void
}

export const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        setBears: (to: number) => set({ bears: to }),
      }),
      {
        name: 'bear-storage',
      },
    ),
  ),
)