import { produce } from 'immer'
import type { IStore } from './useStore'

const storeBears = (set: any) => ({
  bears: 0,
  setBears: (to: number): void =>
    set(
      produce((state: IStore) => {
        state.bears = to
      }),
      false,
      'bears/setBears'
    )
})

export default storeBears
