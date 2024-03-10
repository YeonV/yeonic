import { produce } from 'immer'
import type { IStore } from './useStore'

export type colorType = {
  r: number
  g: number
  b: number
}

const storeEffects = (set: any) => ({
  effects: {
    effect: 'Power (Left FB)',
    color: { r: 50, g: 100, b: 150 } as colorType,
    bgColor: { r: 0, g: 0, b: 0 },
    gcolor:
      'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 120, 0) 14%, rgb(255, 200, 0) 28%, rgb(0, 255, 0) 42%, rgb(0, 199, 140) 56%, rgb(0, 0, 255) 70%, rgb(128, 0, 128) 84%, rgb(255, 0, 178) 98%)'
  },
  setEffect: (newEffect: string): void =>
    set(
      produce((state: IStore) => {
        state.effects.effect = newEffect
      }),
      false,
      'audio/setEffect'
    ),
  setColor: (newColor: colorType): void =>
    set(
      produce((state: IStore) => {
        state.effects.color = newColor
      }),
      false,
      'effects/setColor'
    ),

  setBgColor: (newColor: colorType): void =>
    set(
      produce((state: IStore) => {
        state.effects.bgColor = newColor
      }),
      false,
      'effects/setBgColor'
    ),
  setGcolor: (newGradient: string): void =>
    set(
      produce((state: IStore) => {
        state.effects.gcolor = newGradient
      }),
      false,
      'effects/setGcolor'
    )
})
export default storeEffects
