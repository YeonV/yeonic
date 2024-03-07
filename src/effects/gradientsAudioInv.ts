/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { MutableRefObject } from 'react'
import { getMultipleGradientStepsInverted } from './utils'

let shift = 0

export const shifting = (pixel_count: number) => {
  if (shift >= pixel_count) {
    shift = 0
  } else {
    shift++
  }
}

const GradientAudioInv = ({ ampValues, pixel_count, activeFb, volume, timeStarted, gcolor }: {
  ampValues: number[]
  pixel_count: number
  activeFb: number
  volume: number
  timeStarted: MutableRefObject<number | null>
  gcolor: string

}): number[] => {
  const tmp = getMultipleGradientStepsInverted(
    gcolor?.match(/rgb\([^()]*\)|#\w+/g)?.map((c) => c.match(/\d+/g)),
    pixel_count
  )
  const audio = ampValues[activeFb] - volume * 2.55 > 0
  const speed = audio ? 0 : 5

  if (timeStarted.current && (performance.now() - timeStarted.current >= 16 + speed * 9.84)) {
    shifting(pixel_count)
    timeStarted.current = performance.now()
  }

  const sliceA = tmp.slice(0, shift)
  const sliceB = tmp.slice(shift)

  return [...sliceB, ...sliceA].flat()
}

export default GradientAudioInv
