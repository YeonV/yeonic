import { create } from 'zustand'
import { devtools, combine, persist } from 'zustand/middleware'
import storeUI from './storeUI'
import storeBears from './storeBear'

const useStore = create(
  devtools(
    persist(
      combine(
        {
          hackedBy: 'Blade'
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (set: any) => ({
          ...storeUI(set),
          ...storeBears(set)
          // user: storeUser(set),
          // ...storeCloud(set)
        })
      ),
      {
        name: 'yeonic-storage',
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['dialogs'].includes(key)))
      }
    )
  )
)

const state = useStore.getState()
export type IStore = typeof state

export default useStore
