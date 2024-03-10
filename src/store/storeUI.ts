import { produce } from 'immer'
import type { IStore } from './useStore'

const storeUI = (set: any) => ({
  ui: {
    darkMode: true,
    devMode: false
  },
  setDarkMode: (to: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.darkMode = to
      }),
      false,
      'ui/setDarkMode'
    ),
  setDevMode: (to: boolean): void =>
    set(
      produce((state: IStore) => {
        state.ui.devMode = to
      }),
      false,
      'ui/setDevMode'
    )
})

export default storeUI
