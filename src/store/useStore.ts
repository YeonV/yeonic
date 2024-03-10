import { create } from 'zustand'
import { devtools, combine, persist } from 'zustand/middleware'
import storeUI from './storeUI'
import storeEffects from './storeEffects'
import storeBears from './storeBear'
import storePlugins from './storePlugins'
import storeAudio from './storeAudio'
import storeDevices from './storeDevices'

const useStore = create(
  devtools(
    persist(
      combine(
        {
          hackedBy: 'Blade'
        },
        (set) => ({
          ...storeUI(set),
          ...storeAudio(set),
          ...storeEffects(set),
          ...storePlugins(set),
          ...storeDevices(set),
          ...storeBears(set)
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
