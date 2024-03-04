import { produce } from 'immer'
import type { IStore } from './useStore'

export type colorType = {
  r: number
  g: number
  b: number
}

const storeUI = (set: any) => ({
  darkMode: true,
  setDarkMode: (to: boolean): void =>
    set(
      produce((state: IStore) => {
        state.darkMode = to
      }),
      false,
      'ui/setDarkMode'
    ),
  color: { r: 50, g: 100, b: 150 },
  setColor: (newColor: colorType) =>
    set(() => ({
      color: newColor
    })),

  bgColor: { r: 0, g: 0, b: 0 },
  setBgColor: (newColor: colorType) =>
    set(() => ({
      bgColor: newColor
    })),
  gcolor:
    'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 120, 0) 14%, rgb(255, 200, 0) 28%, rgb(0, 255, 0) 42%, rgb(0, 199, 140) 56%, rgb(0, 0, 255) 70%, rgb(128, 0, 128) 84%, rgb(255, 0, 178) 98%)',
  setGcolor: (newColor: colorType) =>
    set(() => ({
      gcolor: newColor
    }))
})

export default storeUI
