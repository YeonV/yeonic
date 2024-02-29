import { create } from 'zustand'
import { devtools, combine, persist } from 'zustand/middleware'
import storeUI from './storeUI'
import storeBears from './storeBear'
import storePlugins from './storePlugins'
import storeAudio from './storeAudio'

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
          ...storeBears(set),
          ...storePlugins(set),
          ...storeAudio(set),
          // user: storeUser(set),
          // ...storeCloud(set)
        })
      ),
      {
        name: 'yeonic-store3',
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['dialogs', 'audioSettings'].includes(key)))
      }
    )
  )
)

const state = useStore.getState()
export type IStore = typeof state

export default useStore
