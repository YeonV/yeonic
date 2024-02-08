import { produce } from 'immer'
import type { IStore } from './useStore'

const storeUI = (set: any) => ({
  darkMode: true,
  setDarkMode: (to: boolean): void =>
    set(
      produce((state: IStore) => {
        state.darkMode = to
      }),
      false,
      'ui/setDarkMode'
    )
})

export default storeUI
